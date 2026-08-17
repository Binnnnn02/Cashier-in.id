import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useStore } from "../context/StoreContext";
import { useProducts } from "../context/ProductContext";
import {
  Store,
  Receipt,
  CreditCard,
  Bell,
  Database,
  Info,
  Download,
  RotateCcw,
  Save,
} from "lucide-react";

export default function Settings() {

  const { store, storeLoading, updateStore } = useStore();

  const { products, history, resetAllData } = useProducts();

  const [storeName, setStoreName] = useState(store.name);
  const [owner, setOwner] = useState(store.owner);
  const [phone, setPhone] = useState(store.phone);
  const [address, setAddress] = useState(store.address);
  const [tax, setTax] = useState(store.tax);
  const [discount, setDiscount] = useState(store.discount);
  const [footer, setFooter] = useState(store.footer);

  const [showLogo, setShowLogo] = useState(store.showLogo);
  const [showAddress, setShowAddress] = useState(store.showAddress);
  const [showPhone, setShowPhone] = useState(store.showPhone);
  const [showTax, setShowTax] = useState(store.showTax);

  const [stockNotif, setStockNotif] = useState(store.stockNotif);
  const [soundNotif, setSoundNotif] = useState(store.soundNotif);
  const [autoPrint, setAutoPrint] = useState(store.autoPrint);

  const [paymentMethod, setPaymentMethod] = useState(
    store.defaultPaymentMethod
  );

  const [saving, setSaving] = useState(false);

  // Begitu data profil toko selesai dimuat dari Supabase, isi form dengan nilainya
  useEffect(() => {

    if (storeLoading) return;

    setStoreName(store.name);
    setOwner(store.owner);
    setPhone(store.phone);
    setAddress(store.address);
    setTax(store.tax);
    setDiscount(store.discount);
    setFooter(store.footer);
    setShowLogo(store.showLogo);
    setShowAddress(store.showAddress);
    setShowPhone(store.showPhone);
    setShowTax(store.showTax);
    setStockNotif(store.stockNotif);
    setSoundNotif(store.soundNotif);
    setAutoPrint(store.autoPrint);
    setPaymentMethod(store.defaultPaymentMethod);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeLoading]);

  const saveSettings = async () => {

    setSaving(true);

    const result = await updateStore({

      name: storeName,
      owner,
      phone,
      address,
      footer,

      tax: Number(tax) || 0,
      discount: Number(discount) || 0,

      showLogo,
      showAddress,
      showPhone,
      showTax,

      stockNotif,
      soundNotif,
      autoPrint,

      defaultPaymentMethod: paymentMethod,

    });

    setSaving(false);

    if (!result.success) {

      toast.error(
        result.message || "Gagal menyimpan pengaturan"
      );

      return;

    }

    toast.success("Pengaturan berhasil disimpan");

  };

  const backupData = () => {

    const backup = {

      products,
      history,

      settings: {
        storeName,
        owner,
        phone,
        address,
        tax,
        discount,
        footer,
      },

    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "backup-kasir.json";

    a.click();

    URL.revokeObjectURL(url);

    toast.success("Backup berhasil diunduh");

  };

  const [resetting, setResetting] = useState(false);

  const resetAll = async () => {

    if (
      !window.confirm(
        "Yakin ingin menghapus SEMUA produk & riwayat transaksi toko ini secara permanen? Tindakan ini tidak bisa dibatalkan."
      )
    )
      return;

    setResetting(true);

    const result = await resetAllData();

    setResetting(false);

    if (!result.success) {

      toast.error(
        result.message || "Gagal menghapus data"
      );

      return;

    }

    toast.success("Data produk & riwayat berhasil dihapus");

  };

  if (storeLoading) {

    return (

      <div className="flex items-center justify-center py-20 text-gray-400">
        Memuat pengaturan...
      </div>

    );

  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Pengaturan
        </h1>

        <p className="text-gray-500 mt-1">
          Kelola informasi toko dan sistem aplikasi.
        </p>
      </div>

            {/* Informasi Toko */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-6">

          <Store className="text-emerald-600" />

          <h2 className="text-xl font-bold">
            Informasi Toko
          </h2>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div>

            <label className="text-sm text-gray-500">
              Nama Toko
            </label>

            <input
              type="text"
              value={storeName}
              onChange={(e) =>
                setStoreName(e.target.value)
              }
              className="w-full border rounded-xl p-3 mt-1"
            />

          </div>

          <div>

            <label className="text-sm text-gray-500">
              Nama Pemilik
            </label>

            <input
              type="text"
              value={owner}
              onChange={(e) =>
                setOwner(e.target.value)
              }
              className="w-full border rounded-xl p-3 mt-1"
            />

          </div>

          <div>

            <label className="text-sm text-gray-500">
              Nomor HP
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border rounded-xl p-3 mt-1"
            />

          </div>

          <div>

            <label className="text-sm text-gray-500">
              Alamat
            </label>

            <input
              type="text"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="w-full border rounded-xl p-3 mt-1"
            />

          </div>

        </div>

      </div>

      {/* Pengaturan Struk */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-6">

          <Receipt className="text-emerald-600" />

          <h2 className="text-xl font-bold">
            Pengaturan Struk
          </h2>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={showLogo}
              onChange={() =>
                setShowLogo(!showLogo)
              }
            />

            Tampilkan Logo

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={showAddress}
              onChange={() =>
                setShowAddress(!showAddress)
              }
            />

            Tampilkan Alamat

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={showPhone}
              onChange={() =>
                setShowPhone(!showPhone)
              }
            />

            Tampilkan Nomor HP

          </label>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={showTax}
              onChange={() =>
                setShowTax(!showTax)
              }
            />

            Tampilkan Pajak

          </label>

        </div>

        <div className="grid grid-cols-2 gap-5 mt-6">

          <div>

            <label className="text-sm text-gray-500">
              Pajak (%)
            </label>

            <input
              type="number"
              value={tax}
              onChange={(e) =>
                setTax(e.target.value)
              }
              className="w-full border rounded-xl p-3 mt-1"
            />

          </div>

          <div>

            <label className="text-sm text-gray-500">
              Diskon Default (%)
            </label>

            <input
              type="number"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value)
              }
              className="w-full border rounded-xl p-3 mt-1"
            />

          </div>

        </div>

        <div className="mt-6">

          <label className="text-sm text-gray-500">
            Footer Struk
          </label>

          <textarea
            rows={4}
            value={footer}
            onChange={(e) =>
              setFooter(e.target.value)
            }
            className="w-full border rounded-xl p-3 mt-1 resize-none"
          />

        </div>

      </div>

            {/* Pembayaran */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-6">

          <CreditCard className="text-emerald-600" />

          <h2 className="text-xl font-bold">
            Pembayaran
          </h2>

        </div>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="w-full border rounded-xl p-3"
        >
          <option>Tunai</option>
          <option>QRIS</option>
          <option>Transfer</option>
          <option>Debit</option>
          <option>E-Wallet</option>
        </select>

      </div>

      {/* Notifikasi */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-6">

          <Bell className="text-emerald-600" />

          <h2 className="text-xl font-bold">
            Notifikasi
          </h2>

        </div>

        <div className="space-y-4">

          <label className="flex justify-between items-center">

            <span>Notifikasi stok menipis</span>

            <input
              type="checkbox"
              checked={stockNotif}
              onChange={() =>
                setStockNotif(!stockNotif)
              }
            />

          </label>

          <label className="flex justify-between items-center">

            <span>Suara transaksi</span>

            <input
              type="checkbox"
              checked={soundNotif}
              onChange={() =>
                setSoundNotif(!soundNotif)
              }
            />

          </label>

          <label className="flex justify-between items-center">

            <span>Print otomatis setelah bayar</span>

            <input
              type="checkbox"
              checked={autoPrint}
              onChange={() =>
                setAutoPrint(!autoPrint)
              }
            />

          </label>

        </div>

      </div>

      {/* Backup */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-6">

          <Database className="text-emerald-600" />

          <h2 className="text-xl font-bold">
            Backup & Reset
          </h2>

        </div>

        <p className="text-sm text-gray-500 mb-4">
          Data Produk & Riwayat Transaksi tersimpan aman di cloud (Supabase),
          jadi tidak akan hilang walau ganti perangkat. Tombol Backup di bawah
          ini hanya untuk mengunduh salinan cadangan berupa file JSON.
        </p>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={backupData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            <Download size={18} />
            Backup Data (JSON)
          </button>

          <button
            onClick={resetAll}
            disabled={resetting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl disabled:opacity-60"
          >
            <RotateCcw size={18} />
            {resetting
              ? "Menghapus..."
              : "Reset Data Produk & Riwayat"}
          </button>

        </div>

      </div>

      {/* Tentang */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-6">

          <Info className="text-emerald-600" />

          <h2 className="text-xl font-bold">
            Tentang Aplikasi
          </h2>

        </div>

        <div className="space-y-2 text-gray-600">

          <p>
            <strong>Aplikasi :</strong> Cashier-in POS
          </p>

          <p>
            <strong>Versi :</strong> 1.0.0
          </p>

          <p>
            <strong>Developer :</strong> Bibinn
          </p>

          <p>
            Sistem kasir sederhana untuk UMKM.
          </p>

        </div>

      </div>

      {/* Simpan */}

      <div className="flex justify-end">

        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>

      </div>

    </div>
  );
}