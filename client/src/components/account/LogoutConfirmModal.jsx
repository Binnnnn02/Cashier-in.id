import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

export default function LogoutConfirmModal({ open, onClose, onConfirm }) {

  if (!open) return null;

  return createPortal(

    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-[400px] max-w-full p-6 shadow-2xl"
      >

        <div className="flex justify-center">

          <div className="bg-rose-50 p-4 rounded-full">
            <LogOut size={32} className="text-rose-600" />
          </div>

        </div>

        <h2 className="text-xl font-black text-gray-900 text-center mt-5">
          Keluar dari Akun?
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2">
          Kamu perlu login lagi untuk mengakses Cashier-in setelah ini.
        </p>

        <div className="flex gap-3 mt-7">

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 font-bold text-sm text-gray-600 transition"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold text-sm text-white transition"
          >
            Ya, Keluar
          </button>

        </div>

      </div>

    </div>,

    document.body

  );

}
