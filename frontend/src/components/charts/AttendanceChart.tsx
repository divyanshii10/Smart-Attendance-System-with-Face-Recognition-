import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { AttendanceData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AttendanceChartProps {
  data: AttendanceData[];
  type?: 'line' | 'bar';
}

export const AttendanceChart = ({ data, type = 'line' }: AttendanceChartProps) => {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Present',
        data: data.map(d => d.present),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#4F46E5',
        pointRadius: 3,
      },
      {
        label: 'Absent',
        data: data.map(d => d.absent),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.10)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#EF4444',
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
          font: { family: 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#E5E7EB',
        bodyColor: '#9CA3AF',
        borderColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
        ticks: {
          color: '#9CA3AF',
          font: { family: 'Inter' },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: { family: 'Inter' },
        },
      },
    },
  };

  return (
    <div className="h-80">
      {type === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};
