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

  const categories = [
    "Semua",
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  const filteredProducts =
    selectedCategory === "Semua"
      ? products
      : products.filter(
          (product) =>
            product.category === selectedCategory
        );

  const totalIncome = history.reduce(
    (sum, trx) => sum + trx.total,
    0
  );

  const totalTransactions = history.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock),
    0
  );

  return (
    <div className="space-y-8">

      {/* Dashboard Card */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">

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

      {/* Produk & Keranjang */}

      <div className="grid grid-cols-1 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-6">
              Daftar Produk
            </h2>

            {/* Filter */}

            <div className="flex flex-wrap gap-3 mb-6">

              {categories.map((category) => (

                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`px-4 py-2 rounded-xl transition ${
                    selectedCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>

              ))}

            </div>

            {/* Produk */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  name={product.name}
                  image={product.image}
                  emoji={product.emoji}
                  price={`Rp${product.price.toLocaleString(
                    "id-ID"
                  )}`}
                  stock={product.stock}
                  onAdd={() => addToCart(product)}
                />

              ))}

            </div>

          </div>

        </div>

        <Cart />

      </div>

    </div>
  );
}
