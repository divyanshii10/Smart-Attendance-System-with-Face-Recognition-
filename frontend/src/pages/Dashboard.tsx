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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
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
          <h1 className="text-3xl text-[#E5E7EB] font-bold">
            Dashboard
          </h1>
          <p className="text-[#9CA3AF] mt-1">
            Real-time attendance monitoring system
          </p>
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
          icon={<Users className="w-6 h-6 text-[#4F46E5]" />}
          color="blue"
        />
        <StatCard
          title="Present Today"
          value={stats?.todayPresent || 0}
          icon={<UserCheck className="w-6 h-6 text-[#10B981]" />}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Absent Today"
          value={stats?.todayAbsent || 0}
          icon={<UserX className="w-6 h-6 text-[#EF4444]" />}
          color="red"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendancePercentage || 0}%`}
          icon={<TrendingUp className="w-6 h-6 text-[#4F46E5]" />}
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

            <div className="p-4 card-ui">
              <div className="flex justify-between">
                <span className="text-sm text-[#9CA3AF]">
                  Average Attendance
                </span>
                <span className="text-xl font-bold text-[#E5E7EB]">
                  87%
                </span>
              </div>
            </div>

            <div className="p-4 card-ui">
              <div className="flex justify-between">
                <span className="text-sm text-[#9CA3AF]">
                  Perfect Attendance
                </span>
                <span className="text-xl font-bold text-[#E5E7EB]">
                  45
                </span>
              </div>
            </div>

          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-4">

            {[
              { name: 'Rahul Sharma', action: 'marked present', time: '2 mins ago' },
              { name: 'Priya Patel', action: 'marked present', time: '5 mins ago' },
              { name: 'Amit Kumar', action: 'marked present', time: '8 mins ago' },
              { name: 'Sneha Reddy', action: 'marked present', time: '12 mins ago' },
            ].map((activity, index) => (

              <div
                key={index}
                className="
          flex items-center justify-between
          p-4
          card-ui
        "
              >

                {/* Left Side */}
                <div className="flex items-center space-x-3">

                  {/* Avatar */}
                  <div className="
            w-10 h-10
            bg-[#4F46E5]/15
            text-[#4F46E5]
            rounded-full
            flex items-center justify-center
            font-semibold
            text-sm
          ">
                    {activity.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-sm font-medium text-[#E5E7EB]">
                      {activity.name}
                    </p>

                    <p className="text-xs text-[#9CA3AF]">
                      {activity.action}
                    </p>
                  </div>

                </div>

                {/* Time */}
                <span className="text-xs text-[#6B7280]">
                  {activity.time}
                </span>

              </div>

            ))}

          </div>
        </Card>

        <Card title="Department Attendance">

          <div className="space-y-6">

            {[
              { name: 'Computer Science', percentage: 92 },
              { name: 'Electronics', percentage: 88 },
              { name: 'Mechanical', percentage: 85 },
              { name: 'Civil', percentage: 79 },
            ].map((dept, index) => (

              <div key={index}>

                {/* Header */}
                <div className="flex items-center justify-between mb-2">

                  <span className="text-sm font-medium text-[#E5E7EB]">
                    {dept.name}
                  </span>

                  <span className="text-sm font-semibold text-[#9CA3AF]">
                    {dept.percentage}%
                  </span>

                </div>

                {/* Track */}
                <div className="
          w-full
          h-2
          rounded-full
          bg-white/10
          overflow-hidden
        ">

                  {/* Fill */}
                  <div
                    className="h-2 rounded-full bg-[#4F46E5] transition-all duration-500"
                    style={{ width: `${dept.percentage}%` }}
                  />

                </div>

              </div>

            ))}

          </div>

        </Card>
      </div>
    </div>
  );
};
