'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd handle form submission here (e.g., send an email or save to a database)
        setSubmitted(true);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Contact Us</CardTitle>
                    <CardDescription>Have a question or a submission? Drop us a line.</CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="text-center py-8">
                            <h3 className="text-2xl font-bold text-primary">Thank You!</h3>
                            <p className="text-muted-foreground">Your message has been sent. We'll get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Your Name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="your@email.com" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message..." required rows={6} />
                            </div>
                            <Button type="submit" className="w-full" variant="accent">
                                Send Message
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
