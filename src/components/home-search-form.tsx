
'use client';

import { FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function HomeSearchForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

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
        <div className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative shadow-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input
                    type="search"
                    name="search"
                    placeholder="Search for firmware by model number..."
                    className="w-full h-14 pl-12 pr-28 text-base rounded-xl backdrop-blur bg-white/80"
                    disabled={isPending}
                />
                <Button
                    type="submit"
                    variant="default"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                    disabled={isPending}
                >
                    {isPending ? 'Searching...' : 'Search'}
                </Button>
            </form>
        </div>
    )
}
