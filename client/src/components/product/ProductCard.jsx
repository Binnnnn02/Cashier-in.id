import { Plus, Package } from "lucide-react";

export default function ProductCard({
  name,
  image,
  emoji,
  price,
  stock,
  isUnlimited,
  onAdd,
}) {
  const outOfStock = !isUnlimited && stock <= 0;
  const isLowStock = !isUnlimited && stock > 0 && stock <= 5;

  return (
    <div
      className="
        group
        relative
        bg-gradient-to-b
        from-white
        via-white
        to-emerald-50/30
        rounded-3xl
        p-4
        sm:p-5
        border
        border-emerald-100/70
        shadow-sm
        hover:shadow-xl
        hover:border-emerald-300/80
        hover:-translate-y-1.5
        transition-all
        duration-300
        flex
        flex-col
        justify-between
      "
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}
    >
      <div>
        {/* FOTO PRODUK / EMOJI */}
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-emerald-50 via-slate-50 to-white flex items-center justify-center overflow-hidden mb-4 border border-emerald-100/50 group-hover:scale-[1.02] transition-transform duration-300">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-5xl filter drop-shadow-sm select-none">
                {emoji || "📦"}
              </span>
            </div>
          )}

          {/* Stock Badges overlay */}
          <div className="absolute top-2.5 right-2.5">
            {isUnlimited ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-600/90 backdrop-blur-sm text-white shadow-sm">
                Selalu Tersedia
              </span>
            ) : outOfStock ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-sm">
                Habis
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
                Sisa {stock}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/90 backdrop-blur-sm text-white shadow-sm">
                {stock} pcs
              </span>
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {name}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-black bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
              {price}
            </span>

            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <Package size={13} className="text-gray-400" />
              Stok: {isUnlimited ? "∞" : stock}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={onAdd}
        disabled={outOfStock}
        className={`
          w-full
          mt-4
          py-3
          px-4
          rounded-2xl
          font-bold
          text-sm
          flex
          items-center
          justify-center
          gap-2
          transition-all
          duration-200
          active:scale-95
          ${
            !outOfStock
              ? "bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          }
        `}
      >
        {!outOfStock ? (
          <>
            <Plus size={16} className="stroke-[3]" />
            <span>Tambah ke Keranjang</span>
          </>
        ) : (
          <span>Stok Tidak Tersedia</span>
        )}
      </button>
    </div>
  );
}