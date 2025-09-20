import { getRelatedFirmware, getBrandById } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { HTMLAttributes } from 'react';

interface RelatedFirmwareProps extends HTMLAttributes<HTMLElement> {
  brandId: string;
  seriesId: string;
}

export async function RelatedFirmware({ brandId, seriesId, ...props }: RelatedFirmwareProps) {
  const related = await getRelatedFirmware(brandId, seriesId);
  const brand = await getBrandById(brandId);

  if (related.length === 0 || !brand) {
    return null;
  }

  return (
    <section className="mt-12 scroll-mt-20" {...props}>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Other {brand.name} Firmwares</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {related.map((series) => (
          <Link href={`/brands/${brand.id}/${series.id}`} key={series.id} className="block">
             <Card className="h-full hover:shadow-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                        {series.name} Firmware
                    </CardTitle>
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-primary hover:underline">View Firmware &rarr;</p>
                </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href={`/brand/${brand.id}`}>
            <Button variant="outline">
                View All {brand.name} Firmwares <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </Link>
      </div>
    </section>
  );
}
