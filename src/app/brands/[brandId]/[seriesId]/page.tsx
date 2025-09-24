

import { getFirmwareBySeries, getSeriesById, getBrandById, getAllBlogPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download, FileText, Star, ChevronsRight, Newspaper } from 'lucide-react';
import type { Metadata } from 'next';
import { RelatedFirmware } from '@/components/related-firmware';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { BlogPost } from '@/lib/types';
import { FaqSection } from '@/components/faq-section';

type Props = {
  params: { brandId: string, seriesId: string }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const series = await getSeriesById(params.seriesId);
  if (!series) return { title: "Series Not Found" };
  const brand = await getBrandById(params.brandId);
  if (!brand) return { title: "Brand Not Found" };

  return {
    title: `All Firmware for ${brand.name} ${series.name} [Stock ROM & Flash File]`,
    description: `Complete list of official firmware and flash file downloads for the ${brand.name} ${series.name}. Get your stock ROM download and find the latest flash file to restore or update your device.`,
  }
}

const RelatedBlogPosts = ({ posts }: { posts: BlogPost[] }) => {
    if (posts.length === 0) return null;
    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Guides & Articles</h2>
            <div className="space-y-4">
                 {posts.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Newspaper className="h-8 w-8 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                 ))}
            </div>
        </section>
    );
};

export default async function SeriesPage({ params }: { params: { brandId: string, seriesId: string } }) {
  const series = await getSeriesById(params.seriesId);

  if (!series) {
    notFound();
  }

  const brand = await getBrandById(params.brandId);
  if (!brand) {
    notFound();
  }

  const [firmwareList, allPosts] = await Promise.all([
    getFirmwareBySeries(params.seriesId),
    getAllBlogPosts(),
  ]);

  const uploadDate = (firmwareList.length > 0 && firmwareList[0]?.uploadDate?.toDate) ? firmwareList[0].uploadDate.toDate() : new Date();

  // Filter for related blog posts
  const relatedPosts = allPosts.filter(post => 
    post.title.toLowerCase().includes(brand.name.toLowerCase()) || 
    post.title.toLowerCase().includes(series.name.toLowerCase())
  ).slice(0, 3); // Show up to 3 related posts

  const faqItems = [
    {
        question: `How to flash ${brand.name} ${series.name} firmware?`,
        answer: `You can find a step-by-step guide for flashing firmware on the download page for your specific file. Generally, for ${brand.name} devices, you'll use a specific tool like Odin or Fastboot. The guide will provide all the necessary details.`
    },
    {
        question: `Is this the official stock ROM for ${brand.name} ${series.name}?`,
        answer: `Yes, all files listed here are the official stock ROMs (firmware) for the ${brand.name} ${series.name}. This is the original software provided by the manufacturer.`
    },
    {
        question: `Can I use this flash file to unbrick my ${series.name}?`,
        answer: `Yes, downloading and flashing the correct stock ROM is a common way to fix a soft-bricked device (e.g., stuck in a bootloop). Make sure to use the file that matches your device's model number.`
    }
  ];


  return (
    <>
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronsRight className="h-4 w-4" />
            <Link href="/brands" className="hover:text-primary">Brands</Link>
            <ChevronsRight className="h-4 w-4" />
            <Link href={`/brand/${brand.id}`} className="hover:text-primary">{brand.name}</Link>
            <ChevronsRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{series.name}</span>
        </div>

        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{series.name} Firmware Download (Flash File)</h1>
            <div className="text-muted-foreground space-y-2">
              <p>
                Find and get the latest stock ROM download and flash file for your {brand.name} {series.name}.
              </p>
              <p>
                On this page, you can find the official link to download {brand.name} {series.name} Stock Firmware ROM (Flash File) on your computer. Firmware comes in a zip package containing Flash File, Flash Tool, USB Driver, and How-to Flash Manual.
              </p>
            </div>
        </div>


        {firmwareList.length > 0 ? (
          <div className="space-y-4">
            {firmwareList.map((firmware) => (
              <Card key={firmware.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <FileText aria-label={`${firmware.fileName} icon`} className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    <div className="flex-grow space-y-1">
                        <Link href={`/download/${firmware.id}`} className="text-lg font-semibold hover:text-primary hover:underline">{firmware.fileName}</Link>
                        <div className="flex items-center gap-2">
                           <Badge variant="accent">Featured Firmware</Badge>
                           <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-yellow-400" />
                                ))}
                           </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Date: {format(uploadDate, 'dd-MM-yyyy')} | Size: {firmware.size}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                         <Link href={`/download/${firmware.id}`}>
                            <Button variant="destructive" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </Link>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg">
            <p className="text-muted-foreground mb-4">No stock ROM or flash file download available for this model yet.</p>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(brand.name + ' ' + series.name + ' stock rom download')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Search on Google</Button>
            </a>
          </div>
        )}

        <FaqSection title={`Frequently Asked Questions for ${series.name}`} items={faqItems} />

        <RelatedBlogPosts posts={relatedPosts} />

        <RelatedFirmware brandId={params.brandId} seriesId={params.seriesId} />
      </div>
    </>
  );
}
