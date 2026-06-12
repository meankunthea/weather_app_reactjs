import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GaugeChart({ value, max = 10, label = 'Value', color = '#f59e0b' }) {
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
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-4xl font-bold ">{Math.round(safeValue)}</p>
        <p className="text-sm t">{label}</p>
      </div>
      <div className="h-full w-full">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
