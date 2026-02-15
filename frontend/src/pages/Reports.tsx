import { useState, useEffect } from 'react';
import { Calendar, Download, FileText, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { AttendanceChart } from '../components/charts/AttendanceChart';
import { attendanceAPI, dashboardAPI } from '../services/api';
import { formatDate, exportToCSV, getStatusColor } from '../utils/helpers';
import type { AttendanceRecord, AttendanceData } from '../types';

export const Reports = () => {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [chartData, setChartData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [startDate, endDate]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [recordsData, chartDataResult] = await Promise.all([
        attendanceAPI.getRecords(startDate, endDate),
        dashboardAPI.getWeeklyData()
      ]);
      setRecords(recordsData);
      setChartData(chartDataResult);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const exportData = records.map((record) => ({
      'Roll Number': record.rollNumber,
      'Student Name': record.studentName,
      'Date': record.date,
      'Time': record.time,
      'Status': record.status,
      'Method': record.method,
      'Confidence': record.confidence ? `${record.confidence.toFixed(2)}%` : 'N/A'
    }));
    exportToCSV(exportData, `attendance-report-${startDate}-to-${endDate}.csv`);
  };

  const columns = [
    { header: 'Date', accessor: 'date', render: (value: string) => formatDate(value) },
    { header: 'Time', accessor: 'time' },
    { header: 'Roll Number', accessor: 'rollNumber' },
    { header: 'Student Name', accessor: 'studentName' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value.toUpperCase()}
        </span>
      )
    },
    {
      header: 'Method',
      accessor: 'method',
      render: (value: string) => (
        <span className="text-xs text-gray-600 capitalize">{value.replace('_', ' ')}</span>
      )
    },
    {
      header: 'Confidence',
      accessor: 'confidence',
      render: (value: number | undefined) => (
        value ? `${value.toFixed(1)}%` : 'N/A'
      )
    }
  ];

  const totalRecords = records.length;
  const presentCount = records.filter(r => r.status === 'present').length;
  const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl white font-bold  font-tech">Reports</h1>
          <p className="text-purple-400 mt-1">Attendance analytics and reports</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Download className="w-5 h-5" />}
          onClick={handleExportCSV}
          disabled={records.length === 0}
        >
          Export CSV
        </Button>
      </div>

     <Card className="card-ui">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Start Date */}
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        Start Date
      </label>

      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="
            w-full pl-10 pr-4 py-3
            bg-[#0B1220]
            border border-white/10
            rounded-lg
            text-white
            focus:border-purple-500
            focus:ring-1 focus:ring-purple-500
            outline-none
          "
        />
      </div>
    </div>

    {/* End Date */}
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        End Date
      </label>

      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="
            w-full pl-10 pr-4 py-3
            bg-[#0B1220]
            border border-white/10
            rounded-lg
            text-white
            focus:border-purple-500
            focus:ring-1 focus:ring-purple-500
            outline-none
          "
        />
      </div>
    </div>

  </div>
</Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-ui">
  <div className="flex items-center justify-between">

    <div>
      <p className="text-sm text-gray-400">
        Total Records
      </p>

      <p className="text-3xl font-bold text-white mt-2 stat-number">
        {totalRecords}
      </p>
    </div>

    <div className="
      p-3 rounded-xl
      bg-purple-500/10
      border border-purple-500/20
    ">
      <FileText className="w-6 h-6 text-purple-400" />
    </div>

  </div>
</Card>

        <Card className="card-ui">
  <div className="flex items-center justify-between">

    <div>
      <p className="text-sm text-gray-400">
        Present Count
      </p>

      <p className="text-3xl font-bold text-green-400 mt-2 stat-number">
        {presentCount}
      </p>
    </div>

    <div className="
      p-3 rounded-xl
      bg-green-500/10
      border border-green-500/20
    ">
      <TrendingUp className="w-6 h-6 text-green-400" />
    </div>

  </div>
</Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-slate-700 mt-2">{attendanceRate}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="card-ui">

  <h3 className="text-lg font-semibold text-purple-400 mb-6">
    Attendance Trend
  </h3>

  <div className="panel-card">
    <AttendanceChart data={chartData} type="bar" />
  </div>

</Card>

      <Card className="card-ui">

  <h3 className="text-lg font-semibold text-purple-400 mb-6">
    Detailed Records
  </h3>

  {loading ? (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400"></div>
    </div>
  ) : (
    <>
      <p className="text-gray-400 text-sm mb-4">
        Showing {records.length} records from {formatDate(startDate)} to {formatDate(endDate)}
      </p>

      <div className="panel-card p-2">
        <div className="card-ui p-4 rounded-xl">
             <Table columns={columns} data={records} />
             </div>
       
      </div>
    </>
  )}

</Card>
    </div>
  );
};
