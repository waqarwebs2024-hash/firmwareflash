
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

  const handleSeedHuawei = () => {
    setResult(null);
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
            Manually trigger data seeding processes. Use with caution as these actions perform bulk database writes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
             <h3 className="font-semibold">Seed Legacy Huawei Data</h3>
            <p>
              This action populates the database with a pre-defined set of Huawei firmware data. This is a legacy function and should only be run once if needed.
            </p>
            <p className="text-sm text-destructive">
              <strong>Warning:</strong> This process may take a few moments.
            </p>
            <Button onClick={handleSeedHuawei} disabled={isPending} variant="secondary">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Seeding Huawei Data...' : 'Seed Huawei Firmware Data'}
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
