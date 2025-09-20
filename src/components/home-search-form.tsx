
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
        <div className="w-full">
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    name="search"
                    placeholder="Search by model name or number..."
                    className="w-full h-10 pl-9 pr-20 bg-background/80"
                    disabled={isPending}
                />
                <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4"
                    disabled={isPending}
                >
                    {isPending ? '...' : 'Search'}
                </Button>
            </form>
        </div>
    )
}
