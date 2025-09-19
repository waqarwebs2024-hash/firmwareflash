import { getFirmwareBySeries, getSeriesById } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download } from 'lucide-react';

export default async function SeriesPage({ params }: { params: { brandId: string, seriesId: string } }) {
  const series = await getSeriesById(params.seriesId);

  if (!series) {
    notFound();
  }

  const firmwareList = await getFirmwareBySeries(params.seriesId);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">{series.name} Firmware</h1>
      <p className="text-muted-foreground mb-8">
        Find and download firmware for your device.
      </p>

      {firmwareList.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead className="hidden md:table-cell">Version</TableHead>
                <TableHead className="hidden sm:table-cell">Android Version</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {firmwareList.map((firmware) => (
                <TableRow key={firmware.id}>
                  <TableCell className="font-medium break-all">{firmware.fileName}</TableCell>
                  <TableCell className="hidden md:table-cell">{firmware.version}</TableCell>
                  <TableCell className="hidden sm:table-cell">{firmware.androidVersion}</TableCell>
                  <TableCell>{firmware.size}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/download/${firmware.id}/ad`}>
                      <Button variant="accent" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-muted-foreground mb-4">No firmware available for this model yet.</p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(series.name + ' firmware')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">Search on Google</Button>
          </a>
        </div>
      )}
    </div>
  );
}
