
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
    
    const containerClass = variant === 'light' 
        ? 'bg-white border-gray-900'
        : 'bg-white border-transparent';

    const inputClass = variant === 'light' 
        ? 'text-gray-900 placeholder:text-gray-500'
        : 'text-gray-900 placeholder:text-gray-500';


    return (
        <div className="w-full">
            <form onSubmit={handleSearch}>
                <div className={cn(
                    "relative flex items-center w-full rounded-full p-2 shadow-sm",
                    containerClass
                )}>
                    <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                    <Input
                        type="search"
                        name="search"
                        placeholder="Search for firmware, brand, or model..."
                        className={cn(
                            "w-full h-10 pl-10 pr-24 rounded-full text-base bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
                            inputClass
                        )}
                        disabled={isPending}
                    />
                    <Button 
                        type="submit" 
                        className="absolute right-2 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        disabled={isPending}
                    >
                        {isPending ? 'Searching...' : 'Search'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
