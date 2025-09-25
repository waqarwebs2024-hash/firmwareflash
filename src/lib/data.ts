

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
    
    for (const dbInstance of dbs) {
        try {
            const snap = await getDoc(doc(dbInstance, collectionName, id));
            if (snap.exists()) {
                return { id: snap.id, ...snap.data() };
            }
        } catch (e) {
            // console.error(`Error fetching doc ${id} from a DB instance:`, e);
            continue; // Try next database
        }
    }
    
    // console.warn(`Document ${id} in ${collectionName} not found in any database.`);
    return null;
}

async function findDocInAnyDB(collectionName: string, id: string): Promise<{ db: Firestore, ref: any } | null> {
    if (!id) return null;
    const dbs = [db, db_1, db_2];
    
    for (const dbInstance of dbs) {
        try {
            const docRef = doc(dbInstance, collectionName, id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                return { db: dbInstance, ref: docRef };
            }
        } catch (e) {
            continue;
        }
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

export async function searchFirmware(searchTerm: string, queryLimit: number = 50): Promise<Firmware[]> {
    if (!searchTerm || searchTerm.length < 2) return [];

    const searchTermLower = searchTerm.toLowerCase();

    const allDbs = [db, db_1, db_2];
    const searchPromises = allDbs.map(dbInstance => getDocs(collection(dbInstance, 'firmware')));
    
    const snapshots = await Promise.all(searchPromises);
    const uniqueFirmware = new Map<string, Firmware>();

    snapshots.forEach(snapshot => {
        snapshot.docs.forEach(doc => {
            const firmware = { id: doc.id, ...doc.data() } as Firmware;
            if (firmware.fileName.toLowerCase().includes(searchTermLower)) {
                if (!uniqueFirmware.has(doc.id)) {
                    uniqueFirmware.set(doc.id, firmware);
                }
            }
        });
    });

    return Array.from(uniqueFirmware.values()).slice(0, queryLimit);
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

export async function getFlashingInstructionsFromDB(cpuType: string): Promise<FlashingInstructions | null> {
    const dbRef = ref(rtdb);
    try {
        const snapshot = await get(child(dbRef, `flashingInstructions/${cpuType}`));
        if (snapshot.exists()) {
            return snapshot.val() as FlashingInstructions;
        }
        return null;
    } catch (error) {
        console.error("Error fetching flashing instructions from RTDB:", error);
        return null;
    }
}

export async function saveFlashingInstructionsToDB(cpuType: string, instructions: FlashingInstructions): Promise<void> {
    const instructionsRef = ref(rtdb, `flashingInstructions/${cpuType}`);
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
    const firmwareLocation = await findDocInAnyDB('firmware', firmwareId);
    if (!firmwareLocation) {
        console.error(`Firmware with id ${firmwareId} not found in any database.`);
        return;
    }
    
    const { ref: firmwareDocRef } = firmwareLocation;
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

export async function saveCpuTypeForFirmware(firmwareId: string, cpuType: string): Promise<void> {
    const firmwareLocation = await findDocInAnyDB('firmware', firmwareId);
    if (firmwareLocation) {
        await updateDoc(firmwareLocation.ref, { cpuType: cpuType });
    } else {
        console.error(`Could not find firmware ${firmwareId} to save CPU type.`);
    }
}

export async function seedAllInstructionsToDb() {
    const instructions: Record<string, FlashingInstructions> = {
        mediatek: {
            introduction: "Use the SmartPhone (SP) Flash Tool to flash the stock firmware or flash file on your MediaTek device. This guide will walk you through the process of using the SP Flash Tool. Ensure you have the correct stock ROM download for your device.",
            prerequisites: ["A Windows PC.", "The correct stock firmware (flash file) for your device model.", "MediaTek USB VCOM drivers installed on your PC.", "The latest version of the SP Flash Tool.", "A USB cable to connect your device to the PC.", "A backup of your important data."],
            instructions: [
                { title: "Install Drivers and Extract Files", description: "Install the MediaTek USB VCOM drivers on your computer. Extract the downloaded SP Flash Tool and the firmware zip file to a convenient location on your PC." },
                { title: "Launch SP Flash Tool", description: "Navigate to the extracted SP Flash Tool folder and run 'flash_tool.exe' as an administrator." },
                { title: "Load Scatter File", description: "In the SP Flash Tool, click on the 'Scatter-loading File' button. Navigate to the extracted firmware folder and select the 'MTxxxx_Android_scatter.txt' file (xxxx will be your device's chipset number)." },
                { title: "Select Download Mode", description: "Ensure the dropdown menu is set to 'Download Only'. This mode is safest and will not erase your device's NVRAM or IMEI data. Do NOT use 'Format All + Download' unless you are an expert and have a backup of your NVRAM." },
                { title: "Start the Flashing Process", description: "Click the 'Download' button with the green arrow to begin the flashing process. The tool will now be ready to detect your device." },
                { title: "Connect Your Device", description: "Power off your MediaTek device completely. While holding the Volume Down or Volume Up key (this varies by device), connect it to the computer via the USB cable. The tool should detect your device and start the flashing process automatically." },
                { title: "Wait for Completion", description: "The flashing process will take a few minutes. You will see a progress bar at the bottom. Once it's complete, a green tick with a 'Download OK' message will appear. You can now safely disconnect your device and power it on." }
            ],
            warning: "Flashing firmware can be risky. Proceed with caution. firmwareflash.com is not responsible for any damage to your device. Ensure you are using the correct firmware for your device model to avoid bricking it.",
            tool: { name: "SP Flash Tool", slug: "sp-flash-tool" }
        },
        spd: {
            introduction: "To flash firmware on a Spreadtrum (SPD) chipset device, you need to use the SPD Upgrade Tool. This tool allows you to flash '.pac' or '.p5c' firmware files. Make sure you have the correct stock ROM download for your device.",
            prerequisites: ["A Windows PC.", "The correct '.pac' stock firmware for your device.", "SPD SCI USB drivers installed on your PC.", "The latest version of the SPD Upgrade Tool or SPD Research Tool.", "A functioning USB cable."],
            instructions: [
                { title: "Install Drivers and Extract Files", description: "First, install the SPD SCI USB drivers on your computer. Then, extract the SPD Upgrade Tool and the firmware '.pac' file onto your PC." },
                { title: "Launch SPD Upgrade Tool", description: "Open the extracted SPD Upgrade Tool folder and run 'UpgradeDownload.exe' as an administrator." },
                { title: "Load PAC Firmware File", description: "Click on the first gear icon ('Load Packet') and select the '.pac' firmware file you extracted earlier. It may take a few moments for the tool to load the file." },
                { title: "Start Download Mode", description: "Click on the third icon, which looks like a play button ('Start Downloading'), to put the tool in flashing mode." },
                { title: "Connect Your Device", description: "Turn off your device completely. Press and hold the Volume Down key, and while holding it, connect your device to the PC using the USB cable. The tool will automatically detect the device and start flashing." },
                { title: "Wait for Completion", description: "The flashing process will begin, and you can monitor the progress bar. Once finished, you will see a green 'Passed' message. You can now disconnect your device and turn it on." }
            ],
            warning: "Using the wrong firmware can brick your device. Double-check that the firmware file is meant for your exact model. firmwareflash.com is not liable for any damages.",
            tool: { name: "SPD Upgrade Tool", slug: "spd-upgrade-tool" }
        },
        qualcomm: {
            introduction: "For Qualcomm chipset devices, the Qualcomm Flash Image Loader (QFIL) tool is used to flash stock firmware. This is essential for unbricking devices or performing a clean software install. You will need the specific stock ROM download for your model.",
            prerequisites: ["A Windows PC.", "The correct MBN/ELF format stock firmware for your device.", "Qualcomm HS-USB QDLoader 9008 drivers installed.", "The latest version of QPST, which includes the QFIL tool.", "A high-quality USB cable."],
            instructions: [
                { title: "Install Drivers and QPST", description: "Install the Qualcomm HS-USB QDLoader 9008 drivers and the QPST suite on your computer. Extract the firmware files to a folder on your PC." },
                { title: "Boot Device into EDL Mode", description: "Power off your device. You need to boot it into Emergency Download (EDL) mode. This can be done by holding specific key combinations (e.g., Volume Up + Volume Down) while connecting the USB cable, or by using the ADB command 'adb reboot edl'. Some devices may require test points on the motherboard for EDL mode." },
                { title: "Launch and Configure QFIL", description: "Open the QFIL tool. It should automatically detect your device as 'Qualcomm HS-USB QDLoader 9008' on a COM port. If not, re-check your drivers and EDL mode." },
                { title: "Load Firmware Files", description: "In QFIL, select 'Flat Build'. Click 'Browse' and select the 'prog_emmc_firehose_...mbn' file from your firmware folder. Then, click 'Load XML' and select the 'rawprogram_unsparse.xml' and subsequently the 'patch0.xml' file." },
                { title: "Start Flashing", description: "Once all files are loaded, click the 'Download' button to start the flashing process. Do not disconnect the device during this time." },
                { title: "Wait for Completion", description: "The process will take several minutes. Once completed, you will see a 'Download Succeed' or 'Finish Download' message. Your device may reboot automatically, or you may need to power it on manually." }
            ],
            warning: "EDL mode flashing is an advanced procedure. Incorrect handling or using the wrong firmware can permanently damage your device. Proceed with extreme caution.",
            tool: { name: "QFIL", slug: "qfil-tool" }
        },
        other: { // Corresponds to Samsung/Exynos/Fastboot
            introduction: "Use Odin for Samsung devices or Fastboot for others like Google Pixel, Xiaomi, and OnePlus to flash the stock firmware or flash file. This guide provides a general overview. Ensure you have the correct stock ROM download for your device.",
            prerequisites: ["A Windows PC.", "The correct stock firmware (flash file) for your device.", "Samsung USB Drivers (for Odin) or ADB/Fastboot drivers (for Fastboot) installed.", "The latest version of Odin or the platform-tools for Fastboot.", "A good quality USB cable."],
            instructions: [
                { title: "Install Drivers and Extract Files", description: "Install the necessary USB drivers for your brand. Extract the downloaded firmware zip file, which will contain files like AP, BL, CP, and CSC for Samsung, or 'image-....zip' for Fastboot." },
                { title: "Boot into Download/Fastboot Mode", description: "For Samsung, power off and hold Volume Down + Bixby + Power to enter Download Mode. For other devices, power off and hold Volume Down + Power to enter Fastboot/Bootloader Mode." },
                { title: "Launch Flashing Tool", description: "Run Odin.exe as administrator. For Fastboot, open a command prompt or terminal in your extracted platform-tools folder." },
                { title: "Load Firmware Files", description: "In Odin, load the AP, BL, CP, and CSC files into their corresponding slots. For Fastboot, you will use commands like 'fastboot update image-....zip' or run the 'flash-all.bat' script." },
                { title: "Start the Flashing Process", description: "In Odin, click 'Start'. For Fastboot, execute the flashing command. The process will begin." },
                { title: "Wait for Completion", description: "This will take several minutes. Odin will show a green 'PASS' message. Fastboot will show 'Finished. Total time: ...' in the terminal. Your device will reboot automatically." }
            ],
            warning: "Flashing the wrong firmware can brick your device. Ensure you are using the firmware for your exact model number. This process may erase all your data.",
            tool: { name: "Odin / Fastboot", slug: "odin-fastboot" }
        }
    };

    for (const [key, value] of Object.entries(instructions)) {
        await saveFlashingInstructionsToDB(key, value);
    }
}


