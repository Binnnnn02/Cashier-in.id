import { useState } from "react";

import DashboardCard from "../components/dashboard/DashboardCard";
import ProductCard from "../components/product/ProductCard";
import Cart from "../components/cart/Cart";

import { useProducts } from "../context/ProductContext";
import { useStore } from "../context/StoreContext";

import {
  Package,
  ShoppingCart,
  Wallet,
  Boxes,
  Search,
  Sparkles,
  Layers,
} from "lucide-react";


export default function Dashboard() {

  const {
    products,
    addToCart,
    history,
  } = useProducts();

  const { store } = useStore();

  const [selectedCategory, setSelectedCategory] =
    useState("Semua");

  const [dashboardSearch, setDashboardSearch] =
    useState("");


  /* =========================
     CATEGORY
  ========================= */

  const categories = [
    "Semua",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];


  /* =========================
     FILTER PRODUCT
  ========================= */

  const filteredProducts = products.filter((product) => {

    const matchCategory =
      selectedCategory === "Semua" ||
      product.category === selectedCategory;

    const matchSearch =
      !dashboardSearch ||
      product.name?.toLowerCase().includes(dashboardSearch.toLowerCase());

    return matchCategory && matchSearch;

  });


  /* =========================
     DASHBOARD DATA
  ========================= */

  const activeHistory = history.filter(
    (trx) => trx.status !== "void"
  );

  const totalIncome =
    activeHistory.reduce(
      (sum, trx) =>
        sum + Number(trx.total || 0),
      0
    );

  const totalTransactions =
    activeHistory.length;

  const totalStock =
    products.reduce(
      (total, product) =>
        product.is_unlimited
          ? total
          : total + Number(product.stock || 0),
      0
    );


  return (

    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      {/* =========================
          HERO BANNER
      ========================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 border border-emerald-600/30">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3 border border-white/20">
              <Sparkles size={13} className="text-emerald-300" />
              <span>Sistem Kasir Pintar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Selamat Datang di {store?.name || "Cashier-in"}
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base mt-1 max-w-xl">
              Kelola kasir, pantau stok barang, dan proses transaksi penjualan secara mudah & cepat.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 shrink-0">
            <div className="p-2.5 rounded-xl bg-emerald-500/30 text-emerald-200">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-xs text-emerald-200 uppercase font-bold tracking-wider">Total Menu</p>
              <p className="text-xl font-black text-white">{products.length} Produk</p>
            </div>
          </div>
        </div>
      </div>


      {/* =========================
          DASHBOARD STAT CARDS
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
          sm:gap-6
        "
      >

        <DashboardCard
          title="Jumlah Produk"
          value={products.length}
          icon={Package}
          color="bg-emerald-600"
        />

        <DashboardCard
          title="Transaksi Selesai"
          value={totalTransactions}
          icon={ShoppingCart}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Total Pendapatan"
          value={`Rp${totalIncome.toLocaleString("id-ID")}`}
          icon={Wallet}
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Total Stok Barang"
          value={totalStock}
          icon={Boxes}
          color="bg-purple-600"
        />

      </div>


      {/* =========================
          PRODUK & KERANJANG
      ========================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        {/* =========================
            DAFTAR PRODUK SECTION
        ========================= */}

        <div className="xl:col-span-2">

          <div
            className="
              bg-gradient-to-b
              from-white
              via-white
              to-emerald-50/20
              rounded-3xl
              shadow-sm
              border
              border-emerald-100/60
              p-5
              sm:p-7
            "
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
          >

            {/* HEADER & QUICK SEARCH */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

              <div>
                <h3
                  className="
                    text-xl
                    sm:text-2xl
                    font-extrabold
                    text-gray-900
                    tracking-tight
                  "
                >
                  Pilih Produk
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
                  Klik kartu untuk menambahkan item ke keranjang
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Cari menu / produk..."
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5
                    text-sm
                    bg-gray-50/80
                    border
                    border-gray-200
                    rounded-2xl
                    focus:outline-none
                    focus:bg-white
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    transition-all
                  "
                />
              </div>

            </div>


            {/* CATEGORY FILTER PILLS */}

            <div
              className="
                flex
                items-center
                gap-2
                overflow-x-auto
                pb-2
                mb-6
                no-scrollbar
              "
            >

              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4
                      py-2
                      rounded-2xl
                      text-xs
                      sm:text-sm
                      font-bold
                      whitespace-nowrap
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-600/20 scale-105"
                          : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200/80"
                      }
                    `}
                  >
                    {category}
                  </button>
                );
              })}

            </div>


            {/* PRODUCT GRID */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
                sm:gap-5
              "
            >

              {filteredProducts.length > 0 ? (

                filteredProducts.map((product) => (

                  <ProductCard
                    key={product.id}
                    name={product.name}
                    image={product.image}
                    emoji={product.emoji}
                    price={`Rp${Number(
                      product.price || 0
                    ).toLocaleString("id-ID")}`}
                    stock={product.stock}
                    isUnlimited={product.is_unlimited}
                    onAdd={() =>
                      addToCart(product)
                    }
                  />

                ))

              ) : (

                <div
                  className="
                    col-span-full
                    py-16
                    px-4
                    text-center
                    bg-gray-50/50
                    rounded-3xl
                    border
                    border-dashed
                    border-gray-200
                  "
                >
                  <Package size={36} className="mx-auto text-gray-300 mb-2" />
                  <p className="font-semibold text-gray-600">Produk tidak ditemukan</p>
                  <p className="text-xs text-gray-400 mt-1">Coba kata kunci pencarian atau kategori lain</p>
                </div>

              )}

            </div>

          </div>

        </div>


        {/* =========================
            KERANJANG (POS CART)
        ========================= */}

        <div className="w-full">

          <Cart />

        </div>


      </div>


    </div>

  );

}