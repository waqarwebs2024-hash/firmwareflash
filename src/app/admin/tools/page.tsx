
import { getAllTools } from '@/lib/data';
import { Tool } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function ToolsAdminPage() {
    const tools = await getAllTools();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tool Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Available Tools</CardTitle>
                    <CardDescription>These are the tools that are linked to from the flashing instructions.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tool Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tools.map((tool: Tool) => (
                                <TableRow key={tool.id}>
                                    <TableCell className="font-medium">{tool.name}</TableCell>
                                    <TableCell>{tool.id}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" disabled>Edit Content</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {tools.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No tools found. Tools are added automatically when new flashing instructions are generated.
                        </div>
                    )}
                </div>
                </CardContent>
            </Card>
        </div>
    );
}
