import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import PaymentModal from "../payment/PaymentModal";
import InvoiceModal from "../invoice/InvoiceModal";

export default function Cart() {

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeCart,
    clearCart,
  } = useProducts();

  const [openPayment, setOpenPayment] = useState(false);

  const [openInvoice, setOpenInvoice] =
    useState(false);

  const [invoiceData, setInvoiceData] =
useState({

  invoice: "",

  cart: [],

  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  total: 0,

  paymentMethod: "Tunai",
  paid: 0,
  change: 0,

});

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  // Diskon & pajak mengikuti pengaturan di halaman Settings
  const discountPercent =
    Number(localStorage.getItem("discount")) || 0;

  const taxPercent =
    Number(localStorage.getItem("tax")) || 0;

  const discountAmount =
    Math.round(subtotal * (discountPercent / 100));

  const taxAmount =
    Math.round(
      (subtotal - discountAmount) * (taxPercent / 100)
    );

  const total =
    subtotal - discountAmount + taxAmount;

  return (

    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">

      <h2 className="text-xl font-bold mb-6">
        Keranjang
      </h2>

      {

        cart.length === 0 && (

          <p className="text-gray-400">
            Keranjang kosong
          </p>

        )

      }

      {

        cart.map(item => (

          <div
            key={item.id}
            className="border-b py-4"
          >

            <div className="flex justify-between">

              <h3 className="font-semibold">
                {item.name}
              </h3>

              <span>
                Rp{(item.price * item.qty).toLocaleString("id-ID")}
              </span>

            </div>

            <div className="flex items-center gap-3 mt-3">

              <button
                onClick={() => decreaseQty(item.id)}
                className="w-8 h-8 rounded-lg bg-red-500 text-white"
              >
                -
              </button>

              <span>
                {item.qty}
              </span>

              <button
                onClick={() => increaseQty(item.id)}
                className="w-8 h-8 rounded-lg bg-emerald-600 text-white"
              >
                +
              </button>

              <button
                onClick={() => removeCart(item.id)}
                className="w-8 h-8 rounded-lg bg-gray-700 text-white"
              >
                🗑
              </button>

            </div>

          </div>

        ))

      }

      {/* Ringkasan Belanja */}

      <div className="mt-6 space-y-2">

        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>Rp{subtotal.toLocaleString("id-ID")}</span>
        </div>

        {discountAmount > 0 && (

          <div className="flex justify-between text-gray-600">
            <span>Diskon ({discountPercent}%)</span>
            <span className="text-red-500">
              -Rp{discountAmount.toLocaleString("id-ID")}
            </span>
          </div>

        )}

        {taxAmount > 0 && (

          <div className="flex justify-between text-gray-600">
            <span>Pajak ({taxPercent}%)</span>
            <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
          </div>

        )}

        <div className="flex justify-between text-xl font-bold pt-2 border-t">
          <span>Total</span>
          <span>Rp{total.toLocaleString("id-ID")}</span>
        </div>

      </div>

      <button
        onClick={() => setOpenPayment(true)}
        disabled={cart.length === 0}
        className={`mt-6 w-full py-3 rounded-xl text-white ${
          cart.length > 0
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >

        Bayar

      </button>

      <PaymentModal
        open={openPayment}
        subtotal={subtotal}
        discountAmount={discountAmount}
        taxAmount={taxAmount}
        total={total}
        onClose={() => setOpenPayment(false)}
        onPay={(paymentInfo) => {

          const cartSnapshot = [...cart];

          const transaction = clearCart({
            paymentMethod: paymentInfo.paymentMethod,
            paid: paymentInfo.paid,
            change: paymentInfo.change,
            discount: discountPercent,
            discountAmount,
            tax: taxPercent,
            taxAmount,
            total,
          });

          setInvoiceData({
            invoice:
              transaction?.invoice || `INV-${Date.now()}`,
            cart: cartSnapshot,
            subtotal,
            discountAmount,
            taxAmount,
            total,
            paymentMethod: paymentInfo.paymentMethod,
            paid: paymentInfo.paid,
            change: paymentInfo.change,
          });

          setOpenPayment(false);

          setOpenInvoice(true);

        }}
      />

      <InvoiceModal
        open={openInvoice}
        cart={invoiceData.cart}
        subtotal={invoiceData.subtotal}
        discountAmount={invoiceData.discountAmount}
        taxAmount={invoiceData.taxAmount}
        total={invoiceData.total}
        paymentMethod={invoiceData.paymentMethod}
        paid={invoiceData.paid}
        change={invoiceData.change}
        invoice={invoiceData.invoice}
        onClose={() => setOpenInvoice(false)}
      />

    </div>

  );

}