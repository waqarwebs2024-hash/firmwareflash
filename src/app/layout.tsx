
import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { WithContext, WebSite, Organization } from 'schema-dts';
import { headers } from 'next/headers';
import { getAdSettings, getHeaderScripts } from '@/lib/data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'firmwareflash.com - Free Official Stock Firmware & ROM Downloads',
    template: '%s | firmwareflash.com'
  },
  description: 'Download official stock firmware for Samsung, Huawei, Xiaomi, and more. Find free flash files and step-by-step installation guides to update or unbrick your mobile device.',
  keywords: ['firmware', 'stock rom', 'flash file', 'android', 'samsung firmware', 'xiaomi firmware', 'huawei firmware', 'download firmware', 'flash tool', 'unbrick phone'],
};

const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'firmwareflash.com',
  url: 'https://firmwareflash.com', // Replace with your actual domain
  logo: 'https://firmwareflash.com/logo.png', // Replace with your actual logo URL
};

const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'firmwareflash.com',
  url: 'https://firmwareflash.com', // Replace with your actual domain
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://firmwareflash.com/search?q={search_term_string}',
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
  
  const adSettings = await getAdSettings();
  const headerScripts = await getHeaderScripts();

  const headerAd = adSettings.slots?.headerBanner;

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
        {headerScripts && (
            <div dangerouslySetInnerHTML={{ __html: headerScripts }} />
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {isAdminPage ? (
          <>{children}</>
        ) : (
          <div className="flex flex-col min-h-screen bg-background">
            <Header />
            {headerAd?.enabled && headerAd.adCode && (
                <div className="py-2 bg-secondary flex justify-center">
                    <div dangerouslySetInnerHTML={{ __html: headerAd.adCode }} />
                </div>
            )}
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        )}
        <Toaster />
      </body>
    </html>
  );
}
