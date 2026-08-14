// src/pages/Settings.jsx
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  CreditCard,
  Database,
  Download,
  Info,
  Receipt,
  RotateCcw,
  Save,
  Store,
  Upload,
} from "lucide-react";
import { useStore } from "../context/StoreContext";

const defaultReceipt = {
  showLogo: true,
  showAddress: true,
  showPhone: true,
  showTax: false,
};

const defaultNotification = {
  stock: true,
  sound: true,
  autoPrint: false,
};

export default function Settings() {
  const fileInput = useRef(null);
  const { store, setStore } = useStore();

  const [form, setForm] = useState({
    name: store.name || "",
    owner: store.owner || "",
    phone: store.phone || "",
    address: store.address || "",
    footer: store.footer || "Terima kasih telah berbelanja.",
    tax: store.tax || 0,
    discount: store.discount || 0,
    paymentMethod: store.paymentMethod || "Tunai",
    receipt: {
      ...defaultReceipt,
      ...(store.receipt || {}),
    },
    notification: {
      ...defaultNotification,
      ...(store.notification || {}),
    },
  });

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateReceipt = (key, value) => {
    setForm((previous) => ({
      ...previous,
      receipt: {
        ...previous.receipt,
        [key]: value,
      },
    }));
  };

  const updateNotification = (key, value) => {
    setForm((previous) => ({
      ...previous,
      notification: {
        ...previous.notification,
        [key]: value,
      },
    }));
  };

  const saveSettings = () => {
    if (!form.name.trim()) {
      toast.error("Nama toko wajib diisi");
      return;
    }

    setStore((previous) => ({
      ...previous,
      name: form.name.trim(),
      owner: form.owner.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      footer: form.footer.trim(),
      tax: Number(form.tax || 0),
      discount: Number(form.discount || 0),
      paymentMethod: form.paymentMethod,
      receipt: form.receipt,
      notification: form.notification,
    }));

    toast.success("Pengaturan berhasil disimpan");
  };

  const backupData = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      products: JSON.parse(localStorage.getItem("products") || "[]"),
      history: JSON.parse(localStorage.getItem("history") || "[]"),
      store: {
        ...store,
        ...form,
      },
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `backup-kasirku-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Backup berhasil diunduh");
  };

  const restoreData = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (result) => {
      try {
        const data = JSON.parse(result.target.result);

        if (!Array.isArray(data.products) || !Array.isArray(data.history)) {
          throw new Error("Format backup tidak valid");
        }

        localStorage.setItem("products", JSON.stringify(data.products));
        localStorage.setItem("history", JSON.stringify(data.history));

        if (data.store) {
          localStorage.setItem("store", JSON.stringify(data.store));
        }

        toast.success("Data berhasil dipulihkan");

        setTimeout(() => {
          window.location.reload();
        }, 700);
      } catch {
        toast.error("File backup tidak valid");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const resetAll = () => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus seluruh produk, transaksi, dan pengaturan?"
    );

    if (!confirmed) return;

    localStorage.clear();
    toast.success("Semua data berhasil dihapus");

    setTimeout(() => {
      window.location.href = "/login";
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Pengaturan</h1>

        <p className="mt-1 text-gray-500">
          Kelola informasi toko dan sistem aplikasi.
        </p>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Store className="text-emerald-600" />
          <h2 className="text-xl font-bold">Informasi Toko</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-500">Nama Toko</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Nama Pemilik</label>
            <input
              type="text"
              value={form.owner}
              onChange={(event) => updateForm("owner", event.target.value)}
              className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Nomor HP</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateForm("phone", event.target.value)}
              className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Alamat</label>
            <input
              type="text"
              value={form.address}
              onChange={(event) => updateForm("address", event.target.value)}
              className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Receipt className="text-emerald-600" />
          <h2 className="text-xl font-bold">Pengaturan Struk</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["showLogo", "Tampilkan Logo"],
            ["showAddress", "Tampilkan Alamat"],
            ["showPhone", "Tampilkan Nomor HP"],
            ["showTax", "Tampilkan Pajak"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
            >
              <span>{label}</span>

              <input
                type="checkbox"
                checked={form.receipt[key]}
                onChange={(event) => updateReceipt(key, event.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm text-gray-500">Pajak (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.tax}
              onChange={(event) => updateForm("tax", event.target.value)}
              className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Diskon Default (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={(event) => updateForm("discount", event.target.value)}
              className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm text-gray-500">Footer Struk</label>
          <textarea
            rows={3}
            value={form.footer}
            onChange={(event) => updateForm("footer", event.target.value)}
            className="mt-1 w-full resize-none rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <CreditCard className="text-emerald-600" />
          <h2 className="text-xl font-bold">Pembayaran Default</h2>
        </div>

        <select
          value={form.paymentMethod}
          onChange={(event) => updateForm("paymentMethod", event.target.value)}
          className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="Tunai">Tunai</option>
          <option value="QRIS">QRIS</option>
          <option value="Transfer">Transfer</option>
        </select>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Bell className="text-emerald-600" />
          <h2 className="text-xl font-bold">Notifikasi</h2>
        </div>

        <div className="space-y-3">
          {[
            ["stock", "Notifikasi stok menipis"],
            ["sound", "Suara transaksi"],
            ["autoPrint", "Print otomatis setelah bayar"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
            >
              <span>{label}</span>

              <input
                type="checkbox"
                checked={form.notification[key]}
                onChange={(event) =>
                  updateNotification(key, event.target.checked)
                }
                className="h-4 w-4 accent-emerald-600"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Database className="text-emerald-600" />
          <h2 className="text-xl font-bold">Backup & Restore</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={backupData}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <Download size={18} />
            Backup Data
          </button>

          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
          >
            <Upload size={18} />
            Restore Data
          </button>

          <button
            type="button"
            onClick={resetAll}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            <RotateCcw size={18} />
            Reset Semua Data
          </button>

          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={restoreData}
          />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 text-gray-600 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Info className="text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Tentang Aplikasi
          </h2>
        </div>

        <p>
          <strong>Aplikasi:</strong> KasirKu POS
        </p>

        <p className="mt-1">
          <strong>Versi:</strong> 1.0.0
        </p>

        <p className="mt-1">
          Sistem kasir sederhana untuk UMKM.
        </p>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveSettings}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 sm:w-auto"
        >
          <Save size={18} />
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}