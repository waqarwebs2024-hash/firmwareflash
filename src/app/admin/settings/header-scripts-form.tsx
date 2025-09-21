

'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { updateHeaderScriptsAction } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

interface HeaderScriptsFormProps {
  initialScripts: string;
}

export function HeaderScriptsForm({ initialScripts }: HeaderScriptsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [scripts, setScripts] = useState(initialScripts || '');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateHeaderScriptsAction(scripts);
        setResult({ success: true, message: 'Header scripts updated successfully!' });
      } catch (e: any) {
        setResult({ success: false, message: e.message || 'Failed to update scripts.' });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Header Scripts</CardTitle>
        <CardDescription>
          Add scripts to the website's &lt;head&gt; tag for analytics, ads verification, etc.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="header-scripts">Scripts</Label>
          <Textarea
            id="header-scripts"
            placeholder="<script>...</script>"
            value={scripts}
            onChange={(e) => setScripts(e.target.value)}
            rows={8}
          />
           <p className="text-sm text-muted-foreground">
            This content will be injected directly into the site's head tag.
          </p>
        </div>

        <Button onClick={handleSave} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Save Scripts'}
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
