
'use server';

import { updateAdSettings, addBrand, addSeries, updateApiKey, saveDonation, saveContactMessage, searchFirmware, setHeaderScripts, saveBlogPost, toggleBrandPopularity, addOrUpdateTool, deleteToolById, getAllTools as getAllToolsFromDB, incrementDownloadCount, logVisitor } from './data';
import { seedFromLegacyFiles } from './seed';
import type { AdSettings, Firmware, BlogPost, BlogPostOutput, Tool } from './types';
import { login, logout } from './auth';
import { generateBlogPost } from '@/ai/flows/blog-post-flow';
import { generateTrendingTopics } from '@/ai/flows/trending-topics-flow';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    await login(formData);
}

export async function logoutAction() {
    await logout();
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

export async function seedLegacyDataAction() {
  try {
    const result = await seedFromLegacyFiles();
    return { success: true, message: `Seeding complete! ${result.brandsAdded} brands, ${result.seriesAdded} series, and ${result.firmwareAdded} firmware files were added.` };
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

export async function saveBlogPostAction(post: BlogPostOutput): Promise<string> {
    return await saveBlogPost(post);
}

export async function autoGenerateBlogPostsAction(topics: string): Promise<{success: boolean, message: string}> {
    const topicList = topics.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    if (topicList.length === 0) {
        return { success: false, message: 'No topics provided.' };
    }

    let successfulPosts = 0;
    let failedPosts = 0;
    const errors: string[] = [];

    for (const topic of topicList) {
        try {
            const postContent = await generateBlogPost({ topic });
            await saveBlogPost(postContent);
            successfulPosts++;
        } catch (e: any) {
            failedPosts++;
            errors.push(`Failed to generate post for topic "${topic}": ${e.message}`);
            console.error(`Error processing topic "${topic}":`, e);
        }
    }

    let message = `Finished processing. Successfully generated ${successfulPosts} posts.`;
    if (failedPosts > 0) {
        message += ` Failed to generate ${failedPosts} posts. Errors: ${errors.join(', ')}`;
    }

    return { success: failedPosts === 0, message };
}


export async function generateTrendingTopicsAction(): Promise<string[]> {
    const result = await generateTrendingTopics();
    return result.topics;
}

export async function toggleBrandPopularityAction(brandId: string, isPopular: boolean) {
    await toggleBrandPopularity(brandId, isPopular);
}

export async function addToolAction(tool: Omit<Tool, 'id'>) {
    await addOrUpdateTool(tool);
}

export async function deleteToolAction(toolId: string) {
    await deleteToolById(toolId);
}

export async function getAllTools(): Promise<Tool[]> {
    return await getAllToolsFromDB();
}

export async function handleDownloadAction(formData: FormData) {
    const firmwareId = formData.get('firmwareId') as string;
    const downloadUrl = formData.get('downloadUrl') as string;

    if (!firmwareId || !downloadUrl) {
        throw new Error('Missing firmware ID or download URL.');
    }
    
    // Increment count in the background, don't wait for it to finish.
    incrementDownloadCount(firmwareId).catch(console.error);
    
    // Immediately redirect the user to the download link.
    redirect(downloadUrl);
}

export async function logVisitorAction(ip: string | undefined) {
    if (ip) {
        await logVisitor(ip);
    }
}
