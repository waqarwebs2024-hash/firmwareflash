
import { getBrands, getAdSettings, getAllBlogPosts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Brand, BlogPost } from '@/lib/types';
import { HomeSearchForm } from '@/components/home-search-form';
import { FaqSection } from '@/components/faq-section';
import { ShieldCheck, Database, Download, BookCheck, Wrench, RefreshCw, LifeBuoy, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Download Free Firmware, ROMs & Flash Files — Fast & Safe',
  description: 'Find your free stock rom download, firmware, and flash file for Samsung, Huawei, Xiaomi, Oppo, Vivo, Infinix, Tecno and more. Get official firmware and flash files with step-by-step installation guides to update or unbrick your mobile device.',
  keywords: ['firmware', 'stock rom', 'flash file', 'android', 'samsung firmware', 'xiaomi firmware', 'huawei firmware', 'oppo firmware', 'vivo firmware', 'infinix firmware', 'tecno firmware', 'download firmware', 'flash tool', 'unbrick phone', 'stock rom download'],
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
    const allBrands: Brand[] = await getBrands();
    const recentPosts = (await getAllBlogPosts()).slice(0, 3);
    
    const topBrandNames = ['samsung', 'apple', 'xiaomi', 'redmi', 'oppo', 'vivo', 'realme', 'oneplus', 'google pixel', 'huawei', 'motorola', 'nokia', 'tecno', 'infinix', 'lg', 'sony'];
    
    const displayBrands = allBrands
        .filter(brand => topBrandNames.includes(brand.name.toLowerCase()))
        .sort((a,b) => topBrandNames.indexOf(a.name.toLowerCase()) - topBrandNames.indexOf(b.name.toLowerCase()));

    const popularBrandsTitle = "Popular Brands for Firmware & Flash File Download";
    
    const faqItems = [
      {
        question: "What is a Stock ROM or Firmware download?",
        answer: "A Stock ROM, firmware, or flash file download contains the official software developed by the device manufacturer. It's the original operating system your device came with. Flashing a stock ROM can fix software issues, remove root access, and return your phone to its factory state."
      },
      {
        question: "Is flashing firmware safe for my device?",
        answer: "Flashing can be safe if you follow instructions carefully and use the correct firmware or flash file for your exact device model. However, there are always risks, such as data loss or 'bricking' the device if done incorrectly. We always recommend backing up your data before you begin any stock rom download and flashing process."
      },
      {
        question: "Why would I need to download a flash file?",
        answer: "Common reasons include fixing a phone stuck in a bootloop, upgrading to a newer Android version, or removing custom modifications. A fresh flash file download is the perfect solution to restore your phone to its original state for warranty or resale."
      }
    ];

    const features = [
      {
        icon: ShieldCheck,
        title: "Official & Secure Firmware",
        description: "We provide official, untouched firmware files (stock ROMs) sourced directly from manufacturers for a safe flash file download."
      },
      {
        icon: BookCheck,
        title: "Step-by-Step Guides",
        description: "Clear, AI-generated flashing instructions to help you every step of the way with tools like Odin or Fastboot for your firmware."
      },
      {
        icon: Database,
        title: "Vast Library of Brands",
        description: "Our extensive database covers a wide range of device brands for all your flash file and firmware download needs."
      },
      {
        icon: Download,
        title: "Free for Everyone",
        description: "All our firmware flash files and stock rom downloads are available for free, with no hidden charges or subscriptions."
      },
    ];

    const whyUseStockFirmware = [
      {
        icon: Wrench,
        title: "Fix Software Issues",
        description: "Resolve common problems like bootloops and crashes by reinstalling the original flash file from a stock rom download."
      },
      {
        icon: RefreshCw,
        title: "Restore to Factory State",
        description: "Remove root access and custom ROMs to return your device to its original condition with an official firmware download."
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
                    Download Free Firmware, ROMs & Flash Files — Fast & Safe
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Welcome to firmwareflash.com, your trusted hub for official flash files, firmware, and stock ROMs to update, unbrick, or restore your mobile device.
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
                        Our library includes firmware for all major manufacturers. Whether you're looking for the latest Samsung firmware download, need specific Xiaomi flash files, or want to restore a Huawei phone, we have you covered. Select a brand below to get started.
                      </p>
                    </div>
                    {displayBrands.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {displayBrands.map((brand) => (
                                    <Link href={`/brand/${brand.id}`} key={brand.id} className="block group">
                                        <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1 bg-card flex items-center justify-center min-h-[90px]">
                                            <CardContent className="p-4 text-center">
                                                <p className="text-xl font-semibold">{brand.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Firmware Download</p>
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
                    <h2 className="text-3xl font-bold mb-4">Why Download a Stock Firmware or Flash File?</h2>
                    <p className="text-muted-foreground">Flashing the official stock firmware is the most reliable way to solve software problems and restore your phone to its peak performance.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {whyUseStockFirmware.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent-2/10 text-primary mb-4">
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
                        <p className="text-muted-foreground">Everything you need to confidently manage your device's firmware.</p>
                    </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <feature.icon className="h-12 w-12 mb-4 text-primary" />
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
                      <p className="text-muted-foreground">Stay updated with our latest articles on firmware flashing, flash file topics, and mobile tech news.</p>
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
                  <FaqSection title="Firmware & Flash File FAQs" items={faqItems} />
                </div>
              </section>
            </main>
        </>
    );
}
