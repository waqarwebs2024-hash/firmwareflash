'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAdSettings } from '@/lib/data';
import { AdSettings } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/main-layout';

export default function AdPage({ params }: { params: { firmwareId: string } }) {
  const [adSettings, setAdSettings] = useState<AdSettings | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const settings = await getAdSettings();
      setAdSettings(settings);
      setCountdown(settings.timeout || 10);
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowButton(true);
    }
  }, [countdown]);

  if (!adSettings) {
    return <MainLayout><div>Loading...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-lg text-center">
              <CardHeader>
                  <CardTitle>Advertisement</CardTitle>
                  <CardDescription>Your download will be ready shortly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="bg-muted h-60 w-full flex items-center justify-center rounded-md">
                      <p className="text-muted-foreground">Ad placeholder</p>
                  </div>
                  
                  <Link href={`/download/${params.firmwareId}`}>
                      <Button disabled={!showButton} className="w-full" variant="accent">
                      {showButton ? 'Continue to Download' : `Please wait ${countdown} seconds...`}
                      </Button>
                  </Link>
              </CardContent>
          </Card>
      </div>
    </MainLayout>
  );
}
