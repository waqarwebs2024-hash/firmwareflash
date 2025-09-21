
import Link from 'next/link';
import { Button } from './ui/button';
import { Facebook, Twitter, Send } from 'lucide-react';
import { Separator } from './ui/separator';

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="font-semibold">Firmware Finder</h4>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Firmware Finder. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                  <h4 className="font-semibold">Quick Links</h4>
                  <ul className="space-y-1 text-sm">
                      <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
                      <li><Link href="/brands" className="text-muted-foreground hover:text-primary">Brands</Link></li>
                      <li><Link href="/tools" className="text-muted-foreground hover:text-primary">Tools</Link></li>
                      <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                  </ul>
              </div>
              <div className="space-y-2">
                  <h4 className="font-semibold">Legal</h4>
                   <ul className="space-y-1 text-sm">
                      <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                      <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                      <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                      <li><Link href="/donate" className="text-muted-foreground hover:text-primary">Donate</Link></li>
                  </ul>
              </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Follow Us</h4>
            <div className="flex space-x-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
                        <Facebook className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
                        <Twitter className="h-5 w-5" />
                    </Link>
                </Button>
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="https://telegram.org" target="_blank" aria-label="Telegram">
                        <Send className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
