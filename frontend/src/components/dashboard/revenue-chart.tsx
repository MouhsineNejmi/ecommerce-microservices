import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface RevenueChartProps {
  data: { name: string; revenue: number }[];
  loading?: boolean;
}

export const RevenueChart = ({ data, loading = false }: RevenueChartProps) => {
  if (loading) {
    return <div>Loading chart...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-[200px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data}>
              <XAxis dataKey='name' stroke='#888888' fontSize={12} />
              <YAxis
                stroke='#888888'
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  'Revenue',
                ]}
              />
              <Line
                type='monotone'
                dataKey='revenue'
                stroke='hsl(var(--primary))'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
