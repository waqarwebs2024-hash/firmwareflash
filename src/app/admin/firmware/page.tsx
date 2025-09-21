
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getBrands, getAllSeries } from '@/lib/data';
import { FirmwareForm } from './firmware-form';
import { BrandManagement } from './brand-management';
import { SeriesManagement } from './series-management';

export default async function FirmwareAdminPage() {
  const brands = await getBrands();
  const allSeries = await getAllSeries();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Firmware Management</h1>
      <Tabs defaultValue="firmware">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="firmware">Add Firmware</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="series">Series</TabsTrigger>
        </TabsList>
        <TabsContent value="firmware">
          <Card>
            <CardHeader>
              <CardTitle>Add New Firmware</CardTitle>
              <CardDescription>
                Fill out the form below to add a new firmware to the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FirmwareForm brands={brands} allSeries={allSeries} />
            </CardContent>
          </Card>
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
