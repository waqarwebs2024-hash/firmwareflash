

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, setDoc, query, where, documentId, writeBatch, limit, orderBy, getCountFromServer } from 'firebase/firestore';
import { Brand, Series, Firmware, AdSettings, FlashingInstructions, Tool, ContactMessage, Donation } from './types';
import slugify from 'slugify';
import { seedBrands, brands as brandData, seedHuaweiFirmware } from './seed';

// A function to slugify strings for use in Firestore document IDs
const createId = (name: string) => slugify(name, { lower: true, strict: true });

export async function searchFirmware(searchTerm: string, queryLimit?: number): Promise<Firmware[]> {
  if (!searchTerm) return [];

  const searchTermLower = searchTerm.toLowerCase();

  try {
    const brandsCol = collection(db, 'brands');
    const seriesCol = collection(db, 'series');
    
    // Find matching brand and series IDs first
    const brandSnapshot = await getDocs(brandsCol);
    const seriesSnapshot = await getDocs(seriesCol);

    const matchingBrandIds = brandSnapshot.docs
        .filter(doc => doc.data().name.toLowerCase().includes(searchTermLower))
        .map(doc => doc.id);

    const matchingSeriesIds = seriesSnapshot.docs
        .filter(doc => doc.data().name.toLowerCase().includes(searchTermLower))
        .map(doc => doc.id);

    const uniqueIds = [...new Set([...matchingBrandIds, ...matchingSeriesIds])];

    const firmwareCol = collection(db, 'firmware');
    const firmwareSnapshot = await getDocs(firmwareCol);
    const allFirmware = firmwareSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Firmware));
    
    const results = allFirmware.filter(fw => {
        const fileNameMatch = fw.fileName.toLowerCase().includes(searchTermLower);
        const brandMatch = matchingBrandIds.includes(fw.brandId);
        const seriesMatch = matchingSeriesIds.includes(fw.seriesId);
        return fileNameMatch || brandMatch || seriesMatch;
    });

    if (queryLimit) {
        return results.slice(0, queryLimit);
    }
    
    return results;

  } catch (error) {
    console.error("Error searching firmware: ", error);
    return [];
  }
}


export async function getBrands(): Promise<Brand[]> {
  const brandsCol = collection(db, 'brands');
  const brandSnapshot = await getDocs(brandsCol);
  
  if (brandSnapshot.docs.length < brandData.length) {
    await seedBrands();
    const newSnapshot = await getDocs(brandsCol);
    const brandList = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
    return brandList;
  }
  
  const brandList = brandSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
  return brandList.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPopularBrands(count: number = 10): Promise<Brand[]> {
  const firmwareCol = collection(db, 'firmware');
  const firmwareSnapshot = await getDocs(firmwareCol);
  
  const seriesDownloadCount = new Map<string, number>();

  firmwareSnapshot.docs.forEach(doc => {
    const firmware = doc.data() as Omit<Firmware, 'id'>;
    if (firmware.seriesId) {
      const currentCount = seriesDownloadCount.get(firmware.seriesId) || 0;
      seriesDownloadCount.set(firmware.seriesId, currentCount + (firmware.downloadCount || 0));
    }
  });

  if (seriesDownloadCount.size === 0) {
    const allBrands = await getBrands();
    return allBrands.slice(0, count);
  };
  
  const seriesCol = collection(db, 'series');
  const seriesSnapshot = await getDocs(seriesCol);
  
  const brandDownloadCount = new Map<string, number>();

  seriesSnapshot.docs.forEach(doc => {
    const aSeries = doc.data() as Omit<Series, 'id'>;
    if (aSeries.brandId) {
        const seriesDownloads = seriesDownloadCount.get(doc.id) || 0;
        const currentBrandDownloads = brandDownloadCount.get(aSeries.brandId) || 0;
        brandDownloadCount.set(aSeries.brandId, currentBrandDownloads + seriesDownloads);
    }
  });

  if (brandDownloadCount.size === 0) {
    const allBrands = await getBrands();
    return allBrands.slice(0, count);
  }

  const sortedBrandIds = Array.from(brandDownloadCount.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, count);

  if(sortedBrandIds.length === 0) return [];

  const brandsCol = collection(db, 'brands');
  const brandsQuery = query(brandsCol, where(documentId(), 'in', sortedBrandIds));
  const brandSnapshot = await getDocs(brandsQuery);

  const brandList = brandSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));

  // Sort the final list according to the sortedBrandIds array to maintain popularity order
  return brandList.sort((a, b) => sortedBrandIds.indexOf(a.id) - sortedBrandIds.indexOf(b.id));
}


