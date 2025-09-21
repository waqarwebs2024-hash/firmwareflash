'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HardDrive, Search, Menu } from 'lucide-react';
import { HomeSearchForm } from './home-search-form';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/brands', label: 'Brands' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/admin', label: 'Admin' },
];

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="border-b bg-background/95 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 gap-4">
          
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0" aria-label="Firmware Finder Homepage">
            <HardDrive className="h-8 w-8 text-primary" />
            <div>
              <span className="font-bold text-xl text-primary">
                Firmware<span className="text-foreground">Finder</span>
              </span>
            </div>
          </Link>
          
          <div className="flex-grow flex justify-end items-center gap-4">
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link href={item.href} key={item.href}>
                    <span className={`px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
            
            {!isHomePage && (
              <div className="hidden md:block w-full max-w-xs">
                <HomeSearchForm />
              </div>
            )}

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                   <nav className="grid gap-6 text-lg font-medium mt-8">
                     {!isHomePage && (
                       <div className="px-4">
                          <HomeSearchForm />
                       </div>
                     )}
                     {navItems.map(item => (
                       <Link
                          key={item.href}
                          href={item.href}
                          className="text-muted-foreground hover:text-foreground"
                      >
                          {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
