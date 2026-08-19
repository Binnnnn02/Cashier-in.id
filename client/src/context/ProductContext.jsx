import toast from "react-hot-toast";
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";
import { useStore } from "./StoreContext";

const ProductContext = createContext();

// Baris transaksi (snake_case) -> bentuk yang dipakai di seluruh app (camelCase)
const mapTransaction = (row) => ({

  id: row.id,
  invoice: row.invoice,
  cashier: row.cashier,
  status: row.status || "completed",

  items: (row.transaction_items || []).map((ti) => ({
    id: ti.id,
    productId: ti.product_id,
    name: ti.name,
    price: Number(ti.price),
    qty: ti.qty,
  })),

  subtotal: Number(row.subtotal),
  discount: Number(row.discount_percent),
  discountAmount: Number(row.discount_amount),
  tax: Number(row.tax_percent),
  taxAmount: Number(row.tax_amount),
  total: Number(row.total),

  paymentMethod: row.payment_method,
  paid: Number(row.paid),
  change: Number(row.change),

  date: new Date(row.created_at).toLocaleString("id-ID"),
  createdAt: row.created_at,

});

export function ProductProvider({ children }) {

  const { admin } = useAuth();

  const { store } = useStore();

  const [products, setProducts] = useState([]);

  const [productsLoading, setProductsLoading] = useState(true);

  const [cart, setCart] = useState([]);

  const [history, setHistory] = useState([]);

  const [historyLoading, setHistoryLoading] = useState(true);


  /* =========================
     MUAT PRODUK & RIWAYAT DARI SUPABASE
     (berjalan ulang setiap kali akun yang login berganti)
  ========================= */

  useEffect(() => {

    let active = true;

    if (!admin?.id) {

      setProducts([]);
      setHistory([]);
      setCart([]);
      setProductsLoading(false);
      setHistoryLoading(false);

      return;

    }

    setProductsLoading(true);
    setHistoryLoading(true);
    setCart([]);

    const loadProducts = async () => {

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("profile_id", admin.id)
        .order("created_at", { ascending: true });

      if (!active) return;

      if (error) {
        toast.error("Gagal memuat produk");
        console.error(error);
      } else {
        setProducts(data || []);
      }

      setProductsLoading(false);

    };

    const loadHistory = async () => {

      const { data, error } = await supabase
        .from("transactions")
        .select("*, transaction_items(*)")
        .eq("profile_id", admin.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        toast.error("Gagal memuat riwayat transaksi");
        console.error(error);
      } else {
        setHistory((data || []).map(mapTransaction));
      }

      setHistoryLoading(false);

    };

    loadProducts();
    loadHistory();

    return () => {
      active = false;
    };

  }, [admin?.id]);


  /* =========================
     CRUD PRODUK
  ========================= */

  const addProduct = async (product) => {

    if (!admin?.id) return { success: false };

    const { data, error } = await supabase
      .from("products")
      .insert({

        profile_id: admin.id,
        name: product.name,
        category: product.category || "",
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0,
        emoji: product.emoji || "📦",
        image: product.image || null,

      })
      .select()
      .single();

    if (error) {

      toast.error("Gagal menambah produk");

      return { success: false, message: error.message };

    }

    setProducts((prev) => [...prev, data]);

    toast.success("Produk ditambahkan");

    return { success: true, product: data };

  };

  const updateProduct = async (product) => {

    if (!admin?.id) return { success: false };

    const { data, error } = await supabase
      .from("products")
      .update({

        name: product.name,
        category: product.category || "",
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0,
        emoji: product.emoji || "📦",
        image: product.image || null,

      })
      .eq("id", product.id)
      .eq("profile_id", admin.id)
      .select()
      .single();

    if (error) {

      toast.error("Gagal menyimpan perubahan produk");

      return { success: false, message: error.message };

    }

    setProducts((prev) =>
      prev.map((p) => (p.id === data.id ? data : p))
    );

    toast.success("Produk berhasil diperbarui");

    return { success: true, product: data };

  };

  const deleteProduct = async (id) => {

    if (!admin?.id) return { success: false };

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("profile_id", admin.id);

    if (error) {

      toast.error("Gagal menghapus produk");

      return { success: false, message: error.message };

    }

    setProducts((prev) => prev.filter((p) => p.id !== id));

    toast.success("Produk dihapus");

    return { success: true };

  };


  /* =========================
     KERANJANG (di memori, belum tersimpan ke Supabase
     sampai checkout selesai / clearCart dipanggil)
  ========================= */

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
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        { ...product, qty: 1 },
      ]);

    }

    setProducts(
      products.map((item) =>
        item.id === product.id
          ? { ...item, stock: item.stock - 1 }
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
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );

    setProducts(
      products.map((item) =>
        item.id === id
          ? { ...item, stock: item.stock - 1 }
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
          ? { ...product, stock: product.stock + item.qty }
          : product
      )
    );

    setCart(
      cart.filter((item) => item.id !== id)
    );

    toast.success("Produk dihapus");

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
          ? { ...cartItem, qty: cartItem.qty - 1 }
          : cartItem
      )
    );

    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, stock: product.stock + 1 }
          : product
      )
    );

  };


  /* =========================
     CHECKOUT — simpan transaksi ke Supabase
  ========================= */

  const clearCart = async (paymentInfo = {}) => {

    if (cart.length === 0 || !admin?.id) return null;

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const {
      paymentMethod = "Tunai",
      paid = subtotal,
      change = 0,
      discount = 0,
      discountAmount = 0,
      tax = 0,
      taxAmount = 0,
      total = subtotal,
    } = paymentInfo;

    const today = new Date();

    const dateCode =
      `${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(
        today.getDate()
      ).padStart(2, "0")}`;

    const invoice = `INV-${dateCode}-${Date.now()}`;

    // 1. Simpan transaksi
    const { data: trxRow, error: trxError } = await supabase
      .from("transactions")
      .insert({

        profile_id: admin.id,
        invoice,
        cashier: store.owner || "Admin",

        subtotal,
        discount_percent: discount,
        discount_amount: discountAmount,
        tax_percent: tax,
        tax_amount: taxAmount,
        total,

        payment_method: paymentMethod,
        paid,
        change,

      })
      .select()
      .single();

    if (trxError) {

      toast.error("Gagal menyimpan transaksi");
      console.error(trxError);

      return null;

    }

    // 2. Simpan item transaksi
    const itemRows = cart.map((item) => ({

      transaction_id: trxRow.id,
      profile_id: admin.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,

    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from("transaction_items")
      .insert(itemRows)
      .select();

    if (itemsError) {
      console.error(itemsError);
    }

    // 3. Update stok produk di Supabase (nilai stok lokal sudah terpotong
    //    sejak produk dimasukkan ke keranjang, jadi tinggal disamakan)
    await Promise.all(

      cart.map((item) => {

        const current = products.find((p) => p.id === item.id);

        if (!current) return null;

        return supabase
          .from("products")
          .update({ stock: current.stock })
          .eq("id", item.id)
          .eq("profile_id", admin.id);

      })

    );

    const transaction = mapTransaction({
      ...trxRow,
      transaction_items: itemsData || itemRows,
    });

    setHistory((prev) => [transaction, ...prev]);

    setCart([]);

    toast.success("Pembayaran berhasil");

    return transaction;

  };

  /* =========================
     BATALKAN TRANSAKSI (VOID)
     — menandai transaksi sebagai dibatalkan & mengembalikan stok produk
  ========================= */

  const voidTransaction = async (id) => {

    if (!admin?.id) return { success: false };

    const trx = history.find((h) => h.id === id);

    if (!trx) return { success: false, message: "Transaksi tidak ditemukan" };

    if (trx.status === "void") {
      return { success: false, message: "Transaksi sudah dibatalkan" };
    }

    // 1. Tandai transaksi sebagai void di Supabase
    const { error: trxError } = await supabase
      .from("transactions")
      .update({ status: "void" })
      .eq("id", id)
      .eq("profile_id", admin.id);

    if (trxError) {

      toast.error("Gagal membatalkan transaksi");
      console.error(trxError);

      return { success: false, message: trxError.message };

    }

    // 2. Kembalikan stok tiap produk yang ada di transaksi ini
    const updatedProducts = [...products];

    await Promise.all(

      (trx.items || []).map(async (item) => {

        const idx = updatedProducts.findIndex(
          (p) => p.id === item.productId
        );

        if (idx === -1) return null; // produk sudah dihapus, lewati

        const newStock =
          Number(updatedProducts[idx].stock || 0) + Number(item.qty || 0);

        updatedProducts[idx] = {
          ...updatedProducts[idx],
          stock: newStock,
        };

        return supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.productId)
          .eq("profile_id", admin.id);

      })

    );

    setProducts(updatedProducts);

    // 3. Update status transaksi di state lokal
    setHistory((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: "void" } : h
      )
    );

    toast.success("Transaksi dibatalkan, stok dikembalikan");

    return { success: true };

  };


  /* =========================
     RESET SEMUA DATA (Produk & Riwayat) DI SUPABASE
  ========================= */

  const resetAllData = async () => {

    if (!admin?.id) return { success: false };

    const { error: itemsError } = await supabase
      .from("transaction_items")
      .delete()
      .eq("profile_id", admin.id);

    const { error: trxError } = await supabase
      .from("transactions")
      .delete()
      .eq("profile_id", admin.id);

    const { error: productsError } = await supabase
      .from("products")
      .delete()
      .eq("profile_id", admin.id);

    if (itemsError || trxError || productsError) {

      return {
        success: false,
        message: "Sebagian data gagal dihapus",
      };

    }

    setProducts([]);
    setHistory([]);
    setCart([]);

    return { success: true };

  };

  return (

    <ProductContext.Provider
      value={{

        products,
        productsLoading,

        cart,
        setCart,

        history,
        historyLoading,

        addProduct,
        updateProduct,
        deleteProduct,

        addToCart,
        increaseQty,
        decreaseQty,
        removeCart,
        clearCart,

        voidTransaction,

        resetAllData,

      }}
    >

      {children}

    </ProductContext.Provider>

  );

}

export const useProducts = () =>
  useContext(ProductContext);
