
import { getToolBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Link from 'next/link';

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
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
                  <Button variant="accent" size="lg" className="w-full">
                    <Download className="mr-2 h-5 w-5" />
                    Download {tool.name}
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
  );
}
