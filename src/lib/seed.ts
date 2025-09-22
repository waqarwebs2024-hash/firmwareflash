

import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { Brand } from './types';
import slugify from 'slugify';

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

const huaweiFirmwareData = [
    { name: 'Huawei P40 Pro Plus', fileName: 'Huawei_P40_Pro_Plus_ELP-N39_9.0.0.168_C185E7R3P1_Firmware_Magic_OS_9.0_0501AEGW_Dload.zip', size: '7.4 GB', link: 'https://drive.google.com/file/d/1j6JwFkss7uxJzuGFFEQkgfXYs_fpUO5s/view?usp=sharing' },
    { name: 'Huawei Nova 2 Lite', fileName: 'Huawei_Nova_2_Lite_LDN-L22_8.0.0.159_C636CUSTC636D1_Firmware_8.0.0_r1_EMUI8.0_05015ADM_Dload.zip', size: '2.64 GB', link: 'https://drive.google.com/file/d/152YxDaoU-ZL2GbdvU5Qs-aydE4vxzwwM/view?usp=sharing' },
    { name: 'Huawei Watch 3', fileName: 'Huawei_Watch_3_Alex-AL10-BD_1.0.15.99_Board_Software_NA_NA_05022RGV_HMT.zip', size: '782 MB', link: 'https://drive.google.com/file/d/1ttdNAXcCPz8c2nETfrQS55UFK07bxT-r/view?usp=sharing' },
    { name: 'Huawei Y6 2018', fileName: 'Huawei_Y6_2018_Atomu-L21_8.0.0.155_C432CUSTC432D1_8.0.0_R1_EMUI8.0_05015CHD_Dload.zip', size: '2.21 GB', link: 'https://drive.google.com/file/d/1vBvoD2ZriIsrPNrG9vNv7Ixvaz4pmjAs/view?usp=sharing' },
    { name: 'Huawei Y7 Prime 2018', fileName: 'Huawei_Y7_Prime_2018_London-L22_8.0.0.159_C636CUSTC636D1_Firmware_8.0.0_r1_EMUI8.0_05015ADM_Dload.zip', size: '2.64 GB', link: 'https://drive.google.com/file/d/1sUPr8ZqRPyiBeeL3A5dE0yi6CRW3GgD-/view?usp=sharing' },
    { name: 'Huawei P50E', fileName: 'Huawei_P50E_ABR-AL60_102.0.1.125_C00E120R2P3_Firmware_General_HarmonyOS_2.0.1_05018DHQ_Dload.zip', size: '5.72 GB', link: 'https://drive.google.com/file/d/1MOqw0qEmbzVf0DWAuzgz4JttD4AYMBnz/view?usp=sharing' },
    { name: 'Huawei Y7 2018', fileName: 'Huawei_Y7_2018_LDN-L01_8.0.0.162_C185_Firmware_8.0.0_r1_EMUI8.0_05015DSM_Dload.zip', size: '3.03 GB', link: 'https://drive.google.com/file/d/1A4_musaFL75VF6P8KaDGoxXRLr3HAj_M/view?usp=drive_link' },
    { name: 'Huawei P30 Lite', fileName: 'Huawei_P30_Lite_Marie-BD_1.0.0.59_Board_Software_General_9.1.0_r1_EMUI9.1.0_05022PYS_HMT.zip', size: '1.46 GB', link: 'https://drive.google.com/file/d/1g1XPeAXP3RrBHPc-Kbo3nB1oeoYUShfl/view?usp=sharing' },
    { name: 'Huawei Y5 Prime 2018', fileName: 'Huawei_Y5_Prime_2018_DRA-LX2-BD_MT6739_1.0.0.31_Board_Software_20180921_8.1.zip', size: '887 MB', link: 'https://drive.google.com/file/d/1EPL3BOC6FNPBJnk9HMMunKTH2EGBmHyh/view?usp=sharing' },
    { name: 'Huawei MediaPad M5 8.4', fileName: 'Huawei_MediaPad_M5_8.4_SHT-W09_9.1.0.332_C432E3R1P2T8_Firmware_EMUI9.1.0 05014XYE_Dload.zip', size: '3.68 GB', link: 'https://drive.google.com/file/d/1zcO7u_NXqe4O75vN9CJbFgrykJOQnOYb/view?usp=sharing' },
    { name: 'Huawei Y5 Lite 2018', fileName: 'Huawei_Y5_Lite_2018_Dura-L42HN_MT6739_1.0.0.175_C10_05016DLP.zip', size: '1.76 GB', link: 'https://drive.google.com/file/d/1Nq50tE9xGqfytSqlF695E4zvJ0ewk5_p/view?usp=sharing' },
    { name: 'Huawei Y9A', fileName: 'Huawei_Y9A_FRL-L23_MT6768_010921.zip', size: '3.11 GB', link: 'https://drive.google.com/file/d/1p9EQ00s_l6FfG15MGb6yS9Xx4DBJ4FSK/view?usp=sharing' },
    { name: 'Huawei Y3 2017', fileName: 'Huawei_Y3_2017_CRO-L22_MT6737M_C10B120_Firmware_Belarus_Armenia_Kyrgyzstan_Kazakhstan_Georgia_Russian_Federation_Nonspecific_Android_6.0_EMUI_4.1_Mini_05014NML.zip', size: '1 GB', link: 'https://drive.google.com/file/d/1tMJTE56Jde99tEAhQPFsicGH3dH-uuEE/view?usp=sharing' },
    { name: 'Huawei Y5 II', fileName: 'Huawei_Y5_II_CUN-L21_C479B107_Armenia_Russian_Federation_Azerbaijan_Kazakhstan_Kyrgyzstan_Firmware_5.1_EMUI_3.1_OTA.zip', size: '1.61 GB', link: 'https://drive.google.com/file/d/1WzyJXuoqU4yfivq2ioKZ88eHNR8lRfZa/view?usp=sharing' },
    { name: 'Huawei Y7 2018', fileName: 'Huawei_Y7_2018_LDN-LX3_8.0.0.182_C605CUSTC605D1_110820_Dload.zip', size: '2.13 GB', link: 'https://drive.google.com/file/d/1zVv2NboaL06Qe16-EytANpyknaDsxhwY/view?usp=sharing' },
    { name: 'Huawei P30 Lite', fileName: 'Huawei_P30_Lite_MAR-L21M_10.0.0.332_C10E4R3P3_171120_Dload.zip', size: '3.84 GB', link: 'https://drive.google.com/file/d/1vzL2iWD6mxWt-7IGltr6wDx3rXiEFYeV/view?usp=sharing' },
    { name: 'Huawei Y3 2017', fileName: 'Huawei_Y3_2017_Cairo-L22_MT6737M_C10B120_Firmware_Belarus_Armenia_Kyrgyzstan_Kazakhstan_Georgia_Russian_Federation_Nonspecific_Android_6.0_EMUI_4.1_Mini_05014NML.zip', size: '1 GB', link: 'https://drive.google.com/file/d/1vRPwntvf9w9LYAe9KfJtp-uT5GbS0Q66/view?usp=sharing' },
    { name: 'Huawei Y5 Prime 2018', fileName: 'Huawei_Y5_Prime_2018_Dura-L21_MT6739_1.0.0.155_C432_Firmware_8.1.0.zip', size: '4.53 GB', link: 'https://drive.google.com/file/d/15U1M_obP8aRNZnFNqAVA6QsWa-5L__4m/view?usp=sharing' },
    { name: 'Huawei Y5 II', fileName: 'Huawei_Y5_II_CUN-U29_C479B126_Firmware_Belarus_Uzbekistan_Mongolia_Ukraine_Russian_Federation_Android_5.1_EMUI_3.1_05021YUV_OTA.zip', size: '1.96 GB', link: 'https://drive.google.com/file/d/1r3RfvP-rphR9Ao3ZlwA3pUHgR0htj7Ne/view?usp=sharing' },
    { name: 'Huawei Y6 2018', fileName: 'Huawei_Y6_2018_ATU-L31-BD_1.0.0.53_Board_Software_General_8.0.0_R1_05022JHT_HMT.zip', size: '1.90 GB', link: 'https://drive.google.com/file/d/1S7H4eMNQ0DfCoB91H2HtyoIBd957-0Do/view?usp=sharing' },
    { name: 'Huawei Y6 2018', fileName: 'Huawei_Y6_2018_ATU-LX3-BD_1.0.0.53_Board_Software_General_8.0.0_R1_05022JHT_HMT.zip', size: '1.90 GB', link: 'https://drive.google.com/file/d/1p_o54eo0axKf-bUTG3fEkBbq-QFaQ5EZ/view?usp=sharing' },
    { name: 'Huawei Y6 2018', fileName: 'Huawei_Y6_2018_Atomu-L31B_8.0.0.148_C432CUSTC432D1_8.0.0_R1_EMUI8.0_05015EEA_Dload.zip', size: '2.22 GB', link: 'https://drive.google.com/file/d/1ueXufD56HaB-hr8EPQ3MmkC5YW-0pnrT/view?usp=sharing' },
    { name: 'Huawei Y6 2018', fileName: 'Huawei_Y6_2018_ATU-L31_8.0.0.148_C432CUSTC432D1_8.0.0_R1_EMUI8.0_05015EEA_Dload.zip', size: '2.22 GB', link: 'https://drive.google.com/file/d/1VlEPD46kwKoUO0ivmoAy1H4HiuXmYyIT/view?usp=sharing' },
    { name: 'Huawei Y6S 2019', fileName: 'Huawei_Y6S_2019_Jakarta-L21AHW_9.1.0.251_C10E2R1P1_9.0.0_R3_EMUI9.1.0_05016HRS_Dload.zip', size: '2.64 GB', link: 'https://drive.google.com/file/d/1tqCKtzNhLo1mass29m17kU6L-D03EY3r/view?usp=sharing' },
    { name: 'Huawei Y6S 2019', fileName: 'Huawei_Y6S_2019_Jakarta-L21CHW_9.1.0.342_C10E2R2P1_EMUI9.1.0_05016HRS_Dload.zip', size: '2.38 GB', link: 'https://drive.google.com/file/d/1TfjzzRNEuCFp_8yWMFIwpZexFDOMB1r8/view?usp=sharing' },
    { name: 'Huawei Y6S 2019', fileName: 'Huawei_Y6S_2019_JAT-LX1_9.1.0.251_C10E2R1P1_9.0.0_R3_EMUI9.1.0_05016HRS_Dload.zip', size: '2.28 GB', link: 'https://drive.google.com/file/d/1ZAyHRvFkVzQW4PyC412_rgtr6DatepyT/view?usp=sharing' },
    { name: 'Huawei Y9 Prime 2019', fileName: 'Huawei_Y9_Prime_2019_Stark-L21M_EBX7_10.0.0.323_C185E6R6P1_EMUI10.0.0_05016LQE_Dload.zip', size: '3.35 GB', link: 'https://drive.google.com/file/d/1qe1_CWNkjL_-MvW0MfULAGGkXnSqbwG4/view?usp=sharing' },
    { name: 'Huawei Y9 Prime 2019', fileName: 'Huawei_Y9_Prime_2019_STK-L21M_10.0.0.323_C185E6R6P1_EMUI10.0.0_05016LQE_Dload.zip', size: '3.35 GB', link: 'https://drive.google.com/file/d/1LziyNiPasG9BKn85VBvBPsjszSme4xbT/view?usp=sharing' },
    { name: 'Huawei Nova 12i', fileName: 'Huawei_Nova_12i_CTR-L81_HW_RU_104.2.0.141_C10E2R1P1_Dload.zip', size: '4.61 GB', link: 'https://drive.google.com/file/d/1IuWfN6otiLpRhqwOhsds9Y48beY9-b-Z/view?usp=sharing' },
    { name: 'Huawei Nova 13i', fileName: 'Huawei_Nova_13i_CTR-L91_HW_RU_104.2.0.103_C10E2R2P1_Dload.zip', size: '4.5 GB', link: 'https://drive.google.com/file/d/18g6XN2Kk3C-u-WvON0ndKf4pbeimPw0Q/view?usp=sharing' },
    { name: 'Huawei Nova 13', fileName: 'Huawei_Nova_13_BLK-LX9_HW_RU_104.2.0.138_C10E3R3P1_Dload.zip', size: '5.54 GB', link: 'https://drive.google.com/file/d/1_ku1Ozk9NPM2RPjhvYaG0eiUaPmnW0pg/view?usp=sharing' },
    { name: 'Huawei Nova 13', fileName: 'Huawei_Nova_13_BLK-L29_HW_RU_104.2.0.138_C10E3R3P1_Dload.zip', size: '5.54 GB', link: 'https://drive.google.com/file/d/1FiATF1gyE2VoSp79Wx-9MzV0_d1QdeRf/view?usp=sharing' },
    { name: 'Huawei Nova 4', fileName: 'Huawei_Nova_4_VCE-TL00_102.0.0.215_C01E205R2P7_HarmonyOS_2.0.0_05015LWW_Dload.zip', size: '5.43 GB', link: 'https://drive.google.com/file/d/1itebskd_znyPnFdq3JM04s64dge5pGPO/view?usp=sharing' },
    { name: 'Huawei Enjoy 7 Plus', fileName: 'Huawei_Enjoy_7_Plus_Toronto-AL00IN_C675B176CUSTC675D001_7.0.0_r1_EMUI5.1.3_05014NYX_Dload.zip', size: '2.18 GB', link: 'https://drive.google.com/file/d/1X8_pAIolCIelCddRmeAcFK5Q7gQ9chO-/view?usp=sharing' },
    { name: 'Huawei Enjoy 20', fileName: 'Huawei_Enjoy_20_WKG-AN00_102.0.0.190_C00E185R7P3_HarmonyOS_2.0.0_05016XKB_Dload.zip', size: '4.1 GB', link: 'https://drive.google.com/file/d/1Crvq5Jd_02vpOiNfP0K09Qtfq6F1NRM6/view?usp=sharing' },
    { name: 'Huawei Nova 6 5G', fileName: 'Huawei_Nova_6_5G_WLZ-AN00_102.0.0.165_C00E160R5P6_HarmonyOS_2.0.0_05016JEX_Dload.zip', size: '5.51 GB', link: 'https://drive.google.com/file/d/1qcjlsNAl7Ccl1DXbEQSL62GRFvzzJFL5/view?usp=sharing' },
    { name: 'Huawei P8 Lite', fileName: 'Huawei_P8_Lite_ALE-TL00_MAA001073_Board_Software_General_5.0_EMUI_3.1_05021SJQ_HMT.zip', size: '610 MB', link: 'https://drive.google.com/file/d/1AB8WhUp-xxYuNrKoDHj1MHMfM3lSLolJ/view?usp=sharing' },
];

