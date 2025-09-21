
'use client';
import { useState, useTransition, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AdSettings, AdSlot } from '@/lib/types';
import { updateAdSettingsAction } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const adSlotsConfig = [
  { id: 'headerBanner', name: 'Header Banner Ad', description: 'A banner ad that appears at the top of the site.' },
  { id: 'inContent', name: 'In-Content Ad', description: 'An ad displayed within the main content, e.g., on the download page.' },
  { id: 'footerBanner', name: 'Footer Banner Ad', description: 'A banner ad that appears in the site footer.' },
  { id: 'downloadPage', name: 'Download Page Ad (Legacy)', description: 'The ad shown on the dedicated ad-wall page before download.' },
];


export default function AdsAdminPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<AdSettings>;
}) {
  const searchParams = use(searchParamsPromise);
  const [isPending, startTransition] = useTransition();

  const [adSlots, setAdSlots] = useState<Record<string, AdSlot>>(
    searchParams.slots || {
      headerBanner: { enabled: false, adCode: '' },
      inContent: { enabled: false, adCode: '' },
      footerBanner: { enabled: false, adCode: '' },
      downloadPage: { enabled: false, adCode: '' },
    }
  );
  
  const handleSlotChange = (slotId: string, field: keyof AdSlot, value: string | boolean) => {
    setAdSlots(prev => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateAdSettingsAction({
        slots: adSlots,
      });
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advertisement Management</CardTitle>
          <CardDescription>
            Control multiple ad placements across the site. Use the text areas to paste ad code snippets (e.g., Google AdSense code).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {adSlotsConfig.map((slot, index) => (
              <AccordionItem value={`item-${index}`} key={slot.id}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-semibold">{slot.name}</span>
                    <Badge variant={adSlots[slot.id]?.enabled ? 'accent' : 'secondary'}>
                      {adSlots[slot.id]?.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                          id={`${slot.id}-enabled`}
                          checked={adSlots[slot.id]?.enabled || false}
                          onCheckedChange={(checked) => handleSlotChange(slot.id, 'enabled', checked)}
                        />
                        <Label htmlFor={`${slot.id}-enabled`}>Enable this ad slot</Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${slot.id}-code`}>Ad Network Code</Label>
                        <Textarea
                          id={`${slot.id}-code`}
                          placeholder={`Paste ad code for ${slot.name} here...`}
                          value={adSlots[slot.id]?.adCode || ''}
                          onChange={(e) => handleSlotChange(slot.id, 'adCode', e.target.value)}
                          rows={6}
                          disabled={!adSlots[slot.id]?.enabled}
                        />
                        <p className="text-sm text-muted-foreground">
                            {slot.description}
                        </p>
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Saving...' : 'Save All Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
