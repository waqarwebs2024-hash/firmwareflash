

import { getToolBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `Download ${tool.name} - Latest Version`,
    description: tool.description || `Download the latest version of ${tool.name} and find guides on how to use it for flashing firmware on your mobile device.`,
  }
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <>
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronsRight className="h-4 w-4" />
            <Link href="/tools" className="hover:text-primary">Tools</Link>
            <ChevronsRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{tool.name}</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">{tool.name} Download</CardTitle>
            <CardDescription className="pt-2">{tool.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Download</h2>
                {tool.downloadUrl ? (
                  <Link href={tool.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="lg" className="w-full animated-button">
                      <Download className="mr-2 h-5 w-5" />
                      Download {tool.name}
                      <Badge variant="accent" className="ml-2">Free</Badge>
                    </Button>
                  </Link>
                ) : (
                  <div className="bg-muted p-6 rounded-lg text-center">
                      <p className="text-muted-foreground">A direct download link for {tool.name} is not yet available.</p>
                      <p className="text-sm text-muted-foreground mt-2">Please search for it on Google for now.</p>
                      <a
                          href={`https://www.google.com/search?q=${encodeURIComponent('Download ' + tool.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block"
                      >
                          <Button variant="outline">Search on Google</Button>
                      </a>
                  </div>
                )}
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">How to Use {tool.name}</h2>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-muted-foreground">
                    Instructions on how to use {tool.name} will be added here soon. This section will contain a detailed guide, screenshots, and tips for successful firmware flashing.
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
