import { useProducts } from "../context/ProductContext";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import InvoiceModal from "../components/invoice/InvoiceModal";
import VoidModal from "../components/invoice/VoidModal";
import DashboardCard from "../components/dashboard/DashboardCard";

import {
  FileDown,
  FileSpreadsheet,
  Receipt,
  Wallet,
  TrendingUp,
  Undo2,
} from "lucide-react";

const paymentMethods = [
  "Semua",
  "Tunai",
  "QRIS",
  "Debit",
  "Transfer",
  "E-Wallet",
];

export default function History() {

  const { history, voidTransaction } = useProducts();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("Semua");
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [voidTarget, setVoidTarget] = useState(null);

  const handleConfirmVoid = async () => {

    if (!voidTarget) return;

    await voidTransaction(voidTarget.id);

    setVoidTarget(null);

  };

  const filteredHistory = history.filter((trx) => {

  const keyword = search.toLowerCase();

  // Filter search (invoice atau nama produk)
  const matchSearch =
    !keyword ||
    trx.invoice?.toLowerCase().includes(keyword) ||
    trx.items.some((item) =>
      item.name.toLowerCase().includes(keyword)
    );

  if (!matchSearch) return false;

  // Filter metode pembayaran
  const matchMethod =
    methodFilter === "Semua" ||
    trx.paymentMethod === methodFilter;

  if (!matchMethod) return false;

  // Tidak ada filter tanggal
  if (filter === "all") return true;

  // Ambil waktu transaksi
  const trxDate = new Date(trx.createdAt || trx.date);

  // Kalau tanggal tidak valid
  if (isNaN(trxDate.getTime())) return false;

  const now = new Date();

  // Filter Hari Ini
  if (filter === "today") {

    return (
      trxDate.getDate() === now.getDate() &&
      trxDate.getMonth() === now.getMonth() &&
      trxDate.getFullYear() === now.getFullYear()
    );

  }

  // Selisih hari
  const diff =
    (now.getTime() - trxDate.getTime()) /
    (1000 * 60 * 60 * 24);

  // Filter 7 Hari
  if (filter === "week") {

    return diff >= 0 && diff <= 7;

  }

  // Filter 30 Hari
  if (filter === "month") {

    return diff >= 0 && diff <= 30;

  }

  return true;

});

  /* =========================
     RINGKASAN
  ========================= */

  const activeHistory = filteredHistory.filter(
    (trx) => trx.status !== "void"
  );

  const totalTransactions = activeHistory.length;

  const totalRevenue = activeHistory.reduce(
    (sum, trx) => sum + Number(trx.total || 0),
    0
  );

  const avgTransaction =
    totalTransactions > 0
      ? Math.round(totalRevenue / totalTransactions)
      : 0;

  const downloadPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Laporan Penjualan", 14, 18);

  doc.setFontSize(11);
  doc.text(
    `Tanggal Cetak : ${new Date().toLocaleString("id-ID")}`,
    14,
    26
  );

  const rows = [];

  activeHistory.forEach((trx) => {

    trx.items.forEach((item) => {

      rows.push([
        trx.invoice,
        item.name,
        item.qty,
        `Rp${item.price.toLocaleString("id-ID")}`,
        `Rp${(item.price * item.qty).toLocaleString("id-ID")}`,
        trx.paymentMethod || "-",
        trx.date,
      ]);

    });

  });

  autoTable(doc, {

    startY: 35,

    head: [[
      "Invoice",
      "Produk",
      "Qty",
      "Harga",
      "Subtotal",
      "Metode",
      "Tanggal",
    ]],

    body: rows,

    styles: { fontSize: 9 },

  });

  const total = activeHistory.reduce(

    (sum, trx) => sum + Number(trx.total || 0),

    0

  );

  doc.text(

    `Total Pendapatan : Rp${total.toLocaleString("id-ID")}`,

    14,

    doc.lastAutoTable.finalY + 15

  );

  doc.save("Laporan-Penjualan.pdf");

};

