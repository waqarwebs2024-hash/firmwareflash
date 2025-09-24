
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RelatedFirmware } from '@/components/related-firmware';
import { Calendar, ChevronsRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPost } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

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

const RecentPostsSidebar = ({ posts }: { posts: BlogPost[] }) => {
    if (posts.length === 0) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Recent Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {posts.map(post => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                        <p className="font-semibold group-hover:text-primary transition-colors">{post.title}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), 'PPP')}</p>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}

export default async function BlogPostPage({ params }: Props) {
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getAllBlogPosts()
  ]);

  if (!post) {
    notFound();
  }

  const recentPosts = allPosts.filter(p => p.id !== post.id).slice(0, 5);

  const postDate = post.createdAt ? new Date(post.createdAt) : new Date();

  return (
    <div className="container mx-auto py-12 px-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronsRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <ChevronsRight className="h-4 w-4" />
            <span className="font-medium text-foreground truncate">{post.title}</span>
        </div>
        <div className="grid lg:grid-cols-4 gap-12">
            <article className="lg:col-span-3">
                <header className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Published on {format(postDate, 'PPP')}</span>
                    </div>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>

            <aside className="lg:col-span-1 space-y-8">
                <RecentPostsSidebar posts={recentPosts} />
                {/* In a real app, we would dynamically determine brand/series from blog content */}
                <Separator />
                <div className="sticky top-24">
                  <RelatedFirmware brandId={"samsung"} seriesId={"galaxy-s22"} />
                </div>
            </aside>
        </div>
    </div>
  );
}

export const revalidate = 60; // Revalidate the page every 60 seconds
