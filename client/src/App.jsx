import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { useStore } from "./context/StoreContext";
import { getSubscriptionAccess } from "./lib/subscription";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import History from "./pages/History";

import Landing from "./pages/Landing";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import SubscriptionLocked from "./pages/SubscriptionLocked";
import NotFound from "./pages/NotFound";


function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <p className="text-emerald-700 font-medium">
        Memuat...
      </p>
    </div>
  );
}


export default function App() {

  const { admin, authLoading } = useAuth();

  const { store, storeLoading } = useStore();


  // Masih mengecek sesi login
  if (authLoading) {
    return <LoadingScreen />;
  }


  // Halaman utama
  const renderProtectedArea = () => {

    // BELUM LOGIN
    // Tampilkan landing page
    if (!admin) {
      return <Landing />;
    }


    // SUDAH LOGIN
    // Tunggu data toko
    if (storeLoading) {
      return <LoadingScreen />;
    }


    // Cek subscription
    const access = getSubscriptionAccess(store);


    if (!access.allowed) {
      return (
        <SubscriptionLocked
          reason={access.reason}
        />
      );
    }


    // Sudah login + subscription aktif
    return <MainLayout />;
  };


  return (
    <Routes>

      {/* =========================
          HALAMAN UTAMA
      ========================= */}

      <Route
        path="/"
        element={renderProtectedArea()}
      >

        {/* Dashboard setelah login */}

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


      {/* =========================
          LOGIN
      ========================= */}

      <Route
        path="/login"
        element={
          admin
            ? <Navigate to="/" replace />
            : <Login />
        }
      />


      {/* =========================
          REGISTER
      ========================= */}

      <Route
        path="/register"
        element={
          admin
            ? <Navigate to="/" replace />
            : <Register />
        }
      />


      {/* =========================
          CONFIRM EMAIL
      ========================= */}

      <Route
        path="/confirm-email"
        element={
          admin
            ? <Navigate to="/" replace />
            : <ConfirmEmail />
        }
      />


      {/* =========================
          404
      ========================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}