

'use client';

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileUp,
  Megaphone,
  CircleDollarSign,
  Settings,
  User,
  Database,
  Sprout,
  Wrench,
  SearchCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/submissions', label: 'Submissions', icon: FileUp },
  { href: '/admin/firmware', label: 'Firmware', icon: Database },
  { href: '/admin/tools', label: 'Tools', icon: Wrench },
  { href: '/admin/announcement', label: 'Announcement', icon: Megaphone },
  { href: '/admin/ads', label: 'Ads', icon: CircleDollarSign },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/seed', label: 'Seed Data', icon: Sprout },
  { href: '/admin/seo-report', label: 'AI SEO Report', icon: SearchCheck },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                  >
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Admin</span>
            </div>
            <Link href="/admin/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
