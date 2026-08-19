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
} from "lucide-react";


export default function Dashboard() {

  const {
    products,
    addToCart,
    history,
  } = useProducts();


  const [selectedCategory, setSelectedCategory] =
    useState("Semua");


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

  const filteredProducts =
    selectedCategory === "Semua"
      ? products
      : products.filter(
          (product) =>
            product.category === selectedCategory
        );


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

            <h2
              className="
                text-xl
                sm:text-2xl
                font-bold
                mb-5
                sm:mb-6
              "
            >
              Daftar Produk
            </h2>


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