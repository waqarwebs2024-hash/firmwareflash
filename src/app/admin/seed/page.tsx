
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { seedHuaweiDataAction } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

export default function SeedPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeed = () => {
    startTransition(async () => {
      const response = await seedHuaweiDataAction();
      setResult(response);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>
            Manually trigger data seeding processes. Use with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Click the button below to populate the Firestore database with the large set of Huawei firmware data. This action is designed to run only once. If the data already exists, it will not create duplicates.
          </p>
          <p className="text-sm text-destructive">
            <strong>Warning:</strong> This process may take a few moments and will perform multiple writes to your database.
          </p>
          
          <Button onClick={handleSeed} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Seeding in Progress...' : 'Seed Huawei Firmware Data'}
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
    </div>
  );
}
