
import { getRelatedFirmware, getBrandById } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
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
    <section className="mt-12" {...props}>
      <h2 className="text-xl font-bold mb-4">Other {brand.name} Firmwares</h2>
      <div className="space-y-4">
        {related.map((series) => (
          <Link href={`/brands/${brand.id}/${series.id}`} key={series.id} className="block">
             <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Smartphone className="h-10 w-10 text-muted-foreground" />
                        <div>
                            <p className="font-semibold text-foreground">{series.name} Firmware</p>
                            <span className="text-sm text-primary hover:underline">View Firmware &rarr;</span>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
