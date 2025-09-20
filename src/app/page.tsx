import { getPopularBrands } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Brand } from '@/lib/types';
import { HomeSearchForm } from '@/components/home-search-form';

export default async function Home() {
    const brands: Brand[] = await getPopularBrands(10);

    return (
        <div className="container mx-auto py-12 px-4">
            {/* Hero / Search Section */}
            <div
                className="text-center mb-12 py-16 md:py-20 rounded-lg bg-primary text-primary-foreground"
            >
                <div className="relative z-10 p-8 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
                        Firmware Finder
                    </h1>
                    <p className="text-lg text-gray-200 mb-8 max-w-2xl">
                        The ultimate resource for official stock firmware. Find and download the right ROM for your smartphone or tablet with ease.
                    </p>
                    <div className="w-full max-w-lg">
                        <HomeSearchForm />
                    </div>
                </div>
            </div>

            {/* Popular Brands */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 text-center">Popular Brands</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {brands.map((brand) => (
                        <Link href={`/brand/${brand.id}`} key={brand.id} className="block">
                            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                                    <span className="font-semibold text-center">{brand.name}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
                {brands.length === 0 && (
                    <div className="text-center text-muted-foreground">
                        Loading popular brands...
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Your One-Stop Firmware Hub</h3>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                    Download official firmware updates for Samsung, Huawei, Xiaomi, Oppo, and more. 
                    Find the latest stock ROMs, flash files, and updates for your mobile device to keep it 
                    running smoothly and securely.
                </p>
            </div>
        </div>
    );
}
