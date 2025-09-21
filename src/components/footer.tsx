
import Link from 'next/link';
import { Button } from './ui/button';
import { Facebook, Twitter, Send, Youtube, HardDrive } from 'lucide-react';
import { Separator } from './ui/separator';

export function Footer() {
  return (
    <footer className="bg-secondary border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-12">
          
          <div className="col-span-12 md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2">
                <HardDrive aria-label="Firmware Finder Logo" className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Firmware Finder</span>
            </Link>
            <p className="text-sm text-muted-foreground">
                Your reliable source for official mobile firmware.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
             <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
                  <li><Link href="/brands" className="text-muted-foreground hover:text-primary">Brands</Link></li>
                  <li><Link href="/tools" className="text-muted-foreground hover:text-primary">Tools</Link></li>
                  <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/disclaimer" className="text-muted-foreground hover:text-primary">Disclaimer</Link></li>
              </ul>
          </div>

          <div className="col-span-12 md:col-span-4">
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#" target="_blank" aria-label="Facebook">
                        <Facebook className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="#" target="_blank" aria-label="Twitter">
                        <Twitter className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </Button>
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="#" target="_blank" aria-label="Telegram">
                        <Send className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </Button>
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="#" target="_blank" aria-label="YouTube">
                        <Youtube className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </Button>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} Firmware Finder. All rights reserved.</p>
      </div>
    </footer>
  );
}
