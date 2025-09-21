
import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { WithContext, WebSite, Organization } from 'schema-dts';
import { headers } from 'next/headers';
import { getAnnouncement } from '@/lib/data';
import { AnnouncementBar } from '@/components/announcement-bar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { WhatsappFab } from '@/components/whatsapp-fab';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Firmware Finder - Official Stock ROM Downloads',
    template: '%s | Firmware Finder'
  },
  description: 'Download official stock firmware for Samsung, Huawei, Xiaomi, and more. Find free flash files and step-by-step installation guides for your mobile device.',
  keywords: ['firmware', 'stock rom', 'flash file', 'android', 'samsung firmware', 'xiaomi firmware', 'huawei firmware', 'download firmware'],
};

const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'My Awesome App',
  url: 'https://my-awesome-app.com', // Replace with your actual domain
  logo: 'https://my-awesome-app.com/logo.png', // Replace with your actual logo URL
};

const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'My Awesome App',
  url: 'https://my-awesome-app.com', // Replace with your actual domain
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://my-awesome-app.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminPage = pathname.startsWith('/admin');
  const announcement = await getAnnouncement();

  return (
    <html lang="en">
       <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {isAdminPage ? (
          <>{children}</>
        ) : (
          <div className="flex flex-col min-h-screen">
            <AnnouncementBar announcement={announcement} />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <WhatsappFab />
          </div>
        )}
      </body>
    </html>
  );
}