export async function getBrandsWithFirmware(): Promise<Brand[]> {
  const firmwareCol = collection(db, 'firmware');
  const firmwareSnapshot = await getDocs(firmwareCol);
  if (firmwareSnapshot.empty) {
    return [];
  }

  const seriesIds = new Set<string>();
  firmwareSnapshot.docs.forEach(doc => {
    const firmware = doc.data() as Omit<Firmware, 'id'>;
    if (firmware.seriesId) {
      seriesIds.add(firmware.seriesId);
    }
  });

  if (seriesIds.size === 0) {
    return [];
  }

  const seriesCol = collection(db, 'series');
  const seriesQuery = query(seriesCol, where(documentId(), 'in', Array.from(seriesIds)));
  const seriesSnapshot = await getDocs(seriesQuery);
  
  const brandIds = new Set<string>();
  seriesSnapshot.docs.forEach(doc => {
    const aSeries = doc.data() as Omit<Series, 'id'>;
    if (aSeries.brandId) {
      brandIds.add(aSeries.brandId);
    }
  });

  if (brandIds.size === 0) {
    return [];
  }
  
  const brandsCol = collection(db, 'brands');
  const brandsQuery = query(brandsCol, where(documentId(), 'in', Array.from(brandIds)));
  const brandSnapshot = await getDocs(brandsQuery);
  const brandList = brandSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
  
  return brandList;
}


export async function getBrandById(id: string): Promise<Brand | null> {
  if (!id) return null;
  const brandDocRef = doc(db, 'brands', id);
  const brandDoc = await getDoc(brandDocRef);
  if (brandDoc.exists()) {
    return { id: brandDoc.id, ...brandDoc.data() } as Brand;
  }
  return null;
}

export async function getSeriesByBrand(brandId: string): Promise<Series[]> {
  const seriesCol = collection(db, 'series');
  const q = query(seriesCol, where('brandId', '==', brandId));
  const seriesSnapshot = await getDocs(q);
  const seriesList = seriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series));
  return seriesList;
}

export async function getSeriesById(id: string): Promise<Series | null> {
  if (!id) return null;
  const seriesDocRef = doc(db, 'series', id);
  const seriesDoc = await getDoc(seriesDocRef);
  if (seriesDoc.exists()) {
    const seriesData = seriesDoc.data();
    if(seriesData){
      return { id: seriesDoc.id, ...seriesData } as Series;
    }
  }
  return null;
}

export async function getFirmwareBySeries(seriesId: string): Promise<Firmware[]> {
  const firmwareCol = collection(db, 'firmware');
  const q = query(firmwareCol, where('seriesId', '==', seriesId));
  const firmwareSnapshot = await getDocs(q);
  const firmwareList = firmwareSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Firmware));
  return firmwareList;
}

export async function getFirmwareById(id: string): Promise<Firmware | null> {
    const firmwareDocRef = doc(db, 'firmware', id);
    const firmwareDoc = await getDoc(firmwareDoc);
    if (firmwareDoc.exists()) {
        const firmwareData = firmwareDoc.data();
        if(firmwareData){
            return { id: firmwareDoc.id, ...firmwareData } as Firmware;
        }
    }
    return null;
}

export async function getRecentFirmwareForSeo(count: number = 20): Promise<Firmware[]> {
    const firmwareCol = collection(db, 'firmware');
    const q = query(firmwareCol, orderBy('uploadDate', 'desc'), limit(count));
    const firmwareSnapshot = await getDocs(q);
    const firmwareList = firmwareSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Firmware));
    return firmwareList;
}

