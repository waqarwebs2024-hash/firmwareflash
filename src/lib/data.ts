

import { db, db_1, db_2, rtdb } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, setDoc, query, where, documentId, writeBatch, limit, orderBy, getCountFromServer, Firestore } from 'firebase/firestore';
import { ref, get, set, child } from 'firebase/database';
import { Brand, Series, Firmware, AdSettings, FlashingInstructions, Tool, ContactMessage, Donation, DailyAnalytics, HeaderScripts } from './types';
import slugify from 'slugify';

const createId = (name: string) => slugify(name, { lower: true, strict: true });


async function searchFirestore(dbInstance: Firestore, collectionName: string, field: string, searchTerm: string, limitVal?: number) {
    const collRef = collection(dbInstance, collectionName);
    const q = query(collRef, where(field, '>=', searchTerm), where(field, '<=', searchTerm + '\uf8ff'), limit(limitVal || 25));
    return await getDocs(q);
}

export async function searchFirmware(searchTerm: string, queryLimit: number = 50): Promise<Firmware[]> {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const searchTermLower = searchTerm.toLowerCase();
    const dbs = [db, db_1, db_2];
    let results: Firmware[] = [];

    // This is not a perfect search, but it's a simple way to query across collections.
    // For a production app, a dedicated search service like Algolia or Elasticsearch would be better.
    const brandNameQuery = dbs.map(dbInstance => searchFirestore(dbInstance, 'brands', 'name', searchTerm));
    const seriesNameQuery = dbs.map(dbInstance => searchFirestore(dbInstance, 'series', 'name', searchTerm));
    const fileNameQuery = dbs.map(dbInstance => searchFirestore(dbInstance, 'firmware', 'fileName', searchTermLower));

    const [
        ...brandResults
    ] = await Promise.all(brandNameQuery);

    const [
        ...seriesResults
    ] = await Promise.all(seriesNameQuery);

    const [
        ...firmwareResults
    ] = await Promise.all(fileNameQuery);
    
    const brandIds = brandResults.flatMap(res => res.docs.map(d => d.id));
    const seriesIds = seriesResults.flatMap(res => res.docs.map(d => d.id));

    let firmwareQueries = [];

    if (brandIds.length > 0) {
        firmwareQueries.push(...dbs.map(dbInstance => getDocs(query(collection(dbInstance, 'firmware'), where('brandId', 'in', brandIds), limit(queryLimit)))))
    }
    if (seriesIds.length > 0) {
        firmwareQueries.push(...dbs.map(dbInstance => getDocs(query(collection(dbInstance, 'firmware'), where('seriesId', 'in', seriesIds), limit(queryLimit)))))
    }

    const firmwareByIdsResults = await Promise.all(firmwareQueries);
    
    const allResults = [
        ...firmwareResults.flatMap(r => r.docs),
        ...firmwareByIdsResults.flatMap(r => r.docs),
    ];
    
    const uniqueIds = new Set<string>();
    const uniqueResults: Firmware[] = [];

    for (const doc of allResults) {
        if (!uniqueIds.has(doc.id) && uniqueResults.length < queryLimit) {
            uniqueIds.add(doc.id);
            uniqueResults.push({ id: doc.id, ...doc.data() } as Firmware);
        }
    }

    return uniqueResults;
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

export async function getBrands(): Promise<Brand[]> {
    const brands = await getAllFromAllDBs<Brand>('brands');
    return brands.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBrandById(id: string): Promise<Brand | null> {
    if (!id) return null;
    const dbs = [db, db_1, db_2];
    for (const dbInstance of dbs) {
        const docRef = doc(dbInstance, 'brands', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Brand;
        }
    }
    return null;
}

export async function getSeriesByBrand(brandId: string): Promise<Series[]> {
    if (!brandId) return [];
    const dbs = [db, db_1, db_2];
    let allSeries: Series[] = [];

    for (const dbInstance of dbs) {
        const q = query(collection(dbInstance, 'series'), where('brandId', '==', brandId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            allSeries.push({ id: doc.id, ...doc.data() } as Series);
        });
    }

    return allSeries.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getSeriesById(id: string): Promise<Series | null> {
    if (!id) return null;
    const dbs = [db, db_1, db_2];
    for (const dbInstance of dbs) {
        const docRef = doc(dbInstance, 'series', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Series;
        }
    }
    return null;
}

export async function getFirmwareBySeries(seriesId: string): Promise<Firmware[]> {
    if (!seriesId) return [];
    const dbs = [db, db_1, db_2];
    let allFirmware: Firmware[] = [];

    for (const dbInstance of dbs) {
        const q = query(collection(dbInstance, 'firmware'), where('seriesId', '==', seriesId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            allFirmware.push({ id: doc.id, ...doc.data() } as Firmware);
        });
    }
    return allFirmware;
}

export async function getFirmwareById(id: string): Promise<Firmware | null> {
    if (!id) return null;
    const dbs = [db, db_1, db_2];
    for (const dbInstance of dbs) {
        const docRef = doc(dbInstance, 'firmware', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Firmware;
        }
    }
    return null;
}

export async function getRecentFirmwareForSeo(count: number = 20): Promise<Firmware[]> {
    // This is simplified, in a real app you might query only one DB or aggregate differently
    const q = query(collection(db, 'firmware'), orderBy('uploadDate', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Firmware));
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
    await setDoc(brandDocRef, { name });
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
    headerBanner: { enabled: false, adCode: '' },
    inContent: { enabled: false, adCode: '' },
    footerBanner: { enabled: false, adCode: '' },
    downloadPage: { enabled: false, adCode: '' },
  };

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
        slots: { ...defaultSlots, ...data.slots },
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

export async function getAllTools(): Promise<Tool[]> {
    const toolsCol = collection(db, 'tools');
    const toolSnapshot = await getDocs(toolsCol);
    const toolList = toolSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
    return toolList.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
    if (!slug) return null;
    const toolDocRef = doc(db, 'tools', slug);
    const toolDoc = await getDoc(toolDocRef);
    if (toolDoc.exists()) {
        return { id: toolDoc.id, ...toolDoc.data() } as Tool;
    }
    return null;
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

async function getFirmwareFromAllDBs(): Promise<Firmware[]> {
    return getAllFromAllDBs<Firmware>('firmware');
}

export async function getTotalDownloads(): Promise<number> {
  const allFirmware = await getFirmwareFromAllDBs();
  return allFirmware.reduce((sum, fw) => sum + (fw.downloadCount || 0), 0);
}


export async function saveDonation(data: { name: string; email?: string; amount: number; message?: string; }) {
    const donationsCol = collection(db, 'donations');
    await addDoc(donationsCol, { ...data, createdAt: new Date() });
}

export async function saveContactMessage(data: { name: string; email: string; message: string; }) {
    const contactsCol = collection(db, 'contacts');
    await addDoc(contactsCol, { ...data, createdAt: new Date() });
}

export async function getDonations(): Promise<Donation[]> {
  const donationsCol = collection(db, 'donations');
  const q = query(donationsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const contactsCol = collection(db, 'contacts');
  const q = query(contactsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
}

export async function getTodaysAnalytics(): Promise<DailyAnalytics> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const docRef = doc(db, 'analytics/daily/data', today);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as DailyAnalytics;
    }

    // If no data, return a default object, maybe create it?
    const defaultData: Omit<DailyAnalytics, 'id'> = {
        visitors: 120, // Dummy data
        downloads: 45, // Dummy data
        adsClicks: 10,  // Dummy data
    };
    await setDoc(docRef, defaultData);
    
    return { id: today, ...defaultData };
}

export async function incrementDownloadCount(firmwareId: string): Promise<void> {
    const dbs = [db, db_1, db_2];
    let firmwareDocRef;
    let dbInstance;

    // Find which DB the firmware is in
    for (const dbInst of dbs) {
        const tempRef = doc(dbInst, 'firmware', firmwareId);
        const tempSnap = await getDoc(tempRef);
        if (tempSnap.exists()) {
            firmwareDocRef = tempRef;
            dbInstance = dbInst;
            break;
        }
    }

    if (!firmwareDocRef || !dbInstance) {
        console.error(`Firmware with id ${firmwareId} not found in any database.`);
        return;
    }

    const firmwareDoc = await getDoc(firmwareDocRef);
    if (firmwareDoc.exists()) {
        const currentCount = firmwareDoc.data().downloadCount || 0;
        await setDoc(firmwareDocRef, { downloadCount: currentCount + 1 }, { merge: true });
    }

    // Also increment daily download count
    const today = new Date().toISOString().split('T')[0];
    const analyticsDocRef = doc(db, 'analytics/daily/data', today); // Analytics are in the main DB
    const analyticsDoc = await getDoc(analyticsDocRef);

    if (analyticsDoc.exists()) {
        const currentDownloads = analyticsDoc.data().downloads || 0;
        await setDoc(analyticsDocRef, { downloads: currentDownloads + 1 }, { merge: true });
    } else {
        await setDoc(analyticsDocRef, { downloads: 1 }, { merge: true });
    }
}
