import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getBrands, getAllSeries } from '@/lib/data';
import { FirmwareForm } from './firmware-form';

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
                Upload a new firmware file directly. It will be published immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FirmwareForm brands={brands} allSeries={allSeries} />
            </CardContent>
          </Card>
          {/* We will add the table of existing firmware here later */}
        </TabsContent>
        <TabsContent value="brands">
          <Card>
            <CardHeader>
              <CardTitle>Brand Management</CardTitle>
              <CardDescription>Add, edit, or delete brands.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Brand management form and list will go here */}
              <p>Brand management coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="series">
          <Card>
            <CardHeader>
              <CardTitle>Series/Model Management</CardTitle>
              <CardDescription>Add, edit, or delete series for each brand.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Series management form and list will go here */}
              <p>Series/Model management coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
