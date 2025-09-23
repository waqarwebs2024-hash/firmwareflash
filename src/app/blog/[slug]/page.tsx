
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RelatedFirmware } from '@/components/related-firmware';
import { Calendar, ChevronsRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Blog Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Assuming createdAt is a timestamp or string that can be converted to a Date
  const postDate = post.createdAt ? new Date(post.createdAt) : new Date();

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <article>
        <header className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronsRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <ChevronsRight className="h-4 w-4" />
            <span className="font-medium text-foreground truncate">{post.title}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Published on {format(postDate, 'PPP')}</span>
          </div>
        </header>

        {/* This is a simple way to render markdown. For a real app, you'd use a dedicated library like 'react-markdown'. */}
        <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} 
        />
      </article>

      {/* In a real app, we might want to relate blog posts to specific brands or series */}
      {/* <RelatedFirmware brandId={"some-brand"} seriesId={"some-series"} /> */}
    </div>
  );
}

export const revalidate = 60; // Revalidate the page every 60 seconds
