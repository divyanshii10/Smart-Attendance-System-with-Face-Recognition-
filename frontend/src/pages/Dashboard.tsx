import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard, Card } from '../components/ui/Card';
import { AttendanceChart } from '../components/charts/AttendanceChart';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { dashboardAPI } from '../services/api';
import type { DashboardStats, AttendanceData } from '../types';

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, chartData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getWeeklyData()
      ]);
      setStats(statsData);
      setWeeklyData(chartData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text font-tech">Dashboard</h1>
          <p className="text-cyan-300/70 mt-1">Real-time attendance monitoring system</p>
        </div>
        <StatusIndicator
          status="active"
          label="System Online"
          icon={<Activity className="w-4 h-4" />}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Present Today"
          value={stats?.todayPresent || 0}
          icon={<UserCheck className="w-6 h-6" />}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Absent Today"
          value={stats?.todayAbsent || 0}
          icon={<UserX className="w-6 h-6" />}
          color="red"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendancePercentage || 0}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Weekly Attendance Trend" className="lg:col-span-2">
          <AttendanceChart data={weeklyData} type="line" />
        </Card>

        <Card title="Quick Stats">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Average Attendance</span>
                <span className="text-2xl font-bold text-blue-600">87%</span>
              </div>
              <p className="text-xs text-blue-700 mt-2">Last 7 days</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Perfect Attendance</span>
                <span className="text-2xl font-bold text-green-600">45</span>
              </div>
              <p className="text-xs text-green-700 mt-2">Students this month</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-900">Below 75%</span>
                <span className="text-2xl font-bold text-yellow-600">12</span>
              </div>
              <p className="text-xs text-yellow-700 mt-2">Need attention</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-3">
            {[
              { name: 'Rahul Sharma', action: 'marked present', time: '2 mins ago', status: 'success' },
              { name: 'Priya Patel', action: 'marked present', time: '5 mins ago', status: 'success' },
              { name: 'Amit Kumar', action: 'marked present', time: '8 mins ago', status: 'success' },
              { name: 'Sneha Reddy', action: 'marked present', time: '12 mins ago', status: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {activity.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Department Attendance">
          <div className="space-y-4">
            {[
              { name: 'Computer Science', percentage: 92, color: 'bg-blue-500' },
              { name: 'Electronics', percentage: 88, color: 'bg-green-500' },
              { name: 'Mechanical', percentage: 85, color: 'bg-yellow-500' },
              { name: 'Civil', percentage: 79, color: 'bg-red-500' },
            ].map((dept, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{dept.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${dept.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
