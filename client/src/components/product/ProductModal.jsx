import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Package, DollarSign, Boxes, Tag, Smile, Image as ImageIcon } from "lucide-react";
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
        isUnlimited: product.is_unlimited || false,
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
      isUnlimited: false,
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

    if (
      !form.isUnlimited &&
      (form.stock === "" || isNaN(Number(form.stock)) || Number(form.stock) < 0)
    ) {
      toast.error("Stok harus berupa angka dan minimal 0");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      category: form.category.trim() || "Umum",
      price: Number(form.price),
      stock: form.isUnlimited ? 0 : Number(form.stock),
      isUnlimited: form.isUnlimited,
    });

    onClose();
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-emerald-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-white via-white to-emerald-50/30 rounded-3xl w-[520px] max-w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-emerald-100 animate-scale-in"
        style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.18)" }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <Package size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">
                {product ? "Perbarui Data Produk" : "Tambah Produk Baru"}
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                {product ? "Sesuaikan harga, nama atau stok" : "Masukkan informasi produk baru ke kasir"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-5">

          {/* Nama Produk */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Nama Produk *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Kopi Susu Gula Aren"
              className="
                w-full
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                p-3.5
                text-sm
                font-medium
                text-gray-900
                placeholder-gray-400
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
              "
              required
            />
          </div>

          {/* Harga & Stok Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Harga Jual (Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  Rp
                </span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="15000"
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3.5
                    bg-gray-50/80
                    border
                    border-gray-200
                    rounded-2xl
                    text-sm
                    font-bold
                    text-gray-900
                    focus:outline-none
                    focus:bg-white
                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/10
                    transition-all
                  "
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Jumlah Stok {!form.isUnlimited && "*"}
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.isUnlimited ? "" : form.stock}
                onChange={handleChange}
                placeholder={form.isUnlimited ? "Tidak terbatas" : "50"}
                disabled={form.isUnlimited}
                className={`
                  w-full
                  p-3.5
                  bg-gray-50/80
                  border
                  border-gray-200
                  rounded-2xl
                  text-sm
                  font-bold
                  text-gray-900
                  focus:outline-none
                  focus:bg-white
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/10
                  transition-all
                  ${form.isUnlimited ? "opacity-50 cursor-not-allowed" : ""}
                `}
                required={!form.isUnlimited}
              />
            </div>
          </div>

          {/* Toggle Stok Tidak Terbatas */}
          <label
            className="
              flex
              items-center
              justify-between
              gap-3
              p-4
              rounded-2xl
              bg-gray-50/80
              border
              border-gray-200/80
              hover:border-emerald-300
              cursor-pointer
              transition-all
            "
          >
            <span>
              <span className="block text-sm font-bold text-gray-800">
                Stok Tidak Terbatas
              </span>
              <span className="block text-xs text-gray-400 font-medium mt-0.5">
                Cocok untuk produk yang dimasak/dibuat sesuai pesanan, bukan barang jadi seperti sachet.
              </span>
            </span>
            <input
              type="checkbox"
              checked={form.isUnlimited}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isUnlimited: e.target.checked,
                }))
              }
              className="w-5 h-5 shrink-0 rounded-lg text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer accent-emerald-600"
            />
          </label>

          {/* Kategori */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Kategori Produk
              </label>
              <button
                type="button"
                onClick={() => setCustomCategory(!customCategory)}
                className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 underline"
              >
                {customCategory ? "Pilih dari daftar" : "+ Buat kategori baru"}
              </button>
            </div>

            {customCategory ? (
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Ketik kategori baru (contoh: Dessert)..."
                className="
                  w-full
                  bg-gray-50/80
                  border
                  border-gray-200
                  rounded-2xl
                  p-3.5
                  text-sm
                  font-medium
                  text-gray-900
                  focus:outline-none
                  focus:bg-white
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/10
                  transition-all
                "
              />
            ) : (
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="
                  w-full
                  bg-gray-50/80
                  border
                  border-gray-200
                  rounded-2xl
                  p-3.5
                  text-sm
                  font-bold
                  text-gray-900
                  focus:outline-none
                  focus:bg-white
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/10
                  transition-all
                  cursor-pointer
                "
              >
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Emoji / Ikon Tampilan
            </label>
            <input
              name="emoji"
              value={form.emoji}
              onChange={handleChange}
              placeholder="Contoh: ☕ 🍜 🥤 🍟 📦"
              className="
                w-full
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                p-3.5
                text-sm
                font-medium
                text-gray-900
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
              "
            />
          </div>

          {/* Foto Produk */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
              Upload Foto Produk (Opsional, max 2MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="
                w-full
                text-xs
                text-gray-500
                file:mr-4
                file:py-2.5
                file:px-4
                file:rounded-xl
                file:border-0
                file:text-xs
                file:font-bold
                file:bg-emerald-50
                file:text-emerald-700
                hover:file:bg-emerald-100
                cursor-pointer
              "
            />
          </div>

          {form.image && (
            <div className="relative rounded-2xl overflow-hidden border border-emerald-100 shadow-sm mt-2">
              <img
                src={form.image}
                alt="Preview Produk"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, image: "" }))}
                className="absolute top-2.5 right-2.5 bg-rose-600 text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-rose-700 transition shadow-sm"
              >
                Hapus Foto
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition font-bold text-xs sm:text-sm text-gray-600"
            >
              Batal
            </button>

            <button
              type="submit"
              className="
                px-6
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-emerald-600
                via-emerald-600
                to-emerald-700
                hover:from-emerald-700
                hover:to-emerald-800
                transition-all
                text-white
                font-extrabold
                text-xs
                sm:text-sm
                shadow-md
                shadow-emerald-600/25
                active:scale-95
              "
            >
              {product ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}
