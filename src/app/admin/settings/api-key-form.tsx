
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateApiKeyAction } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface ApiKeyFormProps {
  initialApiKey: string;
}

export function ApiKeyForm({ initialApiKey }: ApiKeyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [apiKey, setApiKey] = useState(initialApiKey || '');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '****';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateApiKeyAction(apiKey);
        setResult({ success: true, message: 'API Key updated successfully!' });
      } catch (e: any) {
        setResult({ success: false, message: e.message || 'Failed to update API key.' });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Key Management</CardTitle>
        <CardDescription>
          Manage the Gemini API Key for generating AI content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="api-key">Gemini API Key</Label>
          <Input
            id="api-key"
            type="text"
            placeholder="Enter your Gemini API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
           <p className="text-sm text-muted-foreground">
            Current stored key: <span className="font-mono">{maskApiKey(initialApiKey)}</span>
          </p>
        </div>

        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save API Key'}
        </Button>

        {result && (
            <Alert variant={result.success ? 'default' : 'destructive'}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{result.success ? 'Success!' : 'Error!'}</AlertTitle>
            <AlertDescription>
                {result.message}
            </AlertDescription>
        </Alert>
        )}
      </CardContent>
    </Card>
  );
}