async function getOrCreateSeries(seriesName: string, brandId: string): Promise<string> {
    const seriesId = createId(`${brandId}-${seriesName}`);
    const seriesDocRef = doc(db, 'series', seriesId);

    const seriesDoc = await getDoc(seriesDocRef);
    if (!seriesDoc.exists()) {
        await setDoc(seriesDocRef, { name: seriesName, brandId: brandId });
    }
    return seriesId;
}

export async function seedHuaweiFirmware() {
    const brandId = 'huawei'; // The ID for Huawei
    
    // Check if seeding has already been done
    const settingsDocRef = doc(db, 'settings', 'seeding');
    const settingsDoc = await getDoc(settingsDocRef);
    if (settingsDoc.exists() && settingsDoc.data().huaweiSeeded) {
        throw new Error('Huawei firmware has already been seeded. This action cannot be run again.');
    }

    const brandDocRef = doc(db, 'brands', brandId);
    const brandDoc = await getDoc(brandDocRef);
    if (!brandDoc.exists()) {
        await setDoc(brandDocRef, { name: 'Huawei' });
    }

    const batch = writeBatch(db);
    const firmwareCol = collection(db, 'firmware');

    for (const fw of huaweiFirmwareData) {
        const modelName = fw.name.replace(/^Huawei\s+/i, '').trim();
        const seriesId = await getOrCreateSeries(modelName, brandId);

        // Extract version and androidVersion from filename
        let version = "N/A";
        let androidVersion = "N/A";

        const versionMatch = fw.fileName.match(/_(\d+\.\d+\.\d+\.\d+)_/);
        if (versionMatch) {
            version = versionMatch[1];
        } else {
             const versionMatch2 = fw.fileName.match(/_(\d+\.\d+\.\d+)_/);
             if (versionMatch2) {
                version = versionMatch2[1];
             } else {
                const versionMatch3 = fw.fileName.match(/_(\d+\.\d+\.\d+)_/);
                if (versionMatch3) version = versionMatch3[1]
             }
        }

        const androidMatch = fw.fileName.match(/Android_(\d+\.\d+)/);
        if (androidMatch) {
            androidVersion = androidMatch[1];
        } else {
            const emuiMatch = fw.fileName.match(/EMUI(\d+\.\d+(\.\d+)?)/);
            if (emuiMatch) {
                androidVersion = `EMUI ${emuiMatch[1]}`;
            } else {
                 const harmonyOsMatch = fw.fileName.match(/HarmonyOS_(\d+\.\d+\.\d+)/);
                 if (harmonyOsMatch) {
                     androidVersion = `HarmonyOS ${harmonyOsMatch[1]}`;
                 } else {
                    const magicOsMatch = fw.fileName.match(/Magic_OS_(\d+\.\d+)/);
                    if (magicOsMatch) {
                        androidVersion = `Magic OS ${magicOsMatch[1]}`;
                    }
                 }
            }
        }
        
        const firmwareId = createId(fw.fileName);
        const firmwareDocRef = doc(firmwareCol, firmwareId);
        batch.set(firmwareDocRef, {
            seriesId: seriesId,
            brandId: brandId,
            fileName: fw.fileName,
            version: version,
            androidVersion: androidVersion,
            size: fw.size,
            downloadUrl: fw.link,
            uploadDate: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 90), // Random date in last 90 days
            downloadCount: Math.floor(Math.random() * 25000), // Random download count
        });
    }

    try {
        await batch.commit();
        // Mark seeding as done
        await setDoc(settingsDocRef, { huaweiSeeded: true }, { merge: true });
        console.log('Huawei firmware and series successfully seeded to Firestore.');
    } catch (error) {
        console.error('Error seeding Huawei firmware:', error);
        throw error;
    }
}
