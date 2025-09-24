
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';

export function HeaderSearchForm() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                name="q" // Changed name to 'q' to match search page logic
                placeholder="Search firmware..."
                className="h-10 pl-10 pr-20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">
                Search
            </Button>
        </form>
    );
}
