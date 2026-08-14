import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useStore } from "../context/StoreContext";
import {
  Store,
  Receipt,
  CreditCard,
  Bell,
  Database,
  Info,
  Upload,
  Download,
  RotateCcw,
  Save,
} from "lucide-react";

export default function Settings() {

  const fileInput = useRef(null);

  const { store, setStore } = useStore();

  const [storeName, setStoreName] = useState(
    store.name
  );

  const [owner, setOwner] = useState(
    store.owner
  );

  const [phone, setPhone] = useState(
    store.phone
  );

  const [address, setAddress] = useState(
    store.address
  );

  const [tax, setTax] = useState(
    localStorage.getItem("tax") || 0
  );

  const [discount, setDiscount] = useState(
    localStorage.getItem("discount") || 0
  );

  const [footer, setFooter] = useState(
    localStorage.getItem("footer") ||
      store.footer
  );

  const [showLogo, setShowLogo] = useState(
    JSON.parse(localStorage.getItem("showLogo") ?? "true")
  );

  const [showAddress, setShowAddress] = useState(
    JSON.parse(localStorage.getItem("showAddress") ?? "true")
  );

  const [showPhone, setShowPhone] = useState(
    JSON.parse(localStorage.getItem("showPhone") ?? "true")
  );

  const [showTax, setShowTax] = useState(
    JSON.parse(localStorage.getItem("showTax") ?? "false")
  );

  const [stockNotif, setStockNotif] = useState(
    JSON.parse(localStorage.getItem("stockNotif") ?? "true")
  );

  const [soundNotif, setSoundNotif] = useState(
    JSON.parse(localStorage.getItem("soundNotif") ?? "true")
  );

  const [autoPrint, setAutoPrint] = useState(
    JSON.parse(localStorage.getItem("autoPrint") ?? "false")
  );

  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem("paymentMethod") || "Tunai"
  );

  const saveSettings = () => {
    setStore({
  ...store,
  name: storeName,
  owner,
  email: store.email,
  phone,
  address,
  footer,
});

    localStorage.setItem("tax", tax);
    localStorage.setItem("discount", discount);
    localStorage.setItem("footer", footer);

    localStorage.setItem(
      "showLogo",
      JSON.stringify(showLogo)
    );

    localStorage.setItem(
      "showAddress",
      JSON.stringify(showAddress)
    );

    localStorage.setItem(
      "showPhone",
      JSON.stringify(showPhone)
    );

    localStorage.setItem(
      "showTax",
      JSON.stringify(showTax)
    );

    localStorage.setItem(
      "stockNotif",
      JSON.stringify(stockNotif)
    );

    localStorage.setItem(
      "soundNotif",
      JSON.stringify(soundNotif)
    );

    localStorage.setItem(
      "autoPrint",
      JSON.stringify(autoPrint)
    );

    localStorage.setItem(
      "paymentMethod",
      paymentMethod
    );

    toast.success("Pengaturan berhasil disimpan");
  };

  const backupData = () => {
    const backup = {
      products: JSON.parse(localStorage.getItem("products") || "[]"),
      history: JSON.parse(localStorage.getItem("history") || "[]"),
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

    toast.success("Backup berhasil");
  };

  const restoreData = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (data.products)
          localStorage.setItem(
            "products",
            JSON.stringify(data.products)
          );

        if (data.history)
          localStorage.setItem(
            "history",
            JSON.stringify(data.history)
          );

        toast.success("Restore berhasil");

        window.location.reload();
      } catch {
        toast.error("File tidak valid");
      }
    };

    reader.readAsText(file);
  };

  const resetAll = () => {
    if (
      !window.confirm(
        "Yakin ingin menghapus semua data?"
      )
    )
      return;

    localStorage.clear();

    toast.success("Semua data berhasil dihapus");

    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

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
            Backup & Restore
          </h2>

        </div>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={backupData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            <Download size={18} />
            Backup Data
          </button>

          <button
            onClick={() =>
              fileInput.current.click()
            }
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl"
          >
            <Upload size={18} />
            Restore Data
          </button>

          <button
            onClick={resetAll}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
          >
            <RotateCcw size={18} />
            Reset Semua Data
          </button>

          <input
            ref={fileInput}
            type="file"
            accept=".json"
            hidden
            onChange={restoreData}
          />

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
            <strong>Aplikasi :</strong> KasirKu POS
          </p>

          <p>
            <strong>Versi :</strong> 1.0.0
          </p>

          <p>
            <strong>Developer :</strong> Berjuta Cerita
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
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl"
        >
          <Save size={18} />
          Simpan Pengaturan
        </button>

      </div>

    </div>
  );
}
