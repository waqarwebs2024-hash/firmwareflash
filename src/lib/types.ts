export interface Brand {
    id: string;
    name: string;
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

export interface Submission {
    id: string;
    fileName: string;
    brand: string;
    model: string;
    version: string;
    size: string;
    fileUrl: string;
    uploaderName: string;
    submittedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
}


export interface Announcement {
    id: 'announcement';
    text: string;
}

export interface AdSettings {
    enabled: boolean;
    adsenseClient: string;
    adsenseSlot: string;
    timeout: number;
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
