import { getBrandById, getSeriesByBrand } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Smartphone } from 'lucide-react';

export default async function BrandPage({ params }: { params: { id: string } }) {
  const brand = await getBrandById(params.id);

  if (!brand) {
    notFound();
  }

  const series = await getSeriesByBrand(params.id);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {brand.name} Series
      </h1>

      {series.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {series.map((s) => (
            <Link href={`/brands/${brand.id}/${s.id}`} key={s.id}>
                <Card className="h-full hover:shadow-primary/20 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                            {s.name}
                        </CardTitle>
                        <Smartphone className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">View available firmware</p>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>No series found for this brand.</p>
        </div>
      )}
    </div>
  );
}
