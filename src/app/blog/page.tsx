
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from 'next';
import { getAllBlogPosts } from "@/lib/data";

export const metadata: Metadata = {
    title: 'Firmware Flashing Guides & Mobile Tech Blog',
    description: 'Explore expert guides, tutorials, and news on mobile firmware. Learn to flash stock ROMs, fix software issues, and unlock your device’s full potential.'
};

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();

  return (
    <>
        <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Guides, tutorials, and news from the world of mobile firmware.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="block">
                <Card className="h-full hover:shadow-primary/20 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription className="pt-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <span className="text-sm font-semibold text-primary hover:underline">Read More &rarr;</span>
                    </CardContent>
                </Card>
            </Link>
            ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No blog posts found.</p>
          </div>
        )}
        </div>
    </>
  );
}