const downloadExcel = () => {

  const data = [];

  activeHistory.forEach((trx) => {

    trx.items.forEach((item) => {

      data.push({

        "Invoice": trx.invoice,
        "Produk": item.name,
        "Qty": item.qty,
        "Harga": item.price,
        "Subtotal Item": item.price * item.qty,
        "Metode Pembayaran": trx.paymentMethod || "-",
        "Diskon": trx.discountAmount || 0,
        "Pajak": trx.taxAmount || 0,
        "Total Transaksi": trx.total,
        "Dibayar": trx.paid ?? "-",
        "Kembalian": trx.change ?? "-",
        "Tanggal": trx.date,

      });

    });

  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Riwayat"
  );

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

  saveAs(file, "Laporan-Penjualan.xlsx");

};

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center flex-wrap gap-3">

        <h1 className="text-3xl font-bold">
         Riwayat Transaksi
        </h1>

      <div className="flex gap-3">

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
        >
          <FileDown size={18}/>
          Export PDF
        </button>

        <button
          onClick={downloadExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
        >
          <FileSpreadsheet size={18}/>
          Export Excel
        </button>

      </div>
      </div>

      {/* Ringkasan */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

        <DashboardCard
          title="Total Transaksi"
          value={totalTransactions}
          icon={Receipt}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Total Pendapatan"
          value={`Rp${totalRevenue.toLocaleString("id-ID")}`}
          icon={Wallet}
          color="bg-emerald-600"
        />

        <DashboardCard
          title="Rata-rata / Transaksi"
          value={`Rp${avgTransaction.toLocaleString("id-ID")}`}
          icon={TrendingUp}
          color="bg-purple-600"
        />

      </div>

      <input
        type="text"
        placeholder="Cari invoice atau nama produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-xl p-3"
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

        <div className="flex gap-3 flex-wrap">

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
            onClick={() => setFilter("week")}
            className={`px-4 py-2 rounded-xl ${
              filter === "week"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            7 Hari
          </button>

          <button
            onClick={() => setFilter("month")}
            className={`px-4 py-2 rounded-xl ${
              filter === "month"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200"
            }`}
          >
            30 Hari
          </button>

        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="border rounded-xl px-4 py-2 sm:w-56"
        >

          {paymentMethods.map((method) => (

            <option key={method} value={method}>
              {method === "Semua" ? "Semua Metode" : method}
            </option>

          ))}

        </select>

      </div>

      {
        filteredHistory.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            Tidak ada transaksi.
          </div>

        ) : (

          filteredHistory.map((trx) => {

            const subtotal = trx.subtotal ?? trx.total;
            const discountAmount = trx.discountAmount ?? 0;
            const taxAmount = trx.taxAmount ?? 0;
            const isVoid = trx.status === "void";

            return (

              <div
                key={trx.id}
                className={`bg-white rounded-xl shadow p-5 ${
                  isVoid ? "opacity-60" : ""
                }`}
              >

                <div className="flex justify-between items-start flex-wrap gap-2">

                  <div>

                    <h2 className="font-bold">
                      {trx.invoice}
                    </h2>

                    <span className="text-gray-500 text-sm">
                      {trx.date}
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    {isVoid && (
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                        Dibatalkan
                      </span>
                    )}

                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      {trx.paymentMethod || "Tunai"}
                    </span>

                  </div>

                </div>

                <div className="mt-4 space-y-2">

                  {

                    trx.items.map((item) => (

                      <div
                        key={item.id}
                        className="flex justify-between"
                      >

                        <span>
                          {item.name} × {item.qty}
                        </span>

                        <span>
                          Rp{(item.price * item.qty).toLocaleString("id-ID")}
                        </span>

                      </div>

                    ))

                  }

                </div>

                <hr className="my-4" />

                <div className="space-y-1.5">

                  {discountAmount > 0 && (

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>Rp{subtotal.toLocaleString("id-ID")}</span>
                    </div>

                  )}

                  {discountAmount > 0 && (

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Diskon</span>
                      <span className="text-red-500">
                        -Rp{discountAmount.toLocaleString("id-ID")}
                      </span>
                    </div>

                  )}

                  {taxAmount > 0 && (

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Pajak</span>
                      <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
                    </div>

                  )}

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      Rp{trx.total.toLocaleString("id-ID")}
                    </span>
                  </div>

                </div>

                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() => setSelectedTrx(trx)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                  >
                    <Receipt size={16} />
                    Lihat Struk
                  </button>

                  {!isVoid && (

                    <button
                      onClick={() => setVoidTarget(trx)}
                      className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg"
                    >
                      <Undo2 size={16} />
                      Batalkan Transaksi
                    </button>

                  )}

                </div>

              </div>

            );

          })

        )

      }

      <InvoiceModal
        open={selectedTrx !== null}
        onClose={() => setSelectedTrx(null)}
        cart={selectedTrx?.items || []}
        subtotal={selectedTrx?.subtotal ?? selectedTrx?.total ?? 0}
        discountAmount={selectedTrx?.discountAmount ?? 0}
        taxAmount={selectedTrx?.taxAmount ?? 0}
        total={selectedTrx?.total ?? 0}
        paymentMethod={selectedTrx?.paymentMethod ?? "Tunai"}
        paid={selectedTrx?.paid ?? selectedTrx?.total ?? 0}
        change={selectedTrx?.change ?? 0}
        invoice={selectedTrx?.invoice ?? ""}
      />

      <VoidModal
        open={voidTarget !== null}
        onClose={() => setVoidTarget(null)}
        onConfirm={handleConfirmVoid}
        invoice={voidTarget?.invoice ?? ""}
      />

    </div>

  );

}