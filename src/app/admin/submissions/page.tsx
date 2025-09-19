import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
  import { CheckCircle, XCircle } from 'lucide-react';
  import { Submission } from '@/lib/types';
  import { format } from 'date-fns';
  
  // Dummy data for now, we will replace this with Firestore data later
  const dummySubmissions: Submission[] = [
    {
      id: 'sub1',
      fileName: 'galaxy_s22_ultra_firmware.zip',
      brand: 'Samsung',
      model: 'Galaxy S22 Ultra',
      version: 'S908U1UEU2AVF7',
      size: '4.5 GB',
      fileUrl: 'https://example.com/s22u.zip',
      uploaderName: 'John Doe',
      submittedAt: new Date(2023, 10, 5),
      status: 'pending',
    },
    {
        id: 'sub2',
        fileName: 'pixel_7_pro_firmware.zip',
        brand: 'Google',
        model: 'Pixel 7 Pro',
        version: 'TP1A.220624.014',
        size: '2.1 GB',
        fileUrl: 'https://example.com/p7p.zip',
        uploaderName: 'Jane Smith',
        submittedAt: new Date(2023, 10, 4),
        status: 'pending',
    },
    {
        id: 'sub3',
        fileName: 'mi_11_lite_firmware.zip',
        brand: 'Xiaomi',
        model: 'Mi 11 Lite',
        version: 'MIUI 14.0.5.0',
        size: '3.2 GB',
        fileUrl: 'https://example.com/mi11.zip',
        uploaderName: 'Aarav Sharma',
        submittedAt: new Date(2023, 10, 3),
        status: 'pending',
    },
  ];
  
  export default async function SubmissionsPage() {
    const submissions = dummySubmissions;
  
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Firmware Submissions</h1>
        <Card>
            <CardHeader>
                <CardTitle>Pending Review</CardTitle>
                <CardDescription>Review and approve or reject new firmware submissions.</CardDescription>
            </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Brand & Model</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden lg:table-cell">Submitter</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                        <TableCell className="font-medium break-all">{sub.fileName}</TableCell>
                        <TableCell>{sub.brand} {sub.model}</TableCell>
                        <TableCell className="hidden md:table-cell">{sub.size}</TableCell>
                        <TableCell className="hidden lg:table-cell">{sub.uploaderName}</TableCell>
                        <TableCell className="hidden sm:table-cell">{format(sub.submittedAt, 'PPP')}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={sub.status === 'pending' ? 'secondary' : 'default'}>{sub.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approve
                        </Button>
                        <Button variant="outline" size="sm">
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            {submissions.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No pending submissions.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  