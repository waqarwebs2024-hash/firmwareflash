import { getBrandsWithFirmware } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const brands = await getBrandsWithFirmware();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Firmware Finder</h1>
        <p className="text-muted-foreground">The ultimate source for your device's firmware.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Input 
            type="search" 
            placeholder="Search for firmware by model number..." 
            className="w-full h-12 pl-12 pr-4 text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Brands</h2>
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
    </div>
  );
}
