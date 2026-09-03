import { useState } from "react";
import {
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Login() {

  const navigate = useNavigate();
  const { admin, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (admin) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Login berhasil! Selamat datang kembali.");
      navigate("/", { replace: true });
      return;
    }

    toast.error(
      result.message || "Email atau password salah"
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-gray-800">

      {/* LEFT BRANDING PANEL (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-emerald-300 text-emerald-950 rounded-2xl shadow-lg">
            <Store size={26} className="stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Cashier-in
          </span>
        </div>

        {/* Main Pitch */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-bold border border-white/15">
            <Sparkles size={14} className="text-emerald-300" />
            <span>Aplikasi Kasir Point of Sale Modern</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
            Kemudahan Kasir <br />
            <span className="bg-gradient-to-r from-emerald-300 to-white bg-clip-text text-transparent">
              Untuk Bisnis & UMKM
            </span>
          </h2>

          <p className="text-emerald-100/80 text-base leading-relaxed">
            Catat penjualan, pantau stok barang real-time, cetak struk thermal, dan ekspor laporan keuangan harian dalam satu aplikasi.
          </p>

          <div className="pt-4 space-y-3">
            {[
              "Pencatatan transaksi kasir cepat & responsif",
              "Perhitungan pajak, diskon, & kembalian otomatis",
              "Laporan statistik pendapatan & ekspor PDF / Excel",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-emerald-100/90 text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-emerald-300/60 font-medium">
          © 2026 Cashier-in • Hak Cipta Dilindungi
        </div>
      </div>


      {/* RIGHT FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-gradient-to-br from-white via-white to-emerald-50/40 relative">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white rounded-2xl shadow-md">
              <Store size={22} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-emerald-950">
              Cashier-in
            </span>
          </div>

          {/* Form Header */}
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-sm font-medium text-gray-400 mt-1.5">
              Masukkan email dan password untuk masuk ke dashboard kasir.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Email Toko
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="nama@toko.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3.5
                    bg-gray-50/80
                    border
                    border-gray-200
                    rounded-2xl
                    text-sm
                    font-medium
                    text-gray-900
                    placeholder-gray-400
                    focus:outline-none
                    focus:bg-white
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    transition-all
                  "
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    pl-11
                    pr-12
                    py-3.5
                    bg-gray-50/80
                    border
                    border-gray-200
                    rounded-2xl
                    text-sm
                    font-medium
                    text-gray-900
                    placeholder-gray-400
                    focus:outline-none
                    focus:bg-white
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    transition-all
                  "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-4
                bg-gradient-to-r
                from-emerald-600
                via-emerald-600
                to-emerald-700
                hover:from-emerald-700
                hover:to-emerald-800
                text-white
                font-extrabold
                text-sm
                rounded-2xl
                shadow-lg
                shadow-emerald-600/25
                hover:shadow-xl
                hover:shadow-emerald-600/35
                flex
                items-center
                justify-center
                gap-2
                transition-all
                active:scale-98
                disabled:opacity-60
              "
            >
              <span>{loading ? "Memproses Verifikasi..." : "Masuk ke Dashboard"}</span>
              {!loading && <ArrowRight size={16} />}
            </button>

          </form>

          {/* Register Link */}
          <div className="pt-4 text-center">
            <p className="text-sm font-medium text-gray-500">
              Belum punya akun toko?{" "}
              <Link
                to="/register"
                className="text-emerald-700 font-extrabold hover:text-emerald-800 hover:underline"
              >
                Daftar sekarang gratis
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}