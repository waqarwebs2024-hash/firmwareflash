
import { getBrandById, getSeriesByBrand } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import { ChevronsRight } from 'lucide-react';

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
    title: `Firmware for ${brand.name} Devices - All Models`,
    description: `Find and download official stock firmware for all ${brand.name} models. Select your device series to get the latest flash file and installation guide.`,
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
          Firmware for {brand.name} Devices
        </h1>

        {series.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
            {series.map((s) => (
              <Link href={`/brands/${brand.id}/${s.id}`} key={s.id} className="group">
                  <div className="flex flex-col items-center text-center">
                      <Image
                        src="/f.png"
                        alt="Folder icon"
                        width={80}
                        height={60}
                        className="transition-transform group-hover:-translate-y-1"
                      />
                      <p className="mt-2 text-sm font-medium text-foreground group-hover:text-primary">
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
