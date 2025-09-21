
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
import { Textarea } from '@/components/ui/textarea';

export default function AdsAdminPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<AdSettings>;
}) {
  const searchParams = use(searchParamsPromise);
  const [isPending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(searchParams.enabled === 'true' || searchParams.enabled === true);
  const [adCode, setAdCode] = useState(searchParams.adCode || '');
  const [timeout, setTimeoutValue] = useState(searchParams.timeout || 10);

  const handleSave = () => {
    startTransition(async () => {
      await updateAdSettingsAction({
        enabled,
        adCode,
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
            <Label htmlFor="ad-code">Ad Network Code</Label>
            <Textarea
              id="ad-code"
              placeholder="Paste your ad code snippet here (e.g., <script>...)"
              value={adCode}
              onChange={(e) => setAdCode(e.target.value)}
              rows={8}
            />
            <p className="text-sm text-muted-foreground">
              This code will be rendered on the ad page. Works with AdSense or any other ad network.
            </p>
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
