import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { Brand } from './types';
import slugify from 'slugify';

const createId = (name: string) => slugify(name, { lower: true, strict: true });

const brands: Omit<Brand, 'id'>[] = [
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
    await batch.commit();
    console.log('New brands seeded.');
  }
}

const seriesData: { [key: string]: string[] } = {
    samsung: ['Galaxy S', 'Galaxy Note', 'Galaxy A', 'Galaxy M', 'Galaxy Z', 'Galaxy Tab', 'Galaxy J', 'Galaxy C'],
    apple: ['iPhone', 'iPad', 'MacBook', 'iMac', 'Apple Watch'],
    xiaomi: ['Mi Series', 'Mi Note', 'Mi Max', 'Mi Mix', 'Black Shark'],
    redmi: ['Redmi Note', 'Redmi K', 'Redmi Y', 'Redmi Go'],
    poco: ['Poco F', 'Poco X', 'Poco M', 'Poco C'],
    oppo: ['Find Series', 'Reno Series', 'A Series', 'K Series', 'F Series'],
    vivo: ['X Series', 'V Series', 'Y Series', 'S Series', 'Z Series', 'Nex Series'],
    iqoo: ['iQOO Neo', 'iQOO Z', 'iQOO U'],
    realme: ['C Series', 'Narzo Series', 'GT Series', 'X Series'],
    oneplus: ['OnePlus Series', 'Nord Series'],
    huawei: ['P Series', 'Mate Series', 'Nova Series', 'Y Series', 'Enjoy Series', 'Honor Series'],
    honor: ['Magic Series', 'Honor N Series', 'X Series', 'Play Series', 'V Series'],
    'google-pixel': ['Pixel', 'Pixel XL', 'Pixel A-Series'],
    motorola: ['Moto G', 'Moto E', 'Moto X', 'Edge', 'Razr'],
    lenovo: ['K Note Series', 'ZUK Series', 'Vibe Series', 'Tab Series'],
    'sony-xperia': ['Xperia 1', 'Xperia 5', 'Xperia 10', 'Xperia Pro', 'Xperia L'],
    asus: ['ROG Phone', 'Zenfone'],
    zte: ['Axon', 'Blade', 'Nubia Red Magic'],
    meizu: ['Pro Series', 'MX Series', 'M-Series Note'],
    sharp: ['Aquos'],
    panasonic: ['Eluga', 'P-Series'],
    alcatel: ['1 Series', '3 Series', '5 Series'],
    tcl: ['10 Series', '20 Series'],
    coolpad: ['Cool Series', 'Note Series'],
    'black-shark': ['Black Shark Series'],
    infinix: ['Hot Series', 'Note Series', 'Smart Series', 'Zero Series'],
    tecno: ['Camon', 'Spark', 'Pova', 'Phantom'],
    itel: ['A Series', 'Vision Series', 'S Series'],
    lava: ['Z Series', 'Agni'],
    micromax: ['IN Note', 'IN Series'],
    qmobile: ['Noir'],
    jio: ['JioPhone'],
    karbonn: ['Titanium'],
    spice: ['Stellar', 'Dream UNO'],
    symphony: ['Z Series', 'i Series'],
    walton: ['Primo'],
    gionee: ['M Series', 'A1 Series'],
    blu: ['Vivo Series', 'G Series'],
    bq: ['Aquaris'],
    archos: ['Oxygen', 'Core'],
    celkon: ['Star', 'Millennium'],
    philips: ['Xenium', 'S-Series'],
    htc: ['U Series', 'Desire Series', 'Wildfire'],
    nokia: ['G-Series', 'C-Series', 'X-Series', 'Lumia'],
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
