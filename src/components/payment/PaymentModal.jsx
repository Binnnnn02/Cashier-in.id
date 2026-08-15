import { useState, useEffect } from "react";
import { X } from "lucide-react";

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
  total,
  onClose,
  onPay,
}) {
  const [money, setMoney] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tunai");

  useEffect(() => {
    if (open) {
      setMoney("");
      setPaymentMethod(
        localStorage.getItem("paymentMethod") || "Tunai"
      );
    }
  }, [open]);

  if (!open) return null;

  const isCash = paymentMethod === "Tunai";

  const paid = isCash ? Number(money || 0) : total;
  const change = paid - total;

  const canPay = isCash ? paid >= total : true;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[450px] max-h-[90vh] overflow-y-auto p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Pembayaran
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="space-y-5">

          <div>

            <p className="text-gray-500">
              Total Belanja
            </p>

            <h1 className="text-3xl font-bold text-emerald-600">
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
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-xl text-sm border transition ${
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

              <input
                type="number"
                placeholder="Masukkan uang pelanggan"
                value={money}
                onChange={(e) => setMoney(e.target.value)}
                className="w-full border rounded-xl p-3"
              />

              {/* Tombol Nominal Cepat */}

              <div className="grid grid-cols-4 gap-2">

                {[10000, 20000, 50000, 100000].map((nominal) => (

                  <button
                    key={nominal}
                    onClick={() => setMoney(String(nominal))}
                    className="bg-gray-100 hover:bg-gray-200 rounded-lg py-2 text-sm"
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
              Pembayaran via {paymentMethod} dianggap lunas sesuai total belanja.
            </div>

          )}

          {/* Ringkasan */}

          <div className="border rounded-xl p-4 space-y-3">

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

            <div className="flex justify-between">

              <span>Total</span>

              <span className="font-semibold">
                Rp{total.toLocaleString("id-ID")}
              </span>

            </div>

            <div className="flex justify-between">

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
                  : `Rp${change.toLocaleString("id-ID")}`}
              </span>

            </div>

            {isCash && paid > 0 && paid < total && (

              <p className="text-red-500 text-sm">
                Uang pelanggan masih kurang.
              </p>

            )}

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200"
          >
            Batal
          </button>

          <button
            disabled={!canPay}
            onClick={() => {

              onPay({
                paymentMethod,
                paid,
                change,
              });

              onClose();

            }}
            className={`px-5 py-2 rounded-xl text-white transition ${
              canPay
                ? "bg-emerald-600 hover:bg-emerald-700"
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