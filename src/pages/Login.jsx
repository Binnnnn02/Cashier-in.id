import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();

  const {
    admin,
    login,
  } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  if (admin) {

    return <Navigate to="/" replace />;

  }

  const handleLogin = (e) => {

    e.preventDefault();

    const result = login(
      email,
      password
    );

    if (result.success) {

      toast.success("Login berhasil");

      navigate("/", {
        replace: true,
      });

      return;

    }

    toast.error("Email atau password salah");

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-emerald-50">

      <form
        onSubmit={handleLogin}
        className="bg-white w-[420px] rounded-2xl shadow-xl p-8"
      >

        <h1 className="text-3xl font-bold text-center text-emerald-700">

          KasirKu POS

        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">

          Login Administrator

        </p>

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

        <div className="mb-6">

          <label className="block text-sm mb-2">

            Password

          </label>

          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />

        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-3 rounded-xl font-semibold"
        >

          Masuk

        </button>

        <div className="mt-6 text-center text-sm text-gray-500">

          © 2026 Berjuta Cafe POS

        </div>

      </form>

    </div>

  );

}
