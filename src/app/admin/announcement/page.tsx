
'use client';
import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { updateAnnouncementAction } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

export default function AnnouncementAdminPage({
  searchParams,
}: {
  searchParams: { announcement: string };
}) {
  const [isPending, startTransition] = useTransition();
  const [announcement, setAnnouncementState] = useState(searchParams.announcement || '');

  const handleSave = () => {
    startTransition(async () => {
      await updateAnnouncementAction(announcement);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Announcement Bar</CardTitle>
          <CardDescription>
            Set a scrolling message for all visitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement-text">Announcement Text</Label>
            <Textarea
              id="announcement-text"
              placeholder="Enter your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncementState(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Saving...' : 'Save Announcement'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
