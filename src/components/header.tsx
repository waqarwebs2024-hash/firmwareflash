import Link from 'next/link';
import { Button } from './ui/button';
import { HardDrive, Search } from 'lucide-react';
import { HomeSearchForm } from './home-search-form';

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <HardDrive className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Firmware Finder</span>
          </Link>
          <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
            <div className="w-full max-w-md">
              <HomeSearchForm />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
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
          </nav>
          <div className="md:hidden">
            {/* Mobile menu could be added here */}
            <Link href="/admin">
              <Button>Admin</Button>
            </Link>
          </div>
        </div>
        <div className="md:hidden pb-4">
            <HomeSearchForm />
        </div>
      </div>
    </header>
  );
}
