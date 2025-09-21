
import { getBrands } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Brand } from '@/lib/types';
import { HomeSearchForm } from '@/components/home-search-form';
import { FaqSection } from '@/components/faq-section';
import { CheckCircle } from 'lucide-react';

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
      "Official, Secure Downloads",
      "Step-by-Step Flashing Guides",
      "Vast Library of Brands & Models",
      "Free for Everyone",
    ];

    return (
        <>
            <div className="container mx-auto py-12 px-4">
                {/* Hero / Search Section */}
                <div
                    className="text-center mb-16 py-8 md:py-12 rounded-lg bg-primary text-primary-foreground"
                >
                    <div className="relative z-10 p-8 flex flex-col items-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
                            The Ultimate Firmware Resource
                        </h1>
                        <p className="text-lg text-gray-200 mb-8 max-w-2xl">
                            Find and download the right ROM for your smartphone or tablet with ease.
                        </p>
                        <div className="w-full max-w-2xl">
                            <HomeSearchForm />
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">Your One-Stop Firmware Hub</h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
                        Whether you're fixing a software issue, upgrading your system, or reverting to stock settings, you need reliable firmware. We provide direct access to official stock ROMs for a wide range of mobile devices, complete with easy-to-follow installation guides.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-center p-4 bg-muted rounded-lg">
                                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                <span className="font-medium text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Brands */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-6 text-center">Browse All Brands</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {brands.map((brand) => (
                            <Link href={`/brand/${brand.id}`} key={brand.id} className="block">
                                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                                    <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                                        <span className="font-semibold text-center">{brand.name}</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    {brands.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            Loading brands...
                        </div>
                    )}
                </div>

                {/* FAQ Section */}
                <FaqSection title="Frequently Asked Questions" items={faqItems} />

            </div>
        </>
    );
}
