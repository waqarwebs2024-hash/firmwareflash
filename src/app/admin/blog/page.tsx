
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { generateBlogPost } from '@/ai/flows/blog-post-flow';
import { saveBlogPostAction } from '@/lib/actions';
import { BlogPostOutput } from '@/lib/types';

export default function BlogAdminPage() {
  const [isPending, startTransition] = useTransition();
  const [topic, setTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState<BlogPostOutput | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePost = () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setError(null);
    setResult(null);
    setGeneratedPost(null);

    startTransition(async () => {
      try {
        const post = await generateBlogPost({ topic });
        setGeneratedPost(post);
      } catch (e: any) {
        setError(`Failed to generate post: ${e.message}`);
      }
    });
  };

  const handleSavePost = () => {
    if (!generatedPost) return;

    startTransition(async () => {
        try {
            const slug = await saveBlogPostAction(generatedPost);
            setResult({ success: true, message: `Blog post saved successfully! Slug: ${slug}` });
            setGeneratedPost(null); // Clear the form
            setTopic('');
        } catch (e: any) {
             setResult({ success: false, message: e.message || 'Failed to save post.' });
        }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Blog Post Generator</CardTitle>
          <CardDescription>
            Enter a topic, and the AI will generate a complete blog post for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow w-full space-y-2">
              <Label htmlFor="topic">Blog Post Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., How to flash a Samsung device"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isPending}
              />
            </div>
            <Button onClick={handleGeneratePost} disabled={isPending}>
              {isPending && !generatedPost && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending && !generatedPost ? 'Generating...' : 'Generate Post'}
            </Button>
          </div>
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {isPending && !generatedPost && (
        <div className="text-center py-12">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">The AI is writing the blog post. This may take a moment...</p>
        </div>
      )}

      {generatedPost && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Post</CardTitle>
            <CardDescription>Review the generated content below. You can edit it before saving.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="post-title">Title</Label>
                <Input id="post-title" value={generatedPost.title} onChange={(e) => setGeneratedPost({...generatedPost, title: e.target.value})} />
             </div>
             <div className="space-y-2">
                <Label htmlFor="post-excerpt">Excerpt</Label>
                <Textarea id="post-excerpt" value={generatedPost.excerpt} onChange={(e) => setGeneratedPost({...generatedPost, excerpt: e.target.value})} rows={3} />
             </div>
             <div className="space-y-2">
                <Label htmlFor="post-content">Content (Markdown)</Label>
                <Textarea id="post-content" value={generatedPost.content} onChange={(e) => setGeneratedPost({...generatedPost, content: e.target.value})} rows={20} />
             </div>
             <div className="flex gap-4">
                <Button onClick={handleSavePost} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Post
                </Button>
                <Button variant="outline" onClick={() => setGeneratedPost(null)} disabled={isPending}>Discard</Button>
             </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Alert variant={result.success ? 'default' : 'destructive'}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{result.success ? 'Success!' : 'Error!'}</AlertTitle>
            <AlertDescription>
                {result.message}
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
