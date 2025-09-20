
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { generateSeoReport } from '@/ai/flows/seo-report-flow';
import type { SeoReport } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Lightbulb, TrendingUp, ThumbsDown, Star, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const PAGES = [
    { id: 'homepage', name: 'Homepage', path: '/' },
    { id: 'brands', name: 'All Brands', path: '/brands' },
    { id: 'tools', name: 'All Tools', path: '/tools' },
    { id: 'blog', name: 'Blog Index', path: '/blog' },
    { id: 'contact', name: 'Contact Us', path: '/contact' },
    // We can add a dynamic select for firmware/series pages later
];

export default function SeoReportPage() {
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [report, setReport] = useState<SeoReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [htmlContent, setHtmlContent] = useState('');

  const fetchPageContent = async (path: string) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch page content. Status: ${response.status}`);
      }
      return await response.text();
    } catch (e: any) {
      setError(`Could not fetch page content: ${e.message}`);
      return null;
    }
  };
  
  const handleGenerateReport = async () => {
    if (!selectedPage) {
      setError('Please select a page to analyze.');
      return;
    }
    
    setError(null);
    setReport(null);

    startTransition(async () => {
        const pagePath = PAGES.find(p => p.id === selectedPage)?.path;
        if (!pagePath) {
            setError("Invalid page selected.");
            return;
        }

        const content = await fetchPageContent(window.location.origin + pagePath);
        if (!content) {
            return;
        }
        
        try {
            const generatedReport = await generateSeoReport({ pageHtml: content });
            setReport(generatedReport);
        } catch (e: any) {
            setError(`Failed to generate SEO report: ${e.message}`);
        }
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered SEO Report</CardTitle>
          <CardDescription>
            Select a page to analyze its content for SEO best practices. The AI will provide a score and actionable recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow w-full sm:w-auto">
              <Label htmlFor="page-select">Select Page</Label>
               <Select onValueChange={setSelectedPage} value={selectedPage}>
                <SelectTrigger id="page-select">
                  <SelectValue placeholder="Select a page to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {PAGES.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.name} ({page.path})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateReport} disabled={isPending || !selectedPage}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Analyzing...' : 'Generate Report'}
            </Button>
          </div>
          {error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {isPending && (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">The AI is analyzing the page. This may take a moment...</p>
          </div>
      )}

      {report && (
        <Card>
            <CardHeader>
                <CardTitle>SEO Report Results</CardTitle>
                <CardDescription>Analysis of the selected page content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Overall SEO Score</p>
                    <p className="text-6xl font-bold">{report.score}</p>
                    <Progress value={report.score} className="w-full max-w-sm mx-auto mt-2" />
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-green-500" /> What's Good</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            {report.whatIsGood.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-semibold flex items-center"><ThumbsDown className="mr-2 h-5 w-5 text-red-500" /> What to Improve</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                             {report.whatToImprove.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-semibold flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-blue-500" /> Recommendations</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            {report.recommendations.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>
                
            </CardContent>
        </Card>
      )}
    </div>
  );
}
