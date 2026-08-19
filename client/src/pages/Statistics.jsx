import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileDown, FileSpreadsheet } from "lucide-react";

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

        name: `T${index + 1}`,

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


  const periodLabel =
    {
      all: "Semua Waktu",
      today: "Hari Ini",
      "7": "7 Hari Terakhir",
      "30": "30 Hari Terakhir",
    }[filter] || "Semua Waktu";


  /* =========================
     EXPORT PDF & EXCEL
  ========================= */

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Laporan Statistik Penjualan", 14, 18);

    doc.setFontSize(11);
    doc.text(`Periode : ${periodLabel}`, 14, 26);
    doc.text(
      `Tanggal Cetak : ${new Date().toLocaleString("id-ID")}`,
      14,
      32
    );

    autoTable(doc, {

      startY: 40,

      head: [["Ringkasan", "Nilai"]],

      body: [
        ["Pendapatan", `Rp${totalIncome.toLocaleString("id-ID")}`],
        ["Total Transaksi", `${totalTransaction}`],
        ["Produk Terjual", `${totalItemSold} pcs`],
        ["Rata-rata / Transaksi", `Rp${Math.round(averageTransaction).toLocaleString("id-ID")}`],
        ["Produk Terlaris", bestSeller ? `${bestSeller[0]} (${bestSeller[1]} pcs)` : "-"],
      ],

      styles: { fontSize: 10 },

      headStyles: { fillColor: [5, 150, 105] },

    });

    autoTable(doc, {

      startY: doc.lastAutoTable.finalY + 10,

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
        "Produk": name,
        "Jumlah Terjual": qty,
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
      label: "Semua",
    },
    {
      value: "today",
      label: "Hari Ini",
    },
    {
      value: "7",
      label: "7 Hari",
    },
    {
      value: "30",
      label: "30 Hari",
    },
  ];


  return (

    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}

      <div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              Statistik
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Ringkasan seluruh penjualan.
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
            >
              <FileDown size={18} />
              Export PDF
            </button>

            <button
              onClick={downloadExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>

          </div>

        </div>


        {/* FILTER */}

        <div className="flex gap-2 sm:gap-3 mt-5 flex-wrap">

          {filters.map((item) => (

            <button
              key={item.value}
              onClick={() =>
                setFilter(item.value)
              }
              className={`
                px-3
                sm:px-4
                py-2
                text-sm
                sm:text-base
                rounded-xl
                transition
                ${
                  filter === item.value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-200 hover:bg-gray-300"
                }
              `}
            >

              {item.label}

            </button>

          ))}

        </div>

      </div>


      {/* =========================
          STATISTIK CARD
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-5
          gap-4
          sm:gap-5
          lg:gap-6
        "
      >

        {/* Pendapatan */}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">

          <p className="text-gray-500 text-sm">
            Pendapatan
          </p>

          <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold text-emerald-600 mt-2 truncate">

            Rp
            {totalIncome.toLocaleString(
              "id-ID"
            )}

          </h2>

        </div>


        {/* Total Transaksi */}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">

          <p className="text-gray-500 text-sm">
            Total Transaksi
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mt-2">

            {totalTransaction}

          </h2>

        </div>


        {/* Produk Terjual */}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">

          <p className="text-gray-500 text-sm">
            Produk Terjual
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mt-2">

            {totalItemSold}

          </h2>

        </div>


        {/* Rata-rata */}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">

          <p className="text-gray-500 text-sm">
            Rata-rata
          </p>

          <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold mt-2 truncate">

            Rp
            {Math.round(
              averageTransaction
            ).toLocaleString("id-ID")}

          </h2>

        </div>


        {/* Produk Terlaris */}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">

          <p className="text-gray-500 text-sm">
            Produk Terlaris
          </p>

          {bestSeller ? (

            <>

              <h2 className="text-xl sm:text-2xl font-bold mt-2 truncate">

                {bestSeller[0]}

              </h2>

              <p className="text-sm text-emerald-600 mt-2">

                Terjual {bestSeller[1]} pcs

              </p>

            </>

          ) : (

            <p className="mt-3 text-sm text-gray-400">

              Belum ada penjualan

            </p>

          )}

        </div>

      </div>


      {/* =========================
          CHART
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-4
          sm:gap-6
        "
      >

        {/* Grafik Pendapatan */}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">

          <h2 className="text-lg sm:text-xl font-bold mb-5">
            Grafik Pendapatan
          </h2>

          {chartData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  fontSize={12}
                />

                <YAxis
                  fontSize={11}
                />

                <Tooltip
                  formatter={(value) =>
                    `Rp${Number(
                      value
                    ).toLocaleString("id-ID")}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          ) : (

            <div className="h-[280px] flex items-center justify-center text-gray-400">

              Belum ada data penjualan

            </div>

          )}

        </div>


        {/* Produk Terlaris */}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">

          <h2 className="text-lg sm:text-xl font-bold mb-5">
            Produk Terlaris
          </h2>

          {productChart.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <BarChart
                data={productChart}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 20,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  fontSize={11}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />

                <YAxis
                  fontSize={11}
                />

                <Tooltip
                  formatter={(value) =>
                    `${value} pcs`
                  }
                />

                <Bar
                  dataKey="qty"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div className="h-[280px] flex items-center justify-center text-gray-400">

              Belum ada data produk terjual

            </div>

          )}

        </div>

      </div>

    </div>

  );

}