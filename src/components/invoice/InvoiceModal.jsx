import jsPDF from "jspdf";

export default function InvoiceModal({
  open,
  onClose,
  cart,
  total,
  paymentMethod,
  invoice,
}) {

  if (!open) return null;

  const store =
    JSON.parse(localStorage.getItem("store")) || {};

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

    if (store.address) {
      doc.text(store.address, 20, y);
      y += 7;
    }

    if (store.phone) {
      doc.text(store.phone, 20, y);
      y += 10;
    }

    doc.setFontSize(13);

    doc.text("INVOICE", 20, y);

    y += 8;

    doc.text(
      `No : ${invoice}`,
      20,
      y
    );

    y +=10;

    cart.forEach((item) => {

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

    y += 5;

    doc.setFontSize(12);

    doc.text(
      `Metode : ${paymentMethod}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Total : Rp${total.toLocaleString("id-ID")}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Tanggal : ${new Date().toLocaleString("id-ID")}`,
      20,
      y
    );

    y += 12;

    doc.setFontSize(11);

    doc.text(
      store.footer ||
      "Terima kasih telah berbelanja.",
      20,
      y
    );

    doc.save(`Invoice-${Date.now()}.pdf`);

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[420px] p-6">

        <h2 className="text-2xl font-bold text-center">
          {store.name || "BERJUTA CAFE"}
        </h2>

        {store.address && (
          <p className="text-center text-sm text-gray-500 mt-2">
            {store.address}
          </p>
        )}

        {store.phone && (
          <p className="text-center text-sm text-gray-500">
            {store.phone}
          </p>
        )}

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

        <div className="flex justify-between mb-2">

          <span>Metode Pembayaran</span>

          <span className="font-semibold">
            {paymentMethod}
          </span>

        </div>

        <div className="flex justify-between font-bold text-lg">

          <span>Total</span>

          <span>
            Rp{total.toLocaleString("id-ID")}
          </span>

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