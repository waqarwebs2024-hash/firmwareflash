import { getFirmwareById } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, HardDrive, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

export default async function DownloadPage({ params }: { params: { firmwareId: string } }) {
  const firmware = await getFirmwareById(params.firmwareId);

  if (!firmware) {
    notFound();
  }

  const { fileName, size, uploadDate, downloadCount } = firmware;
  // @ts-ignore
  const date = uploadDate.toDate ? uploadDate.toDate() : new Date(uploadDate);


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold break-words">
            {fileName}
          </CardTitle>
          <CardDescription>Ready to download.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <HardDrive className="mr-3 text-muted-foreground" />
                <span className="font-medium">File Size</span>
              </div>
              <span className="text-muted-foreground">{size}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <Calendar className="mr-3 text-muted-foreground" />
                <span className="font-medium">Upload Date</span>
              </div>
              <span className="text-muted-foreground">{format(date, 'PPP')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <Users className="mr-3 text-muted-foreground" />
                <span className="font-medium">Downloads</span>
              </div>
              <span className="text-muted-foreground">{downloadCount.toLocaleString()}</span>
            </div>
          </div>

          <Link href={firmware.downloadUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block">
            <Button className="w-full" variant="accent">
              <Download className="mr-2 h-4 w-4" />
              Start Download
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
