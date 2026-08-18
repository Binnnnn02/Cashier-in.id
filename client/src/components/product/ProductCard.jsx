export default function ProductCard({
  name,
  image,
  emoji,
  price,
  stock,
  onAdd,
}) {
  const outOfStock = stock <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 transition hover:shadow-md">

      {/* FOTO PRODUK */}
      <div className="w-full h-40 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden mb-4">

        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl">
            {emoji || "📦"}
          </span>
        )}

      </div>

      <h3 className="text-lg font-bold">
        {name}
      </h3>

      <p className="text-emerald-600 font-semibold mt-1">
        {price}
      </p>

      <p className="text-gray-500 text-sm mt-2">
        Stok : {stock}
      </p>

      {stock <= 5 && (
        <p className="text-red-500 text-sm font-semibold mt-1">
          ⚠ Stok hampir habis
        </p>
      )}

      {outOfStock && (
        <span className="inline-block mt-3 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
          Stok Habis
        </span>
      )}

      <button
        onClick={onAdd}
        disabled={outOfStock}
        className={`
          w-full mt-4 py-3 rounded-xl text-white
          ${
            stock > 0
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-gray-400 cursor-not-allowed text-gray-200"
          }
        `}
      >
        {stock > 0 ? "Tambah" : "Habis"}
      </button>

    </div>
  );
}