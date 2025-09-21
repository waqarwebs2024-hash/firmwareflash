
'use client';

import { useState, useTransition, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { scrapeFirmwareFlow } from '@/ai/flows/scrape-firmware-flow';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatePresence, motion } from 'framer-motion';
import { Brand, Series } from '@/lib/types';
import { FirmwareForm, FirmwareFormHandle } from './firmware-form';


interface FirmwareScraperFormProps {
    brands: Brand[];
    allSeries: Series[];
}

export function FirmwareScraperForm({ brands, allSeries }: FirmwareScraperFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<FirmwareFormHandle>(null);

  const handleScrape = () => {
    setError(null);
    if (!url.trim()) {
      setError('URL cannot be empty.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await scrapeFirmwareFlow({ url });
        setShowForm(true);
        // Use a timeout to ensure the form is rendered before populating
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.populateForm(result);
          }
        }, 100);
      } catch (e: any) {
        setError(e.message || 'Failed to scrape URL.');
        setShowForm(false);
      }
    });
  };

  return (
    <div className="space-y-6">
        <h3 className="text-lg font-medium">AI Scraper</h3>
        <div className="flex items-end gap-4">
            <div className="flex-grow space-y-2">
                <Label htmlFor="scrape-url">Firmware Page URL</Label>
                <Input
                id="scrape-url"
                placeholder="https://example.com/firmware-download-page"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <Button onClick={handleScrape} disabled={isPending}>
                {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scraping...
                </>
                ) : (
                'Scrape Details'
                )}
            </Button>
        </div>

        {error && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <AnimatePresence>
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="border p-6 rounded-lg mt-6">
                        <h3 className="text-lg font-medium mb-4">Scraped Details (Review & Submit)</h3>
                        <FirmwareForm ref={formRef} brands={brands} allSeries={allSeries} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}

