
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addSeriesAction } from '@/lib/actions';
import { getAllSeries } from '@/lib/data';
import { Brand, Series } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SeriesManagementProps {
  brands: Brand[];
  initialSeries: Series[];
}

export function SeriesManagement({ brands, initialSeries }: SeriesManagementProps) {
  const [series, setSeries] = useState<Series[]>(initialSeries);
  const [newSeriesName, setNewSeriesName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAddSeries = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!newSeriesName.trim()) {
      setError('Series name cannot be empty.');
      return;
    }
    if (!selectedBrandId) {
      setError('You must select a brand.');
      return;
    }

    startTransition(async () => {
      try {
        await addSeriesAction(newSeriesName, selectedBrandId);
        setNewSeriesName('');
        setSelectedBrandId('');
        // Refresh the list of series after adding
        const updatedSeries = await getAllSeries();
        setSeries(updatedSeries);
      } catch (e: any) {
        setError(e.message || 'Failed to add series.');
      }
    });
  };
  
  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || 'Unknown';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Series/Model Management</CardTitle>
        <CardDescription>Add, edit, or delete series for each brand.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleAddSeries} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow space-y-2">
                    <Select onValueChange={setSelectedBrandId} value={selectedBrandId}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                        {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-grow space-y-2">
                    <Input
                        id="series-name"
                        placeholder="Enter new series/model name"
                        value={newSeriesName}
                        onChange={(e) => setNewSeriesName(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Adding...' : 'Add Series'}
                </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <div className="space-y-4">
            <h3 className="text-lg font-medium">Existing Series / Models</h3>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Series Name</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {series.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell>{getBrandName(s.brandId)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" disabled>Edit</Button>
                                    <Button variant="destructive" size="sm" disabled>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {series.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No series found.
                    </div>
                 )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
