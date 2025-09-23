
import { getBrands } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Brand } from '@/lib/types';

export const metadata: Metadata = {
  title: 'All Mobile Brands for Firmware Downloads',
  description: 'Browse a complete A-Z list of all available mobile phone brands like Samsung, Google, Xiaomi, and Huawei to find and download the correct stock ROM for your device.',
};

export default async function BrandsPage() {
  const brands = await getBrands();

  const groupedBrands = brands.reduce((acc, brand) => {
    const firstLetter = brand.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {} as Record<string, Brand[]>);

  const sortedLetters = Object.keys(groupedBrands).sort();

  return (
    <>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">All Mobile Phone Brands</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Find your device from our comprehensive A-Z list. We provide official stock ROMs for hundreds of brands, helping you to update, unbrick, or restore your phone to its factory settings. Select a brand to see all available models and firmware files.
            </p>
        </div>

        {sortedLetters.map((letter) => (
            <section key={letter} className="mb-12">
                <h2 className="text-3xl font-bold mb-6 border-b pb-2">
                    {letter}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {groupedBrands[letter].map((brand) => (
                    <Link href={`/brand/${brand.id}`} key={brand.id} className="block">
                    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                        <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                        <span className="font-semibold text-center text-sm">{brand.name}</span>
                        </CardContent>
                    </Card>
                    </Link>
                ))}
                </div>
            </section>
        ))}

        {brands.length === 0 && (
            <div className="text-center text-muted-foreground py-16">
                No brands found.
            </div>
        )}
      </div>
    </>
  );
}
