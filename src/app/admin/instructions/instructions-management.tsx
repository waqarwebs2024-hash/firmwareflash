

'use client';
import { useState, useTransition } from 'react';
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
import { getAllInstructionsAction, saveInstructionAction, deleteInstructionAction } from '@/lib/actions';
import { FlashingInstructions } from '@/lib/types';
import { Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type InstructionsManagementProps = {
    initialInstructions: Record<string, FlashingInstructions>;
}

export default function InstructionsManagement({ initialInstructions }: InstructionsManagementProps) {
    const [instructions, setInstructions] = useState(initialInstructions);
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInstructionId, setEditingInstructionId] = useState<string | null>(null);

    const { register, control, handleSubmit, reset, watch } = useForm<FlashingInstructions & { id: string }>();

    const { fields: prereqFields, append: appendPrereq, remove: removePrereq } = useFieldArray({
        control,
        name: "prerequisites"
    });

    const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
        control,
        name: "instructions"
    });

    const fetchInstructions = () => {
        startTransition(async () => {
            const fetchedInstructions = await getAllInstructionsAction();
            setInstructions(fetchedInstructions);
        });
    };

    const handleSave = (data: FlashingInstructions & { id: string }) => {
        const { id, ...instructionData } = data;
        startTransition(async () => {
            try {
                await saveInstructionAction(id, instructionData);
                fetchInstructions();
                setIsDialogOpen(false);
            } catch (e: any) {
                alert(`Error saving instruction: ${e.message}`);
            }
        });
    };
    
    const handleDelete = (id: string) => {
        if (!confirm(`Are you sure you want to delete the instructions for "${id}"? This cannot be undone.`)) return;
        startTransition(async () => {
            try {
                await deleteInstructionAction(id);
                fetchInstructions();
            } catch (e: any) {
                alert(`Error deleting instruction: ${e.message}`);
            }
        });
    }

    const openEditDialog = (id: string, instruction: FlashingInstructions) => {
        setEditingInstructionId(id);
        reset({ id, ...instruction });
        setIsDialogOpen(true);
    };

    const openNewDialog = () => {
        setEditingInstructionId(null);
        reset({ 
            id: '', 
            introduction: '', 
            prerequisites: [''], 
            instructions: [{title: '', description: ''}],
            warning: '',
            tool: { name: '', slug: ''}
        });
        setIsDialogOpen(true);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Flashing Instructions</h1>
                <Button onClick={openNewDialog}>Add New Instruction</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>CPU Instruction Sets</CardTitle>
                    <CardDescription>Manage the step-by-step flashing instructions for different CPU types.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>CPU Type / ID</TableHead>
                                <TableHead>Primary Tool</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPending && Object.keys(instructions).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : Object.entries(instructions).map(([id, instruction]) => (
                                <TableRow key={id}>
                                    <TableCell className="font-medium">{id}</TableCell>
                                    <TableCell>{instruction.tool?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditDialog(id, instruction)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(id)} disabled={isPending}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {!isPending && Object.keys(instructions).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No instructions found in the database.
                        </div>
                    )}
                </div>
                </CardContent>
            </Card>

             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{editingInstructionId ? `Edit "${editingInstructionId}" Instructions` : 'Add New Instruction Set'}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for this instruction set. The CPU Type/ID cannot be changed after creation.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleSave)} className="flex-grow overflow-y-auto pr-6 pl-2 space-y-6">
                        {/* CPU TYPE */}
                        <div className="space-y-2">
                            <Label htmlFor="id">CPU Type / ID</Label>
                            <Input id="id" {...register('id')} placeholder="e.g., mediatek" required disabled={!!editingInstructionId} />
                            <p className="text-sm text-muted-foreground">A unique identifier (e.g., 'qualcomm', 'spd'). Cannot be changed later.</p>
                        </div>
                        {/* INTRODUCTION */}
                        <div className="space-y-2">
                            <Label htmlFor="introduction">Introduction</Label>
                            <Textarea id="introduction" {...register('introduction')} rows={4} />
                        </div>
                        {/* PREREQUISITES */}
                        <div className="space-y-4 rounded-lg border p-4">
                            <Label>Prerequisites</Label>
                            {prereqFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <Input {...register(`prerequisites.${index}` as const)} />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removePrereq(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => appendPrereq('')}>Add Prerequisite</Button>
                        </div>
                        {/* INSTRUCTIONS */}
                         <div className="space-y-4 rounded-lg border p-4">
                            <Label>Instruction Steps</Label>
                            {instructionFields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-2 p-3 border rounded-md bg-muted/50">
                                    <div className='flex justify-between items-center'>
                                       <Label className="font-semibold">Step {index + 1}</Label>
                                       <Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                    <Input placeholder="Step Title" {...register(`instructions.${index}.title` as const)} />
                                    <Textarea placeholder="Step Description" {...register(`instructions.${index}.description` as const)} />
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => appendInstruction({ title: '', description: '' })}>Add Step</Button>
                        </div>
                        {/* WARNING */}
                        <div className="space-y-2">
                            <Label htmlFor="warning">Warning</Label>
                            <Textarea id="warning" {...register('warning')} rows={3} />
                        </div>
                        {/* TOOL */}
                        <div className="space-y-4 rounded-lg border p-4">
                            <Label>Tool</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tool.name">Tool Name</Label>
                                    <Input id="tool.name" {...register('tool.name')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tool.slug">Tool Slug</Label>
                                    <Input id="tool.slug" {...register('tool.slug')} />
                                </div>
                            </div>
                        </div>
                         <DialogFooter className="sticky bottom-0 bg-background py-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Instructions
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
