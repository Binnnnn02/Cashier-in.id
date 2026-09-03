import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  FileDown,
  FileSpreadsheet,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import ProductModal from "../components/product/ProductModal";
import DeleteModal from "../components/product/DeleteModal";
import { useProducts } from "../context/ProductContext";

export default function Product() {

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [search, setSearch] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  // Sinkron kalau ada ?search= baru dari Header (mis. klik notifikasi stok)
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearch(urlSearch);
  }

  const [categoryFilter, setCategoryFilter] =
    useState("Semua");

  const [sortBy, setSortBy] =
    useState("default");

  const [deleteProductId, setDeleteProductId] =
    useState(null);

  const [editProduct, setEditProduct] =
    useState(null);


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

  const handleSaveProduct = async (productData) => {

    if (productData.id) {

      await updateProduct(productData);

    } else {

      await addProduct(productData);

    }

  };


  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleConfirmDelete = async () => {

    if (deleteProductId === null)
      return;

    await deleteProduct(deleteProductId);

    setDeleteProductId(null);

  };


  /* =========================
     STOCK STATUS
  ========================= */

  const getStockStatus = (stock) => {

    if (Number(stock) === 0) return "Habis";

    if (Number(stock) <= 5) return "Menipis";

    return "Aman";

  };


  /* =========================
     EXPORT PDF & EXCEL
  ========================= */

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Daftar Produk & Stok", 14, 18);

    doc.setFontSize(11);
    doc.text(
      `Tanggal Cetak : ${new Date().toLocaleString("id-ID")}`,
      14,
      26
    );

    autoTable(doc, {

      startY: 34,

      head: [[
        "Nama Produk",
        "Kategori",
        "Harga",
        "Stok",
        "Status",
      ]],

      body: sortedProducts.map((product) => [
        product.name,
        product.category || "-",
        `Rp${Number(product.price).toLocaleString("id-ID")}`,
        `${product.stock} pcs`,
        getStockStatus(product.stock),
      ]),

      styles: { fontSize: 9 },

      headStyles: { fillColor: [5, 150, 105] },

    });

    doc.save("Daftar-Produk.pdf");

  };

  const downloadExcel = () => {

    const data = sortedProducts.map((product) => ({

      "Nama Produk": product.name,
      "Kategori": product.category || "-",
      "Harga": product.price,
      "Stok": product.stock,
      "Status": getStockStatus(product.stock),

    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Produk"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(file, "Daftar-Produk.xlsx");

  };


  return (

    <div className="space-y-6 sm:space-y-8 animate-fade-in">


      {/* =========================
          HEADER & ACTIONS
      ========================= */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        <div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Katalog Produk
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Kelola inventaris, sesuaikan harga jual, dan pantau ketersediaan stok produk.
          </p>

        </div>


        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">

          <button
            onClick={downloadPDF}
            className="
              flex-1
              sm:flex-none
              bg-white
              hover:bg-rose-50
              text-rose-700
              border
              border-rose-200
              px-4
              py-2.5
              rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              text-xs
              sm:text-sm
              font-bold
              shadow-sm
              transition-all
              active:scale-95
            "
          >

            <FileDown size={16} />

            <span>Export PDF</span>

          </button>

          <button
            onClick={downloadExcel}
            className="
              flex-1
              sm:flex-none
              bg-white
              hover:bg-emerald-50
              text-emerald-700
              border
              border-emerald-200
              px-4
              py-2.5
              rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              text-xs
              sm:text-sm
              font-bold
              shadow-sm
              transition-all
              active:scale-95
            "
          >

            <FileSpreadsheet size={16} />

            <span>Export Excel</span>

          </button>

          <button
            onClick={() =>
              setIsModalOpen(true)
            }
            className="
              w-full
              sm:w-auto
              bg-gradient-to-r
              from-emerald-600
              via-emerald-600
              to-emerald-700
              hover:from-emerald-700
              hover:to-emerald-800
              text-white
              px-5
              py-2.5
              rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              text-xs
              sm:text-sm
              font-extrabold
              shadow-md
              shadow-emerald-600/20
              hover:shadow-lg
              hover:shadow-emerald-600/30
              transition-all
              active:scale-95
            "
          >

            <Plus size={18} className="stroke-[3]" />

            <span>Tambah Produk</span>

          </button>

        </div>

      </div>


      {/* =========================
          SEARCH & FILTER BAR
      ========================= */}

      <div
        className="
          bg-gradient-to-b
          from-white
          via-white
          to-emerald-50/30
          rounded-3xl
          shadow-sm
          border
          border-emerald-100/70
          p-4
          sm:p-5
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-stretch
            sm:items-center
            gap-3
            w-full
            lg:w-auto
          "
        >


          {/* Search */}

          <div className="relative w-full sm:w-80">

            <Search
              size={18}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Cari nama produk..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
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


          {/* Category Dropdown */}

          <div className="relative">

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
                appearance-none
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                pl-4
                pr-9
                py-2.5
                text-sm
                font-semibold
                text-gray-700
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
                cursor-pointer
              "
            >

              {categories.map(
                (category) => (

                  <option
                    key={category}
                    value={category}
                  >

                    {category === "Semua" ? "Semua Kategori" : category}

                  </option>

                )
              )}

            </select>

            <Filter size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

          </div>


          {/* Sort Dropdown */}

          <div className="relative">

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
                appearance-none
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                pl-4
                pr-9
                py-2.5
                text-sm
                font-semibold
                text-gray-700
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
                cursor-pointer
              "
            >

              <option value="default">
                Urutan Standar
              </option>

              <option value="priceAsc">
                Harga: Termurah
              </option>

              <option value="priceDesc">
                Harga: Termahal
              </option>

              <option value="stockAsc">
                Stok: Paling Sedikit
              </option>

              <option value="stockDesc">
                Stok: Paling Banyak
              </option>

            </select>

            <ArrowUpDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

          </div>

        </div>


        {/* Total Badge */}

        <div
          className="
            flex
            items-center
            gap-2
            text-emerald-800
            bg-emerald-100/70
            px-4
            py-2
            rounded-2xl
            font-bold
            text-xs
            sm:text-sm
            whitespace-nowrap
            self-start
            lg:self-auto
          "
        >

          <Package
            size={16}
            className="text-emerald-700"
          />

          <span>
            {sortedProducts.length} dari {products.length} Produk
          </span>

        </div>

      </div>


      {/* =========================
          MODAL ADD
      ========================= */}

      <ProductModal
        key={isModalOpen ? "add-modal-open" : "add-modal-closed"}
        open={isModalOpen}
        product={null}
        existingCategories={categories}
        onClose={() =>
          setIsModalOpen(false)
        }
        onSave={handleSaveProduct}
      />


      {/* =========================
          MODAL EDIT
      ========================= */}

      <ProductModal
        key={editProduct ? `edit-${editProduct.id}` : "edit-none"}
        open={editProduct !== null}
        product={editProduct}
        existingCategories={categories}
        onClose={() =>
          setEditProduct(null)
        }
        onSave={async (updatedProduct) => {

          await handleSaveProduct(updatedProduct);

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
        onDelete={handleConfirmDelete}
      />


      {/* =========================
          TABLE CONTAINER
      ========================= */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-sm
          border
          border-emerald-100/70
          overflow-hidden
        "
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
      >

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white">

              <tr>

                <th className="text-left px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                  Nama Produk
                </th>

                <th className="text-left px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                  Kategori
                </th>

                <th className="text-left px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                  Harga Satuan
                </th>

                <th className="text-left px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                  Status Stok
                </th>

                <th className="text-center px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-100">

              {sortedProducts.length > 0 ? (

                sortedProducts.map(
                  (product) => {
                    const stockNum = Number(product.stock);
                    const isZero = stockNum === 0;
                    const isLow = stockNum > 0 && stockNum <= 5;

                    return (
                      <tr
                        key={product.id}
                        className="
                          hover:bg-emerald-50/30
                          transition-colors
                        "
                      >

                        {/* Nama & Foto */}

                        <td className="px-5 sm:px-7 py-4">

                          <div className="flex items-center gap-3.5">

                            <div
                              className="
                                w-11
                                h-11
                                shrink-0
                                bg-gradient-to-br
                                from-emerald-50
                                to-slate-100
                                border
                                border-emerald-100
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                                text-2xl
                                shadow-inner
                                overflow-hidden
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
                                  "
                                />

                              ) : (

                                product.emoji || "📦"

                              )}

                            </div>


                            <div>
                              <p className="font-extrabold text-gray-900 text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-400 font-medium mt-0.5">
                                ID: #{product.id}
                              </p>
                            </div>

                          </div>

                        </td>


                        {/* Kategori */}

                        <td className="px-5 sm:px-7 py-4">

                          <span
                            className="
                              inline-flex
                              items-center
                              bg-emerald-50
                              text-emerald-800
                              border
                              border-emerald-200/60
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              whitespace-nowrap
                            "
                          >

                            {product.category || "Umum"}

                          </span>

                        </td>


                        {/* Harga */}

                        <td className="px-5 sm:px-7 py-4 font-black text-gray-900 text-sm whitespace-nowrap">

                          Rp{Number(
                            product.price
                          ).toLocaleString(
                            "id-ID"
                          )}

                        </td>


                        {/* Stok */}

                        <td className="px-5 sm:px-7 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              ${
                                isZero
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : isLow
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }
                            `}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isZero ? "bg-rose-500" : isLow ? "bg-amber-500" : "bg-emerald-500"
                            }`} />
                            {product.stock} pcs ({getStockStatus(product.stock)})
                          </span>

                        </td>


                        {/* Aksi */}

                        <td className="px-5 sm:px-7 py-4">

                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() =>
                                setEditProduct(
                                  product
                                )
                              }
                              className="
                                p-2.5
                                rounded-xl
                                bg-emerald-50
                                hover:bg-emerald-100
                                text-emerald-700
                                border
                                border-emerald-200/80
                                transition-all
                                active:scale-90
                              "
                              title="Edit Produk"
                            >

                              <Pencil size={16} />

                            </button>


                            <button
                              onClick={() =>
                                setDeleteProductId(
                                  product.id
                                )
                              }
                              className="
                                p-2.5
                                rounded-xl
                                bg-rose-50
                                hover:bg-rose-100
                                text-rose-700
                                border
                                border-rose-200/80
                                transition-all
                                active:scale-90
                              "
                              title="Hapus Produk"
                            >

                              <Trash2 size={16} />

                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="
                      py-16
                      text-center
                      text-gray-400
                      font-medium
                    "
                  >

                    <Package size={36} className="mx-auto text-gray-300 mb-2" />
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