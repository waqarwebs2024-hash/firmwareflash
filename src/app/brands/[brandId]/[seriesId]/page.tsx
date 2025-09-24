

import { getFirmwareBySeries, getSeriesById, getBrandById } from '@/lib/data';
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
import { Download, ChevronsRight } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import { RelatedFirmware } from '@/components/related-firmware';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: { brandId: string, seriesId: string }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const series = await getSeriesById(params.seriesId);
  if (!series) return { title: "Series Not Found" };
  const brand = await getBrandById(params.brandId);
  if (!brand) return { title: "Brand Not Found" };

  return {
    title: `All Firmware for ${brand.name} ${series.name} [Flash File Download]`,
    description: `Download all available official stock firmware (flash files) for the ${brand.name} ${series.name}. Find the latest updates and versions to restore or update your device.`,
  }
}

export default async function SeriesPage({ params }: { params: { brandId: string, seriesId: string } }) {
  const series = await getSeriesById(params.seriesId);

  if (!series) {
    notFound();
  }

  const brand = await getBrandById(params.brandId);
  if (!brand) {
    notFound();
  }

  const firmwareList = await getFirmwareBySeries(params.seriesId);

  return (
    <>
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronsRight className="h-4 w-4" />
            <Link href="/brands" className="hover:text-primary">Brands</Link>
            <ChevronsRight className="h-4 w-4" />
            <Link href={`/brand/${brand.id}`} className="hover:text-primary">{brand.name}</Link>
            <ChevronsRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{series.name}</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">{series.name} Firmware (Flash File)</h1>
        <p className="text-muted-foreground mb-8">
          Find and download the latest stock ROM and flash file for your {brand.name} {series.name}.
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
                        <Button variant="primary" size="sm" className="animated-button">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                          <Badge variant="accent" className="ml-2">Free</Badge>
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
              href={`https://www.google.com/search?q=${encodeURIComponent(series.name + ' firmware flash file')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Search on Google</Button>
            </a>
          </div>
        )}

        <RelatedFirmware brandId={params.brandId} seriesId={params.seriesId} />
      </div>
    </>
  );
}
