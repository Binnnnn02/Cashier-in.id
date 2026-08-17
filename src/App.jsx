import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

export default function App() {

  const { admin, authLoading } = useAuth();

  // Masih mengecek sesi login (auto-login) saat app pertama dibuka
  if (authLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-emerald-50">

        <p className="text-emerald-700 font-medium">
          Memuat...
        </p>

      </div>

    );

  }

  return (

    <Routes>

      {/* Login */}

      <Route
        path="/login"
        element={
          admin
            ? <Navigate to="/" replace />
            : <Login />
        }
      />

      {/* Register */}

      <Route
        path="/register"
        element={
          admin
            ? <Navigate to="/" replace />
            : <Register />
        }
      />

      {/* Semua halaman harus login */}

      <Route
        path="/"
        element={
          admin
            ? <MainLayout />
            : <Navigate to="/login" replace />
        }
      >

        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="products"
          element={<Products />}
        />

        <Route
          path="statistics"
          element={<Statistics />}
        />

        <Route
          path="history"
          element={<History />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />

        <Route
          path="account"
          element={<Account />}
        />

      </Route>

      {/* 404 */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );

}