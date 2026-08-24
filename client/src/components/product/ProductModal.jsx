import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductModal({
  open,
  onClose,
  onSave,
  product,
  existingCategories = [],
}) {

  const defaultCategories = ["Makanan", "Minuman", "Snack", ...existingCategories.filter(Boolean)];
  const uniqueCategories = [...new Set(defaultCategories)].filter(c => c !== "Semua");

  const [form, setForm] = useState(() => {
    if (product) {
      return {
        id: product.id,
        name: product.name || "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        category: product.category || "Makanan",
        emoji: product.emoji || "📦",
        image: product.image || "",
      };
    }
    return {
      id: null,
      name: "",
      price: "",
      stock: "",
      category: "Makanan",
      emoji: "📦",
      image: "",
    };
  });

  const [customCategory, setCustomCategory] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));

    };

    reader.readAsDataURL(file);

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Nama produk tidak boleh kosong");
      return;
    }

    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0) {
      toast.error("Harga harus berupa angka dan minimal 0");
      return;
    }

    if (form.stock === "" || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      toast.error("Stok harus berupa angka dan minimal 0");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      category: form.category.trim() || "Umum",
      price: Number(form.price),
      stock: Number(form.stock),
    });

    onClose();

  };

  return (

    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-[500px] max-w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
      >

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {product ? "Edit Produk" : "Tambah Produk"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Nama Produk *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Kopi Susu Aren"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Harga (Rp) *
              </label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="15000"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Stok *
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="100"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-500">
                Kategori
              </label>
              <button
                type="button"
                onClick={() => setCustomCategory(!customCategory)}
                className="text-xs text-emerald-600 hover:underline"
              >
                {customCategory ? "Pilih dari daftar" : "+ Kategori baru"}
              </button>
            </div>

            {customCategory ? (
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Ketik kategori baru..."
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Emoji Ikon
            </label>
            <input
              name="emoji"
              value={form.emoji}
              onChange={handleChange}
              placeholder="Emoji (☕ 🍜 🥤 🍟 📦)"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>

            <label className="block mb-1 text-xs font-semibold text-gray-500">
              Foto Produk (Opsional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />

          </div>

          {

            form.image && (

              <div className="relative">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-36 object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, image: "" }))}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-lg p-1 text-xs hover:bg-red-700 transition"
                  title="Hapus foto"
                >
                  Hapus Foto
                </button>
              </div>

            )

          }

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium text-gray-700"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-white font-semibold shadow-sm"
            >
              {product ? "Simpan Perubahan" : "Tambah Produk"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}
