import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Search,
  Bell,
  PackageX,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { useProducts } from "../../context/ProductContext";

const pageTitles = {
  "/": "Dashboard",
  "/products": "Katalog Produk",
  "/statistics": "Statistik Penjualan",
  "/settings": "Pengaturan Toko",
  "/account": "Akun Pengguna",
  "/history": "Riwayat Transaksi",
};

export default function Header() {

  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAuth();
  const { store } = useStore();
  const { products } = useProducts();

  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const stockNotifEnabled = store.stockNotif;

  const lowStockProducts = products.filter(
    (product) => !product.is_unlimited && Number(product.stock) <= 5
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date().toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const pageTitle =
    pageTitles[location.pathname] || store?.name || "Cashier-in";

  const adminName =
    admin?.name ||
    store?.owner ||
    (admin?.email ? admin.email.split("@")[0] : null) ||
    "Admin";

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const keyword = e.target.value.trim();
      if (!keyword) {
        navigate("/products");
        return;
      }
      navigate(`/products?search=${encodeURIComponent(keyword)}`);
    }
  };

  const goToProduct = (productName) => {
    setShowNotif(false);
    navigate(`/products?search=${encodeURIComponent(productName)}`);
  };

  return (
    <header
      className="
        relative
        z-30
        bg-white/85
        backdrop-blur-md
        border
        border-gray-200/70
        rounded-3xl
        shadow-sm
        p-4
        sm:p-5
        lg:px-7
        lg:py-5
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
        transition-all
      "
    >
      {/* Bagian kiri: Page Title & Date */}
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {pageTitle}
          </h1>
        </div>

        <p className="text-xs sm:text-sm font-medium text-gray-400 mt-1 flex items-center gap-1.5 pl-5">
          <span>{today}</span>
          <span>•</span>
          <span className="text-emerald-600 font-semibold">{store?.name || "Cashier-in"}</span>
        </p>
      </div>

      {/* Bagian kanan: Search, Notifikasi, User */}
      <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
        {/* Search */}
        <div className="relative flex-1 lg:flex-none">
          <Search
            size={18}
            className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari menu atau produk..."
            onKeyDown={handleSearch}
            className="
              w-full
              lg:w-72
              pl-10
              sm:pl-11
              pr-4
              py-2.5
              sm:py-3
              rounded-2xl
              bg-gray-50/80
              border
              border-gray-200/80
              text-sm
              font-medium
              text-gray-700
              placeholder-gray-400
              focus:outline-none
              focus:bg-white
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-500/10
              transition-all
            "
          />
        </div>

        {/* Notifikasi */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            onClick={() => setShowNotif((prev) => !prev)}
            className={`
              relative
              p-2.5
              sm:p-3
              rounded-2xl
              border
              transition-all
              duration-200
              ${
                showNotif
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                  : "bg-gray-50/80 border-gray-200/80 text-gray-600 hover:bg-emerald-50/60 hover:border-emerald-200 hover:text-emerald-700"
              }
            `}
            aria-label="Notifikasi Stok"
          >
            <Bell size={20} className="stroke-[2.2]" />

            {stockNotifEnabled && lowStockProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm animate-scale-in">
                {lowStockProducts.length > 9 ? "9+" : lowStockProducts.length}
              </span>
            )}
          </button>

          {showNotif && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-84
                max-w-[92vw]
                bg-white
                rounded-3xl
                shadow-2xl
                border
                border-gray-100
                z-50
                max-h-96
                overflow-hidden
                flex
                flex-col
                animate-slide-down
              "
              style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }}
            >
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/70 to-emerald-100/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-emerald-700" />
                  <h3 className="font-bold text-gray-800 text-sm">
                    Peringatan Stok
                  </h3>
                </div>
                {lowStockProducts.length > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {lowStockProducts.length} Item
                  </span>
                )}
              </div>

              <div className="overflow-y-auto max-h-72 p-2">
                {!stockNotifEnabled ? (
                  <p className="p-5 text-sm text-gray-500 text-center">
                    Notifikasi stok dinonaktifkan. Aktifkan di menu Pengaturan.
                  </p>
                ) : lowStockProducts.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <Sparkles size={20} />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Semua Stok Aman</p>
                    <p className="text-xs text-gray-400 mt-0.5">Tidak ada produk yang menipis</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {lowStockProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => goToProduct(product.name)}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          p-3
                          rounded-2xl
                          hover:bg-emerald-50/60
                          text-left
                          transition-colors
                          group
                        "
                      >
                        <div
                          className={`
                            p-2.5
                            rounded-xl
                            shrink-0
                            ${
                              Number(product.stock) === 0
                                ? "bg-rose-100 text-rose-600"
                                : "bg-amber-100 text-amber-700"
                            }
                          `}
                        >
                          <PackageX size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-emerald-700 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">
                            {Number(product.stock) === 0 ? (
                              <span className="text-rose-600 font-bold">Stok Habis (0 pcs)</span>
                            ) : (
                              <span className="text-amber-600 font-bold">Tersisa {product.stock} pcs</span>
                            )}
                          </p>
                        </div>

                        <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Button */}
        <button
          onClick={() => navigate("/account")}
          className="
            shrink-0
            flex
            items-center
            gap-2.5
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-3.5
            sm:px-4
            py-2
            sm:py-2.5
            rounded-2xl
            shadow-sm
            shadow-emerald-600/20
            hover:shadow-md
            hover:shadow-emerald-600/30
            active:scale-95
            transition-all
            duration-200
          "
        >
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs uppercase">
            {adminName.charAt(0)}
          </div>

          <span className="hidden sm:inline font-semibold text-sm max-w-28 truncate">
            {adminName}
          </span>
        </button>
      </div>
    </header>
  );
}