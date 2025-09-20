'use client';
import { getPopularBrands } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FormEvent, useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brand } from '@/lib/types';


export default function Home() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function fetchBrands() {
            const brandsData = await getPopularBrands(10);
            setBrands(brandsData);
        }
        fetchBrands();
    }, []);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchQuery = formData.get('search') as string;
        if (searchQuery.trim()) {
            startTransition(() => {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            });
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <div 
                className="text-center mb-12 py-16 rounded-lg bg-cover bg-center relative" 
                style={{backgroundImage: "url('/4k-tech-cgoif1s63fsby58y.jpg')"}}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                <div className="relative z-10 p-8 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Firmware Finder</h1>
                    <p className="text-lg text-gray-300 mb-8">Find & Download Firmware for All Smartphones</p>
                    
                    <div className="w-full max-w-2xl">
                        <form onSubmit={handleSearch} className="relative shadow-lg">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search for firmware by model number..."
                                className="w-full h-14 pl-12 pr-24 text-base rounded-md"
                                disabled={isPending}
                            />
                            <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6" variant="accent" disabled={isPending}>
                                {isPending ? 'Searching...' : 'Search'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

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

            <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Your One-Stop Firmware Hub</h3>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                    Download official firmware updates for Samsung, Huawei, Xiaomi, Oppo, and more. Find the latest stock ROMs, flash files, and updates for your mobile device to keep it running smoothly and securely.
                </p>
            </div>
        </div>
    );
}
