
'use client';
import { useState, useTransition, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AdSettings } from '@/lib/types';
import { updateAdSettingsAction } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

export default function AdsAdminPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<AdSettings>;
}) {
  const searchParams = use(searchParamsPromise);
  const [isPending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(searchParams.enabled === 'true');
  const [adsenseClient, setAdsenseClient] = useState(searchParams.adsenseClient || '');
  const [adsenseSlot, setAdsenseSlot] = useState(searchParams.adsenseSlot || '');
  const [timeout, setTimeoutValue] = useState(searchParams.timeout || 10);

  const handleSave = () => {
    startTransition(async () => {
      await updateAdSettingsAction({
        enabled,
        adsenseClient,
        adsenseSlot,
        timeout: Number(timeout),
      });
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ad Management</CardTitle>
          <CardDescription>
            Control advertisement settings across the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="ads-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <Label htmlFor="ads-enabled">Enable Ads</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adsense-client">AdSense Client ID</Label>
            <Input
              id="adsense-client"
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              value={adsenseClient}
              onChange={(e) => setAdsenseClient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adsense-slot">AdSense Ad Slot ID</Label>
            <Input
              id="adsense-slot"
              placeholder="XXXXXXXXXX"
              value={adsenseSlot}
              onChange={(e) => setAdsenseSlot(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ad-timeout">Ad Page Timeout (seconds)</Label>
            <Input
              id="ad-timeout"
              type="number"
              placeholder="10"
              value={timeout}
              onChange={(e) => setTimeoutValue(Number(e.target.value))}
            />
          </div>

          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
