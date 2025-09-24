

import { getFirmwareBySeries, getSeriesById, getBrandById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download, FileText, Star, ChevronsRight } from 'lucide-react';
import type { Metadata } from 'next';
import { RelatedFirmware } from '@/components/related-firmware';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

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
    title: `All Firmware for ${brand.name} ${series.name} [Stock ROM Download]`,
    description: `Complete list of official firmware for the ${brand.name} ${series.name}. Get your stock ROM download and find the latest updates to restore or update your device.`,
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
  // @ts-ignore
  const uploadDate = firmwareList[0]?.uploadDate.toDate ? firmwareList[0]?.uploadDate.toDate() : new Date();


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

        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{series.name} Firmware (Stock ROM Download)</h1>
            <p className="text-muted-foreground">
            Find and get the latest stock ROM download and flash file for your {brand.name} {series.name}.
            </p>
        </div>


        {firmwareList.length > 0 ? (
          <div className="space-y-4">
            {firmwareList.map((firmware) => (
              <Card key={firmware.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <FileText className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    <div className="flex-grow space-y-1">
                        <Link href={`/download/${firmware.id}/ad`} className="text-lg font-semibold hover:text-primary hover:underline">{firmware.fileName}</Link>
                        <div className="flex items-center gap-2">
                           <Badge variant="accent">Featured</Badge>
                           <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400" />
                                ))}
                           </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Date: {format(uploadDate, 'dd-MM-yyyy')} | Size: {firmware.size}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                         <Link href={`/download/${firmware.id}/ad`}>
                            <Button variant="destructive" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </Link>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg">
            <p className="text-muted-foreground mb-4">No stock ROM download available for this model yet.</p>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(series.name + ' stock rom download')}`}
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

    