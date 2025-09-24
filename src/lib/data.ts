

'use server';

import { db, db_1, db_2, rtdb } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, setDoc, query, where, documentId, writeBatch, limit, orderBy, getCountFromServer, Firestore, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, get, set, child, push, serverTimestamp, runTransaction } from 'firebase/database';
import { Brand, Series, Firmware, AdSettings, FlashingInstructions, Tool, ContactMessage, Donation, DailyAnalytics, HeaderScripts, BlogPost, BlogPostOutput, Announcement, AdSlot } from './types';
import slugify from 'slugify';
import { createHash } from 'crypto';
import { format } from 'date-fns';

const createId = (name: string) => slugify(name, { lower: true, strict: true });

async function getDocFromAnyDB(collectionName: string, id: string): Promise<{ id: string, [key: string]: any } | null> {
    if (!id) return null;
    const dbs = [db, db_1, db_2];
    
    // Use Promise.any to get the first resolved promise
    try {
        const docSnap = await Promise.any(dbs.map(dbInstance => {
            return new Promise(async (resolve, reject) => {
                try {
                    const snap = await getDoc(doc(dbInstance, collectionName, id));
                    if (snap.exists()) {
                        resolve(snap);
                    } else {
                        reject(new Error(`Doc not found in db`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }));

        if (docSnap && docSnap.exists()) {
             return { id: docSnap.id, ...docSnap.data() };
        }
    } catch(e) {
        // All promises rejected
        // console.warn(`Document ${id} in ${collectionName} not found in any database.`);
    }
    
    return null;
}

async function getCollectionFromAllDBs<T extends { id: string }>(collectionName: string, q?: any): Promise<T[]> {
    const dbs = [db, db_1, db_2];
    const promises = dbs.map(dbInstance => {
        const collRef = collection(dbInstance, collectionName);
        const finalQuery = q ? query(collRef, q) : collRef;
        return getDocs(finalQuery);
    });
    
    // Don't wait for all to complete if not needed, but for collections we often need to merge.
    const snapshots = await Promise.allSettled(promises);
    const results: T[] = [];
    const seenIds = new Set<string>();

    snapshots.forEach(result => {
        if (result.status === 'fulfilled') {
            result.value.docs.forEach(doc => {
                if (!seenIds.has(doc.id)) {
                    results.push({ id: doc.id, ...doc.data() } as T);
                    seenIds.add(doc.id);
                }
            });
        }
    });

    return results;
}

export async function getBrands(): Promise<Brand[]> {
    const brands = await getCollectionFromAllDBs<Brand>('brands');
    return brands.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPopularBrands(): Promise<Brand[]> {
    const brands = await getCollectionFromAllDBs<Brand>('brands', where('isPopular', '==', true));
    return brands.sort((a, b) => a.name.localeCompare(b.name));
}


export async function getSeriesByBrand(brandId: string): Promise<Series[]> {
    const series = await getCollectionFromAllDBs<Series>('series', where('brandId', '==', brandId));
    return series.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getFirmwareBySeries(seriesId: string): Promise<Firmware[]> {
    const firmware = await getCollectionFromAllDBs<Firmware>('firmware', where('seriesId', '==', seriesId));
    return firmware.sort((a,b) => a.fileName.localeCompare(b.fileName));
}

export async function getFirmwareById(id: string): Promise<Firmware | null> {
    return await getDocFromAnyDB('firmware', id) as Firmware | null;
}

export async function getBrandById(id: string): Promise<Brand | null> {
    return await getDocFromAnyDB('brands', id) as Brand | null;
}

export async function getSeriesById(id: string): Promise<Series | null> {
    return await getDocFromAnyDB('series', id) as Series | null;
}

// Helper function for Firestore prefix search
async function searchFirestore(dbInstance: Firestore, collectionName: string, field: string, searchTerm: string, limitVal: number) {
    const collRef = collection(dbInstance, collectionName);
    const endTerm = searchTerm + '\uf8ff';
    const q = query(collRef, where(field, '>=', searchTerm), where(field, '<=', endTerm), limit(limitVal));
    return getDocs(q);
}

export async function searchFirmware(searchTerm: string, queryLimit: number = 50): Promise<Firmware[]> {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const dbs = [db, db_1, db_2];
    
    // Create promises for all search queries across all databases
    const searchPromises = dbs.flatMap(dbInstance => [
        searchFirestore(dbInstance, 'brands', 'name', searchTerm, 10),
        searchFirestore(dbInstance, 'brands', 'name', searchTermLower, 10),
        searchFirestore(dbInstance, 'series', 'name', searchTerm, 10),
        searchFirestore(dbInstance, 'series', 'name', searchTermLower, 10),
        searchFirestore(dbInstance, 'firmware', 'fileName', searchTerm, 10),
        searchFirestore(dbInstance, 'firmware', 'fileName', searchTermLower, 10),
    ]);
    
    const snapshots = await Promise.all(searchPromises);

    const brandIds = new Set<string>();
    const seriesIdsFromSearch = new Set<string>();
    const firmwareDocsFromFileNameSearch = new Map<string, any>();

    snapshots.slice(0, 2 * dbs.length).forEach(s => s.docs.forEach(d => brandIds.add(d.id))); // Brand results
    snapshots.slice(2 * dbs.length, 4 * dbs.length).forEach(s => s.docs.forEach(d => seriesIdsFromSearch.add(d.id))); // Series results
    snapshots.slice(4 * dbs.length).forEach(s => s.docs.forEach(d => firmwareDocsFromFileNameSearch.set(d.id, d))); // Firmware file name results
    
    const seriesIdsFromBrands = new Set<string>();
    if (brandIds.size > 0) {
        const seriesFromBrandsPromises = dbs.map(db => getDocs(query(collection(db, 'series'), where('brandId', 'in', Array.from(brandIds).slice(0, 30)), limit(queryLimit))));
        const seriesFromBrandsSnapshots = await Promise.all(seriesFromBrandsPromises);
        seriesFromBrandsSnapshots.forEach(snapshot => snapshot.docs.forEach(doc => seriesIdsFromBrands.add(doc.id)));
    }
    
    const allSeriesIds = Array.from(new Set([...seriesIdsFromBrands, ...seriesIdsFromSearch]));

    const firmwarePromises = [];
    // Chunk the series IDs to stay within Firestore's 30-item limit for 'in' queries
    for (let i = 0; i < allSeriesIds.length; i += 30) {
        const chunk = allSeriesIds.slice(i, i + 30);
        if (chunk.length > 0) {
            firmwarePromises.push(...dbs.map(db => getDocs(query(collection(db, 'firmware'), where('seriesId', 'in', chunk), limit(queryLimit)))));
        }
    }
    
    const firmwareSnapshots = await Promise.all(firmwarePromises);
    
    const allFirmwareDocs = [
        ...Array.from(firmwareDocsFromFileNameSearch.values()),
        ...firmwareSnapshots.flatMap(s => s.docs)
    ];
    
    const uniqueFirmware = new Map<string, Firmware>();
    allFirmwareDocs.forEach(doc => {
        if (!uniqueFirmware.has(doc.id) && uniqueFirmware.size < queryLimit) {
            uniqueFirmware.set(doc.id, { id: doc.id, ...doc.data() } as Firmware);
        }
    });

    return Array.from(uniqueFirmware.values());
}



async function getAllFromAllDBs<T extends { id: string }>(collectionName: string): Promise<T[]> {
    const dbs = [db, db_1, db_2];
    const promises = dbs.map(dbInstance => getDocs(collection(dbInstance, collectionName)));
    const snapshots = await Promise.all(promises);
    const results: T[] = [];
    snapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
            results.push({ id: doc.id, ...doc.data() } as T);
        });
    });
    return results;
}

export async function getRecentFirmwareForSeo(count: number = 20): Promise<Firmware[]> {
    const dbs = [db, db_1, db_2];
    const results: Firmware[] = [];

    for (const dbInstance of dbs) {
        const q = query(collection(dbInstance, 'firmware'), orderBy('uploadDate', 'desc'), limit(count));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() } as Firmware));
    }
    
    // Sort all collected items by date and take the most recent 'count'
    return results.sort((a, b) => b.uploadDate.toMillis() - a.uploadDate.toMillis()).slice(0, count);
}

export async function getAllSeries(): Promise<Series[]> {
    const series = await getAllFromAllDBs<Series>('series');
    return series.sort((a, b) => a.name.localeCompare(b.name));
}

// Admin functions remain connected to Firebase
export async function addBrand(name: string): Promise<void> {
    const id = createId(name);
    // Add to the first DB by default
    const brandDocRef = doc(db, 'brands', id);
    await setDoc(brandDocRef, { name, isPopular: false });
}
  
export async function toggleBrandPopularity(brandId: string, isPopular: boolean): Promise<void> {
    const dbs = [db, db_1, db_2];
    for (const dbInstance of dbs) {
        const brandDocRef = doc(dbInstance, 'brands', brandId);
        const docSnap = await getDoc(brandDocRef);
        if (docSnap.exists()) {
            await updateDoc(brandDocRef, { isPopular });
            return;
        }
    }
    throw new Error(`Brand with id ${brandId} not found in any database.`);
}

export async function addSeries(name: string, brandId: string): Promise<void> {
    const id = createId(`${brandId}-${name}`);
    // Add to the first DB by default
    const seriesDocRef = doc(db, 'series', id);
    const brandDocRef = doc(db, 'brands', brandId);
    const brandDoc = await getDoc(brandDocRef);
    if(!brandDoc.exists()) {
        throw new Error(`Brand with id ${brandId} does not exist.`)
    }
    await setDoc(seriesDocRef, { name, brandId });
}

export async function addFirmware(firmware: Omit<Firmware, 'id' | 'uploadDate' | 'downloadCount'>): Promise<void> {
    const id = createId(firmware.fileName);
    // Add to the first DB by default
    const firmwareDocRef = doc(db, 'firmware', id);
  
    const newFirmware: Omit<Firmware, 'id'> = {
      ...firmware,
      uploadDate: new Date(),
      downloadCount: Math.floor(Math.random() * 10000),
    };
  
    await setDoc(firmwareDocRef, newFirmware);
}

export async function getAdSettings(): Promise<AdSettings> {
  const settingsDocRef = doc(db, 'settings', 'ads');
  const docSnap = await getDoc(settingsDocRef);
  
  const defaultSlots: Record<string, AdSlot> = {
    headerBanner: { enabled: false, adCode: '', rel: 'sponsored' },
    inContent: { enabled: false, adCode: '', rel: 'sponsored' },
    footerBanner: { enabled: false, adCode: '', rel: 'sponsored' },
    downloadPage: { enabled: false, adCode: '', rel: 'sponsored' },
  };

  if (docSnap.exists()) {
    const data = docSnap.data();
    // Ensure `rel` field exists with a default
    const slotsWithDefaults = Object.fromEntries(
        Object.entries(data.slots || {}).map(([key, value]) => [
            key,
            { rel: 'sponsored', ...value }
        ])
    );
    return {
        slots: { ...defaultSlots, ...slotsWithDefaults },
    }
  }

  return {
    slots: defaultSlots,
  };
}

export async function updateAdSettings(settings: AdSettings): Promise<void> {
  const settingsDocRef = doc(db, 'settings', 'ads');
  await setDoc(settingsDocRef, settings, { merge: true });
}

export async function getFlashingInstructionsFromDB(brandId: string): Promise<FlashingInstructions | null> {
    const dbRef = ref(rtdb);
    try {
        const snapshot = await get(child(dbRef, `flashingInstructions/${brandId}`));
        if (snapshot.exists()) {
            return snapshot.val() as FlashingInstructions;
        }
        return null;
    } catch (error) {
        console.error("Error fetching flashing instructions from RTDB:", error);
        return null;
    }
}

export async function saveFlashingInstructionsToDB(brandId: string, instructions: FlashingInstructions): Promise<void> {
    const instructionsRef = ref(rtdb, `flashingInstructions/${brandId}`);
    await set(instructionsRef, instructions);
}

export async function getOrCreateTool(toolSlug: string, toolName: string): Promise<Tool> {
    const toolDocRef = doc(db, 'tools', toolSlug);
    const docSnap = await getDoc(toolDocRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Tool;
    } else {
        const newTool: Omit<Tool, 'id'> = {
            name: toolName,
            description: `Download the latest version of ${toolName} and find guides on how to use it for flashing firmware on your mobile device.`,
        };
        await setDoc(toolDocRef, newTool);
        return { id: toolSlug, ...newTool } as Tool;
    }
}

export async function addOrUpdateTool(toolData: Partial<Tool>): Promise<void> {
    const id = toolData.id || createId(toolData.name || '');
    if (!id) throw new Error('Tool name is required to create a slug/id.');
    const toolDocRef = doc(db, 'tools', id);
    await setDoc(toolDocRef, toolData, { merge: true });
}

export async function deleteToolById(id: string): Promise<void> {
    if (!id) throw new Error('Tool ID is required.');
    const toolDocRef = doc(db, 'tools', id);
await deleteDoc(toolDocRef);
}

export async function getAllTools(): Promise<Tool[]> {
    const toolsCol = collection(db, 'tools');
    const toolSnapshot = await getDocs(toolsCol);
    const toolList = toolSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
    return toolList.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
    return await getDocFromAnyDB('tools', slug) as Tool | null;
}

export async function getRelatedFirmware(brandId: string, currentSeriesId: string): Promise<Series[]> {
    if (!brandId) return [];

    const seriesForBrand = await getSeriesByBrand(brandId);
    
    const related = seriesForBrand.filter(s => s.id !== currentSeriesId);

    // Shuffle the array and take the first 4
    const shuffled = related.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
}

export async function getApiKey(): Promise<string> {
  const settingsDocRef = doc(db, 'settings', 'api');
  const docSnap = await getDoc(settingsDocRef);
  if (docSnap.exists()) {
    return docSnap.data().geminiApiKey || '';
  }
  return '';
}

export async function updateApiKey(apiKey: string): Promise<void> {
  const settingsDocRef = doc(db, 'settings', 'api');
  await setDoc(settingsDocRef, { geminiApiKey: apiKey });
}

export async function getHeaderScripts(): Promise<string> {
    const settingsDocRef = doc(db, 'settings', 'scripts');
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
        return docSnap.data().content || '';
    }
    return '';
}

