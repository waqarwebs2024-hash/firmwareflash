

import { db, db_1, db_2 } from './firebase';
import { collection, doc, writeBatch, getDocs, getDoc, Firestore } from 'firebase/firestore';
import { Brand } from './types';
import slugify from 'slugify';
import fs from 'fs/promises';
import path from 'path';

const createId = (name: string) => slugify(name, { lower: true, strict: true });

// This brand data is now redundant as we read from files, but we keep it for reference
// or if we need to seed initial brands for some other purpose.
export const brands: Omit<Brand, 'id'>[] = [
    { name: 'Samsung' },
    { name: 'Apple' },
    { name: 'Xiaomi' },
    { name: 'Huawei' },
    { name: 'Oppo' },
    { name: 'Vivo' },
    { name: 'Realme' },
    { name: 'OnePlus' },
    { name: 'Google Pixel' },
    { name: 'Motorola' },
    { name: 'Nokia' },
    { name: 'Sony Xperia' },
    { name: 'Asus' },
    { name: 'Lenovo' },
    { name: 'Redmi' },
    { name: 'Poco' },
    { name: 'iQOO' },
    { name: 'Honor' },
    { name: 'HTC' },
    { name: 'ZTE' },
    { name: 'Meizu' },
    { name: 'Sharp' },
    { name: 'Panasonic' },
    { name: 'TCL' },
    { name: 'Alcatel' },
    { name: 'Coolpad' },
    { name: 'Black Shark' },
    { name: 'Infinix' },
    { 'name': 'Tecno' },
    { name: 'Itel' },
    { name: 'Lava' },
    { name: 'Micromax' },
    { name: 'QMobile' },
    { name: 'Jio' },
    { name: 'Karbonn' },
    { name: 'Spice' },
    { name: 'Symphony' },
    { name: 'Walton' },
    { name: 'Gionee' },
    { name: 'BLU' },
    { name: 'BQ' },
    { name: 'Archos' },
    { name: 'Celkon' },
    { name: 'Philips' },
];

export async function seedBrands() {
  const brandsCol = collection(db, 'brands');
  const snapshot = await getDocs(brandsCol);
  const existingBrandNames = new Set(snapshot.docs.map(doc => doc.data().name.toLowerCase()));
  
  const batch = writeBatch(db);
  let hasNewBrands = false;

  brands.forEach((brand) => {
    if (!existingBrandNames.has(brand.name.toLowerCase())) {
      const id = createId(brand.name);
      const docRef = doc(brandsCol, id);
      batch.set(docRef, brand);
      hasNewBrands = true;
    }
  });

  if (hasNewBrands) {
    try {
      await batch.commit();
      console.log('New brands successfully seeded to Firestore.');
    } catch (error) {
      console.error('Error seeding new brands:', error);
    }
  } else {
    console.log('All brands already exist in Firestore.');
  }
}

async function seedDataToDatabase(database: Firestore, files: string[], existingFirmwareIds: Set<string>, counters: { brandsAdded: number, seriesAdded: number, firmwareAdded: number }) {
    let batch = writeBatch(database);
    let operationCount = 0;
    const dataDir = path.join(process.cwd(), 'files_data');

    const commitBatchIfNeeded = async () => {
        if (operationCount >= 499) {
            await batch.commit();
            batch = writeBatch(database);
            operationCount = 0;
        }
    };

    for (const fileName of files) {
        const brandName = fileName.replace('.txt', '').trim();
        if (!brandName) continue;

        const brandId = createId(brandName);
        const brandDocRef = doc(database, 'brands', brandId);
        const brandSnap = await getDoc(brandDocRef);

        if (!brandSnap.exists()) {
            batch.set(brandDocRef, { name: brandName, isPopular: false });
            counters.brandsAdded++;
            operationCount++;
            await commitBatchIfNeeded();
        }

        const filePath = path.join(dataDir, fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');

        if (lines.length <= 1) continue;

        const records = lines.slice(1).map(line => line.split(','));

        for (const record of records) {
            if (record.length < 4) continue;

            const [model, originalFirmwareFileName, size, downloadUrl] = record;
            if (!model || !model.trim() || !originalFirmwareFileName || !originalFirmwareFileName.trim()) continue;

            const seriesName = model.trim();
            const seriesId = createId(`${brandId}-${seriesName}`);
            const seriesDocRef = doc(database, 'series', seriesId);
            const seriesSnap = await getDoc(seriesDocRef);

            if (!seriesSnap.exists()) {
                batch.set(seriesDocRef, { name: seriesName, brandId });
                counters.seriesAdded++;
                operationCount++;
                await commitBatchIfNeeded();
            }

            const firmwareId = createId(originalFirmwareFileName.trim());
            
            if (!existingFirmwareIds.has(firmwareId)) {
                const firmwareDocRef = doc(database, 'firmware', firmwareId);
                batch.set(firmwareDocRef, {
                    brandId,
                    seriesId,
                    fileName: originalFirmwareFileName.trim(),
                    version: "N/A",
                    androidVersion: "N/A",
                    size: size.trim(),
                    downloadUrl: downloadUrl.trim(),
                    uploadDate: new Date(),
                    downloadCount: Math.floor(Math.random() * 5000),
                });
                counters.firmwareAdded++;
                operationCount++;
                existingFirmwareIds.add(firmwareId); // Avoid duplicates across batches
                await commitBatchIfNeeded();
            }
        }
    }

    if (operationCount > 0) {
        await batch.commit();
    }
}


export async function seedFromLegacyFiles() {
    const dataDir = path.join(process.cwd(), 'files_data');
    const fileNames = (await fs.readdir(dataDir)).filter(f => f.endsWith('.txt'));

    // Fetch all existing firmware IDs from all dbs to avoid duplicates
    const allDbs = [db, db_1, db_2];
    const existingFirmwareIds = new Set<string>();
    for (const database of allDbs) {
        const firmwareCol = collection(database, 'firmware');
        const existingFirmwareSnapshot = await getDocs(firmwareCol);
        existingFirmwareSnapshot.docs.forEach(d => existingFirmwareIds.add(d.id));
    }

    const totalFiles = fileNames.length;
    const chunkSize = Math.ceil(totalFiles / 3);
    const fileChunks = [
        fileNames.slice(0, chunkSize),
        fileNames.slice(chunkSize, 2 * chunkSize),
        fileNames.slice(2 * chunkSize)
    ];

    const counters = { brandsAdded: 0, seriesAdded: 0, firmwareAdded: 0 };
    
    await Promise.all([
        seedDataToDatabase(db, fileChunks[0], existingFirmwareIds, counters),
        seedDataToDatabase(db_1, fileChunks[1], existingFirmwareIds, counters),
        seedDataToDatabase(db_2, fileChunks[2], existingFirmwareIds, counters)
    ]);

    return counters;
}
