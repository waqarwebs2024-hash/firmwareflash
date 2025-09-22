
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { seedLegacyDataAction } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

export default function SeedPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeedData = () => {
    setResult(null);
    startTransition(async () => {
      const response = await seedLegacyDataAction();
      setResult(response);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>
            Manually trigger data seeding processes. Use with caution as these actions perform bulk database writes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
             <h3 className="font-semibold">Seed From Text Files</h3>
            <p>
              This action reads all `.txt` files from the `files_data` directory, parses the firmware information, and uploads it to the database. It will skip any firmware files that already exist.
            </p>
            <p className="text-sm text-destructive">
              <strong>Warning:</strong> This process can be slow and may time out on serverless environments if there are many files.
            </p>
            <Button onClick={handleSeedData} disabled={isPending} variant="secondary">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Seeding Data...' : 'Seed Firmware from Text Files'}
            </Button>
          </div>
          

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
    </div>
  );
}
