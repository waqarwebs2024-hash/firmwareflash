
'use server';

import { setAnnouncement, updateAdSettings, addBrand, addSeries, updateApiKey, saveDonation, saveContactMessage, saveSubmission, getPendingSubmissions, approveSubmission, rejectSubmission } from './data';
import { seedHuaweiFirmware } from './seed';
import type { AdSettings, ScrapedFirmware } from './types';
import { scrapeFirmwareFlow } from '@/ai/flows/scrape-firmware-flow';
import { revalidatePath } from 'next/cache';


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

export async function saveDonationAction(data: { name: string; email?: string; amount: number; message?: string; }) {
  await saveDonation(data);
}

export async function saveContactMessageAction(data: { name: string; email: string; message: string; }) {
  await saveContactMessage(data);
}

export async function scrapeUrlAction(url: string) {
    try {
        const scrapedData = await scrapeFirmwareFlow({ url });
        if (scrapedData) {
            await saveSubmission(scrapedData);
            revalidatePath('/admin/scraper');
            return { success: true, data: scrapedData };
        }
        return { success: false, error: 'No data scraped.' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function approveSubmissionAction(submissionId: string, brandId: string, seriesId: string) {
    try {
        await approveSubmission(submissionId, brandId, seriesId);
        revalidatePath('/admin/scraper');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function rejectSubmissionAction(submissionId: string) {
    try {
        await rejectSubmission(submissionId);
        revalidatePath('/admin/scraper');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
