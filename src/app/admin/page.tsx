
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Download } from 'lucide-react';
import { getTotalFirmwares, getTotalDownloads } from '@/lib/data';

export default async function AdminDashboard() {

  const [totalFirmwares, totalDownloads] = await Promise.all([
    getTotalFirmwares(),
    getTotalDownloads(),
  ]);

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Firmwares</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFirmwares.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              In the database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all firmware files
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
