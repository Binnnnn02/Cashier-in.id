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

  const [paymentMethod, setPaymentMethod] =
    useState("Tunai");

  const [openInvoice, setOpenInvoice] =
    useState(false);

  const [invoiceData, setInvoiceData] =
useState({

  invoice: "",

  cart: [],

  total: 0,

  paymentMethod: "Tunai",

});

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

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

      <div className="mt-6 flex justify-between text-xl font-bold">

        <span>Total</span>

        <span>
          Rp{total.toLocaleString("id-ID")}
        </span>

      </div>

      {/* Metode Pembayaran */}

      <div className="mt-5">

        <label className="font-semibold">
          Metode Pembayaran
        </label>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="w-full mt-2 border rounded-xl p-3"
        >

          <option>Tunai</option>
          <option>QRIS</option>
          <option>Debit</option>
          <option>Transfer</option>

        </select>

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
        total={total}
        onClose={() => setOpenPayment(false)}
        onPay={() => {

          setInvoiceData({
            invoice:
              `INV-${Date.now()}`,
            cart: [...cart],
            total,
            paymentMethod,
          });

          clearCart(paymentMethod);

          setOpenPayment(false);

          setOpenInvoice(true);

        }}
      />

      <InvoiceModal
        open={openInvoice}
        cart={invoiceData.cart}
        total={invoiceData.total}
        paymentMethod={invoiceData.paymentMethod}
        invoice={invoiceData.invoice}
        onClose={() => setOpenInvoice(false)}
      />

    </div>

  );

}