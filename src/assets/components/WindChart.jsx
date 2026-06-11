import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function WindChart({ windspeed }) {
  const chartData = {
    labels: ['Wind Speed'],
    datasets: [
      {
        label: 'Wind Speed (km/h)',
        data: [windspeed || 0],
        backgroundColor: ['rgba(236, 72, 153, 0.8)'],
        borderColor: ['#ec4899'],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function (context) {
            return `${Math.round(context.raw)} km/h`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: Math.max(windspeed * 1.5 || 50, 50),
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
