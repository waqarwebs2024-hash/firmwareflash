
import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { WithContext, WebSite, Organization } from 'schema-dts';


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
  name: 'Firmware Finder',
  url: 'https://firmware-finder-app.com', // Replace with your actual domain
  logo: 'https://firmware-finder-app.com/logo.png', // Replace with your actual logo URL
};

const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Firmware Finder',
  url: 'https://firmware-finder-app.com', // Replace with your actual domain
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      'urlTemplate': 'https://firmware-finder-app.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        {children}
      </body>
    </html>
  );
}

