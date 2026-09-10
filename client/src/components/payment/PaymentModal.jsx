import { useState } from "react";
import { createPortal } from "react-dom";
import { X, CreditCard, Banknote, CheckCircle, ArrowRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";

const paymentMethods = [
  "Tunai",
  "QRIS",
  "Debit",
  "Transfer",
  "E-Wallet",
];

export default function PaymentModal({
  open,
  subtotal = 0,
  discountAmount = 0,
  taxAmount = 0,
  total = 0,
  onClose,
  onPay,
}) {
  const { store } = useStore();

  const [money, setMoney] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    () => store.defaultPaymentMethod || "Tunai"
  );

  if (!open) return null;

  const isCash = paymentMethod === "Tunai";

  const paid = isCash ? Number(money || 0) : total;
  const change = paid - total;

  const canPay = isCash ? paid >= total : true;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-white via-white to-emerald-50/30 rounded-3xl w-[480px] max-w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-emerald-100 animate-scale-in"
        style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}
      >

        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CreditCard size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Penyelesaian Transaksi
              </h2>
              <p className="text-xs text-gray-400 font-medium">Pilih metode & konfirmasi bayar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 pt-4">

          {/* TOTAL BANNER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white shadow-md shadow-emerald-900/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">
                Total Tagihan Belanja
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
                Rp{total.toLocaleString("id-ID")}
              </h1>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 text-emerald-200">
              <Banknote size={28} />
            </div>
          </div>

          {/* METODE PEMBAYARAN TABS */}
          <div>
            <label className="font-extrabold text-xs uppercase tracking-wider text-gray-500 block mb-2">
              Pilih Metode Pembayaran
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {paymentMethods.map((method) => {
                const isSelected = paymentMethod === method;

                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 border-emerald-600 scale-102"
                        : "bg-gray-50 text-gray-700 border border-gray-200/80 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {isCash ? (
            <div className="space-y-3">
              <div>
                <label className="font-extrabold text-xs uppercase tracking-wider text-gray-500 block mb-1.5">
                  Nominal Uang Diterima
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={money}
                    onChange={(e) => setMoney(e.target.value)}
                    className="
                      w-full
                      pl-11
                      pr-4
                      py-3.5
                      bg-gray-50/80
                      border
                      border-gray-200
                      rounded-2xl
                      text-lg
                      font-black
                      text-gray-900
                      focus:outline-none
                      focus:bg-white
                      focus:border-emerald-500
                      focus:ring-4
                      focus:ring-emerald-500/10
                      transition-all
                    "
                    autoFocus
                  />
                </div>
              </div>

              {/* QUICK NOMINAL BUTTONS */}
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => setMoney(String(total))}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold rounded-xl py-2 text-xs transition border border-emerald-200"
                >
                  Uang Pas
                </button>

                {[10000, 20000, 50000, 100000].map((nominal) => (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => setMoney(String(nominal))}
                    className="bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl py-2 text-xs font-bold text-gray-700 transition border border-gray-200/60"
                  >
                    {nominal >= 1000 ? `${nominal / 1000}K` : nominal}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-4 bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-600 shrink-0" />
              <span>
                Pembayaran non-tunai via <strong>{paymentMethod}</strong> otomatis diverifikasi lunas (<strong>Rp{total.toLocaleString("id-ID")}</strong>).
              </span>
            </div>
          )}

          {/* CALCULATION SUMMARY */}
          <div className="rounded-2xl p-4 bg-gray-50/90 border border-gray-200/70 space-y-2 text-xs sm:text-sm">
            {discountAmount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Subtotal Awal</span>
                <span>Rp{subtotal.toLocaleString("id-ID")}</span>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Diskon</span>
                <span>-Rp{discountAmount.toLocaleString("id-ID")}</span>
              </div>
            )}

            {taxAmount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Pajak Transaksi</span>
                <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
              </div>
            )}

            <div className="flex justify-between font-extrabold text-gray-800 pt-1">
              <span>Total Bersih</span>
              <span className="text-emerald-700">Rp{total.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Jumlah Dibayar</span>
              <span className="font-bold text-gray-900">
                Rp{paid.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between font-black text-base">
              <span>Kembalian</span>
              <span className={change >= 0 ? "text-emerald-700" : "text-rose-600"}>
                {isCash && paid === 0
                  ? "-"
                  : `Rp${Math.max(0, change).toLocaleString("id-ID")}`}
              </span>
            </div>

            {isCash && paid > 0 && paid < total && (
              <p className="text-rose-600 text-xs font-bold text-right pt-1">
                Kurang: Rp{(total - paid).toLocaleString("id-ID")}
              </p>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-end gap-3 mt-7 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition font-bold text-xs sm:text-sm text-gray-600"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={!canPay}
            onClick={() => {
              onPay({
                paymentMethod,
                paid,
                change: Math.max(0, change),
              });
            }}
            className={`px-6 py-3 rounded-2xl text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 ${
              canPay
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md shadow-emerald-600/25"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Proses Bayar</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}