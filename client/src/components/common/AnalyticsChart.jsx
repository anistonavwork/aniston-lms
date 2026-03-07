import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

/* =========================
   REGISTER CHART MODULES
========================= */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = ({ title, labels, data }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AnalyticsChart;