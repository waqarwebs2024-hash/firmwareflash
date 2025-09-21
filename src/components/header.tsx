'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/about', label: 'About' },
  { href: '/brands', label: 'Downloads' },
  { href: '/docs', label: 'Documentation' },
  { href: '/community', label: 'Community' },
  { href: '/stories', label: 'Success Stories' },
  { href: '/blog', label: 'News' },
  { href: '/events', label: 'Events' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background pt-3 pb-2 shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="bg-primary rounded-lg shadow-md">
          <ul className="flex justify-center items-center">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className="flex items-center">
                  <Link href={item.href}>
                    <span
                      className={`px-6 py-3 block text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-primary-foreground/80 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                  {index < navItems.length - 1 && (
                    <div className="h-4 w-px bg-blue-400/50"></div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
