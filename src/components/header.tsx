'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HardDrive } from 'lucide-react';
import { HomeSearchForm } from './home-search-form';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/brands', label: 'Brands' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/admin', label: 'Admin' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 gap-4">
          
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0" aria-label="Firmware Finder Homepage">
            <HardDrive className="h-8 w-8 text-slate-700" />
            <div>
              <span className="font-bold text-xl text-accent-2">
                Firmware<span className="text-slate-700">Finder</span>
              </span>
              <p className="text-xs text-muted-foreground">Your firmware is here!</p>
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
                        ? 'text-accent-2' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
            
            <div className="w-full max-w-xs">
              <HomeSearchForm />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
