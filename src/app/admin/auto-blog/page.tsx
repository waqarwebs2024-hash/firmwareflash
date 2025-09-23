
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, Bot } from 'lucide-react';
import { autoGenerateBlogPostsAction } from '@/lib/actions';

export default function AutoBlogAdminPage() {
  const [isPending, startTransition] = useTransition();
  const [topics, setTopics] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePosts = () => {
    if (!topics.trim()) {
      setError('Please enter at least one topic.');
      return;
    }
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const response = await autoGenerateBlogPostsAction(topics);
        setResult(response);
        if (response.success) {
            setTopics(''); // Clear textarea on full success
        }
      } catch (e: any) {
        setError(`An unexpected error occurred: ${e.message}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot /> Auto Blog Post Generator
          </CardTitle>
          <CardDescription>
            Enter a list of topics (one per line), and the AI will generate and publish a complete blog post for each one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="topics">Blog Post Topics</Label>
              <Textarea
                id="topics"
                placeholder="e.g., How to flash a Samsung device\nBest custom ROMs for Android\nWhat is Fastboot?"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                disabled={isPending}
                rows={10}
              />
            </div>
            <Button onClick={handleGeneratePosts} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Generating...' : 'Generate All Posts'}
            </Button>
         
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>{result.success ? 'Process Complete!' : 'Process Finished with Errors'}</AlertTitle>
                <AlertDescription>
                    {result.message}
                </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
