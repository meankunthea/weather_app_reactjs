import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GaugeChart({ value, max = 100, label = 'Value', color = '#f59e0b' }) {
  const safeValue = Math.min(Math.max(value || 0, 0), max);
  const remaining = max - safeValue;

  const chartData = {
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [safeValue, remaining],
        backgroundColor: [color, 'rgba(200, 200, 200, 0.2)'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: '75%',
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Doughnut data={chartData} options={options} />
      <div className="mt-4 text-center">
        <p className="text-3xl font-bold text-gray-800">{Math.round(safeValue)}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
