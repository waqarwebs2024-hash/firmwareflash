
'use client';

import { FormEvent, useTransition, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { liveSearchAction } from '@/lib/actions';
import { Firmware } from '@/lib/types';
import Link from 'next/link';
import { Button } from './ui/button';

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
        new Promise(resolve => {
            clearTimeout(timeout);
            timeout = setTimeout(() => resolve(func(...args)), waitFor);
        });
}

interface HomeSearchFormProps {
    variant?: 'light' | 'dark';
    onBlur?: () => void;
}

export function HomeSearchForm({ variant = 'light', onBlur }: HomeSearchFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Firmware[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (query.trim()) {
            startTransition(() => {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            });
        }
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchResults = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.trim().length > 2) {
                setIsLoading(true);
                const searchResults = await liveSearchAction(searchQuery);
                setResults(searchResults);
                setIsLoading(false);
                setShowResults(true);
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        fetchResults(query);
    }, [query, fetchResults]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
                if (onBlur) {
                    onBlur();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onBlur]);

    return (
        <div className="w-full max-w-2xl relative mx-auto" ref={searchContainerRef}>
            <form onSubmit={handleSearch}>
                <div className="relative flex items-center w-full">
                    <Input
                        type="search"
                        name="search"
                        placeholder="Search for firmware, brand, or model..."
                        className="w-full h-14 pl-5 pr-14 rounded-full text-base bg-white border-2 border-gray-900 text-gray-900 placeholder:text-gray-500 focus-visible:ring-primary"
                        disabled={isPending}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length > 2 && setShowResults(true)}
                        autoFocus={variant === 'dark'}
                    />
                    <Button 
                        type="submit" 
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground h-10 w-10 p-0"
                        disabled={isPending}
                        aria-label="Search"
                    >
                       <Search className="h-5 w-5" />
                    </Button>
                </div>
            </form>
            
            {showResults && (
                <div className="absolute top-full mt-2 w-full bg-muted rounded-lg border border-border shadow-xl z-50">
                    {isLoading && <div className="p-4 text-center text-muted-foreground">Loading...</div>}
                    {!isLoading && results.length > 0 && (
                        <ul className="divide-y divide-border">
                            {results.map((firmware) => (
                                <li key={firmware.id}>
                                    <Link href={`/download/${firmware.id}`} className="block p-3 hover:bg-background/80">
                                        <p className="font-medium text-foreground truncate">{firmware.fileName}</p>
                                        <p className="text-sm text-muted-foreground">{firmware.version}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!isLoading && query.length > 2 && results.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">No results found.</div>
                    )}
                     {!isLoading && query.length > 2 && (
                        <div className="p-2 border-t border-border">
                            <Link href={`/search?q=${encodeURIComponent(query.trim())}`} className="block">
                                <Button variant="ghost" className="w-full text-primary">
                                    See all results for "{query}"
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
