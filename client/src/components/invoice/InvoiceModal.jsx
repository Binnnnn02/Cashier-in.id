import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Printer, Download, CheckCircle, Store, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";

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

  const { store } = useStore();

  const showAddress = store.showAddress;
  const showPhone = store.showPhone;
  const showTax = store.showTax;
  const isCash = paymentMethod === "Tunai";

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text(store.name || "Cashier-in", 20, y);
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
    doc.text("INVOICE PEMBAYARAN", 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`No Invoice : ${invoice}`, 20, y);
    y += 6;
    doc.text(`Tanggal    : ${new Date().toLocaleString("id-ID")}`, 20, y);
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
    doc.text(`Subtotal : Rp${subtotal.toLocaleString("id-ID")}`, 20, y);
    y += 7;

    if (discountAmount > 0) {
      doc.text(`Diskon : -Rp${discountAmount.toLocaleString("id-ID")}`, 20, y);
      y += 7;
    }

    if (showTax && taxAmount > 0) {
      doc.text(`Pajak : Rp${taxAmount.toLocaleString("id-ID")}`, 20, y);
      y += 7;
    }

    doc.setFontSize(13);
    doc.text(`Total : Rp${total.toLocaleString("id-ID")}`, 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Metode : ${paymentMethod}`, 20, y);
    y += 7;

    if (isCash) {
      doc.text(`Dibayar   : Rp${paid.toLocaleString("id-ID")}`, 20, y);
      y += 7;
      doc.text(`Kembalian : Rp${change.toLocaleString("id-ID")}`, 20, y);
      y += 10;
    }

    if (store.footer) {
      doc.text(store.footer, 20, y);
    }

    doc.save(`${invoice || "Struk"}.pdf`);
  };

  const printReceipt = () => {
    window.print();
  };

  useEffect(() => {
    if (open && autoPrint) {
      printReceipt();
    }
  }, [open, autoPrint]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-emerald-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-white via-white to-emerald-50/30 rounded-3xl w-[440px] max-w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-emerald-100 animate-scale-in"
        style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.18)" }}
      >
        {/* SUCCESS ICON */}
        <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-gray-100">
          <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner mb-3 border border-emerald-200">
            <CheckCircle size={32} className="stroke-[2.5]" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transaksi Berhasil
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">
            {store.name || "Cashier-in"}
          </h2>
          {showAddress && store.address && (
            <p className="text-xs text-gray-400 mt-0.5">{store.address}</p>
          )}
          {showPhone && store.phone && (
            <p className="text-xs text-gray-400">{store.phone}</p>
          )}
          <p className="font-mono text-xs font-bold text-gray-500 mt-2 bg-gray-100 px-3 py-1 rounded-lg">
            {invoice}
          </p>
        </div>

        {/* ITEMS LIST */}
        <div className="py-4 space-y-2 border-b border-dashed border-gray-200 text-sm">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-gray-700">
              <span className="font-medium text-gray-800">
                {item.name} <span className="text-gray-400 font-normal">× {item.qty}</span>
              </span>
              <span className="font-bold text-gray-900">
                Rp{(item.price * item.qty).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="py-3 space-y-1.5 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>Rp{subtotal.toLocaleString("id-ID")}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-rose-600 font-medium">
              <span>Diskon</span>
              <span>-Rp{discountAmount.toLocaleString("id-ID")}</span>
            </div>
          )}

          {showTax && taxAmount > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Pajak</span>
              <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
            </div>
          )}

          <div className="flex justify-between font-black text-base sm:text-lg text-gray-900 pt-2 border-t border-gray-100">
            <span>Total Tagihan</span>
            <span className="text-emerald-700">Rp{total.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between text-gray-600 pt-1">
            <span>Metode Pembayaran</span>
            <span className="font-bold text-gray-800">{paymentMethod}</span>
          </div>

          {isCash && (
            <>
              <div className="flex justify-between text-gray-500">
                <span>Dibayar</span>
                <span>Rp{paid.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900">
                <span>Kembalian</span>
                <span className="text-emerald-700">Rp{change.toLocaleString("id-ID")}</span>
              </div>
            </>
          )}
        </div>

        {/* RECEIPT FOOTER MESSAGE */}
        <div className="p-3 my-2 rounded-2xl bg-gray-50 text-center text-xs text-gray-500 font-medium border border-gray-100">
          {store.footer || "Terima kasih telah berbelanja."}
        </div>

        {/* BUTTONS */}
        <div className="space-y-2.5 mt-5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={printReceipt}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-emerald-600
                hover:bg-emerald-700
                text-white
                py-3
                rounded-2xl
                font-extrabold
                text-xs
                sm:text-sm
                shadow-md
                shadow-emerald-600/20
                transition-all
                active:scale-95
              "
            >
              <Printer size={16} />
              <span>Cetak Struk</span>
            </button>

            <button
              onClick={downloadPDF}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-white
                hover:bg-emerald-50
                text-emerald-700
                border
                border-emerald-200
                py-3
                rounded-2xl
                font-extrabold
                text-xs
                sm:text-sm
                shadow-sm
                transition-all
                active:scale-95
              "
            >
              <Download size={16} />
              <span>Unduh PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>

      {/* THERMAL 80mm PRINT STRUCTURE */}
      <div id="print-receipt">
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 14 }}>
          {store.name || "Cashier-in"}
        </div>
        {showAddress && store.address && (
          <div style={{ textAlign: "center" }}>{store.address}</div>
        )}
        {showPhone && store.phone && (
          <div style={{ textAlign: "center" }}>{store.phone}</div>
        )}
        <div style={{ textAlign: "center", marginTop: 4 }}>{invoice}</div>
        <div style={{ textAlign: "center" }}>
          {new Date().toLocaleString("id-ID")}
        </div>
        <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
        {cart.map((item) => (
          <div key={item.id} style={{ marginBottom: 4 }}>
            <div>{item.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {item.qty} x Rp{item.price.toLocaleString("id-ID")}
              </span>
              <span>
                Rp{(item.price * item.qty).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))}
        <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal</span>
          <span>Rp{subtotal.toLocaleString("id-ID")}</span>
        </div>
        {discountAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Diskon</span>
            <span>-Rp{discountAmount.toLocaleString("id-ID")}</span>
          </div>
        )}
        {showTax && taxAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Pajak</span>
            <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            borderTop: "1px dashed #000",
            marginTop: 4,
            paddingTop: 4,
          }}
        >
          <span>TOTAL</span>
          <span>Rp{total.toLocaleString("id-ID")}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span>Bayar ({paymentMethod})</span>
          <span>Rp{paid.toLocaleString("id-ID")}</span>
        </div>
        {isCash && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Kembali</span>
            <span>Rp{change.toLocaleString("id-ID")}</span>
          </div>
        )}
        <div style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
        <div style={{ textAlign: "center" }}>
          {store.footer || "Terima kasih telah berbelanja."}
        </div>
      </div>
    </div>
  );
}