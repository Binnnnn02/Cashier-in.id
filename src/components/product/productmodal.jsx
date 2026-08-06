import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ProductModal({
  open,
  onClose,
  onSave,
  product,
}) {

  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    category: "Makanan",
    emoji: "📦",
    image: "",
  });

  useEffect(() => {

    if (product) {

      setForm({
        ...product,
        image: product.image || "",
        emoji: product.emoji || "📦",
      });

    } else {

      setForm({
        id: null,
        name: "",
        price: "",
        stock: "",
        category: "Makanan",
        emoji: "📦",
        image: "",
      });

    }

  }, [product, open]);

  if (!open) return null;

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      setForm({
        ...form,
        image: reader.result,
      });

    };

    reader.readAsDataURL(file);

  };

  const handleSubmit = () => {

    if (
      !form.name ||
      !form.price ||
      !form.stock
    ) {

      alert("Lengkapi semua data.");
      return;

    }

    onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });

    onClose();

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl w-[500px] p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">

            {product ? "Edit Produk" : "Tambah Produk"}

          </h2>

          <button onClick={onClose}>

            <X />

          </button>

        </div>

        <div className="space-y-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Produk"
            className="w-full border rounded-xl p-3"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Harga"
            className="w-full border rounded-xl p-3"
          />

          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stok"
            className="w-full border rounded-xl p-3"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          >
            <option>Makanan</option>
            <option>Minuman</option>
            <option>Snack</option>
          </select>

          <input
            name="emoji"
            value={form.emoji}
            onChange={handleChange}
            placeholder="Emoji (☕ 🍜 🥤 🍟)"
            className="w-full border rounded-xl p-3"
          />

          <div>

            <label className="block mb-2 font-medium">

              Foto Produk

            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

          </div>

          {

            form.image && (

              <img
                src={form.image}
                alt="Preview"
                className="w-full h-40 object-cover rounded-xl border"
              />

            )

          }

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200"
          >

            Batal

          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-white"
          >

            {product ? "Simpan Perubahan" : "Simpan"}

          </button>

        </div>

      </div>

    </div>

  );

}