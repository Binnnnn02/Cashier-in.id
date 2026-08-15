import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Search,
  Bell,
  UserCircle,
  PackageX,
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

  const [showNotif, setShowNotif] = useState(false);

  const notifRef = useRef(null);

  // Notifikasi stok mengikuti toggle di halaman Settings
  const stockNotifEnabled = JSON.parse(
    localStorage.getItem("stockNotif") ?? "true"
  );

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= 5
  );

  // Tutup dropdown saat klik di luar area notifikasi
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
    pageTitles[location.pathname] || "KasirKu";

  const adminName =
    admin?.name ||
    store?.cashier ||
    store?.owner ||
    "Admin";

  const handleSearch = (e) => {

    if (e.key === "Enter") {

      const keyword =
        e.target.value.trim();

      if (!keyword) return;

      navigate(
        `/products?search=${encodeURIComponent(
          keyword
        )}`
      );

    }

  };

  const goToProduct = (productName) => {

    setShowNotif(false);

    navigate(
      `/products?search=${encodeURIComponent(
        productName
      )}`
    );

  };

  return (

    <header
      className="
        bg-white
        rounded-2xl
        shadow-sm
        p-4
        sm:p-5
        lg:p-6
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
      "
    >

      {/* Bagian kiri */}

      <div className="min-w-0">

        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-gray-800
          "
        >
          {pageTitle}
        </h1>

        <p
          className="
            text-sm
            sm:text-base
            text-gray-500
            mt-1
          "
        >
          {today}
        </p>

      </div>


      {/* Bagian kanan */}

      <div
        className="
          flex
          items-center
          gap-2
          sm:gap-3
          lg:gap-4
          w-full
          lg:w-auto
        "
      >

        {/* Search */}

        <div
          className="
            relative
            flex-1
            lg:flex-none
          "
        >

          <Search
            size={18}
            className="
              absolute
              left-3
              sm:left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Cari produk..."
            onKeyDown={handleSearch}
            className="
              w-full
              lg:w-72
              pl-10
              sm:pl-11
              pr-4
              py-2.5
              sm:py-3
              rounded-xl
              border
              border-gray-200
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          />

        </div>


        {/* Notifikasi */}

        <div
          className="relative shrink-0"
          ref={notifRef}
        >

          <button
            onClick={() =>
              setShowNotif((prev) => !prev)
            }
            className="
              relative
              p-2.5
              sm:p-3
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              transition
            "
            aria-label="Notifikasi"
          >

            <Bell size={20} />

            {stockNotifEnabled && lowStockProducts.length > 0 && (

              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-red-600
                  text-white
                  text-[10px]
                  font-bold
                  rounded-full
                  w-5
                  h-5
                  flex
                  items-center
                  justify-center
                "
              >
                {lowStockProducts.length > 9
                  ? "9+"
                  : lowStockProducts.length}
              </span>

            )}

          </button>

          {showNotif && (

            <div
              className="
                absolute
                right-0
                mt-2
                w-80
                max-w-[90vw]
                bg-white
                rounded-xl
                shadow-lg
                border
                border-gray-100
                z-50
                max-h-96
                overflow-y-auto
              "
            >

              <div className="p-4 border-b">
                <h3 className="font-semibold">
                  Notifikasi Stok
                </h3>
              </div>

              {!stockNotifEnabled ? (

                <p className="p-4 text-sm text-gray-500">
                  Notifikasi stok dinonaktifkan. Aktifkan di halaman Pengaturan.
                </p>

              ) : lowStockProducts.length === 0 ? (

                <p className="p-4 text-sm text-gray-500">
                  Semua stok produk masih aman.
                </p>

              ) : (

                <div className="divide-y">

                  {lowStockProducts.map((product) => (

                    <button
                      key={product.id}
                      onClick={() =>
                        goToProduct(product.name)
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        p-4
                        hover:bg-gray-50
                        text-left
                        transition
                      "
                    >

                      <div
                        className={`
                          p-2
                          rounded-lg
                          shrink-0
                          ${
                            Number(product.stock) === 0
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        `}
                      >
                        <PackageX size={18} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="font-medium truncate">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {Number(product.stock) === 0
                            ? "Stok habis"
                            : `Sisa ${product.stock} pcs`}
                        </p>

                      </div>

                    </button>

                  ))}

                </div>

              )}

            </div>

          )}

        </div>


        {/* User */}

        <button
          onClick={() =>
            navigate("/account")
          }
          className="
            shrink-0
            flex
            items-center
            gap-2
            sm:gap-3
            bg-emerald-600
            text-white
            px-3
            sm:px-4
            py-2.5
            rounded-xl
            hover:bg-emerald-700
            transition
          "
        >

          <UserCircle size={22} />

          <span
            className="
              hidden
              sm:inline
              max-w-32
              truncate
            "
          >
            {adminName}
          </span>

        </button>

      </div>

    </header>

  );

}