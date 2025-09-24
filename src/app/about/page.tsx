
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, ShieldCheck } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About firmwareflash.com',
  description: 'Learn about firmwareflash.com, our mission, our values, and the team dedicated to providing reliable and accessible firmware downloads and flash files for everyone.',
};

export default function AboutPage() {
  return (
    <>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">About firmwareflash.com</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your trusted source for official stock firmware. We're dedicated to helping you keep your devices running smoothly and securely with the correct flash file.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              firmwareflash.com was born from a simple idea: finding the correct, official firmware for a mobile device shouldn't be a scavenger hunt. Too often, users looking to repair or update their phones are faced with a confusing landscape of unreliable sources, broken links, and potentially malicious firmware or flash files. We wanted to change that.
            </p>
            <p>
              Founded by a group of mobile tech enthusiasts and developers, our mission is to create a centralized, safe, and easy-to-use platform for downloading stock ROMs. We believe everyone should have the power to restore their device to its original state, fix software issues, or simply get a fresh start without fear.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div className="flex flex-col items-center">
            <Target className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
            <p className="text-muted-foreground">
              To provide a comprehensive, secure, and user-friendly database of official firmware and flash files for the widest possible range of mobile devices, free of charge.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Our Values</h2>
            <p className="text-muted-foreground">
              We prioritize security, accessibility, and reliability. Every flash file is sourced carefully, and our guides are written to be clear and easy to follow for all skill levels.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Our Community</h2>
            <p className="text-muted-foreground">
              We are powered by a community of users who help us find and verify firmware. We are grateful for every contribution that helps us grow and support more devices.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
