import { useState } from "react";

import DashboardCard from "../components/dashboard/DashboardCard";
import ProductCard from "../components/product/ProductCard";
import Cart from "../components/cart/Cart";

import { useProducts } from "../context/ProductContext";

import {
  Package,
  ShoppingCart,
  Wallet,
  Boxes,
  Search,
} from "lucide-react";


export default function Dashboard() {

  const {
    products,
    addToCart,
    history,
  } = useProducts();


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
        total + Number(product.stock || 0),
      0
    );


  return (

    <div className="space-y-6 sm:space-y-8">


      {/* =========================
          DASHBOARD CARD
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
          title="Transaksi"
          value={totalTransactions}
          icon={ShoppingCart}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Pendapatan"
          value={`Rp${totalIncome.toLocaleString("id-ID")}`}
          icon={Wallet}
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Total Stok"
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
          gap-4
          sm:gap-6
        "
      >


        {/* =========================
            DAFTAR PRODUK
        ========================= */}

        <div className="xl:col-span-2">

          <div
            className="
              bg-white
              rounded-2xl
              shadow-sm
              p-4
              sm:p-6
            "
          >

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">

              <h2
                className="
                  text-xl
                  sm:text-2xl
                  font-bold
                "
              >
                Daftar Produk
              </h2>

              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Cari menu / produk..."
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

            </div>


            {/* CATEGORY FILTER */}

            <div
              className="
                flex
                flex-wrap
                gap-2
                sm:gap-3
                mb-5
                sm:mb-6
              "
            >

              {categories.map((category) => (

                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`
                    px-3
                    sm:px-4
                    py-2
                    rounded-xl
                    text-sm
                    sm:text-base
                    transition
                    ${
                      selectedCategory === category
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }
                  `}
                >
                  {category}
                </button>

              ))}

            </div>


            {/* PRODUCT GRID */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-3
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
                    onAdd={() =>
                      addToCart(product)
                    }
                  />

                ))

              ) : (

                <div
                  className="
                    col-span-full
                    py-10
                    text-center
                    text-gray-400
                  "
                >
                  Produk tidak ditemukan.
                </div>

              )}

            </div>

          </div>

        </div>


        {/* =========================
            KERANJANG
        ========================= */}

        <div className="w-full">

          <Cart />

        </div>


      </div>


    </div>

  );

}