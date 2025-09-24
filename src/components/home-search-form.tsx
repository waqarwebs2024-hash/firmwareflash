
'use client';

import { FormEvent, useTransition, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { liveSearchAction } from '@/lib/actions';
import { Firmware } from '@/lib/types';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function HomeSearchForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Firmware[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Debounce effect
    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const fetchSuggestions = async () => {
            setIsSearching(true);
            const results = await liveSearchAction(query);
            setSuggestions(results);
            setShowSuggestions(true);
            setIsSearching(false);
        };

        const debounceTimeout = setTimeout(fetchSuggestions, 300);

        return () => clearTimeout(debounceTimeout);
    }, [query]);

    // Handle clicks outside the search container to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchContainerRef]);


    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (query.trim()) {
            startTransition(() => {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            });
            setShowSuggestions(false);
        }
    };

    const handleSeeAll = () => {
        if(query.trim()) {
            startTransition(() => {
                 router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            });
            setShowSuggestions(false);
        }
    }

    const isLoading = isPending || isSearching;
    const hasQuery = query.length > 0;

    return (
        <div className="relative" ref={searchContainerRef}>
            <form 
                onSubmit={handleSearch} 
                className={cn(
                    "relative flex items-center w-full",
                    "search-form-container",
                    hasQuery && 'search-active'
                )}
            >
                 <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                 <Input
                    type="text"
                    name="search"
                    placeholder="Search for firmware, brand, or model..."
                    className="h-14 pl-12 pr-4 text-base rounded-lg bg-background border-2 border-transparent focus:border-primary/50 focus-visible:ring-0 transition-all"
                    disabled={isLoading}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                />
            </form>
            
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 top-full mt-2 w-full bg-card shadow-lg rounded-lg border overflow-hidden">
                    <ul>
                        {suggestions.map(fw => (
                             <li key={fw.id}>
                                <Link 
                                    href={`/download/${fw.id}`} 
                                    className="block p-4 hover:bg-secondary transition-colors"
                                    onClick={() => setShowSuggestions(false)}
                                >
                                    <p className="font-medium text-sm text-foreground truncate">{fw.fileName}</p>
                                    <p className="text-xs text-muted-foreground">{fw.version} - {fw.size}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                     <div className="p-2 border-t bg-secondary">
                        <button 
                            onClick={handleSeeAll} 
                            className="w-full text-center text-sm font-semibold text-primary hover:underline py-2"
                        >
                            See all results
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
