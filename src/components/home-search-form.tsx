
'use client';

import { FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
        ? 'bg-white text-gray-900 border-transparent placeholder:text-gray-500 focus:bg-white'
        : 'bg-background border-input focus-visible:ring-primary focus-visible:ring-2 placeholder:text-muted-foreground';


    return (
        <div className="w-full">
            <form onSubmit={handleSearch} className="relative">
                <Search className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                    variant === 'light' ? 'text-gray-500' : 'text-muted-foreground'
                )} />
                <Input
                    type="search"
                    name="search"
                    placeholder="Search by model name or number..."
                    className={cn(
                        "w-full h-10 pl-9 pr-24 rounded-full",
                        inputClass
                    )}
                    disabled={isPending}
                />
                <Button
                    type="submit"
                    variant={variant === 'light' ? 'default' : 'accent'}
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full"
                    disabled={isPending}
                >
                    {isPending ? '...' : 'Search'}
                </Button>
            </form>
        </div>
    )
}
