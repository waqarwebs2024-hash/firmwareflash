
'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getPendingSubmissions, getBrands, getAllSeries } from '@/lib/data';
import { Submission, Brand, Series } from '@/lib/types';
import { scrapeUrlAction, approveSubmissionAction, rejectSubmissionAction } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function ScraperForm({ onScrapeStart, onScrapeEnd }: { onScrapeStart: () => void, onScrapeEnd: (result: any) => void }) {
    const [urls, setUrls] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        onScrapeStart();
        const urlList = urls.split('\n').filter(url => url.trim() !== '');
        
        startTransition(async () => {
            let hasError = false;
            for (const url of urlList) {
                const result = await scrapeUrlAction(url);
                if (!result.success) {
                    hasError = true;
                    onScrapeEnd(result); // Pass error to parent
                }
            }
            if (!hasError) {
                onScrapeEnd({ success: true });
            }
            setUrls('');
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="scrape-urls">URLs to Scrape</Label>
                <Textarea
                    id="scrape-urls"
                    placeholder="Enter one URL per line..."
                    rows={5}
                    value={urls}
                    onChange={(e) => setUrls(e.target.value)}
                    disabled={isPending}
                />
            </div>
            <Button type="submit" disabled={isPending || !urls.trim()}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? 'Scraping...' : 'Start Scraping'}
            </Button>
        </form>
    );
}

function PendingSubmissions({ submissions: initialSubmissions, brands, allSeries }: { submissions: Submission[], brands: Brand[], allSeries: Series[] }) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    useEffect(() => {
        setSubmissions(initialSubmissions);
    }, [initialSubmissions]);

    const handleApprove = async (submissionId: string, brandId: string, seriesId: string) => {
        if (!brandId || !seriesId) {
            alert('Please select a brand and series.');
            return;
        }
        setIsProcessing(submissionId);
        await approveSubmissionAction(submissionId, brandId, seriesId);
        setSubmissions(submissions.filter(s => s.id !== submissionId));
        setIsProcessing(null);
    };

    const handleReject = async (submissionId: string) => {
        setIsProcessing(submissionId);
        await rejectSubmissionAction(submissionId);
        setSubmissions(submissions.filter(s => s.id !== submissionId));
        setIsProcessing(null);
    };

    const handleBrandChange = (submissionId: string, brandId: string) => {
        setSubmissions(submissions.map(s => s.id === submissionId ? { ...s, brand: brandId, series: '' } : s));
    };

    const handleSeriesChange = (submissionId: string, seriesId: string) => {
        setSubmissions(submissions.map(s => s.id === submissionId ? { ...s, series: seriesId } : s));
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Submissions</CardTitle>
                <CardDescription>Review and approve scraped firmware data.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Categorization</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((sub) => {
                                const seriesForBrand = allSeries.filter(s => s.brandId === sub.brand);
                                return (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium break-all max-w-xs">
                                        <p>{sub.fileName}</p>
                                        <a href={sub.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline">Source</a>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">Version: {sub.version}</div>
                                        <div className="text-sm">Android: {sub.androidVersion}</div>
                                        <div className="text-sm">Size: {sub.size}</div>
                                    </TableCell>
                                     <TableCell className="space-y-2">
                                        <Select onValueChange={(value) => handleBrandChange(sub.id, value)} value={sub.brand}>
                                            <SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger>
                                            <SelectContent>
                                                {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Select onValueChange={(value) => handleSeriesChange(sub.id, value)} value={sub.series} disabled={!sub.brand}>
                                            <SelectTrigger><SelectValue placeholder="Select Series" /></SelectTrigger>
                                            <SelectContent>
                                                {seriesForBrand.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                     </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button 
                                            variant="outline" size="sm" 
                                            onClick={() => handleApprove(sub.id, sub.brand || '', sub.series || '')}
                                            disabled={isProcessing === sub.id || !sub.brand || !sub.series}
                                        >
                                            {isProcessing === sub.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                                            Approve
                                        </Button>
                                        <Button 
                                            variant="outline" size="sm"
                                            onClick={() => handleReject(sub.id)}
                                            disabled={isProcessing === sub.id}
                                        >
                                             {isProcessing === sub.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <XCircle className="mr-2 h-4 w-4 text-red-500" />}
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                    {submissions.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                            No pending submissions.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


export default function ScraperPage() {
    const [isScraping, setIsScraping] = useState(false);
    const [scrapeResult, setScrapeResult] = useState<{success: boolean, error?: string} | null>(null);
    const [pendingSubmissions, setPendingSubmissions] = useState<Submission[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [allSeries, setAllSeries] = useState<Series[]>([]);
    const [isFetchingInitial, setIsFetchingInitial] = useState(true);

    const fetchInitialData = async () => {
        setIsFetchingInitial(true);
        const [submissions, brandsData, seriesData] = await Promise.all([
            getPendingSubmissions(),
            getBrands(),
            getAllSeries()
        ]);
        setPendingSubmissions(submissions);
        setBrands(brandsData);
        setAllSeries(seriesData);
        setIsFetchingInitial(false);
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleScrapeStart = () => {
        setIsScraping(true);
        setScrapeResult(null);
    };
    
    const handleScrapeEnd = (result: any) => {
        setIsScraping(false);
        if (!result.success) {
            setScrapeResult(result);
        }
        fetchInitialData();
    };

    if(isFetchingInitial) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
             <h1 className="text-2xl font-bold">Firmware Scraper</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Scrape New Firmware</CardTitle>
                    <CardDescription>
                        Paste URLs from supported firmware sites to automatically extract and add them to the approval queue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScraperForm onScrapeStart={handleScrapeStart} onScrapeEnd={handleScrapeEnd} />
                    {scrapeResult && !scrapeResult.success && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Scraping Error</AlertTitle>
                            <AlertDescription>{scrapeResult.error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <PendingSubmissions submissions={pendingSubmissions} brands={brands} allSeries={allSeries} />
        </div>
    );
}

