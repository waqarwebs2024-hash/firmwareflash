
'use server';

import { setAnnouncement, updateAdSettings, addBrand, addSeries, updateApiKey, saveDonation, saveContactMessage, searchFirmware, setHeaderScripts } from './data';
import { seedHuaweiFirmware } from './seed';
import type { AdSettings, Firmware } from './types';
import { login, logout } from './auth';

export async function loginAction(formData: FormData) {
    await login(formData);
}

export async function logoutAction() {
    await logout();
}

export async function updateAnnouncementAction(text: string) {
    await setAnnouncement(text);
}

export async function updateAdSettingsAction(settings: AdSettings) {
    await updateAdSettings(settings);
}

export async function addBrandAction(name: string) {
    if (!name) {
      throw new Error('Brand name is required.');
    }
    await addBrand(name);
}

export async function addSeriesAction(name: string, brandId: string) {
    if (!name) {
        throw new Error('Series name is required.');
    }
    if (!brandId) {
        throw new Error('Brand ID is required.');
    }
    await addSeries(name, brandId);
}

export async function seedHuaweiDataAction() {
  try {
    await seedHuaweiFirmware();
    return { success: true, message: 'Huawei firmware has been successfully seeded!' };
  } catch (error: any) {
    return { success: false, message: error.message || 'An unknown error occurred.' };
  }
}

export async function updateApiKeyAction(apiKey: string) {
  if (!apiKey) {
    throw new Error('API Key is required.');
  }
  await updateApiKey(apiKey);
}

export async function updateHeaderScriptsAction(scripts: string) {
    await setHeaderScripts(scripts);
}

export async function saveDonationAction(data: { name: string; email?: string; amount: number; message?: string; }) {
  await saveDonation(data);
}

export async function saveContactMessageAction(data: { name: string; email: string; message: string; }) {
  await saveContactMessage(data);
}

export async function liveSearchAction(query: string): Promise<Firmware[]> {
    if (!query || query.length < 3) return [];
    const results = await searchFirmware(query, 5); // Limit to 5 results for live search
    
    // Convert Timestamps to plain objects
    return results.map(fw => ({
      ...fw,
      uploadDate: JSON.parse(JSON.stringify(fw.uploadDate)),
    }));
}
