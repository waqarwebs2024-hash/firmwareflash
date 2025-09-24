
import { getBrandById, getSeriesByBrand } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import { ChevronsRight, Folder } from 'lucide-react';

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const brand = await getBrandById(params.id);
  if (!brand) return { title: "Brand Not Found" };

  return {
    title: `Firmware for ${brand.name} Devices - All Models | Stock ROM Download & Flash File`,
    description: `Find and download official stock firmware and get the right stock rom download or flash file for all ${brand.name} models. Select your device series to get the latest flash file and installation guide.`,
  }
}

export default async function BrandPage({ params }: { params: { id: string } }) {
  const brand = await getBrandById(params.id);

  if (!brand) {
    notFound();
  }

  const series = await getSeriesByBrand(params.id);

  return (
    <>
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronsRight className="h-4 w-4" />
            <Link href="/brands" className="hover:text-primary">Brands</Link>
            <ChevronsRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{brand.name}</span>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">
          {brand.name} Firmware & Flash File Download
        </h1>

        {series.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
            {series.map((s) => (
              <Link href={`/brands/${brand.id}/${s.id}`} key={s.id} className="group">
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Folder className="h-10 w-10 text-primary shrink-0" fill="hsl(var(--primary))" />
                      <p className="font-medium text-foreground group-hover:text-primary">
                        {s.name}
                      </p>
                  </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-16">
            <p>No device models found for this brand yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
