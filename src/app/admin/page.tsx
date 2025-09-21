import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HardDrive, FileUp, Database, MousePointerClick, Download } from 'lucide-react';
import { getTotalDownloads, getTotalFirmwares, getTodaysAnalytics } from '@/lib/data';

export default async function AdminDashboard() {

  const [totalDownloads, totalFirmwares, todaysAnalytics] = await Promise.all([
    getTotalDownloads(),
    getTotalFirmwares(),
    getTodaysAnalytics(),
  ]);

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAnalytics.visitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Unique visitors for today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAnalytics.downloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total firmware downloads today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ad Clicks Today
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAnalytics.adsClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Clicks on ad units today
            </p>
          </CardContent>
        </Card>
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
      </div>
    </div>
  );
}
