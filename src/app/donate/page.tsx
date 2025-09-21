
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { saveDonationAction } from "@/lib/actions";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, Heart } from "lucide-react";

const donationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
    amount: z.coerce.number().min(1, "Donation amount must be at least $1."),
    message: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

export default function DonatePage() {
    const [submitted, setSubmitted] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<DonationFormValues>({
        resolver: zodResolver(donationSchema),
        defaultValues: { name: "", email: "", message: "", amount: 10 }
    });

    const onSubmit: SubmitHandler<DonationFormValues> = (data) => {
        startTransition(async () => {
            try {
                await saveDonationAction(data);
                setSubmitted(true);
            } catch (error) {
                console.error("Failed to save donation:", error);
                alert("There was an error processing your donation. Please try again.");
            }
        });
    };

    return (
        <>
            <div className="container mx-auto py-12 px-4">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="text-center">
                        <Heart className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <CardTitle className="text-3xl">Support firmwareflash.com</CardTitle>
                        <CardDescription>
                            Your contribution helps us maintain our servers and expand our firmware library. Thank you for your support!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {submitted ? (
                            <div className="text-center py-8">
                                <h3 className="text-2xl font-bold text-primary">Thank You for Your Donation!</h3>
                                <p className="text-muted-foreground">Your generosity helps keep this project alive.</p>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <FormControl>
                                                        <Input id="name" placeholder="John Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label htmlFor="email">Email (Optional)</Label>
                                                    <FormControl>
                                                        <Input id="email" type="email" placeholder="your@email.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label htmlFor="amount">Amount (USD)</Label>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                                                        <Input id="amount" type="number" placeholder="10" {...field} className="pl-7" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label htmlFor="message">Message (Optional)</Label>
                                                <FormControl>
                                                    <Textarea id="message" placeholder="A friendly message..." rows={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" variant="accent" size="lg" disabled={isPending}>
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isPending ? 'Processing...' : 'Donate Now'}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
