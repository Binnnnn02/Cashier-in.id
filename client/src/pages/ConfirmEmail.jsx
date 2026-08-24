import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function ConfirmEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-6">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={32} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Konfirmasi Email
        </h1>

        <p className="text-gray-500 mt-3 leading-relaxed">
          Silakan cek email kamu dan klik link konfirmasi
          untuk mengaktifkan akun.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-sm"
        >
          Ke Halaman Login
        </Link>
      </div>
    </div>
  );
}