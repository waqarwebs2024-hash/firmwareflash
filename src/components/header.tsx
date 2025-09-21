
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { HardDrive, Search, Menu } from 'lucide-react';
import { HomeSearchForm } from './home-search-form';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = pathname === '/';

  // Close search and mobile menu on navigation
  useEffect(() => {
    setShowSearch(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = (
    <>
        <Link href="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link href="/brands">
          <Button variant="ghost">Brands</Button>
        </Link>
        <Link href="/tools">
          <Button variant="ghost">Tools</Button>
        </Link>
        <Link href="/blog">
          <Button variant="ghost">Blog</Button>
        </Link>
        <Link href="/admin">
          <Button>Admin</Button>
        </Link>
    </>
  );

  return (
    <header className="border-b sticky top-0 bg-background/95 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2" aria-label="Firmware Finder Homepage">
            <HardDrive className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Firmware Finder</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks}
            {!isHomePage && !showSearch && (
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-2">
            {!isHomePage && !showSearch && (
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                    <Search className="h-5 w-5" />
                     <span className="sr-only">Search</span>
                </Button>
            )}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 pt-8">
                  {navLinks}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {!isHomePage && showSearch && (
            <div className="pb-4 absolute top-full left-0 w-full bg-background/95 border-b px-4">
                <HomeSearchForm variant="dark" onBlur={() => setShowSearch(false)} />
            </div>
        )}
      </div>
    </header>
  );
}
