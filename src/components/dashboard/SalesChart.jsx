import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useProducts } from "../../context/ProductContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SalesChart() {
  const { history } = useProducts();

  const salesByDay = {};

  history.forEach((trx) => {
    const date = new Date(trx.createdAt)
      .toLocaleDateString("id-ID");

    if (!salesByDay[date]) {
      salesByDay[date] = 0;
    }

    salesByDay[date] += trx.total;
  });

  const labels = Object.keys(salesByDay).reverse();

  const values = Object.values(salesByDay).reverse();

  const data = {
    labels,

    datasets: [
      {
        label: "Pendapatan",

        data: values,

        tension: 0.3,

        fill: false,

        borderWidth: 3,

        borderColor: "#10b981",
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-5">
        Grafik Penjualan
      </h2>

      <Line data={data} />
    </div>
  );
}