import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { Brand } from './types';
import slugify from 'slugify';

const createId = (name: string) => slugify(name, { lower: true, strict: true });

const brands: Omit<Brand, 'id'>[] = [
    { name: 'Samsung', logoUrl: 'https://picsum.photos/seed/samsung/200/200' },
    { name: 'Apple', logoUrl: 'https://picsum.photos/seed/apple/200/200' },
    { name: 'Xiaomi', logoUrl: 'https://picsum.photos/seed/xiaomi/200/200' },
    { name: 'Huawei', logoUrl: 'https://picsum.photos/seed/huawei/200/200' },
    { name: 'Oppo', logoUrl: 'https://picsum.photos/seed/oppo/200/200' },
    { name: 'Vivo', logoUrl: 'https://picsum.photos/seed/vivo/200/200' },
    { name: 'Realme', logoUrl: 'https://picsum.photos/seed/realme/200/200' },
    { name: 'OnePlus', logoUrl: 'https://picsum.photos/seed/oneplus/200/200' },
    { name: 'Google Pixel', logoUrl: 'https://picsum.photos/seed/google-pixel/200/200' },
    { name: 'Motorola', logoUrl: 'https://picsum.photos/seed/motorola/200/200' },
    { name: 'Sony Xperia', logoUrl: 'https://picsum.photos/seed/sony-xperia/200/200' },
    { name: 'Asus', logoUrl: 'https://picsum.photos/seed/asus/200/200' },
    { name: 'Nokia', logoUrl: 'https://picsum.photos/seed/nokia/200/200' },
    { name: 'Lenovo', logoUrl: 'https://picsum.photos/seed/lenovo/200/200' },
    { name: 'Redmi', logoUrl: 'https://picsum.photos/seed/redmi/200/200' },
    { name: 'Poco', logoUrl: 'https://picsum.photos/seed/poco/200/200' },
    { name: 'iQOO', logoUrl: 'https://picsum.photos/seed/iqoo/200/200' },
    { name: 'Honor', logoUrl: 'https://picsum.photos/seed/honor/200/200' },
    { name: 'ZTE', logoUrl: 'https://picsum.photos/seed/zte/200/200' },
    { name: 'Meizu', logoUrl: 'https://picsum.photos/seed/meizu/200/200' },
    { name: 'Sharp', logoUrl: 'https://picsum.photos/seed/sharp/200/200' },
    { name: 'Panasonic', logoUrl: 'https://picsum.photos/seed/panasonic/200/200' },
    { name: 'TCL', logoUrl: 'https://picsum.photos/seed/tcl/200/200' },
    { name: 'Alcatel', logoUrl: 'https://picsum.photos/seed/alcatel/200/200' },
    { name: 'Coolpad', logoUrl: 'https://picsum.photos/seed/coolpad/200/200' },
    { name: 'Black Shark', logoUrl: 'https://picsum.photos/seed/black-shark/200/200' },
    { name: 'Infinix', logoUrl: 'https://picsum.photos/seed/infinix/200/200' },
    { name: 'Tecno', logoUrl: 'https://picsum.photos/seed/tecno/200/200' },
    { name: 'Itel', logoUrl: 'https://picsum.photos/seed/itel/200/200' },
    { name: 'Lava', logoUrl: 'https://picsum.photos/seed/lava/200/200' },
    { name: 'Micromax', logoUrl: 'https://picsum.photos/seed/micromax/200/200' },
    { name: 'QMobile', logoUrl: 'https://picsum.photos/seed/qmobile/200/200' },
    { name: 'Jio', logoUrl: 'https://picsum.photos/seed/jio/200/200' },
    { name: 'Karbonn', logoUrl: 'https://picsum.photos/seed/karbonn/200/200' },
    { name: 'Spice', logoUrl: 'https://picsum.photos/seed/spice/200/200' },
    { name: 'Symphony', logoUrl: 'https://picsum.photos/seed/symphony/200/200' },
    { name: 'Walton', logoUrl: 'https://picsum.photos/seed/walton/200/200' },
    { name: 'Gionee', logoUrl: 'https://picsum.photos/seed/gionee/200/200' },
    { name: 'BLU', logoUrl: 'https://picsum.photos/seed/blu/200/200' },
    { name: 'BQ', logoUrl: 'https://picsum.photos/seed/bq/200/200' },
    { name: 'Archos', logoUrl: 'https://picsum.photos/seed/archos/200/200' },
    { name: 'Celkon', logoUrl: 'https://picsum.photos/seed/celkon/200/200' },
    { name: 'Philips', logoUrl: 'https://picsum.photos/seed/philips/200/200' },
    { name: 'HTC', logoUrl: 'https://picsum.photos/seed/htc/200/200' },
];

export async function seedBrands() {
  const brandsCol = collection(db, 'brands');
  const snapshot = await getDocs(brandsCol);
  if (snapshot.empty) {
    const batch = writeBatch(db);
    brands.forEach((brand) => {
      const id = createId(brand.name);
      const docRef = doc(brandsCol, id);
      batch.set(docRef, brand);
    });
    await batch.commit();
    console.log('Brands seeded.');
  }
}

const seriesData: { [key: string]: string[] } = {
    samsung: ['Galaxy S', 'Galaxy Note', 'Galaxy A', 'Galaxy M', 'Galaxy Z'],
    huawei: ['P Series', 'Mate Series', 'Nova Series', 'Y Series'],
    oppo: ['Find Series', 'Reno Series', 'A Series'],
    vivo: ['X Series', 'V Series', 'Y Series'],
    lenovo: ['ThinkPad', 'IdeaPad', 'Legion', 'Yoga'],
    xiaomi: ['Mi Series', 'Redmi Series', 'Poco Series'],
    apple: ['iPhone', 'iPad', 'MacBook'],
    realme: ['C Series', 'Narzo Series', 'GT Series'],
};


export async function seedFirmwareForBrand(brandId: string) {
    const brandName = brandId.toLowerCase();
    const seriesList = seriesData[brandName];

    if (!seriesList) {
        console.log(`No series data for brand: ${brandId}`);
        return;
    }

    const seriesCol = collection(db, 'series');
    const firmwareCol = collection(db, 'firmware');

    // Check if series for this brand already exist
    const q = query(seriesCol, where('brandId', '==', brandId));
    const seriesSnapshot = await getDocs(q);

    if (seriesSnapshot.empty) {
        console.log(`Seeding data for ${brandId}...`);
        const batch = writeBatch(db);

        seriesList.forEach((seriesName) => {
            const seriesId = createId(`${brandId}-${seriesName}`);
            const seriesDocRef = doc(seriesCol, seriesId);
            batch.set(seriesDocRef, { name: seriesName, brandId: brandId });

            // Add some dummy firmware for each series
            for (let i = 1; i <= 3; i++) {
                const fileName = `${seriesName} Model ${i} Firmware v1.${i}.zip`;
                const firmwareId = createId(fileName);
                const firmwareDocRef = doc(firmwareCol, firmwareId);
                batch.set(firmwareDocRef, {
                    seriesId: seriesId,
                    fileName: fileName,
                    version: `1.${i}`,
                    androidVersion: `12`,
                    size: `${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 9)} GB`,
                    downloadUrl: `https://example.com/downloads/${firmwareId}`,
                    uploadDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30),
                    downloadCount: Math.floor(Math.random() * 10000),
                });
            }
        });

        await batch.commit();
        console.log(`Seeding complete for ${brandId}.`);
    }

}
