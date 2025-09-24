
import { z } from 'zod';

export interface Brand {
    id: string;
    name: string;
    isPopular?: boolean;
}

export interface Series {
    id: string;
    brandId: string;
    name: string;
}

export interface Firmware {
    id: string;
    brandId: string;
    seriesId: string;
    fileName: string;
    version: string;
    androidVersion: string;
    size: string;
    downloadUrl: string;
    uploadDate: any;
    downloadCount: number;
}

export interface Announcement {
    id: 'announcement';
    text: string;
}

export interface AdSlot {
    enabled: boolean;
    adCode: string;
    rel?: 'sponsored' | 'nofollow';
}

export interface AdSettings {
    slots: Record<string, AdSlot>;
}

export interface FlashingInstructionTool {
    name: string;
    slug: string;
}

export interface FlashingInstructions {
    introduction: string;
    prerequisites: string[];
    instructions: {
        title: string;
        description: string;
    }[];
    warning: string;
    tool?: FlashingInstructionTool;
}

export interface Tool {
    id: string;
    name: string;
    description: string;
    downloadUrl?: string;
}

export interface SeoReport {
    score: number;
    whatIsGood: string[];
    whatToImprove: string[];
    recommendations: string[];
}

export interface Donation {
    id: string;
    name: string;
    email?: string;
    amount: number;
    message?: string;
    createdAt: any;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: any;
}

export interface DailyAnalytics {
    id: string; // YYYY-MM-DD
    visitors: number;
    downloads: number;
    adsClicks: number;
}

export interface HeaderScripts {
    id: 'scripts';
    content: string;
}

export const BlogPostInputSchema = z.object({
  topic: z.string().describe('The topic for the blog post, e.g., "How to flash Samsung firmware".'),
});
export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

export const BlogPostOutputSchema = z.object({
  title: z.string().describe("A catchy and SEO-friendly title for the blog post."),
  excerpt: z.string().describe("A short, compelling summary of the blog post (1-2 sentences)."),
  content: z.string().describe("The full content of the blog post in Markdown format. Should be well-structured with headings, lists, and bold text."),
});
export type BlogPostOutput = z.infer<typeof BlogPostOutputSchema>;


export interface BlogPost extends BlogPostOutput {
    id: string;
    slug: string;
    createdAt: any;
}
