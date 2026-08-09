import {
  Search,
  Bell,
  UserCircle,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
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

        <button
          className="
            shrink-0
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

        </button>


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