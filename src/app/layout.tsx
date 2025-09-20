import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getAnnouncement } from '@/lib/data';
import { AnnouncementBar } from '@/components/announcement-bar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Firmware Finder - Download Official Stock ROM for All Devices',
    template: '%s | Firmware Finder'
  },
  description: 'Find and download the latest official stock firmware (flash file) for your mobile device. We provide free downloads for Samsung, Huawei, Xiaomi, and more, with step-by-step flashing guides.',
  keywords: ['firmware', 'stock rom', 'flash file', 'android', 'samsung firmware', 'xiaomi firmware', 'huawei firmware', 'download firmware'],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcement = await getAnnouncement();

  return (
    <html lang="en">
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <AnnouncementBar announcement={announcement} />
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
