
'use client';
import { useState, useTransition, useEffect } from 'react';
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
import { getAllTools, addToolAction, deleteToolAction } from '@/lib/actions';
import { Tool } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ToolsAdminPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null);

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        startTransition(async () => {
            const fetchedTools = await getAllTools();
            setTools(fetchedTools);
        });
    };

    const handleSaveTool = () => {
        if (!editingTool || !editingTool.name) return;

        startTransition(async () => {
            try {
                await addToolAction(editingTool as Omit<Tool, 'id'>);
                fetchTools();
                setIsDialogOpen(false);
                setEditingTool(null);
            } catch (e: any) {
                alert(`Error saving tool: ${e.message}`);
            }
        });
    };
    
    const handleDeleteTool = (toolId: string) => {
        if (!confirm('Are you sure you want to delete this tool?')) return;
        startTransition(async () => {
            try {
                await deleteToolAction(toolId);
                fetchTools();
            } catch(e: any) {
                alert(`Error deleting tool: ${e.message}`);
            }
        });
    }

    const openEditDialog = (tool: Tool) => {
        setEditingTool(tool);
        setIsDialogOpen(true);
    };

    const openNewDialog = () => {
        setEditingTool({ name: '', description: '', downloadUrl: '' });
        setIsDialogOpen(true);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tool Management</h1>
                <Button onClick={openNewDialog}>Add New Tool</Button>
            </div>
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
                            {isPending && tools.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : tools.map((tool: Tool) => (
                                <TableRow key={tool.id}>
                                    <TableCell className="font-medium">{tool.name}</TableCell>
                                    <TableCell>{tool.id}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditDialog(tool)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTool(tool.id)} disabled={isPending}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {!isPending && tools.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No tools found. Tools are also added automatically when new flashing instructions are generated.
                        </div>
                    )}
                </div>
                </CardContent>
            </Card>

             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTool?.id ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the tool. The slug will be generated automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={editingTool?.name || ''} onChange={(e) => setEditingTool({...editingTool, name: e.target.value})} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" value={editingTool?.description || ''} onChange={(e) => setEditingTool({...editingTool, description: e.target.value})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="downloadUrl" className="text-right">Download URL</Label>
                            <Input id="downloadUrl" value={editingTool?.downloadUrl || ''} onChange={(e) => setEditingTool({...editingTool, downloadUrl: e.target.value})} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" onClick={handleSaveTool} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
