import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">

      <h1 className="text-8xl font-black text-emerald-600 tracking-tight">
        404
      </h1>

      <h2 className="text-2xl font-bold text-gray-800 mt-4">
        Halaman Tidak Ditemukan
      </h2>

      <p className="text-gray-500 mt-2 max-w-md">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-sm"
      >
        Kembali ke Dashboard
      </Link>

    </div>
  );
}
