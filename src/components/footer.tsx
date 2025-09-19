import Link from 'next/link';
import { Button } from './ui/button';
import { Facebook, Twitter, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Firmware Finder. All rights reserved.</p>
            </div>
            <div className="flex justify-center space-x-6 mb-4 md:mb-0 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
              <Link href="/brands" className="text-muted-foreground hover:text-primary">Brands</Link>
              <Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
            </div>
            <div className="flex justify-center space-x-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://facebook.com" target="_blank">
                        <Facebook className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://twitter.com" target="_blank">
                        <Twitter className="h-5 w-5" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://telegram.org" target="_blank">
                        <Send className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </footer>
  );
}
