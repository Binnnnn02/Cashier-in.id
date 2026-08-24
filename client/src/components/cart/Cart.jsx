import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { useStore } from "../../context/StoreContext";
import PaymentModal from "../payment/PaymentModal";
import InvoiceModal from "../invoice/InvoiceModal";
import { Trash2, ShoppingCart, Minus, Plus, X } from "lucide-react";

export default function Cart() {

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeCart,
    clearCart,
    resetCart,
  } = useProducts();

  const { store } = useStore();

  const [openPayment, setOpenPayment] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const discountPercent = store.discount;
  const taxPercent = store.tax;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const taxAmount = Math.round((subtotal - discountAmount) * (taxPercent / 100));
  const total = subtotal - discountAmount + taxAmount;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md flex flex-col sticky top-8 overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <ShoppingCart size={18} className="text-white" />
          </div>
          <h2 className="text-white font-bold text-lg">Keranjang</h2>
          {cart.length > 0 && (
            <span className="bg-white text-emerald-700 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
        {cart.length > 0 && (
          <button
            onClick={resetCart}
            className="flex items-center gap-1.5 text-emerald-100 hover:text-white text-xs font-medium transition-colors"
            title="Kosongkan Keranjang"
          >
            <Trash2 size={13} />
            Kosongkan
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2 max-h-72">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
              <ShoppingCart size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Keranjang kosong</p>
            <p className="text-gray-300 text-xs mt-1">Pilih produk untuk ditambahkan</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {cart.map(item => (
              <div key={item.id} className="py-3.5">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">{item.name}</h3>
                    <p className="text-emerald-600 text-xs font-semibold mt-0.5">
                      Rp{item.price.toLocaleString("id-ID")} / pcs
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-gray-800 font-bold text-sm">
                      Rp{(item.price * item.qty).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2.5">
                  {/* Decrease */}
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all text-gray-600"
                  >
                    <Minus size={13} />
                  </button>

                  <span className="w-8 text-center font-bold text-gray-800 text-sm">{item.qty}</span>

                  {/* Increase */}
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-all"
                  >
                    <Plus size={13} />
                  </button>

                  <div className="flex-1" />

                  {/* Remove */}
                  <button
                    onClick={() => removeCart(item.id)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-all text-gray-400"
                    title="Hapus item"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/60">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="font-medium text-gray-700">Rp{subtotal.toLocaleString("id-ID")}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Diskon ({discountPercent}%)</span>
              <span className="text-red-500 font-medium">-Rp{discountAmount.toLocaleString("id-ID")}</span>
            </div>
          )}

          {taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pajak ({taxPercent}%)</span>
              <span className="text-gray-700 font-medium">Rp{taxAmount.toLocaleString("id-ID")}</span>
            </div>
          )}

          <div className="flex justify-between pt-2.5 border-t border-gray-200">
            <span className="font-bold text-gray-900 text-base">Total</span>
            <span className="font-black text-emerald-700 text-lg">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <button
          onClick={() => setOpenPayment(true)}
          disabled={cart.length === 0}
          className={`mt-4 w-full py-3.5 rounded-2xl font-bold text-base transition-all duration-200 shadow-sm ${
            cart.length > 0
              ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {cart.length > 0 ? `Bayar — Rp${total.toLocaleString("id-ID")}` : "Tambah produk dahulu"}
        </button>
      </div>

      <PaymentModal
        key={openPayment ? "open" : "closed"}
        open={openPayment}
        subtotal={subtotal}
        discountAmount={discountAmount}
        taxAmount={taxAmount}
        total={total}
        onClose={() => setOpenPayment(false)}
        onPay={async (paymentInfo) => {
          const cartSnapshot = [...cart];
          const transaction = await clearCart({
            paymentMethod: paymentInfo.paymentMethod,
            paid: paymentInfo.paid,
            change: paymentInfo.change,
            discount: discountPercent,
            discountAmount,
            tax: taxPercent,
            taxAmount,
            total,
          });

          if (transaction) {
            setInvoiceData({
              invoice: transaction.invoice,
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
          }
        }}
      />

      <InvoiceModal
        key={openInvoice ? "open" : "closed"}
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
        autoPrint={store.autoPrint}
        onClose={() => setOpenInvoice(false)}
      />
    </div>
  );
}