import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function Statistics() {
  const { history } = useProducts();

  const [filter, setFilter] = useState("7");

  const filteredHistory = history.filter((trx) => {
    if (filter === "all") return true;

    const trxDate = new Date(trx.createdAt);
    const now = new Date();

    if (filter === "today") {
      return (
        trxDate.getDate() === now.getDate() &&
        trxDate.getMonth() === now.getMonth() &&
        trxDate.getFullYear() === now.getFullYear()
      );
    }

    const diff =
      (now - trxDate) /
      (1000 * 60 * 60 * 24);

    if (filter === "7") return diff <= 7;

    if (filter === "30") return diff <= 30;

    return true;
  });

  const totalIncome = filteredHistory.reduce(
    (sum, trx) => sum + trx.total,
    0
  );

  const totalTransaction = filteredHistory.length;

  const totalItemSold = filteredHistory.reduce(
    (sum, trx) =>
      sum +
      trx.items.reduce(
        (itemTotal, item) => itemTotal + item.qty,
        0
      ),
    0
  );

  const averageTransaction =
    totalTransaction > 0
      ? totalIncome / totalTransaction
      : 0;

  const soldProducts = {};

  filteredHistory.forEach((trx) => {
    trx.items.forEach((item) => {
      if (!soldProducts[item.name]) {
        soldProducts[item.name] = 0;
      }

      soldProducts[item.name] += item.qty;
    });
  });

  const bestSeller = Object.entries(soldProducts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const chartData = filteredHistory.map(
    (trx, index) => ({
      name: `T${index + 1}`,
      total: trx.total,
    })
  );

  const productChart = Object.entries(
    soldProducts
  ).map(([name, qty]) => ({
    name,
    qty,
  }));

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Statistik
        </h1>

        <p className="text-gray-500 mt-1">
          Ringkasan seluruh penjualan.
        </p>

        <div className="flex gap-3 mt-5 flex-wrap">

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl ${
              filter === "all"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Semua
          </button>

          <button
            onClick={() => setFilter("today")}
            className={`px-4 py-2 rounded-xl ${
              filter === "today"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Hari Ini
          </button>

          <button
            onClick={() => setFilter("7")}
            className={`px-4 py-2 rounded-xl ${
              filter === "7"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            7 Hari
          </button>

          <button
            onClick={() => setFilter("30")}
            className={`px-4 py-2 rounded-xl ${
              filter === "30"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            30 Hari
          </button>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Pendapatan
          </p>

          <h2 className="text-3xl font-bold text-emerald-600 mt-2">
            Rp{totalIncome.toLocaleString("id-ID")}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Total Transaksi
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalTransaction}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Produk Terjual
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalItemSold}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Rata-rata
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Rp{Math.round(
              averageTransaction
            ).toLocaleString("id-ID")}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <p className="text-gray-500">
            Produk Terlaris
          </p>

          {bestSeller ? (
            <>
              <h2 className="text-3xl font-bold mt-2">
                {bestSeller[0]}
              </h2>

              <p className="text-emerald-600 mt-2">
                Terjual {bestSeller[1]} pcs
              </p>
            </>
          ) : (
            <p className="mt-3 text-gray-400">
              Belum ada penjualan
            </p>
          )}

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold mb-5">
            Grafik Pendapatan
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <LineChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#10b981"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold mb-5">
            Produk Terlaris
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart data={productChart}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="qty"
                fill="#10b981"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}
