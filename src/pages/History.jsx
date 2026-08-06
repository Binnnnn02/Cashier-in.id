import { useProducts } from "../context/ProductContext";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileDown, FileSpreadsheet } from "lucide-react";

export default function History() {

  const { history } = useProducts();
  console.log(history);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredHistory = history.filter((trx) => {

  // Filter search
  const matchSearch = trx.items.some((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!matchSearch) return false;

  // Tidak ada filter
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

  const downloadTransactionPDF = (trx) => {

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.text("INVOICE", 20, y);

  y += 12;

  doc.setFontSize(11);

  doc.text(
    `Invoice : ${trx.invoice}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Tanggal : ${trx.date}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Metode : ${trx.paymentMethod}`,
    20,
    y
  );

  y += 12;

  trx.items.forEach((item) => {

    doc.text(
      `${item.name} (${item.qty}x)`,
      20,
      y
    );

    doc.text(
      `Rp${(item.price * item.qty).toLocaleString("id-ID")}`,
      130,
      y
    );

    y += 8;

  });

  y += 10;

  doc.setFontSize(13);

  doc.text(
    `Total : Rp${trx.total.toLocaleString("id-ID")}`,
    20,
    y
  );

  doc.save(`${trx.invoice}.pdf`);

};

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

  filteredHistory.forEach((trx) => {

    trx.items.forEach((item) => {

      rows.push([
        trx.id,
        item.name,
        item.qty,
        `Rp${item.price.toLocaleString("id-ID")}`,
        `Rp${(item.price * item.qty).toLocaleString("id-ID")}`,
        trx.date,
      ]);

    });

  });

  autoTable(doc, {

    startY: 35,

    head: [[
      "ID",
      "Produk",
      "Qty",
      "Harga",
      "Subtotal",
      "Tanggal",
    ]],

    body: rows,

  });

  const total = filteredHistory.reduce(

    (sum, trx) => sum + trx.total,

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

  filteredHistory.forEach((trx) => {

    trx.items.forEach((item) => {

      data.push({

        "ID Transaksi": trx.id,
        "Produk": item.name,
        "Qty": item.qty,
        "Harga": item.price,
        "Subtotal": item.price * item.qty,
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

      <div className="flex justify-between items-center">

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
      <input
        type="text"
        placeholder="Cari nama produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-xl p-3"
      />

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

      {

        filteredHistory.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            Tidak ada transaksi.
          </div>

        ) : (

          filteredHistory.map((trx) => (

            <div
              key={trx.id}
              className="bg-white rounded-xl shadow p-5"
            >

              <div className="flex justify-between items-center">

                <h2 className="font-bold">
                  {trx.invoice}
                </h2>

                <p className="text-gray-500 text-sm">
                  {trx.paymentMethod}
                </p>

                <span className="text-gray-500 text-sm">
                  {trx.date}
                </span>

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

              <div className="flex justify-between font-bold text-lg">

                <span>Total</span>

                <span>
                  Rp{trx.total.toLocaleString("id-ID")}
                </span>

              </div>

              <div className="flex gap-3 mt-5">

  <button
    onClick={() => window.print()}
    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
  >
    Print
  </button>

  <button
    onClick={() => downloadTransactionPDF(trx)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
  >
    PDF
  </button>

</div>

            </div>

          ))

        )

      }

    </div>

  );

}