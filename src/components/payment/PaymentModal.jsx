import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function PaymentModal({
  open,
  total,
  onClose,
  onPay,
}) {
  const [money, setMoney] = useState("");

  useEffect(() => {
    if (open) {
      setMoney("");
    }
  }, [open]);

  if (!open) return null;

  const paid = Number(money || 0);
  const change = paid - total;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[450px] p-6">

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

          {/* Ringkasan */}

          <div className="border rounded-xl p-4 space-y-3">

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
                {paid === 0
                  ? "-"
                  : `Rp${change.toLocaleString("id-ID")}`}
              </span>

            </div>

            {paid > 0 && paid < total && (

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
            disabled={paid < total}
            onClick={() => {

              onPay();

              onClose();

            }}
            className={`px-5 py-2 rounded-xl text-white transition ${
              paid >= total
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