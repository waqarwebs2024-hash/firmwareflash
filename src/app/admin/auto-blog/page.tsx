
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, Bot, Sparkles } from 'lucide-react';
import { autoGenerateBlogPostsAction, generateTrendingTopicsAction } from '@/lib/actions';

export default function AutoBlogAdminPage() {
  const [isGeneratingPosts, startGeneratingPosts] = useTransition();
  const [isGeneratingTopics, startGeneratingTopics] = useTransition();
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

    startGeneratingPosts(async () => {
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

  const handleGenerateTopics = () => {
    setError(null);
    setResult(null);
    startGeneratingTopics(async () => {
        try {
            const topicList = await generateTrendingTopicsAction();
            setTopics(topicList.join('\n'));
        } catch(e: any) {
            setError(`Failed to generate topics: ${e.message}`);
        }
    });
  }

  const isPending = isGeneratingPosts || isGeneratingTopics;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot /> Auto Blog Post Generator
          </CardTitle>
          <CardDescription>
            Enter topics manually, or use the AI to generate trending topics. Then, generate and publish a complete blog post for each one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="topics">Blog Post Topics</Label>
              <Textarea
                id="topics"
                placeholder="e.g., How to flash a Samsung device&#10;Best custom ROMs for Android&#10;What is Fastboot?"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                disabled={isPending}
                rows={10}
              />
            </div>
            <div className="flex gap-4">
                <Button onClick={handleGenerateTopics} disabled={isPending} variant="outline">
                    {isGeneratingTopics && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGeneratingTopics ? 'Generating Topics...' : 'Generate Trending Topics'}
                </Button>
                <Button onClick={handleGeneratePosts} disabled={isPending}>
                  {isGeneratingPosts && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isGeneratingPosts ? 'Generating Posts...' : 'Generate All Posts'}
                </Button>
            </div>
         
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
