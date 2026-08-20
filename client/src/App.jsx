import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { useStore } from "./context/StoreContext";
import { getSubscriptionAccess } from "./lib/subscription";

import MainLayout from "./layouts/MainLayout";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import History from "./pages/History";
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

  const location = useLocation();

  // Masih mengecek sesi login (auto-login) saat app pertama dibuka
  if (authLoading) {

    return <LoadingScreen />;

  }

  // Halaman utama: butuh login DAN langganan aktif/trial
  const renderProtectedArea = () => {

    if (!admin) {

      // Belum login, tapi lagi di halaman utama -> tampilkan Landing publik
      if (location.pathname === "/") {

        return <Landing />;

      }

      return <Navigate to="/login" replace />;

    }

    if (storeLoading) {

      return <LoadingScreen />;

    }

    const access = getSubscriptionAccess(store);

    if (!access.allowed) {

      return <SubscriptionLocked reason={access.reason} />;

    }

    return <MainLayout />;

  };

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

      {/* Konfirmasi email setelah daftar */}

      <Route
        path="/confirm-email"
        element={
          admin
            ? <Navigate to="/" replace />
            : <ConfirmEmail />
        }
      />

      {/* Semua halaman harus login DAN langganan aktif/trial */}

      <Route
        path="/"
        element={renderProtectedArea()}
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