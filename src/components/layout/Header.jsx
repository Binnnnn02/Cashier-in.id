// src/components/layout/Header.jsx
import { useMemo, useState } from "react";
import { Bell, Search, UserCircle, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useStore } from "../../context/StoreContext";

const pageTitles = {
  "/": "Dashboard",
  "/products": "Produk",
  "/statistics": "Statistik",
  "/settings": "Pengaturan",
  "/account": "Akun",
  "/history": "Riwayat",
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAuth();
  const { store } = useStore();
  const { products } = useProducts();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = useMemo(
    () => products.filter((product) => Number(product.stock) <= 5),
    [products]
  );

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const pageTitle = pageTitles[location.pathname] || "KasirKu";
  const adminName = admin?.name || store?.cashier || store?.owner || "Admin";

  const submitSearch = (event) => {
    event.preventDefault();

    const keyword = search.trim();

    navigate(
      keyword
        ? `/products?search=${encodeURIComponent(keyword)}`
        : "/products"
    );
  };

  return (
    <header className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          {pageTitle}
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          {today}
        </p>
      </div>

      <div className="flex w-full items-center gap-2 sm:gap-3 lg:w-auto lg:gap-4">
        <form
          onSubmit={submitSearch}
          className="relative min-w-0 flex-1 lg:w-72 lg:flex-none"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:left-4"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 sm:py-3 sm:pl-11"
          />
        </form>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowNotifications((value) => !value)}
            className="relative rounded-xl bg-gray-100 p-2.5 transition hover:bg-gray-200 sm:p-3"
            aria-label="Notifikasi stok"
          >
            <Bell size={20} />

            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <p className="font-bold text-gray-800">Notifikasi stok</p>
                  <p className="text-xs text-gray-500">Stok 5 atau kurang</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-5 text-center text-sm text-gray-500">
                    Semua stok aman.
                  </p>
                ) : (
                  notifications.map((product) => {
                    const outOfStock = Number(product.stock) === 0;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          navigate(
                            `/products?search=${encodeURIComponent(
                              product.name
                            )}`
                          );
                          setShowNotifications(false);
                        }}
                        className="flex w-full items-center justify-between gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {outOfStock ? "Stok habis" : "Stok menipis"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            outOfStock
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {product.stock} pcs
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate("/account")}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-white transition hover:bg-emerald-700 sm:gap-3 sm:px-4"
        >
          <UserCircle size={22} />

          <span className="hidden max-w-32 truncate sm:inline">
            {adminName}
          </span>
        </button>
      </div>
    </header>
  );
}