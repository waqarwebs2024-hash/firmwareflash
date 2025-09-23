

'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addBrandAction, toggleBrandPopularityAction } from '@/lib/actions';
import { getBrands } from '@/lib/data';
import { Brand } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BrandManagementProps {
  initialBrands: Brand[];
}

export function BrandManagement({ initialBrands }: BrandManagementProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [newBrandName, setNewBrandName] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAddBrand = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!newBrandName.trim()) {
      setError('Brand name cannot be empty.');
      return;
    }

    startTransition(async () => {
      try {
        await addBrandAction(newBrandName);
        setNewBrandName('');
        const updatedBrands = await getBrands();
        setBrands(updatedBrands);
      } catch (e: any) {
        setError(e.message || 'Failed to add brand.');
      }
    });
  };

  const handleTogglePopular = (brandId: string, isPopular: boolean) => {
    startTransition(async () => {
        try {
            await toggleBrandPopularityAction(brandId, isPopular);
            // Optimistically update UI
            setBrands(prevBrands => 
                prevBrands.map(b => b.id === brandId ? { ...b, isPopular } : b)
            );
        } catch (e: any) {
            // Revert on error
            setBrands(prevBrands => 
                prevBrands.map(b => b.id === brandId ? { ...b, isPopular: !isPopular } : b)
            );
            alert(`Failed to update brand: ${e.message}`);
        }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Management</CardTitle>
        <CardDescription>Add new brands and manage which ones appear on the homepage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleAddBrand} className="flex items-start space-x-4">
          <div className="flex-grow space-y-2">
            <Input
              id="brand-name"
              placeholder="Enter new brand name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              className="max-w-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Adding...' : 'Add Brand'}
          </Button>
        </form>

        <div className="space-y-4">
            <h3 className="text-lg font-medium">Existing Brands</h3>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Brand Name</TableHead>
                            <TableHead>Popular</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {brands.map((brand) => (
                            <TableRow key={brand.id}>
                                <TableCell className="font-medium">{brand.name}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={!!brand.isPopular}
                                        onCheckedChange={(checked) => handleTogglePopular(brand.id, checked)}
                                        aria-label="Toggle Popular"
                                        disabled={isPending}
                                    />
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" disabled>Edit</Button>
                                    <Button variant="destructive" size="sm" disabled>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {brands.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No brands found.
                    </div>
                 )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
