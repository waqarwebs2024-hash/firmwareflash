

'use client';

import { FormEvent, useTransition, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { liveSearchAction } from '@/lib/actions';
import { Firmware } from '@/lib/types';
import Link from 'next/link';

export function HomeSearchForm() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Firmware[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const isHomePage = pathname === '/';

    // Debounce effect
    useEffect(() => {
        if (query.length < 3) {
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

    return (
        <div className="relative" ref={searchContainerRef}>
            <form onSubmit={handleSearch}>
                <div className="relative">
                     <Input
                        type="search"
                        name="search"
                        placeholder="Search millions of firmware files..."
                        className={`h-12 pl-4 pr-12 text-sm rounded-full bg-white text-black border-2 border-transparent focus-visible:ring-ring focus-visible:border-foreground [&::-webkit-search-cancel-button]:hidden`}
                        disabled={isPending}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                    />
                     <button 
                        type="submit" 
                        className={`absolute right-1 top-1/2 -translate-y-1/2 h-10 bg-accent-2 rounded-full text-white flex items-center justify-center hover:bg-accent-2/90 transition-all duration-300 ${isPending || isSearching ? 'w-32' : 'w-12'}`} 
                        aria-label="Search"
                        disabled={isPending || isSearching}
                    >
                        {isPending || isSearching ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Searching...
                            </>
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </form>
            
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 top-full mt-2 w-full bg-gray-50 shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                    <ul>
                        {suggestions.map(fw => (
                             <li key={fw.id}>
                                <Link 
                                    href={`/download/${fw.id}`} 
                                    className="block p-3 hover:bg-gray-100 transition-colors"
                                    onClick={() => setShowSuggestions(false)}
                                >
                                    <p className="font-medium text-sm text-gray-800 truncate">{fw.fileName}</p>
                                    <p className="text-xs text-gray-500">Android {fw.androidVersion} - {fw.size}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                     <div className="p-2 border-t border-gray-200 bg-gray-50">
                        <button 
                            onClick={handleSeeAll} 
                            className="w-full text-center text-sm font-semibold text-primary hover:underline"
                        >
                            See all results
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
