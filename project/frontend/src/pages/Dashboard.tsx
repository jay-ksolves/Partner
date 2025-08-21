import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
} from 'lucide-react';
import KpiCard from '@/components/ui/KpiCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import apiClient from '@/services/api';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/dashboard/stats');
      return data;
    },
  });

  const { data: chartData } = useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: async () => {
      const { data } = await apiClient.get('/dashboard/charts');
      return data;
    },
  });

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: stats?.revenue ? `₹${stats.revenue.toLocaleString()}` : '₹0',
      icon: DollarSign,
      trend: { value: 12.5, isPositive: true, period: 'vs last month' },
      gradient: 'primary' as const,
    },
    {
      title: 'Active Partners',
      value: stats?.partners || 0,
      icon: Users,
      trend: { value: 8.2, isPositive: true, period: 'vs last month' },
      gradient: 'teal' as const,
    },
    {
      title: 'Transactions',
      value: stats?.transactions || 0,
      icon: ShoppingCart,
      trend: { value: 3.1, isPositive: false, period: 'vs last week' },
      gradient: 'sky' as const,
    },
    {
      title: 'Growth Rate',
      value: stats?.growthRate ? `${stats.growthRate}%` : '0%',
      icon: TrendingUp,
      trend: { value: 15.3, isPositive: true, period: 'vs last quarter' },
      gradient: 'rose' as const,
    },
  ];

  const COLORS = ['#A05AFF', '#1BCFB4', '#4BCBEB', '#FE9496'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <KpiCard key={index} {...card} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData?.revenue || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A05AFF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#A05AFF" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#A05AFF"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Traffic Sources
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData?.sources || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {(chartData?.sources || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {(chartData?.sources || []).map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {(stats?.recentActivity || []).map((activity: any, index: number) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;