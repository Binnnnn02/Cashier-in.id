import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InvoiceModal({
  open,
  onClose,
  cart,
  subtotal = 0,
  discountAmount = 0,
  taxAmount = 0,
  total = 0,
  paymentMethod,
  paid = 0,
  change = 0,
  invoice,
  autoPrint = false,
}) {

  const store =
    JSON.parse(localStorage.getItem("store")) || {};

  // Toggle tampilan struk mengikuti pengaturan di halaman Settings
  const showAddress = JSON.parse(
    localStorage.getItem("showAddress") ?? "true"
  );

  const showPhone = JSON.parse(
    localStorage.getItem("showPhone") ?? "true"
  );

  const showTax = JSON.parse(
    localStorage.getItem("showTax") ?? "false"
  );

  const isCash = paymentMethod === "Tunai";

  const downloadPDF = () => {

    const doc = new jsPDF();

    let y = 20;

    // Nama toko
    doc.setFontSize(18);
    doc.text(
      store.name || "BERJUTA CAFE",
      20,
      y
    );

    y += 8;

    doc.setFontSize(11);

    if (showAddress && store.address) {
      doc.text(store.address, 20, y);
      y += 7;
    }

    if (showPhone && store.phone) {
      doc.text(store.phone, 20, y);
      y += 10;
    }

    doc.setFontSize(13);

    doc.text("INVOICE", 20, y);

    y += 8;

    doc.setFontSize(11);

    doc.text(
      `No : ${invoice}`,
      20,
      y
    );

    y += 6;

    doc.text(
      `Tanggal : ${new Date().toLocaleString("id-ID")}`,
      20,
      y
    );

    y += 8;

    autoTable(doc, {

      startY: y,

      head: [["Produk", "Qty", "Harga", "Subtotal"]],

      body: cart.map((item) => [
        item.name,
        item.qty,
        `Rp${item.price.toLocaleString("id-ID")}`,
        `Rp${(item.price * item.qty).toLocaleString("id-ID")}`,
      ]),

      styles: { fontSize: 10 },

      headStyles: { fillColor: [5, 150, 105] },

    });

    y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(11);

    doc.text(
      `Subtotal : Rp${subtotal.toLocaleString("id-ID")}`,
      20,
      y
    );

    y += 7;

    if (discountAmount > 0) {

      doc.text(
        `Diskon : -Rp${discountAmount.toLocaleString("id-ID")}`,
        20,
        y
      );

      y += 7;

    }

    if (showTax && taxAmount > 0) {

      doc.text(
        `Pajak : Rp${taxAmount.toLocaleString("id-ID")}`,
        20,
        y
      );

      y += 7;

    }

    doc.setFontSize(13);

    doc.text(
      `Total : Rp${total.toLocaleString("id-ID")}`,
      20,
      y
    );

    y += 8;

    doc.setFontSize(11);

    doc.text(
      `Metode : ${paymentMethod}`,
      20,
      y
    );

    y += 7;

    if (isCash) {

      doc.text(
        `Dibayar : Rp${paid.toLocaleString("id-ID")}`,
        20,
        y
      );

      y += 7;

      doc.text(
        `Kembalian : Rp${change.toLocaleString("id-ID")}`,
        20,
        y
      );

      y += 10;

    } else {

      y += 3;

    }

    doc.setFontSize(11);

    doc.text(
      store.footer ||
      "Terima kasih telah berbelanja.",
      20,
      y
    );

    doc.save(`${invoice || `Invoice-${Date.now()}`}.pdf`);

  };

  // Cetak/unduh otomatis setelah pembayaran, sesuai toggle "Print otomatis" di Settings
  useEffect(() => {

    if (open && autoPrint) {
      downloadPDF();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoPrint]);

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[420px] max-h-[90vh] overflow-y-auto p-6">

        <h2 className="text-2xl font-bold text-center">
          {store.name || "BERJUTA CAFE"}
        </h2>

        {showAddress && store.address && (
          <p className="text-center text-sm text-gray-500 mt-2">
            {store.address}
          </p>
        )}

        {showPhone && store.phone && (
          <p className="text-center text-sm text-gray-500">
            {store.phone}
          </p>
        )}

        <p className="text-center text-xs text-gray-400 mt-2">
          {invoice}
        </p>

        <hr className="my-4" />

        {cart.map((item) => (

          <div
            key={item.id}
            className="flex justify-between mb-2"
          >

            <span>
              {item.name} ({item.qty}x)
            </span>

            <span>
              Rp{(item.price * item.qty).toLocaleString("id-ID")}
            </span>

          </div>

        ))}

        <hr className="my-4" />

        <div className="space-y-2">

          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>Rp{subtotal.toLocaleString("id-ID")}</span>
          </div>

          {discountAmount > 0 && (

            <div className="flex justify-between text-gray-600">
              <span>Diskon</span>
              <span className="text-red-500">
                -Rp{discountAmount.toLocaleString("id-ID")}
              </span>
            </div>

          )}

          {showTax && taxAmount > 0 && (

            <div className="flex justify-between text-gray-600">
              <span>Pajak</span>
              <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
            </div>

          )}

          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>Rp{total.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between mt-3">
            <span>Metode Pembayaran</span>
            <span className="font-semibold">{paymentMethod}</span>
          </div>

          {isCash && (

            <>

              <div className="flex justify-between text-gray-600">
                <span>Dibayar</span>
                <span>Rp{paid.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Kembalian</span>
                <span>Rp{change.toLocaleString("id-ID")}</span>
              </div>

            </>

          )}

        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          {store.footer || "Terima kasih telah berbelanja."}
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl"
        >
          Tutup
        </button>

        <button
          onClick={downloadPDF}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          Download PDF
        </button>

      </div>

    </div>

  );

}