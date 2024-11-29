'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, CreditCard, List, Crown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

const navItems = [
  {
    title: 'Dashboard',
    href: '/office/dashboard',
    icon: LayoutGrid,
  },
  {
    title: 'Listings',
    href: '/office/listings',
    icon: Home,
  },
  {
    title: 'Categories',
    href: '/office/categories',
    icon: List,
  },
  {
    title: 'Amenities',
    href: '/office/amenities',
    icon: Crown,
  },
  {
    title: 'Reservations',
    href: '/office/reservations',
    icon: CreditCard,
  },
];

export const DashboardSidebar = ({
  className,
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible='icon' className={cn('border-r', className)}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem
                  key={item.href}
                  className={cn(
                    pathname === item.href
                      ? 'bg-purple-300 text-purple-900 rounded-md'
                      : ''
                  )}
                >
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className='gap-3'>
                      <item.icon className='size-4' />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
