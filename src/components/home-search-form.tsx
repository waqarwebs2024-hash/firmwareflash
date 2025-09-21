
'use client';

import { FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function HomeSearchForm({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
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
    
    const inputClass = variant === 'light' 
        ? 'bg-white text-gray-900 border-gray-300 placeholder:text-gray-500 focus:bg-white'
        : 'bg-background border-input focus-visible:ring-primary focus-visible:ring-2 placeholder:text-muted-foreground';


    return (
        <div className="w-full">
            <form onSubmit={handleSearch} className="relative">
                <Search className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5",
                    variant === 'light' ? 'text-gray-400' : 'text-muted-foreground'
                )} />
                <Input
                    type="search"
                    name="search"
                    placeholder="Search for firmware, brand, or model..."
                    className={cn(
                        "w-full h-12 pl-12 rounded-full text-base",
                        inputClass
                    )}
                    disabled={isPending}
                />
            </form>
        </div>
    )
}
