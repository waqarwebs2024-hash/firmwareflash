
'use server';

import { getAnnouncement } from '@/lib/data';
import { AnnouncementBar } from './announcement-bar';
import { Header } from './header';
import { Footer } from './footer';

export async function MainLayout({ children }: { children: React.ReactNode }) {
  const announcement = await getAnnouncement();

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar announcement={announcement} />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
