'use client';

import { FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function HomeSearchForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get('search') as string;

        if (query.trim()) {
            startTransition(() => {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            });
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="search"
                    name="search"
                    placeholder="Search millions of firmware files..."
                    className="h-10 pl-10 pr-4 text-sm border-gray-300 rounded-md focus-visible:ring-accent-2"
                    disabled={isPending}
                />
            </div>
        </form>
    )
}
