
import { getContactMessages, getDonations } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default async function MessagesPage() {
  const [contacts, donations] = await Promise.all([
    getContactMessages(),
    getDonations(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages & Donations</h1>
      <Tabs defaultValue="contact">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact Messages</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
        </TabsList>
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>Messages sent through the contact page.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="hidden sm:table-cell whitespace-nowrap">{format(contact.createdAt.toDate(), 'PPP p')}</TableCell>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell className="max-w-xs break-words">{contact.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {contacts.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    No contact messages yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Donations</CardTitle>
              <CardDescription>A log of all donations received.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="hidden sm:table-cell whitespace-nowrap">{format(donation.createdAt.toDate(), 'PPP p')}</TableCell>
                        <TableCell className="font-medium">{donation.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">${donation.amount.toFixed(2)}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs break-words">{donation.message || 'No message.'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {donations.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    No donations received yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
