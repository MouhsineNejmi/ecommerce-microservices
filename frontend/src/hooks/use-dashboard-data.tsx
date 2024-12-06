import { useState, useEffect } from 'react';
import {
  DashboardStats,
  Listing,
  Reservation,
  RevenueStats,
  User,
} from '@/types';
import { useRequest } from './use-request';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reservations, setReservations] = useState<
    Reservation<Listing, User>[]
  >([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueStats[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { execute: fetchDashboardStats } = useRequest({
    url: '/api/stats',
    method: 'get',
  });
  const { execute: fetchRecentReservations } = useRequest({
    url: '/api/stats/reservations',
    method: 'get',
  });
  const { execute: fetchMonthlyRevenue } = useRequest({
    url: '/api/stats/revenue',
    method: 'get',
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [statsData, reservationsData, revenueData] = (await Promise.all([
          fetchDashboardStats(),
          fetchRecentReservations(),
          fetchMonthlyRevenue(),
        ])) as [DashboardStats, Reservation<Listing, User>[], RevenueStats[]];

        setStats(statsData);
        setReservations(reservationsData);
        setMonthlyRevenue(revenueData);

        console.log('REVENUE DATA: ', revenueData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { stats, reservations, monthlyRevenue, loading, error };
};
