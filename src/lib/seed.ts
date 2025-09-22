

import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { Brand } from './types';
import slugify from 'slugify';
import fs from 'fs/promises';
import path from 'path';

const createId = (name: string) => slugify(name, { lower: true, strict: true });

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


async function getOrCreate(collectionName: string, id: string, data: object) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        await setDoc(docRef, data);
        return true; // Document was created
    }
    return false; // Document already existed
}

export async function seedFromLegacyFiles() {
    const dataDir = path.join(process.cwd(), 'files_data');
    const fileNames = await fs.readdir(dataDir);
    const txtFiles = fileNames.filter(f => f.endsWith('.txt'));

    let brandsAdded = 0;
    let seriesAdded = 0;
    let firmwareAdded = 0;
    
    const firmwareCol = collection(db, 'firmware');
    const existingFirmwareSnapshot = await getDocs(firmwareCol);
    const existingFirmwareIds = new Set(existingFirmwareSnapshot.docs.map(d => d.id));

    for (const fileName of txtFiles) {
        const brandName = fileName.replace('.txt', '');
        const brandId = createId(brandName);

        if (await getOrCreate('brands', brandId, { name: brandName })) {
            brandsAdded++;
        }

        const filePath = path.join(dataDir, fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');

        if (lines.length <= 1) continue; // Skip header or empty files

        const records = lines.slice(1).map(line => line.split(','));

        for (const record of records) {
            if (record.length < 4) continue; // Ensure record has all columns

            const [model, firmwareFileName, size, downloadUrl] = record;
            if (!model || !firmwareFileName) continue;
            
            const seriesName = model.trim();
            const seriesId = createId(`${brandId}-${seriesName}`);

            if (await getOrCreate('series', seriesId, { name: seriesName, brandId })) {
                seriesAdded++;
            }
            
            const firmwareId = createId(firmwareFileName.trim());

            if (!existingFirmwareIds.has(firmwareId)) {
                const firmwareDocRef = doc(firmwareCol, firmwareId);
                await setDoc(firmwareDocRef, {
                    brandId,
                    seriesId,
                    fileName: firmwareFileName.trim(),
                    version: "N/A",
                    androidVersion: "N/A",
                    size: size.trim(),
                    downloadUrl: downloadUrl.trim(),
                    uploadDate: new Date(),
                    downloadCount: Math.floor(Math.random() * 5000),
                });
                firmwareAdded++;
            }
        }
    }
    return { brandsAdded, seriesAdded, firmwareAdded };
}
