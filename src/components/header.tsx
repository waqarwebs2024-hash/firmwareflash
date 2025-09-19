import Link from 'next/link';
import { Button } from './ui/button';
import { HardDrive } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <HardDrive className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Firmware Finder</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/brands">
              <Button variant="ghost">Brands</Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
          </nav>
          <Link href="/admin">
            <Button>Admin Panel</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
