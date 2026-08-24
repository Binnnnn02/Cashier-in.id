import { useState } from "react";
import { X } from "lucide-react";
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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-[450px] max-w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
      >

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Pembayaran
          </h2>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

        </div>

        <div className="space-y-5">

          <div>

            <p className="text-gray-500 text-sm">
              Total Belanja
            </p>

            <h1 className="text-3xl font-bold text-emerald-600 mt-1">
              Rp{total.toLocaleString("id-ID")}
            </h1>

          </div>

          {/* Metode Pembayaran */}

          <div>

            <label className="font-semibold text-sm text-gray-600">
              Metode Pembayaran
            </label>

            <div className="grid grid-cols-3 gap-2 mt-2">

              {paymentMethods.map((method) => (

                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-xl text-sm border font-medium transition ${
                    paymentMethod === method
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {method}
                </button>

              ))}

            </div>

          </div>

          {isCash ? (

            <>

              <div>

                <label className="font-semibold text-sm text-gray-600 block mb-1">
                  Uang Pelanggan
                </label>

                <input
                  type="number"
                  placeholder="Masukkan nominal uang..."
                  value={money}
                  onChange={(e) => setMoney(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />

              </div>

              {/* Tombol Nominal Cepat */}

              <div className="grid grid-cols-5 gap-2">

                <button
                  type="button"
                  onClick={() => setMoney(String(total))}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg py-2 text-xs transition border border-emerald-200"
                >
                  Uang Pas
                </button>

                {[10000, 20000, 50000, 100000].map((nominal) => (

                  <button
                    key={nominal}
                    type="button"
                    onClick={() => setMoney(String(nominal))}
                    className="bg-gray-100 hover:bg-gray-200 rounded-lg py-2 text-xs font-medium transition"
                  >
                    {nominal >= 1000
                      ? `${nominal / 1000}K`
                      : nominal}
                  </button>

                ))}

              </div>

            </>

          ) : (

            <div className="border rounded-xl p-4 bg-emerald-50 text-emerald-700 text-sm">
              Pembayaran via <strong>{paymentMethod}</strong> otomatis tercatat lunas sesuai total belanja (Rp{total.toLocaleString("id-ID")}).
            </div>

          )}

          {/* Ringkasan */}

          <div className="border rounded-xl p-4 space-y-3 bg-gray-50/50">

            {discountAmount > 0 && (

              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>Rp{subtotal.toLocaleString("id-ID")}</span>
              </div>

            )}

            {discountAmount > 0 && (

              <div className="flex justify-between text-sm text-gray-500">
                <span>Diskon</span>
                <span className="text-red-500">
                  -Rp{discountAmount.toLocaleString("id-ID")}
                </span>
              </div>

            )}

            {taxAmount > 0 && (

              <div className="flex justify-between text-sm text-gray-500">
                <span>Pajak</span>
                <span>Rp{taxAmount.toLocaleString("id-ID")}</span>
              </div>

            )}

            <div className="flex justify-between text-base font-semibold">

              <span>Total</span>

              <span>
                Rp{total.toLocaleString("id-ID")}
              </span>

            </div>

            <div className="flex justify-between text-sm text-gray-600">

              <span>Dibayar</span>

              <span className="font-semibold">
                Rp{paid.toLocaleString("id-ID")}
              </span>

            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">

              <span>Kembalian</span>

              <span
                className={
                  change >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }
              >
                {isCash && paid === 0
                  ? "-"
                  : `Rp${Math.max(0, change).toLocaleString("id-ID")}`}
              </span>

            </div>

            {isCash && paid > 0 && paid < total && (

              <p className="text-red-500 text-xs font-medium">
                Uang pelanggan masih kurang Rp{(total - paid).toLocaleString("id-ID")}.
              </p>

            )}

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium text-gray-700"
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
            className={`px-5 py-2.5 rounded-xl text-white font-semibold transition ${
              canPay
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Bayar
          </button>

        </div>

      </div>

    </div>
  );
}