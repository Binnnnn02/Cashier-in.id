import { Undo2 } from "lucide-react";

export default function VoidModal({
  open,
  onClose,
  onConfirm,
  invoice,
}) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">

        <div className="flex justify-center">

          <div className="bg-amber-100 p-4 rounded-full">

            <Undo2
              size={40}
              className="text-amber-600"
            />

          </div>

        </div>

        <h2 className="text-2xl font-bold text-center mt-5">
          Batalkan Transaksi
        </h2>

        <p className="text-center text-gray-500 mt-3">
          Yakin ingin membatalkan transaksi
          <br />

          <span className="font-semibold text-gray-800">
            "{invoice}"
          </span>
          ?
          <br />
          <span className="text-sm">
            Stok produk pada transaksi ini akan dikembalikan otomatis.
          </span>
        </p>

        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition"
          >
            Ya, Batalkan
          </button>

        </div>

      </div>

    </div>

  );

}
