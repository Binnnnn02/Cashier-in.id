import { TriangleAlert } from "lucide-react";

export default function DeleteModal({
  open,
  onClose,
  onDelete,
  productName,
}) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl">

        <div className="flex justify-center">

          <div className="bg-red-100 p-4 rounded-full">

            <TriangleAlert
              size={40}
              className="text-red-600"
            />

          </div>

        </div>

        <h2 className="text-2xl font-bold text-center mt-5">
          Hapus Produk
        </h2>

        <p className="text-center text-gray-500 mt-3">
          Yakin ingin menghapus produk
          <br />

          <span className="font-semibold text-gray-800">
            "{productName}"
          </span>
          ?
        </p>

        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
          >
            Batal
          </button>

          <button
            onClick={onDelete}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
          >
            Hapus
          </button>

        </div>

      </div>

    </div>

  );

}