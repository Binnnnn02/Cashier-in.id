import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

import ProductModal from "../components/product/ProductModal";
import DeleteModal from "../components/product/DeleteModal";
import { useProducts } from "../context/ProductContext";

export default function Product() {
  const { products, setProducts } = useProducts();

  const [searchParams] = useSearchParams();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [search, setSearch] =
    useState(() => searchParams.get("search") || "");

  const [categoryFilter, setCategoryFilter] =
    useState("Semua");

  const [sortBy, setSortBy] =
    useState("default");

  const [deleteProductId, setDeleteProductId] =
    useState(null);

  const [editProduct, setEditProduct] =
    useState(null);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);


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
    products.filter((product) => {

      const matchSearch =
        product.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchCategory =
        categoryFilter === "Semua" ||
        product.category === categoryFilter;

      return (
        matchSearch &&
        matchCategory
      );

    });


  /* =========================
     SORT PRODUCT
  ========================= */

  const sortedProducts =
    [...filteredProducts];

  if (sortBy === "priceAsc") {

    sortedProducts.sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    );

  }

  if (sortBy === "priceDesc") {

    sortedProducts.sort(
      (a, b) =>
        Number(b.price) -
        Number(a.price)
    );

  }

  if (sortBy === "stockAsc") {

    sortedProducts.sort(
      (a, b) =>
        Number(a.stock) -
        Number(b.stock)
    );

  }

  if (sortBy === "stockDesc") {

    sortedProducts.sort(
      (a, b) =>
        Number(b.stock) -
        Number(a.stock)
    );

  }


  /* =========================
     ADD / EDIT PRODUCT
  ========================= */

  const saveProduct = (newProduct) => {

    if (newProduct.id) {

      setProducts(
        products.map((product) =>
          product.id === newProduct.id
            ? newProduct
            : product
        )
      );

    } else {

      setProducts([
        ...products,
        {
          ...newProduct,
          id: Date.now(),
        },
      ]);

    }

  };


  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteProduct = () => {

    if (deleteProductId === null)
      return;

    setProducts(
      products.filter(
        (product) =>
          product.id !== deleteProductId
      )
    );

    setDeleteProductId(null);

  };


  return (

    <div className="space-y-6">


      {/* =========================
          HEADER
      ========================= */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >

        <div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Produk
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Kelola seluruh produk kasir.
          </p>

        </div>


        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="
            w-full
            sm:w-auto
            justify-center
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-5
            py-3
            rounded-xl
            flex
            items-center
            gap-2
            transition
          "
        >

          <Plus size={20} />

          Tambah Produk

        </button>

      </div>


      {/* =========================
          SEARCH & FILTER
      ========================= */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-sm
          p-4
          sm:p-5
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
            w-full
            lg:w-auto
          "
        >


          {/* Search */}

          <div className="relative w-full sm:w-72">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                pl-10
                pr-4
                py-3
                border
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
              "
            />

          </div>


          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="
              w-full
              sm:w-auto
              border
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          >

            {categories.map(
              (category) => (

                <option
                  key={category}
                  value={category}
                >

                  {category}

                </option>

              )
            )}

          </select>


          {/* Sort */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="
              w-full
              sm:w-auto
              border
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          >

            <option value="default">
              Urutkan
            </option>

            <option value="priceAsc">
              Harga Terendah
            </option>

            <option value="priceDesc">
              Harga Tertinggi
            </option>

            <option value="stockAsc">
              Stok Terendah
            </option>

            <option value="stockDesc">
              Stok Tertinggi
            </option>

          </select>

        </div>


        {/* Total */}

        <div
          className="
            flex
            items-center
            gap-2
            text-gray-500
            font-medium
            whitespace-nowrap
          "
        >

          <Package
            size={18}
            className="text-emerald-600"
          />

          <span>
            {sortedProducts.length} dari{" "}
            {products.length} Produk
          </span>

        </div>

      </div>


      {/* =========================
          MODAL ADD
      ========================= */}

      <ProductModal
        open={isModalOpen}
        product={null}
        onClose={() =>
          setIsModalOpen(false)
        }
        onSave={saveProduct}
      />


      {/* =========================
          MODAL EDIT
      ========================= */}

      <ProductModal
        open={editProduct !== null}
        product={editProduct}
        onClose={() =>
          setEditProduct(null)
        }
        onSave={(updatedProduct) => {

          setProducts(
            products.map(
              (product) =>
                product.id ===
                updatedProduct.id
                  ? updatedProduct
                  : product
            )
          );

          setEditProduct(null);

        }}
      />


      {/* =========================
          DELETE MODAL
      ========================= */}

      <DeleteModal
        open={
          deleteProductId !== null
        }
        productName={
          products.find(
            (product) =>
              product.id ===
              deleteProductId
          )?.name
        }
        onClose={() =>
          setDeleteProductId(null)
        }
        onDelete={deleteProduct}
      />


      {/* =========================
          TABLE
      ========================= */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead className="bg-emerald-600 text-white">

              <tr>

                <th className="text-left px-4 sm:px-6 py-4">
                  Nama Produk
                </th>

                <th className="text-left px-4 sm:px-6 py-4">
                  Kategori
                </th>

                <th className="text-left px-4 sm:px-6 py-4">
                  Harga
                </th>

                <th className="text-left px-4 sm:px-6 py-4">
                  Stok
                </th>

                <th className="text-center px-4 sm:px-6 py-4">
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody>

              {sortedProducts.length > 0 ? (

                sortedProducts.map(
                  (product) => (

                    <tr
                      key={product.id}
                      className="
                        border-b
                        hover:bg-gray-50
                        transition
                      "
                    >

                      {/* Nama */}

                      <td className="px-4 sm:px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              w-10
                              h-10
                              shrink-0
                              bg-emerald-50
                              rounded-xl
                              flex
                              items-center
                              justify-center
                              text-xl
                            "
                          >

                            {product.image ? (

                              <img
                                src={product.image}
                                alt={product.name}
                                className="
                                  w-full
                                  h-full
                                  object-cover
                                  rounded-xl
                                "
                              />

                            ) : (

                              product.emoji || "📦"

                            )}

                          </div>


                          <span className="font-medium">

                            {product.name}

                          </span>

                        </div>

                      </td>


                      {/* Kategori */}

                      <td className="px-4 sm:px-6 py-4">

                        <span
                          className="
                            bg-emerald-50
                            text-emerald-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            whitespace-nowrap
                          "
                        >

                          {product.category}

                        </span>

                      </td>


                      {/* Harga */}

                      <td className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">

                        Rp
                        {Number(
                          product.price
                        ).toLocaleString(
                          "id-ID"
                        )}

                      </td>


                      {/* Stok */}

                      <td className="px-4 sm:px-6 py-4">

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium
                            ${
                              Number(product.stock) === 0
                                ? "bg-red-100 text-red-600"
                                : Number(product.stock) <= 5
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-emerald-100 text-emerald-700"
                            }
                          `}
                        >

                          {product.stock} pcs

                        </span>

                      </td>


                      {/* Aksi */}

                      <td className="px-4 sm:px-6 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              setEditProduct(
                                product
                              )
                            }
                            className="
                              bg-blue-500
                              hover:bg-blue-600
                              text-white
                              p-2
                              rounded-lg
                              transition
                            "
                            title="Edit Produk"
                          >

                            <Pencil size={18} />

                          </button>


                          <button
                            onClick={() =>
                              setDeleteProductId(
                                product.id
                              )
                            }
                            className="
                              bg-red-500
                              hover:bg-red-600
                              text-white
                              p-2
                              rounded-lg
                              transition
                            "
                            title="Hapus Produk"
                          >

                            <Trash2 size={18} />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="
                      py-16
                      text-center
                      text-gray-500
                    "
                  >

                    Produk tidak ditemukan.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}