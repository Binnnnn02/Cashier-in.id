import toast from "react-hot-toast";
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {

  const defaultProducts = [
  {
    id: 1,
    name: "Kopi",
    price: 15000,
    stock: 20,
    category: "Minuman",
    emoji: "☕",
    image: "",
  },
  {
    id: 2,
    name: "Mie Ayam",
    price: 18000,
    stock: 15,
    category: "Makanan",
    emoji: "🍜",
    image: "",
  },
  {
    id: 3,
    name: "Es Teh",
    price: 7000,
    stock: 50,
    category: "Minuman",
    emoji: "🥤",
    image: "",
  },
  {
    id: 4,
    name: "Kentang",
    price: 12000,
    stock: 30,
    category: "Snack",
    emoji: "🍟",
    image: "",
  },
];

const [products, setProducts] = useState(() => {

  const saved = localStorage.getItem("products");

  return saved
    ? JSON.parse(saved)
    : defaultProducts;

});

  const [cart, setCart] = useState(() => {

  const saved = localStorage.getItem("cart");

  return saved
    ? JSON.parse(saved)
    : [];

});

  const [history, setHistory] = useState(() => {

  const saved = localStorage.getItem("history");

  return saved
    ? JSON.parse(saved)
    : [];

});

  const addToCart = (product) => {

    if (product.stock <= 0) {

  toast.error("Stok habis");

  return;

}

    const exist = cart.find(
      (item) => item.id === product.id
    );

    if (exist) {

      setCart(

        cart.map((item) =>

          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item

        )

      );

    } else {

      setCart([
        ...cart,
        {
          ...product,
          qty: 1,
        },
      ]);

    }

    setProducts(

      products.map((item) =>

        item.id === product.id
          ? {
              ...item,
              stock: item.stock - 1,
            }
          : item

      )

    );
    toast.success(`${product.name} ditambahkan`);
  };

  const increaseQty = (id) => {

  const product = products.find((p) => p.id === id);

  if (!product || product.stock <= 0) {
    
    toast.error("Stok habis");

    return;

  }
  setCart(

    cart.map((item) =>

      item.id === id
        ? {
            ...item,
            qty: item.qty + 1,
          }
        : item

    )

  );

  setProducts(

    products.map((item) =>

      item.id === id
        ? {
            ...item,
            stock: item.stock - 1,
          }
        : item

    )

  );

};

const removeCart = (id) => {

  const item = cart.find((item) => item.id === id);

  if (!item) return;

  setProducts(

    products.map((product) =>

      product.id === id
        ? {
            ...product,
            stock: product.stock + item.qty,
          }
        : product

    )

  );

  setCart(

    cart.filter((item) => item.id !== id)

  );

  toast.success("Produk dihapus");

};

const clearCart = (paymentMethod = "Tunai") => {

  if (cart.length === 0) return;

  const store =
    JSON.parse(localStorage.getItem("store")) || {};

  const today = new Date();

  const dateCode =
    `${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(
      today.getDate()
    ).padStart(2, "0")}`;

  const invoice =
    `INV-${dateCode}-${Date.now()}`;

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const transaction = {

    id: Date.now(),

    invoice,

    cashier:
      store.cashier || "Admin",

    storeName:
      store.name || "KasirKu",

    storeAddress:
      store.address || "",

    storePhone:
      store.phone || "",

    items: [...cart],

    total,

    paymentMethod,

    date: today.toLocaleString("id-ID"),

    createdAt: today.toISOString(),

  };

  setHistory((prev) => [

    transaction,

    ...prev,

  ]);

  setCart([]);

  toast.success("Pembayaran berhasil");

};

const decreaseQty = (id) => {

  const item = cart.find((item) => item.id === id);

  if (!item) return;

  if (item.qty === 1) {

    removeCart(id);

    return;

  }

  setCart(

    cart.map((cartItem) =>

      cartItem.id === id
        ? {
            ...cartItem,
            qty: cartItem.qty - 1,
          }
        : cartItem

    )

  );

  setProducts(

    products.map((product) =>

      product.id === id
        ? {
            ...product,
            stock: product.stock + 1,
          }
        : product

    )

  );

};

useEffect(() => {

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

}, [products]);

useEffect(() => {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}, [cart]);

useEffect(() => {

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

}, [history]);

  return (

    <ProductContext.Provider
  value={{
    products,
    setProducts,

    cart,
    setCart,

    history,
    setHistory,

    addToCart,
    increaseQty,
    decreaseQty,
    removeCart,
    clearCart,
  }}
>

      {children}

    </ProductContext.Provider>

  );

}

export const useProducts = () =>
  useContext(ProductContext);