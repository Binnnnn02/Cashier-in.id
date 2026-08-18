import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const StoreContext = createContext();

const defaultStore = {

  name: "Toko Saya",
  owner: "",
  phone: "",
  address: "",
  footer: "Terima kasih telah berbelanja.",

  showLogo: true,
  showAddress: true,
  showPhone: true,
  showTax: false,

  tax: 0,
  discount: 0,
  defaultPaymentMethod: "Tunai",

  stockNotif: true,
  soundNotif: true,
  autoPrint: false,

  subscriptionStatus: "inactive",
  subscriptionExpiresAt: null,

};

// Kolom di tabel profiles (snake_case) <-> field di frontend (camelCase)
const fromRow = (row) => ({

  name: row.store_name ?? defaultStore.name,
  owner: row.owner_name ?? "",
  phone: row.phone ?? "",
  address: row.address ?? "",
  footer: row.footer ?? defaultStore.footer,

  showLogo: row.show_logo ?? true,
  showAddress: row.show_address ?? true,
  showPhone: row.show_phone ?? true,
  showTax: row.show_tax ?? false,

  tax: Number(row.tax_percent ?? 0),
  discount: Number(row.discount_percent ?? 0),
  defaultPaymentMethod: row.default_payment_method ?? "Tunai",

  stockNotif: row.stock_notif ?? true,
  soundNotif: row.sound_notif ?? true,
  autoPrint: row.auto_print ?? false,

  subscriptionStatus: row.subscription_status ?? "inactive",
  subscriptionExpiresAt: row.subscription_expires_at ?? null,

});

const toRow = (patch) => {

  const map = {
    name: "store_name",
    owner: "owner_name",
    phone: "phone",
    address: "address",
    footer: "footer",
    showLogo: "show_logo",
    showAddress: "show_address",
    showPhone: "show_phone",
    showTax: "show_tax",
    tax: "tax_percent",
    discount: "discount_percent",
    defaultPaymentMethod: "default_payment_method",
    stockNotif: "stock_notif",
    soundNotif: "sound_notif",
    autoPrint: "auto_print",
  };

  const row = {};

  Object.entries(patch).forEach(([key, value]) => {

    const column = map[key];

    if (column) {
      row[column] = value;
    }

  });

  return row;

};

export function StoreProvider({ children }) {

  const { admin } = useAuth();

  const [store, setStoreState] = useState(defaultStore);

  const [storeLoading, setStoreLoading] = useState(true);

  useEffect(() => {

    let active = true;

    if (!admin?.id) {

      setStoreState(defaultStore);
      setStoreLoading(false);

      return;

    }

    setStoreLoading(true);

    const loadProfile = async () => {

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", admin.id)
        .maybeSingle();

      if (!active) return;

      if (error) {

        console.error("Gagal memuat profil toko:", error.message);
        setStoreLoading(false);

        return;

      }

      if (data) {

        setStoreState(fromRow(data));

      } else {

        // Self-healing: kalau trigger auto-create profil gagal/belum jalan,
        // buat baris profil manual di sini supaya app tetap bisa dipakai.
        const { data: created, error: insertError } =
          await supabase
            .from("profiles")
            .insert({ id: admin.id })
            .select()
            .single();

        if (!insertError && created) {
          setStoreState(fromRow(created));
        } else if (insertError) {
          console.error("Gagal membuat profil toko:", insertError.message);
        }

      }

      setStoreLoading(false);

    };

    loadProfile();

    return () => {
      active = false;
    };

  }, [admin?.id]);

  // Update sebagian field toko (langsung ke Supabase, lalu update state lokal)
  const updateStore = async (patch) => {

    if (!admin?.id) {

      return {
        success: false,
        message: "Belum login",
      };

    }

    const { data, error } = await supabase
      .from("profiles")
      .update(toRow(patch))
      .eq("id", admin.id)
      .select()
      .single();

    if (error) {

      return {
        success: false,
        message: error.message,
      };

    }

    setStoreState(fromRow(data));

    return { success: true };

  };

  return (

    <StoreContext.Provider
      value={{

        store,
        storeLoading,
        updateStore,

        // Alias supaya komponen lama yang masih pakai setStore tetap jalan
        setStore: updateStore,

      }}
    >

      {children}

    </StoreContext.Provider>

  );

}

export const useStore = () =>
  useContext(StoreContext);