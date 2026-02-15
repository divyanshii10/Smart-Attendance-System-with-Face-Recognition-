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
        borderColor: 'rgb(71, 85, 105)',
        backgroundColor: 'rgba(71, 85, 105, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Absent',
        data: data.map(d => d.absent),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#cbd5f5',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255,255,255,0.08)',
      },
      ticks: {
        color: '#cbd5f5',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#cbd5f5',
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
