import { useState } from "react";
import { X, Plus, Package, Search } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import toast from "react-hot-toast";

/**
 * Modal sederhana untuk Kasir: hanya bisa menambah stok produk.
 * Tidak bisa tambah produk baru, edit nama/harga, atau hapus.
 */
export default function StockOnlyModal({ open, onClose }) {

  const { products, updateProduct } = useProducts();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectProduct = (product) => {
    setSelected(product);
    setAddAmount("");
  };

  const handleSave = async () => {

    const amount = parseInt(addAmount, 10);

    if (!selected) return;

    if (!addAmount || isNaN(amount) || amount <= 0) {
      toast.error("Masukkan jumlah stok yang valid");
      return;
    }

    setSaving(true);

    const newStock = Number(selected.stock) + amount;

    const result = await updateProduct({
      ...selected,
      stock: newStock,
    });

    setSaving(false);

    if (result?.success === false) {
      toast.error("Gagal menambah stok");
    } else {
      toast.success(
        `Stok "${selected.name}" +${amount} → ${newStock}`
      );
      setSelected(null);
      setAddAmount("");
      setSearch("");
    }

  };

  const handleClose = () => {
    setSelected(null);
    setAddAmount("");
    setSearch("");
    onClose();
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
              <Package size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">
                Tambah Stok
              </h2>
              <p className="text-xs text-gray-500">
                Pilih produk lalu masukkan jumlah stok
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X size={18} />
          </button>

        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelected(null);
              }}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-1.5">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-6">
              Produk tidak ditemukan
            </p>
          ) : (
            filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all border ${
                  selected?.id === product.id
                    ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20"
                    : "bg-white border-gray-100 hover:bg-emerald-50/50 hover:border-emerald-200"
                }`}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {product.category || "Tanpa kategori"}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    product.is_unlimited
                      ? "bg-blue-100 text-blue-700"
                      : Number(product.stock) === 0
                      ? "bg-red-100 text-red-700"
                      : Number(product.stock) <= 5
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {product.is_unlimited
                      ? "∞"
                      : `${product.stock} pcs`}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Input & Save — tampil hanya saat produk dipilih */}
        {selected && !selected.is_unlimited && (
          <div className="px-6 py-4 border-t border-gray-100 space-y-3">

            <p className="text-sm font-semibold text-gray-700">
              Tambah stok untuk:{" "}
              <span className="text-emerald-700">{selected.name}</span>
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Plus
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Jumlah stok..."
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSave()
                  }
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition"
                  autoFocus
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !addAmount}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition active:scale-95 shrink-0"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>

            {addAmount && parseInt(addAmount) > 0 && (
              <p className="text-xs text-gray-500">
                Stok sekarang:{" "}
                <span className="font-semibold text-gray-800">
                  {selected.stock}
                </span>{" "}
                → setelah disimpan:{" "}
                <span className="font-bold text-emerald-700">
                  {Number(selected.stock) + parseInt(addAmount)}
                </span>{" "}
                pcs
              </p>
            )}

          </div>
        )}

        {selected?.is_unlimited && (
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Produk ini memiliki stok tidak terbatas.
            </p>
          </div>
        )}

      </div>

    </div>

  );

}

