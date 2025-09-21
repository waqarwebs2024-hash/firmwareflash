
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getBrands, getAllSeries } from '@/lib/data';
import { FirmwareForm } from './firmware-form';
import { BrandManagement } from './brand-management';
import { SeriesManagement } from './series-management';
import { FirmwareScraperForm } from './firmware-scraper-form';
import { Separator } from '@/components/ui/separator';

export default async function FirmwareAdminPage() {
  const brands = await getBrands();
  const allSeries = await getAllSeries();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Firmware Management</h1>
      <Tabs defaultValue="firmware">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="firmware">Firmware</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="series">Series</TabsTrigger>
        </TabsList>
        <TabsContent value="firmware">
          <Card>
            <CardHeader>
              <CardTitle>Add New Firmware</CardTitle>
              <CardDescription>
                Use the scraper to automatically fetch details from a URL, or add the firmware manually below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <FirmwareScraperForm brands={brands} allSeries={allSeries} />
              
              <div className="flex items-center">
                <Separator className="flex-1" />
                <span className="mx-4 text-sm text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Manual Entry</h3>
                <FirmwareForm brands={brands} allSeries={allSeries} />
              </div>
            </CardContent>
          </Card>
          {/* We will add the table of existing firmware here later */}
        </TabsContent>
        <TabsContent value="brands">
            <BrandManagement initialBrands={brands} />
        </TabsContent>
        <TabsContent value="series">
            <SeriesManagement brands={brands} initialSeries={allSeries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
