import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FileDown,
  FileSpreadsheet,
  TrendingUp,
  Receipt,
  Boxes,
  Award,
  DollarSign,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";

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

    if (trx.status === "void") return false;

    if (filter === "all") return true;

    const trxDate = trx.createdAt ? new Date(trx.createdAt) : new Date();

    if (isNaN(trxDate.getTime())) return false;

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

    if (filter === "7") return diff >= 0 && diff <= 7;

    if (filter === "30") return diff >= 0 && diff <= 30;

    return true;

  });


  /* =========================
     RINGKASAN DATA
  ========================= */

  const totalIncome = filteredHistory.reduce(
    (sum, trx) =>
      sum + Number(trx.total || 0),
    0
  );

  const totalTransaction =
    filteredHistory.length;

  const totalItemSold =
    filteredHistory.reduce(
      (sum, trx) => {

        const totalItem =
          (trx.items || []).reduce(
            (itemTotal, item) =>
              itemTotal + Number(item.qty || 0),
            0
          );

        return sum + totalItem;

      },
      0
    );

  const averageTransaction =
    totalTransaction > 0
      ? totalIncome / totalTransaction
      : 0;


  /* =========================
     PRODUK TERLARIS
  ========================= */

  const soldProducts = {};

  filteredHistory.forEach((trx) => {

    (trx.items || []).forEach((item) => {

      if (!soldProducts[item.name]) {

        soldProducts[item.name] = 0;

      }

      soldProducts[item.name] +=
        Number(item.qty || 0);

    });

  });


  const sortedProducts =
    Object.entries(soldProducts).sort(
      (a, b) => b[1] - a[1]
    );


  const bestSeller =
    sortedProducts[0];


  /* =========================
     DATA CHART PENDAPATAN
  ========================= */

  const chartData =
    filteredHistory
      .slice()
      .reverse()
      .map((trx, index) => ({

        name: `Trx ${index + 1}`,

        total:
          Number(trx.total || 0),

      }));


  /* =========================
     DATA CHART PRODUK
  ========================= */

  const productChart =
    sortedProducts
      .slice(0, 8)
      .map(([name, qty]) => ({

        name,
        qty,

      }));


  /* =========================
     EXPORT PDF & EXCEL
  ========================= */

  const periodLabel =
    filter === "all"
      ? "Semua Waktu"
      : filter === "today"
      ? "Hari Ini"
      : filter === "7"
      ? "7 Hari Terakhir"
      : "30 Hari Terakhir";

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Laporan Statistik Penjualan", 14, 18);

    doc.setFontSize(11);
    doc.text(`Periode : ${periodLabel}`, 14, 26);
    doc.text(
      `Tanggal Cetak : ${new Date().toLocaleString("id-ID")}`,
      14,
      33
    );

    autoTable(doc, {

      startY: 40,

      head: [["Metrik Ringkasan", "Nilai"]],

      body: [
        ["Total Pendapatan", `Rp${totalIncome.toLocaleString("id-ID")}`],
        ["Total Transaksi", `${totalTransaction} transaksi`],
        ["Total Produk Terjual", `${totalItemSold} pcs`],
        ["Rata-rata / Transaksi", `Rp${Math.round(averageTransaction).toLocaleString("id-ID")}`],
        ["Produk Terlaris", bestSeller ? `${bestSeller[0]} (${bestSeller[1]} pcs)` : "-"],
      ],

      styles: { fontSize: 10 },

      headStyles: { fillColor: [5, 150, 105] },

    });

    autoTable(doc, {

      startY: (doc.lastAutoTable ? doc.lastAutoTable.finalY : 80) + 10,

      head: [["Produk", "Jumlah Terjual"]],

      body: sortedProducts.map(([name, qty]) => [
        name,
        `${qty} pcs`,
      ]),

      styles: { fontSize: 9 },

      headStyles: { fillColor: [5, 150, 105] },

    });

    doc.save("Laporan-Statistik.pdf");

  };

  const downloadExcel = () => {

    const summarySheet = XLSX.utils.json_to_sheet([
      { Ringkasan: "Periode", Nilai: periodLabel },
      { Ringkasan: "Pendapatan", Nilai: totalIncome },
      { Ringkasan: "Total Transaksi", Nilai: totalTransaction },
      { Ringkasan: "Produk Terjual", Nilai: totalItemSold },
      { Ringkasan: "Rata-rata / Transaksi", Nilai: Math.round(averageTransaction) },
      { Ringkasan: "Produk Terlaris", Nilai: bestSeller ? `${bestSeller[0]} (${bestSeller[1]} pcs)` : "-" },
    ]);

    const productSheet = XLSX.utils.json_to_sheet(
      sortedProducts.map(([name, qty]) => ({
        "Nama Produk": name,
        "Jumlah Terjual (pcs)": qty,
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");
    XLSX.utils.book_append_sheet(workbook, productSheet, "Produk Terlaris");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(file, "Laporan-Statistik.xlsx");

  };


  const filters = [
    {
      value: "all",
      label: "Semua Waktu",
    },
    {
      value: "today",
      label: "Hari Ini",
    },
    {
      value: "7",
      label: "7 Hari Terakhir",
    },
    {
      value: "30",
      label: "30 Hari Terakhir",
    },
  ];


  return (

    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      {/* =========================
          HEADER & ACTIONS
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Statistik Penjualan
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Analisis performa omzet, tren volume transaksi, dan produk terlaris.
          </p>

        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">

          <button
            onClick={downloadPDF}
            className="
              flex-1
              sm:flex-none
              bg-white
              hover:bg-rose-50
              text-rose-700
              border
              border-rose-200
              px-4
              py-2.5
              rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              text-xs
              sm:text-sm
              font-bold
              shadow-sm
              transition-all
              active:scale-95
            "
          >
            <FileDown size={16} />
            <span>Export PDF</span>
          </button>

          <button
            onClick={downloadExcel}
            className="
              flex-1
              sm:flex-none
              bg-white
              hover:bg-emerald-50
              text-emerald-700
              border
              border-emerald-200
              px-4
              py-2.5
              rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              text-xs
              sm:text-sm
              font-bold
              shadow-sm
              transition-all
              active:scale-95
            "
          >
            <FileSpreadsheet size={16} />
            <span>Export Excel</span>
          </button>

        </div>

      </div>


      {/* =========================
          FILTER PILLS
      ========================= */}

      <div
        className="
          flex
          items-center
          gap-2
          overflow-x-auto
          pb-1
          no-scrollbar
        "
      >

        {filters.map((item) => {
          const isActive = filter === item.value;

          return (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`
                px-4
                py-2
                rounded-2xl
                text-xs
                sm:text-sm
                font-bold
                whitespace-nowrap
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200"
                }
              `}
            >
              {item.label}
            </button>
          );
        })}

      </div>


      {/* =========================
          STATISTIK 5 CARDS
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
          gap-4
          sm:gap-5
        "
      >

        {/* Pendapatan */}
        <div className="bg-gradient-to-b from-white via-white to-emerald-50/40 rounded-3xl p-5 border border-emerald-200/80 shadow-sm border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Pendapatan
            </p>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 truncate">
            Rp{totalIncome.toLocaleString("id-ID")}
          </h2>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {periodLabel}
          </p>
        </div>

        {/* Total Transaksi */}
        <div className="bg-gradient-to-b from-white via-white to-blue-50/40 rounded-3xl p-5 border border-blue-100 shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Transaksi
            </p>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Receipt size={18} />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            {totalTransaction} <span className="text-sm font-medium text-gray-400">trx</span>
          </h2>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">
            Status sukses
          </p>
        </div>

        {/* Produk Terjual */}
        <div className="bg-gradient-to-b from-white via-white to-amber-50/40 rounded-3xl p-5 border border-amber-100 shadow-sm border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Produk Terjual
            </p>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Boxes size={18} />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            {totalItemSold} <span className="text-sm font-medium text-gray-400">pcs</span>
          </h2>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            Volume item
          </p>
        </div>

        {/* Rata-rata */}
        <div className="bg-gradient-to-b from-white via-white to-purple-50/40 rounded-3xl p-5 border border-purple-100 shadow-sm border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Rata-rata / Trx
            </p>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 truncate">
            Rp{Math.round(averageTransaction).toLocaleString("id-ID")}
          </h2>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            Basket size
          </p>
        </div>

        {/* Produk Terlaris */}
        <div className="bg-gradient-to-b from-white via-white to-rose-50/40 rounded-3xl p-5 border border-rose-100 shadow-sm border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Terlaris (Top 1)
            </p>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Award size={18} />
            </div>
          </div>
          {bestSeller ? (
            <>
              <h2 className="text-lg font-black text-gray-900 mt-2 truncate">
                {bestSeller[0]}
              </h2>
              <p className="text-[11px] text-rose-600 font-bold mt-1">
                🔥 Terjual {bestSeller[1]} pcs
              </p>
            </>
          ) : (
            <p className="mt-3 text-xs text-gray-400 font-medium">
              Belum ada penjualan
            </p>
          )}
        </div>

      </div>


      {/* =========================
          CHARTS SECTION
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        {/* Grafik Pendapatan */}

        <div
          className="
            bg-gradient-to-b
            from-white
            via-white
            to-emerald-50/20
            rounded-3xl
            shadow-sm
            border
            border-emerald-100/70
            p-5
            sm:p-7
          "
        >

          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <LineChartIcon size={18} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Tren Pendapatan Transaksi
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Pergerakan nominal penjualan per transaksi
              </p>
            </div>
          </div>

          {chartData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 15,
                  left: -15,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0fdf4"
                />

                <XAxis
                  dataKey="name"
                  fontSize={11}
                  stroke="#9ca3af"
                />

                <YAxis
                  fontSize={11}
                  stroke="#9ca3af"
                />

                <Tooltip
                  formatter={(value) =>
                    `Rp${Number(
                      value
                    ).toLocaleString("id-ID")}`
                  }
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid #d1fae5",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#059669",
                    strokeWidth: 2,
                    stroke: "#ffffff",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#047857",
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (

            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm font-medium">

              Belum ada data penjualan

            </div>

          )}

        </div>


        {/* Produk Terlaris Bar Chart */}

        <div
          className="
            bg-gradient-to-b
            from-white
            via-white
            to-emerald-50/20
            rounded-3xl
            shadow-sm
            border
            border-emerald-100/70
            p-5
            sm:p-7
          "
        >

          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Top Produk Terlaris
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Volume pcs produk yang paling diminati pembeli
              </p>
            </div>
          </div>

          {productChart.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={productChart}
                margin={{
                  top: 10,
                  right: 15,
                  left: -15,
                  bottom: 25,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0fdf4"
                />

                <XAxis
                  dataKey="name"
                  fontSize={11}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                  stroke="#9ca3af"
                />

                <YAxis
                  fontSize={11}
                  stroke="#9ca3af"
                />

                <Tooltip
                  formatter={(value) =>
                    `${value} pcs`
                  }
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "1rem",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid #d1fae5",
                  }}
                />

                <Bar
                  dataKey="qty"
                  fill="#059669"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm font-medium">

              Belum ada data produk terjual

            </div>

          )}

        </div>

      </div>

    </div>

  );

}