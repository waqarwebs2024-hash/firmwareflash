
'use client';

import { useState, useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Brand, Series } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { addFirmware } from '@/lib/data';
import { Loader2 } from 'lucide-react';

const firmwareSchema = z.object({
  brandId: z.string().min(1, 'Brand is required'),
  seriesId: z.string().min(1, 'Series/Model is required'),
  fileName: z.string().min(1, 'File Name is required'),
  version: z.string().min(1, 'Version is required'),
  size: z.string().min(1, 'File Size is required'),
  downloadUrl: z.string().url('Must be a valid URL'),
});

type FirmwareFormValues = z.infer<typeof firmwareSchema>;

interface FirmwareFormProps {
  brands: Brand[];
  allSeries: Series[];
  initialData?: Partial<FirmwareFormValues>;
}

export function FirmwareForm({ brands, allSeries, initialData }: FirmwareFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(initialData?.brandId || null);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);

  const form = useForm<FirmwareFormValues>({
    resolver: zodResolver(firmwareSchema),
    defaultValues: initialData || {
        brandId: '',
        seriesId: '',
        fileName: '',
        version: '',
        size: '',
        downloadUrl: ''
    }
  });

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    form.setValue('brandId', brandId);
    form.setValue('seriesId', ''); // Reset series when brand changes
    const seriesForBrand = allSeries.filter((s) => s.brandId === brandId);
    setFilteredSeries(seriesForBrand);
  };

  const onSubmit: SubmitHandler<FirmwareFormValues> = (data) => {
    startTransition(async () => {
      try {
        await addFirmware({ ...data, androidVersion: 'N/A' });
        // Maybe show a success toast here
        alert('Firmware added successfully!');
        form.reset({
            brandId: '',
            seriesId: '',
            fileName: '',
            version: '',
            size: '',
            downloadUrl: ''
        });
        setSelectedBrand(null);
        setFilteredSeries([]);
      } catch (error) {
        console.error('Failed to add firmware:', error);
        // Maybe show an error toast here
        alert('Failed to add firmware.');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select
                  onValueChange={handleBrandChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seriesId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Series / Model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedBrand}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a series/model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSeries.map((series) => (
                      <SelectItem key={series.id} value={series.id}>
                        {series.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fileName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., galaxy_s22_firmware.zip" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Firmware Version</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., S908U1UEU2AVF7" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
                <FormItem>
                <FormLabel>File Size</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 4.5 GB" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="downloadUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Download URL</FormLabel>
              <FormControl>
                <Input placeholder="https://your-download-link.com/file.zip" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Adding...' : 'Add Firmware'}
        </Button>
      </form>
    </Form>
  );
}

FirmwareForm.displayName = 'FirmwareForm';