export async function setHeaderScripts(scripts: string): Promise<void> {
    const settingsDocRef = doc(db, 'settings', 'scripts');
    await setDoc(settingsDocRef, { content: scripts });
}

async function countDocsInDB(dbInstance: Firestore, collectionName: string): Promise<number> {
    const snapshot = await getCountFromServer(collection(dbInstance, collectionName));
    return snapshot.data().count;
}

export async function getTotalFirmwares(): Promise<number> {
    const counts = await Promise.all([
        countDocsInDB(db, 'firmware'),
        countDocsInDB(db_1, 'firmware'),
        countDocsInDB(db_2, 'firmware'),
    ]);
    return counts.reduce((sum, count) => sum + count, 0);
}

export async function getTotalDownloads(): Promise<number> {
    const totalDownloadsRef = ref(rtdb, 'analytics/totalDownloads');
    const snapshot = await get(totalDownloadsRef);
    return snapshot.exists() ? snapshot.val() : 0;
}

export async function getDailyVisitors(): Promise<number> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const dailyVisitorsRef = ref(rtdb, `analytics/dailyVisitors/${today}`);
    const snapshot = await get(dailyVisitorsRef);
    return snapshot.exists() ? snapshot.size : 0;
}


export async function saveDonation(data: { name: string; email?: string; amount: number; message?: string; }) {
    const donationsCol = collection(db, 'donations');
    await addDoc(donationsCol, { ...data, createdAt: new Date() });
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const contactsCol = collection(db, 'contacts');
  const q = query(contactsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
}

export async function getDonations(): Promise<Donation[]> {
  const donationsCol = collection(db, 'donations');
  const q = query(donationsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
}


export async function saveContactMessage(data: { name: string; email: string; message: string; }) {
    const contactsCol = collection(db, 'contacts');
    await addDoc(contactsCol, { ...data, createdAt: new Date() });
}

export async function incrementDownloadCount(firmwareId: string): Promise<void> {
    const dbs = [db, db_1, db_2];
    let firmwareDocRef: any;

    // Find which DB the firmware is in
    for (const dbInst of dbs) {
        const tempRef = doc(dbInst, 'firmware', firmwareId);
        const tempSnap = await getDoc(tempRef);
        if (tempSnap.exists()) {
            firmwareDocRef = tempRef;
            break;
        }
    }

    if (!firmwareDocRef) {
        console.error(`Firmware with id ${firmwareId} not found in any database.`);
        return;
    }

    const firmwareDoc = await getDoc(firmwareDocRef);
    if (firmwareDoc.exists()) {
        const currentCount = firmwareDoc.data().downloadCount || 0;
        await updateDoc(firmwareDocRef, { downloadCount: currentCount + 1 });
    }

    // Also increment total download count in RTDB for fast access on dashboard
    const totalDownloadsRef = ref(rtdb, 'analytics/totalDownloads');
    await runTransaction(totalDownloadsRef, (currentCount) => {
        return (currentCount || 0) + 1;
    });
}

// Privacy-conscious visitor logging
async function getDailySalt(): Promise<string> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const saltRef = ref(rtdb, `analytics/salts/${today}`);
    const snapshot = await get(saltRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        const newSalt = createHash('sha256').update(Math.random().toString()).digest('hex');
        await set(saltRef, newSalt);
        return newSalt;
    }
}

export async function logVisitor(ip: string): Promise<void> {
    const salt = await getDailySalt();
    const hashedIp = createHash('sha256').update(ip + salt).digest('hex');
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const visitorRef = ref(rtdb, `analytics/dailyVisitors/${today}/${hashedIp}`);
    
    // Use set to ensure we only store one entry per hashed IP per day
    await set(visitorRef, true);
}


// Blog Functions using RTDB
export async function saveBlogPost(post: BlogPostOutput): Promise<string> {
    const blogRef = ref(rtdb, 'blog');
    const newPostRef = push(blogRef);
    const slug = createId(post.title);
    
    const dataToSave: Omit<BlogPost, 'id'> = {
        ...post,
        slug: slug,
        createdAt: serverTimestamp(),
    };

    await set(newPostRef, dataToSave);
    return slug;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
    const blogRef = ref(rtdb, 'blog');
    const snapshot = await get(blogRef);
    if (snapshot.exists()) {
        const posts: BlogPost[] = [];
        snapshot.forEach((childSnapshot) => {
            posts.push({ id: childSnapshot.key!, ...childSnapshot.val() });
        });
        // Sort posts by createdAt timestamp in descending order (newest first)
        return posts.sort((a, b) => b.createdAt - a.createdAt);
    }
    return [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const blogRef = ref(rtdb, 'blog');
    const snapshot = await get(blogRef);
    if (snapshot.exists()) {
        let post: BlogPost | null = null;
        snapshot.forEach((childSnapshot) => {
            const postData = childSnapshot.val();
            if (postData.slug === slug) {
                post = { id: childSnapshot.key!, ...postData };
            }
        });
        return post;
    }
    return null;
}
