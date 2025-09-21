
'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAdSettings } from '@/lib/data';
import { AdSettings } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdPage({ params: promiseParams }: { params: Promise<{ firmwareId: string }> }) {
  const params = use(promiseParams);
  const [adSettings, setAdSettings] = useState<AdSettings | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [showButton, setShowButton] = useState(false);
  const [isPending, setIsPending] = useState(true);

  const downloadPageAd = adSettings?.slots?.downloadPage;

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getAdSettings();
        setAdSettings(settings);
      } catch (error) {
        console.error("Failed to fetch ad settings:", error);
        // Fallback to defaults if fetch fails
        setAdSettings({ slots: {} });
      } finally {
        setIsPending(false);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (isPending || adSettings === null) return;

    if (!downloadPageAd?.enabled) {
      setShowButton(true);
      setCountdown(0);
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!showButton) {
      setShowButton(true);
    }
  }, [countdown, adSettings, showButton, isPending, downloadPageAd]);

  if (isPending) {
    return (
        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }
  
  if (!downloadPageAd?.enabled) {
    // If ads are disabled, provide a direct link to the download page without the ad experience.
    return (
        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle>Proceed to Download</CardTitle>
                    <CardDescription>Your download is ready.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href={`/download/${params.firmwareId}`} className='w-full'>
                        <Button className="w-full" variant="primary">
                            Continue to Download
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
  }

  const WaitingButtonContent = () => (
    <div className="flex items-center justify-center">
      Please wait {countdown} seconds
      <span className="loading-ellipsis">
        <span>.</span><span>.</span><span>.</span>
      </span>
    </div>
  );

  return (
    <>
      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-lg text-center">
              <CardHeader>
                  <CardTitle>Advertisement</CardTitle>
                  <CardDescription>Your download will be ready shortly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="bg-muted h-60 w-full flex items-center justify-center rounded-md overflow-hidden">
                      {downloadPageAd?.adCode ? (
                        <div dangerouslySetInnerHTML={{ __html: downloadPageAd.adCode }} />
                      ) : (
                        <p className="text-muted-foreground">Ad placeholder</p>
                      )}
                  </div>
                  
                  <Link href={`/download/${params.firmwareId}`} className={!showButton ? 'pointer-events-none' : ''}>
                      <Button disabled={!showButton} className="w-full" variant="primary">
                        {showButton ? 'Continue to Download' : <WaitingButtonContent />}
                      </Button>
                  </Link>
              </CardContent>
          </Card>
      </div>
    </>
  );
}
