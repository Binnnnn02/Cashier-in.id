import { useState } from "react";
import {
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Register() {

  const navigate = useNavigate();

  const { admin, register } = useAuth();

  const [storeName, setStoreName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  if (admin) {

    return <Navigate to="/" replace />;

  }

  const handleRegister = async (e) => {

    e.preventDefault();

    if (password.length < 6) {

      toast.error("Password minimal 6 karakter");

      return;

    }

    if (password !== confirmPassword) {

      toast.error("Konfirmasi password tidak cocok");

      return;

    }

    setLoading(true);

    const result = await register(
      email,
      password,
      storeName
    );

    setLoading(false);

    if (!result.success) {

      toast.error(
        result.message || "Pendaftaran gagal"
      );

      return;

    }

    if (result.needsEmailConfirm) {

      toast.success(
        "Pendaftaran berhasil. Cek email untuk konfirmasi sebelum login.",
        { duration: 6000 }
      );

    } else {

      toast.success("Pendaftaran berhasil, silakan login");

    }

    navigate("/login", { replace: true });

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-10">

      <form
        onSubmit={handleRegister}
        className="bg-white w-[420px] rounded-2xl shadow-xl p-8"
      >

        <h1 className="text-3xl font-bold text-center text-emerald-700">

          Cashier-in

        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">

          Daftarkan toko Anda

        </p>

        <div className="mb-4">

          <label className="block text-sm mb-2">
            Nama Toko
          </label>

          <input
            type="text"
            placeholder="Contoh: Kopi Senja"
            value={storeName}
            onChange={(e) =>
              setStoreName(e.target.value)
            }
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

        </div>

        <div className="mb-4">

          <label className="block text-sm mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

        </div>

        <div className="mb-4">

          <label className="block text-sm mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

        </div>

        <div className="mb-6">

          <label className="block text-sm mb-2">
            Konfirmasi Password
          </label>

          <input
            type="password"
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-3 rounded-xl font-semibold disabled:opacity-60"
        >

          {loading ? "Memproses..." : "Daftar"}

        </button>

        <p className="text-center text-sm text-gray-500 mt-6">

          Sudah punya akun?{" "}

          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Masuk di sini
          </Link>

        </p>

      </form>

    </div>

  );

}