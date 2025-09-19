export interface Brand {
    id: string;
    name: string;
    logoUrl: string;
}

export interface Series {
    id: string;
    brandId: string;
    name: string;
}

export interface Firmware {
    id: string;
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
    brand: string;
    series: string;
    fileUrl: string;
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
