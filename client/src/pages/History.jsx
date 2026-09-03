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
  Search,
  Filter,
  CheckCircle2,
  Ban,
  Clock,
  ChevronRight,
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
    const trxDate = trx.createdAt ? new Date(trx.createdAt) : new Date();

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

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 40;

    doc.text(

      `Total Pendapatan : Rp${total.toLocaleString("id-ID")}`,

      14,

      finalY + 15

    );

    doc.save("Laporan-Penjualan.pdf");

  };

  const downloadExcel = () => {

    const summaryData = [
      { Ringkasan: "Total Transaksi", Nilai: totalTransactions },
      { Ringkasan: "Total Pendapatan", Nilai: totalRevenue },
      { Ringkasan: "Rata-rata per Transaksi", Nilai: avgTransaction },
      {},
    ];

    const detailData = [];

    activeHistory.forEach((trx) => {

      trx.items.forEach((item) => {

        detailData.push({
          "No Invoice": trx.invoice,
          "Tanggal": trx.date,
          "Nama Produk": item.name,
          "Jumlah (Qty)": item.qty,
          "Harga Satuan": item.price,
          "Subtotal": item.price * item.qty,
          "Metode Bayar": trx.paymentMethod || "-",
          "Total Tagihan": trx.total,
        });

      });

    });

    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    const detailSheet = XLSX.utils.json_to_sheet(detailData);

    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Ringkasan"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      detailSheet,
      "Rincian Transaksi"
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

    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      {/* HEADER & EXPORT */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Riwayat Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Rekap seluruh transaksi yang berhasil dan dibatalkan beserta detail struk.
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

      {/* STAT CARDS RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

        <DashboardCard
          title="Transaksi Aktif"
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

      {/* FILTER & CONTROLS */}
      <div
        className="
          bg-gradient-to-b
          from-white
          via-white
          to-emerald-50/20
          rounded-3xl
          p-4
          sm:p-6
          border
          border-emerald-100/70
          shadow-sm
          space-y-4
        "
      >
        {/* Search */}
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari berdasarkan no invoice atau nama produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-11
              pr-4
              py-3
              text-sm
              bg-gray-50/80
              border
              border-gray-200
              rounded-2xl
              focus:outline-none
              focus:bg-white
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-500/10
              transition-all
            "
          />
        </div>

        {/* Date Filter & Payment Method */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

          {/* Date Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { key: "all", label: "Semua Waktu" },
              { key: "today", label: "Hari Ini" },
              { key: "week", label: "7 Hari Terakhir" },
              { key: "month", label: "30 Hari Terakhir" },
            ].map((tab) => {
              const isActive = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`
                    px-4
                    py-2
                    rounded-2xl
                    text-xs
                    sm:text-sm
                    font-bold
                    whitespace-nowrap
                    transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-600/20"
                        : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200"
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Payment Method Select */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="
                w-full
                sm:w-52
                appearance-none
                bg-white
                border
                border-gray-200
                rounded-2xl
                pl-4
                pr-9
                py-2
                text-xs
                sm:text-sm
                font-semibold
                text-gray-700
                focus:outline-none
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                cursor-pointer
              "
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method === "Semua" ? "Semua Metode Bayar" : `Metode: ${method}`}
                </option>
              ))}
            </select>
            <Filter size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
            <Receipt size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="font-semibold text-gray-600">Tidak ada transaksi yang cocok</p>
            <p className="text-xs text-gray-400 mt-1">Coba sesuaikan filter pencarian atau tanggal</p>
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
                className={`
                  bg-gradient-to-b
                  from-white
                  via-white
                  to-emerald-50/20
                  rounded-3xl
                  border
                  ${isVoid ? "border-rose-200 bg-rose-50/20 opacity-70" : "border-emerald-100/80"}
                  shadow-sm
                  p-5
                  sm:p-6
                  hover:shadow-md
                  transition-all
                `}
              >
                {/* Header Trx */}
                <div className="flex justify-between items-start flex-wrap gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-gray-900 text-base sm:text-lg">
                        {trx.invoice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 font-medium">
                      <Clock size={13} />
                      <span>{trx.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isVoid ? (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-extrabold">
                        <Ban size={12} />
                        Dibatalkan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-extrabold">
                        <CheckCircle2 size={12} />
                        Selesai
                      </span>
                    )}

                    <span className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold">
                      {trx.paymentMethod || "Tunai"}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="py-4 space-y-2">
                  {trx.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span className="font-medium text-gray-800">
                        {item.name} <span className="text-gray-400">× {item.qty}</span>
                      </span>

                      <span className="font-semibold text-gray-900">
                        Rp{(item.price * item.qty).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation Breakdown */}
                <div className="pt-3 border-t border-gray-100 space-y-1 bg-gray-50/50 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3 rounded-2xl">
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span>Rp{subtotal.toLocaleString("id-ID")}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-rose-600 font-medium">
                      <span>Diskon</span>
                      <span>-Rp{discountAmount.toLocaleString("id-ID")}</span>
                    </div>
                  )}

                  {taxAmount > 0 && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Pajak</span>
                      <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-black text-base sm:text-lg text-gray-900 pt-1">
                    <span>Total Transaksi</span>
                    <span className="text-emerald-700">
                      Rp{trx.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2.5 mt-5">
                  <button
                    onClick={() => setSelectedTrx(trx)}
                    className="
                      flex
                      items-center
                      gap-2
                      bg-gradient-to-r
                      from-emerald-600
                      to-emerald-700
                      hover:from-emerald-700
                      hover:to-emerald-800
                      text-white
                      px-4
                      py-2.5
                      rounded-xl
                      font-bold
                      text-xs
                      sm:text-sm
                      shadow-sm
                      transition-all
                      active:scale-95
                    "
                  >
                    <Receipt size={16} />
                    <span>Lihat Struk</span>
                  </button>

                  {!isVoid && (
                    <button
                      onClick={() => setVoidTarget(trx)}
                      className="
                        flex
                        items-center
                        gap-2
                        bg-amber-50
                        hover:bg-amber-100
                        text-amber-800
                        border
                        border-amber-200
                        px-4
                        py-2.5
                        rounded-xl
                        font-bold
                        text-xs
                        sm:text-sm
                        transition-all
                        active:scale-95
                      "
                    >
                      <Undo2 size={16} />
                      <span>Batalkan Transaksi</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODALS */}
      <InvoiceModal
        key={selectedTrx ? `inv-${selectedTrx.id}` : "inv-none"}
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
        key={voidTarget ? `void-${voidTarget.id}` : "void-none"}
        open={voidTarget !== null}
        onClose={() => setVoidTarget(null)}
        onConfirm={handleConfirmVoid}
        invoice={voidTarget?.invoice ?? ""}
      />

    </div>

  );

}