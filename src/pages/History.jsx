// src/pages/History.jsx
import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Eye, FileDown, FileSpreadsheet, Search } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import InvoiceModal from "../components/invoice/InvoiceModal";

const formatRupiah = (amount) =>
  `Rp${Number(amount || 0).toLocaleString("id-ID")}`;

export default function History() {
  const { history } = useProducts();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredHistory = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const now = new Date();

    return history.filter((transaction) => {
      const searchableText = [
        transaction.invoice,
        transaction.cashier,
        transaction.paymentMethod,
        ...(transaction.items || []).map((item) => item.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (keyword && !searchableText.includes(keyword)) return false;
      if (filter === "all") return true;

      const transactionDate = new Date(
        transaction.createdAt || transaction.date
      );

      if (Number.isNaN(transactionDate.getTime())) return false;

      if (filter === "today") {
        return transactionDate.toDateString() === now.toDateString();
      }

      const dayDifference =
        (now.getTime() - transactionDate.getTime()) / 86_400_000;

      return (
        dayDifference >= 0 &&
        dayDifference <= (filter === "week" ? 7 : 30)
      );
    });
  }, [filter, history, search]);

  const downloadTransactionPDF = (transaction) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("INVOICE", 14, 18);

    doc.setFontSize(10);
    doc.text(`Invoice: ${transaction.invoice}`, 14, 27);
    doc.text(`Tanggal: ${transaction.date}`, 14, 33);
    doc.text(`Kasir: ${transaction.cashier || "Admin"}`, 14, 39);
    doc.text(`Pembayaran: ${transaction.paymentMethod}`, 14, 45);

    autoTable(doc, {
      startY: 52,
      head: [["Produk", "Qty", "Harga", "Subtotal"]],
      body: (transaction.items || []).map((item) => [
        item.name,
        item.qty,
        formatRupiah(item.price),
        formatRupiah(item.price * item.qty),
      ]),
      theme: "grid",
      headStyles: { fillColor: [5, 150, 105] },
      styles: { fontSize: 9 },
    });

    const y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(11);
    doc.text(`Total: ${formatRupiah(transaction.total)}`, 14, y);
    doc.text(
      `Dibayar: ${formatRupiah(
        transaction.paidAmount ?? transaction.total
      )}`,
      14,
      y + 7
    );
    doc.text(
      `Kembalian: ${formatRupiah(transaction.change)}`,
      14,
      y + 14
    );

    doc.save(`${transaction.invoice}.pdf`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Laporan Penjualan", 14, 18);

    doc.setFontSize(10);
    doc.text(
      `Tanggal cetak: ${new Date().toLocaleString("id-ID")}`,
      14,
      25
    );

    const rows = filteredHistory.flatMap((transaction) =>
      (transaction.items || []).map((item) => [
        transaction.invoice,
        item.name,
        item.qty,
        formatRupiah(item.price),
        formatRupiah(item.price * item.qty),
        transaction.date,
      ])
    );

    autoTable(doc, {
      startY: 32,
      head: [["Invoice", "Produk", "Qty", "Harga", "Subtotal", "Tanggal"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [5, 150, 105] },
    });

    const total = filteredHistory.reduce(
      (sum, transaction) => sum + Number(transaction.total || 0),
      0
    );

    doc.setFontSize(11);
    doc.text(
      `Total pendapatan: ${formatRupiah(total)}`,
      14,
      doc.lastAutoTable.finalY + 12
    );

    doc.save("Laporan-Penjualan.pdf");
  };

  const downloadExcel = () => {
    const rows = filteredHistory.flatMap((transaction) =>
      (transaction.items || []).map((item) => ({
        Invoice: transaction.invoice,
        Kasir: transaction.cashier || "Admin",
        Produk: item.name,
        Qty: item.qty,
        Harga: item.price,
        Subtotal: item.price * item.qty,
        "Metode Pembayaran": transaction.paymentMethod,
        Tanggal: transaction.date,
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(rows),
      "Riwayat"
    );

    const file = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(file, "Laporan-Penjualan.xlsx");
  };

  const filterOptions = [
    ["all", "Semua"],
    ["today", "Hari ini"],
    ["week", "7 hari"],
    ["month", "30 hari"],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Riwayat Transaksi
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {filteredHistory.length} transaksi ditemukan
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            <FileDown size={17} />
            Export PDF
          </button>

          <button
            type="button"
            onClick={downloadExcel}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            <FileSpreadsheet size={17} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={19}
          />

          <input
            type="search"
            placeholder="Cari invoice, produk, kasir, atau metode bayar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filterOptions.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                filter === value
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">
          Tidak ada transaksi yang sesuai.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((transaction) => (
            <article
              key={transaction.id}
              className="rounded-2xl bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    {transaction.invoice}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {transaction.date} · Kasir:{" "}
                    {transaction.cashier || "Admin"}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {transaction.paymentMethod}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {(transaction.items || []).map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <span>
                      {item.name}{" "}
                      <span className="text-gray-500">× {item.qty}</span>
                    </span>

                    <span className="shrink-0">
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="font-semibold">Total</span>

                <span className="text-lg font-bold text-emerald-700">
                  {formatRupiah(transaction.total)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => setSelectedTransaction(transaction)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  <Eye size={17} />
                  Detail
                </button>

                <button
                  type="button"
                  onClick={() => downloadTransactionPDF(transaction)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  <FileDown size={17} />
                  PDF
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <InvoiceModal
        open={Boolean(selectedTransaction)}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}