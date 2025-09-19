import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/about" className="hover:text-primary">About</Link>
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-primary">Contact Us</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Firmware Finder. All rights reserved.</p>
      </div>
    </footer>
  );
}
