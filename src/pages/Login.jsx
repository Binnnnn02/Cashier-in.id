import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();

  const { admin, setAdmin } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  if (admin) {
    return <Navigate to="/" replace />;
  }

  const login = (e) => {

    e.preventDefault();

    if (

      email === "admin@berjuta.com" &&
      password === "123456"

    ) {

      setAdmin({

        email,

      });

      toast.success("Login berhasil");

      navigate("/");

      return;

    }

    toast.error("Email atau password salah");

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={login}
        className="bg-white p-8 rounded-2xl shadow-md w-[400px]"
      >

        <h1 className="text-3xl font-bold text-center mb-2">
          BERJUTA CAFE
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login Administrator
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl p-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl p-3 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-3 rounded-xl"
        >
          Masuk
        </button>

      </form>

    </div>

  );

}