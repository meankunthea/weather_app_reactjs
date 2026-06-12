import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function HumidityChart({ humidity }) {
  const chartData = {
    labels: ["Humidity"],

    datasets: [
      {
        label: "Humidity (%)",
        data: [humidity || 0],

        backgroundColor: ["rgba(236, 72, 153, 0.8)"], // your old pink
        borderColor: ["#ec4899"],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${Math.round(context.raw)}%`,
        },
      },
    },

    scales: {
      x: {
        beginAtZero: true,
        max: 100,
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}