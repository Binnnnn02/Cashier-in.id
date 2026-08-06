import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import ProductModal from "../components/product/ProductModal";
import DeleteModal from "../components/product/DeleteModal";
import { useProducts } from "../context/ProductContext";

export default function Product() {

  const { products, setProducts } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const categories = [
    "Semua",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {

    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      categoryFilter === "Semua" ||
      product.category === categoryFilter;

    return matchSearch && matchCategory;

  });

  const sortedProducts = [...filteredProducts];

  if (sortBy === "priceAsc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sortBy === "priceDesc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  if (sortBy === "stockAsc") {
    sortedProducts.sort((a, b) => a.stock - b.stock);
  }

  if (sortBy === "stockDesc") {
    sortedProducts.sort((a, b) => b.stock - a.stock);
  }

  const addProduct = (newProduct) => {

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

const deleteProduct = () => {

  setProducts(
    products.filter(
      (product) => product.id !== deleteProductId
    )
  );

  setDeleteProductId(null);

};

return (
  <div className="space-y-6">

    {/* Header */}

    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Produk
        </h1>

        <p className="text-gray-500 mt-1">
          Kelola seluruh produk kasir.
        </p>

      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
      >
        <Plus size={20} />
        Tambah Produk
      </button>

    </div>

    {/* Search */}

    <div className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center">

      <div className="relative">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-3 border rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

      </div>

      <span className="text-gray-500 font-medium">
        Total Produk : {products.length}
      </span>

    </div>

    <ProductModal
  open={isModalOpen}
  product={null}
  onClose={() => setIsModalOpen(false)}
  onSave={addProduct}
    />

    <ProductModal
    open={editProduct !== null}
    product={editProduct}
    onClose={() => setEditProduct(null)}
    onSave={(updatedProduct) => {

        setProducts(
            products.map((product) =>
                product.id === updatedProduct.id
                    ? updatedProduct
                    : product
            )
        );

        setEditProduct(null);

    }}
    />

    <DeleteModal
  open={deleteProductId !== null}
  productName={
    products.find(
      (p) => p.id === deleteProductId
    )?.name
  }
  onClose={() => setDeleteProductId(null)}
  onDelete={deleteProduct}
/>

    {/* Table Produk */}

<div className="bg-white rounded-2xl shadow-sm overflow-hidden">

  <table className="w-full">

    <thead className="bg-emerald-600 text-white">

      <tr>

        <th className="text-left px-6 py-4">
          Nama Produk
        </th>

        <th className="text-left px-6 py-4">
          Kategori
        </th>

        <th className="text-left px-6 py-4">
          Harga
        </th>

        <th className="text-left px-6 py-4">
          Stok
        </th>

        <th className="text-center px-6 py-4">
          Aksi
        </th>

      </tr>

    </thead>

   <tbody>

  {

    sortedProducts.length > 0 ? (

      sortedProducts.map((product) => (

        <tr
          key={product.id}
          className="border-b hover:bg-gray-50"
        >

          <td className="px-6 py-4 font-medium">
            {product.name}
          </td>

          <td className="px-6 py-4">
            {product.category}
          </td>

          <td className="px-6 py-4">
            Rp{product.price.toLocaleString("id-ID")}
          </td>

          <td className="px-6 py-4">
            {product.stock}
          </td>

          <td className="px-6 py-4">

            <div className="flex justify-center gap-2">

              <button
                onClick={() => setEditProduct(product)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => setDeleteProductId(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </td>

        </tr>

      ))

    ) : (

      <tr>

        <td
          colSpan="5"
          className="py-10 text-center text-gray-500"
        >

          Produk tidak ditemukan.

        </td>

      </tr>

    )

  }

</tbody>
  </table>

</div>

  </div>
);
}
