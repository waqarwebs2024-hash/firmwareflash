
import { getPopularBrands, getAdSettings, getAllBlogPosts, getBrands } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Brand, BlogPost } from '@/lib/types';
import { HomeSearchForm } from '@/components/home-search-form';
import { FaqSection } from '@/components/faq-section';
import { ShieldCheck, Database, Download, BookCheck, Wrench, RefreshCw, LifeBuoy, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'firmwareflash.com - Free Official Stock Firmware & ROM Downloads',
  description: 'Download official stock firmware for Samsung, Huawei, Xiaomi, and more. Find free flash files, stock ROMs, and step-by-step installation guides to update or unbrick your mobile device.',
  keywords: ['firmware', 'stock rom', 'flash file', 'android', 'samsung firmware', 'xiaomi firmware', 'huawei firmware', 'download firmware', 'flash tool', 'unbrick phone'],
};

const LatestPosts = ({ posts }: { posts: BlogPost[] }) => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
        <Link href={`/blog/${post.slug}`} key={post.id} className="block">
            <Card className="h-full hover:shadow-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription className="pt-2 line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-primary hover:underline">Read More &rarr;</span>
                      <span className="text-xs text-muted-foreground">{format(new Date(post.createdAt), 'PPP')}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
        ))}
    </div>
);


export default async function Home() {
    const popularBrands: Brand[] = await getPopularBrands();
    const allBrands: Brand[] = await getBrands();
    const recentPosts = (await getAllBlogPosts()).slice(0, 3);

    let displayBrands = popularBrands;
    let popularBrandsTitle = "Popular Brands";

    if (displayBrands.length === 0 && allBrands.length > 0) {
        displayBrands = allBrands.slice(0, 12);
        popularBrandsTitle = "Browse Brands";
    }

    const faqItems = [
      {
        question: "What is stock firmware or a Stock ROM?",
        answer: "Stock firmware, or a Stock ROM, is the official software developed by the device manufacturer for a specific model. It's the original operating system your device came with. Flashing stock firmware can fix software issues, remove root access, and return your phone to its factory state."
      },
      {
        question: "Is flashing firmware safe for my device?",
        answer: "Flashing can be safe if you follow instructions carefully and use the correct firmware for your exact device model. However, there are always risks, such as data loss or 'bricking' the device if done incorrectly. We always recommend backing up your data before you begin."
      },
      {
        question: "Why would I need to download and flash firmware?",
        answer: "Common reasons include fixing a phone stuck in a bootloop, upgrading to a newer Android version that wasn't released in your region, downgrading to a previous version, or removing custom modifications (like root) to restore your phone to its original state for warranty or resale."
      }
    ];

    const features = [
      {
        icon: ShieldCheck,
        title: "Official Secure Downloads",
        description: "We provide official, untouched firmware files and stock ROMs sourced directly from manufacturers."
      },
      {
        icon: BookCheck,
        title: "Step-by-Step Guides",
        description: "Clear, AI-generated flashing instructions to help you every step of the way with tools like Odin or Fastboot."
      },
      {
        icon: Database,
        title: "Vast Library of Brands",
        description: "Our extensive database covers a wide range of popular and niche device brands for all your Android update needs."
      },
      {
        icon: Download,
        title: "Free for Everyone",
        description: "All our firmware flash files are available for free, with no hidden charges or subscriptions."
      },
    ];

    const whyUseStockFirmware = [
      {
        icon: Wrench,
        title: "Fix Software Issues",
        description: "Resolve common problems like bootloops, crashes, and force closes by reinstalling the original stock ROM."
      },
      {
        icon: RefreshCw,
        title: "Restore to Factory State",
        description: "Remove root access, custom ROMs, and other modifications to return your device to its original condition for warranty or resale."
      },
      {
        icon: LifeBuoy,
        title: "Unbrick Your Device",
        description: "Bring a 'soft-bricked' phone back to life by flashing the correct stock firmware and rescue it from being unusable."
      }
    ];

    return (
        <>
            <main>
              {/* Hero Section */}
              <section className="bg-secondary py-16 text-center">
                <div className="container mx-auto px-4">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Download <span className="text-primary">Free</span> Official Stock Firmware (ROM)
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Welcome to firmwareflash.com, your trusted source for official flash files to update, unbrick, or restore your mobile device.
                  </p>
                  <div className="w-full max-w-3xl mx-auto">
                    <HomeSearchForm />
                  </div>
                </div>
              </section>

              {/* Browse Popular Brands */}
              <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center">{popularBrandsTitle}</h2>
                    <div className="text-center max-w-3xl mx-auto mt-4 mb-12">
                      <p className="text-muted-foreground">
                        Our library includes firmware for all major manufacturers. Whether you're looking for the latest firmware for Samsung devices, need specific Xiaomi flash files, or want to restore a Huawei phone, we have you covered. Select a brand below to get started.
                      </p>
                    </div>
                    {displayBrands.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {displayBrands.map((brand) => (
                                    <Link href={`/brand/${brand.id}`} key={brand.id} className="block group">
                                        <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1 bg-card flex items-center justify-center min-h-[80px]">
                                            <CardContent className="p-4">
                                                <p className="text-lg text-center font-semibold">{brand.name}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <Link href="/brands">
                                    <Button>View All Brands</Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>No brands have been indexed yet.</p>
                        </div>
                    )}
                </div>
              </section>

               {/* Why use stock firmware section */}
               <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4">
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold mb-4">Why Use Stock Firmware?</h2>
                    <p className="text-muted-foreground">Flashing the official stock ROM is the most reliable way to solve software problems and restore your phone to its peak performance.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {whyUseStockFirmware.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                           <item.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
               </section>

              {/* Features Section */}
              <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Features</h2>
                        <p className="text-muted-foreground">Everything you need to confidently manage your device's software.</p>
                    </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <feature.icon className="h-10 w-10 mb-4 text-primary" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
              </section>

              {/* Latest Blog Posts */}
              {recentPosts.length > 0 && (
                <section className="py-20 bg-background">
                  <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                      <h2 className="text-3xl font-bold mb-4">Latest Guides & News</h2>
                      <p className="text-muted-foreground">Stay updated with our latest articles on firmware flashing, troubleshooting, and mobile tech news.</p>
                    </div>
                    <LatestPosts posts={recentPosts} />
                    <div className="text-center mt-12">
                      <Link href="/blog">
                        <Button>Read More on Our Blog</Button>
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              {/* FAQ Section */}
              <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4 max-w-4xl">
                  <FaqSection title="Frequently Asked Questions" items={faqItems} />
                </div>
              </section>
            </main>
        </>
    );
}
