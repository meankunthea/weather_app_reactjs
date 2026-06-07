import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function PolarChart() {
  const data = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [10, 20, 30],
        backgroundColor: ["red", "yellow", "blue"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: 200, height: 200 }}>
      <PolarArea data={data} options={options} />
    </div>
  );
}