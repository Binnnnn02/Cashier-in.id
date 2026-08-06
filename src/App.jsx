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
import NotFound from "./pages/NotFound";

export default function App() {

  const { admin } = useAuth();

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