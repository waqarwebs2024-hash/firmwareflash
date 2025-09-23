

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

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string; // The full blog post content in Markdown
    createdAt: any;
}
