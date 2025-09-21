import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const blogPosts = [
    {
        slug: "how-to-flash-samsung-firmware",
        title: "How to Flash Firmware on Samsung Phones",
        excerpt: "A step-by-step guide to safely flashing stock firmware on your Samsung Galaxy device using Odin.",
    },
    {
        slug: "stock-rom-vs-custom-rom",
        title: "Stock ROM vs. Custom ROM: What's the Difference?",
        excerpt: "Understand the pros and cons of sticking with the official firmware versus exploring the world of custom ROMs.",
    },
    {
        slug: "fix-bootloop-with-firmware",
        title: "How to Fix a Bootloop Using a Firmware Update",
        excerpt: "Is your phone stuck in a bootloop? Learn how reinstalling the stock firmware can bring your device back to life.",
    }
]

export default function BlogPage() {
  return (
    <>
        <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Our Blog</h1>
            <p className="text-muted-foreground">Guides, tutorials, and news from the world of mobile firmware.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="block">
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
        </div>
    </>
  );
}
