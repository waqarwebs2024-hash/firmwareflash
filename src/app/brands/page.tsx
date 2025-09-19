import { getBrands } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">All Brands</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <Link href={`/brand/${brand.id}`} key={brand.id} className="block">
            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                 <div className="relative w-16 h-16 mb-2">
                    <Image
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      fill
                      style={{ objectFit: 'contain' }}
                      data-ai-hint={`${brand.name} logo`}
                    />
                  </div>
                <span className="font-semibold text-center">{brand.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
