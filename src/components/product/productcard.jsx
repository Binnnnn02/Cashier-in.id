export default function ProductCard({

  name,
  emoji,
  price,
  stock,
  onAdd,

}) {

  const outOfStock = stock <= 0;

  return (

    <div className="bg-white rounded-2xl shadow-sm border p-5 transition hover:shadow-md">

      <div className="text-4xl mb-4">

        {emoji}

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

      {

        outOfStock && (

          <span className="inline-block mt-3 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">

            Stok Habis

          </span>

        )

      }

      <button

        onClick={onAdd}
        disabled={stock <= 0}

        className={`

          w-full mt-4 py-3 rounded-xl text-white ${
            stock > 0
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-gray-400 cursor-not-allowed text-gray-200"
          }`}

      >

        {stock > 0 ? "Tambah" : "Habis"}

      </button>

    </div>

  );

}