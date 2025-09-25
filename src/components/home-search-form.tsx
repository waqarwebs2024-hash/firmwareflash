
'use client';

import { FormEvent, useTransition, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { liveSearchAction } from '@/lib/actions';
import { Firmware } from '@/lib/types';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const placeholderHints = [
    "Search for firmware, brand, or model...",
    "e.g., Samsung Galaxy S23 Ultra",
    "e.g., Xiaomi 12 Pro flash file",
    "e.g., Unbrick Google Pixel 7",
    "e.g., Redmi Note 12 stock ROM"
];

export function HomeSearchForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Firmware[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // --- Start of Typing Animation Logic ---
    const [placeholder, setPlaceholder] = useState(placeholderHints[0]);
    const [hintIndex, setHintIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const delayAfterTyping = 1500;

        const handleTyping = () => {
            const currentHint = placeholderHints[hintIndex];
            if (isDeleting) {
                if (charIndex > 0) {
                    setPlaceholder(currentHint.substring(0, charIndex - 1));
                    setCharIndex(charIndex - 1);
                } else {
                    setIsDeleting(false);
                    setHintIndex((prev) => (prev + 1) % placeholderHints.length);
                }
            } else {
                if (charIndex < currentHint.length) {
                    setPlaceholder(currentHint.substring(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                } else {
                    setTimeout(() => setIsDeleting(true), delayAfterTyping);
                }
            }
        };

        const typingTimeout = setTimeout(handleTyping, isDeleting ? deleteSpeed : typeSpeed);

        return () => clearTimeout(typingTimeout);
    }, [charIndex, isDeleting, hintIndex]);
    // --- End of Typing Animation Logic ---


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

    return (
        <div className="relative flex-grow" ref={searchContainerRef}>
            <form 
                onSubmit={handleSearch} 
                className={cn(
                    "relative",
                    "search-form-container",
                    showSuggestions && suggestions.length > 0 && "search-active"
                )}
            >
                <div className="relative flex items-center w-full">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        name="q"
                        placeholder={placeholder}
                        className="h-16 pl-12 pr-28 text-base rounded-full bg-background border-2"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <Button type="submit" className="rounded-full h-12 w-24" disabled={isLoading}>
                             {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Search'}
                        </Button>
                    </div>
                </div>
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
                            See all results for &quot;{query}&quot;
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
