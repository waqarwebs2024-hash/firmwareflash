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
  import { format } from 'date-fns';
  
  
  export default async function SubmissionsPage() {
    const submissions = [];
  
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
                    {submissions.map((sub: any) => (
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
  