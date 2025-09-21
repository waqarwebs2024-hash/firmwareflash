
import { getBrands } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Brand } from '@/lib/types';
import { HomeSearchForm } from '@/components/home-search-form';
import { FaqSection } from '@/components/faq-section';
import { CheckCircle, ShieldCheck, Database, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function Home() {
    const brands: Brand[] = await getBrands();

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

              {/* Features Section */}
              <section className="py-20">
                <div className="container mx-auto px-4">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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
              <section className="py-20 bg-secondary">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Browse All Brands</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {brands.slice(0, 12).map((brand) => ( // Show first 12 brands
                            <Link href={`/brand/${brand.id}`} key={brand.id} className="block">
                                <Card className="h-full transition-all hover:shadow-xl hover:-translate-y-1 bg-card">
                                    <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                                        <span className="font-semibold text-center">{brand.name}</span>
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
                    {brands.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            Loading brands...
                        </div>
                    )}
                </div>
              </section>

              {/* FAQ Section */}
              <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                  <FaqSection title="Frequently Asked Questions" items={faqItems} />
                </div>
              </section>
            </main>
        </>
    );
}
