'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentReservations } from '@/components/dashboard/recent-reservations';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const DashboardClient = () => {
  const { stats, reservations, monthlyRevenue, loading, error } =
    useDashboardData();

  if (error) {
    return <div className='p-6 text-red-500'>{error}</div>;
  }

  return (
    <main className='flex-1 p-6 space-y-6'>
      <StatsCards stats={stats} loading={loading} />
      <div className='grid gap-6 md:grid-cols-2'>
        <RevenueChart data={monthlyRevenue} loading={loading} />
        <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Link href='/office/listings' className='underline text-primary'>
              Add New Listing
            </Link>
            <Link
              href='/office/reservations'
              className='underline text-primary'
            >
              View All Reservations
            </Link>
          </CardContent>
        </Card>
      </div>
      <RecentReservations reservations={reservations} loading={loading} />
    </main>
  );
};