export async function getAllSeries(): Promise<Series[]> {
  const seriesCol = collection(db, 'series');
  const seriesSnapshot = await getDocs(seriesCol);
  const seriesList = seriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series));
  return seriesList.sort((a, b) => a.name.localeCompare(b.name));
}

export async function addBrand(name: string): Promise<void> {
    const id = createId(name);
    const brandDocRef = doc(db, 'brands', id);
    await setDoc(brandDocRef, { name });
}
  

export async function addSeries(name: string, brandId: string): Promise<void> {
  const id = createId(`${brandId}-${name}`);
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
    const firmwareDocRef = doc(db, 'firmware', id);
  
    const newFirmware: Omit<Firmware, 'id'> = {
      ...firmware,
      uploadDate: new Date(),
      downloadCount: Math.floor(Math.random() * 10000),
    };
  
    await setDoc(firmwareDocRef, newFirmware);
}

export async function getAnnouncement(): Promise<string> {
  const settingsDocRef = doc(db, 'settings', 'announcement');
  const docSnap = await getDoc(settingsDocRef);
  if (docSnap.exists()) {
    return docSnap.data().text || '';
  }
  return 'Welcome to Firmware Finder! We are constantly updating our database with new firmware. If you have a request, please let us know.';
}

export async function setAnnouncement(text: string): Promise<void> {
  const settingsDocRef = doc(db, 'settings', 'announcement');
  await setDoc(settingsDocRef, { text });
}


export async function getAdSettings(): Promise<AdSettings> {
  const settingsDocRef = doc(db, 'settings', 'ads');
  const docSnap = await getDoc(settingsDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as AdSettings;
  }
  return {
    enabled: false,
    adsenseClient: '',
    adsenseSlot: '',
    timeout: 10
  };
}

export async function updateAdSettings(settings: AdSettings): Promise<void> {
  const settingsDocRef = doc(db, 'settings', 'ads');
  await setDoc(settingsDocRef, settings);
}

export async function getFlashingInstructionsFromDB(brandId: string): Promise<FlashingInstructions | null> {
    const instructionsDocRef = doc(db, 'flashingInstructions', brandId);
    const docSnap = await getDoc(instructionsDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as FlashingInstructions;
    }
    return null;
}

export async function saveFlashingInstructionsToDB(brandId: string, instructions: FlashingInstructions): Promise<void> {
    const instructionsDocRef = doc(db, 'flashingInstructions', brandId);
    await setDoc(instructionsDocRef, instructions);
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

    const seriesCol = collection(db, 'series');
    
    // Firestore doesn't support "not equal" queries efficiently in a way that
    // scales and can be combined with other filters easily.
    // The most straightforward approach is to fetch all series for the brand
    // and filter in the application. This is acceptable for a reasonable number of series per brand.
    const q = query(
        seriesCol,
        where('brandId', '==', brandId)
    );

    try {
        const seriesSnapshot = await getDocs(q);
        const allSeriesForBrand = seriesSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Series))
            .filter(s => s.id !== currentSeriesId); // Filter out the current series

        // Shuffle the array and take the first 4
        const shuffled = allSeriesForBrand.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);

    } catch (error) {
        console.error("Error fetching related firmware:", error);
        return [];
    }
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

export async function getTotalFirmwares(): Promise<number> {
  try {
    const firmwareCol = collection(db, 'firmware');
    const snapshot = await getCountFromServer(firmwareCol);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting total firmwares: ", error);
    return 0;
  }
}

export async function getTotalDownloads(): Promise<number> {
  try {
    const firmwareCol = collection(db, 'firmware');
    const firmwareSnapshot = await getDocs(firmwareCol);
    let total = 0;
    firmwareSnapshot.forEach(doc => {
      total += doc.data().downloadCount || 0;
    });
    return total;
  } catch (error) {
    console.error("Error getting total downloads: ", error);
    return 0;
  }
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
