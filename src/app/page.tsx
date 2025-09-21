import { getBrands, getAdSettings } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Brand } from '@/lib/types';
import { HomeSearchForm } from '@/components/home-search-form';
import { FaqSection } from '@/components/faq-section';
import { ShieldCheck, Database, Download, BookCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function Home() {
    const brands: Brand[] = await getBrands();
    const adSettings = await getAdSettings();
    const inContentAd = adSettings.slots?.inContent;

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
        answer: "Common reasons include fixing a phone stuck in a bootloop, upgrading to a newer Android version that wasn't released in your region, downgrading to a previous version, or removing custom modifications (like root) to restore your phone to its original state for warranty purposes."
      }
    ];

    const features = [
      {
        icon: ShieldCheck,
        title: "Official Secure Downloads",
        description: "We provide official, untouched firmware files sourced directly from manufacturers."
      },
      {
        icon: BookCheck,
        title: "Step-by-Step Guides",
        description: "Clear, AI-generated flashing instructions to help you every step of the way."
      },
      {
        icon: Database,
        title: "Vast Library of Brands",
        description: "Our extensive database covers a wide range of popular and niche device brands."
      },
      {
        icon: Download,
        title: "Free for Everyone",
        description: "All our firmware files are available for free, with no hidden charges or subscriptions."
      },
    ];

    const brandsToShow = brands.slice(0, 12);
    const firstHalfBrands = brandsToShow.slice(0, 6);
    const secondHalfBrands = brandsToShow.slice(6);

    return (
        <>
            <main>
              {/* Hero Section */}
              <section className="bg-secondary py-20 text-center">
                <div className="container mx-auto px-4">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Firmware Finder
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Find and download the right firmware for your device quickly and securely.
                  </p>
                  <div className="w-full max-w-2xl mx-auto">
                    <HomeSearchForm />
                  </div>
                </div>
              </section>

               {/* Mission Section */}
              <section className="py-20 text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                  <h2 className="text-3xl font-bold mb-4">Your Trusted Firmware Source</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our mission is to provide a safe, reliable, and user-friendly platform for everyone needing to restore or update their mobile devices. We understand how frustrating it can be to deal with software issues, which is why we offer a comprehensive library of official stock firmware and clear, step-by-step guides. From fixing bootloops to updating your Android version, Firmware Finder is here to empower you with the tools and information you need to keep your device running smoothly.
                  </p>
                </div>
              </section>

              {/* Features Section */}
              <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4">
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

              {/* Browse All Brands */}
              <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Browse All Brands</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {firstHalfBrands.map((brand) => (
                            <Link href={`/brand/${brand.id}`} key={brand.id} className="block group">
                                <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1 bg-card">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold">{brand.name}</CardTitle>
                                         <CardDescription className="pt-2 text-sm">Download official firmware for all {brand.name} devices.</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                        
                        {inContentAd?.enabled && inContentAd.adCode && (
                            <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 flex items-center justify-center h-full">
                                <div dangerouslySetInnerHTML={{ __html: inContentAd.adCode }} />
                            </div>
                        )}

                        {secondHalfBrands.map((brand) => (
                            <Link href={`/brand/${brand.id}`} key={brand.id} className="block group">
                                <Card className="h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1 bg-card">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold">{brand.name}</CardTitle>
                                         <CardDescription className="pt-2 text-sm">Download official firmware for all {brand.name} devices.</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                     <div className="text-center mt-12">
                        <Link href="/brands">
                            <Button>View All Brands</Button>
                        </Link>
                    </div>
                    {brands.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            Loading brands...
                        </div>
                    )}
                </div>
              </section>

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
