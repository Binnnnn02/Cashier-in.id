import { useState } from "react";
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
  Check,
} from "lucide-react";

function SettingsForm({ store, updateStore, products, history, resetAllData }) {

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
  const [resetting, setResetting] = useState(false);

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

    toast.success("Pengaturan toko berhasil diperbarui!");

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

    a.download = `backup-kasir-${new Date().toISOString().slice(0, 10)}.json`;

    a.click();

    URL.revokeObjectURL(url);

    toast.success("File backup berhasil diunduh");

  };

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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Pengaturan Toko
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Konfigurasi identitas toko, format struk, sistem notifikasi, dan pencadangan.
          </p>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="
            self-start
            md:self-auto
            bg-gradient-to-r
            from-emerald-600
            via-emerald-600
            to-emerald-700
            hover:from-emerald-700
            hover:to-emerald-800
            text-white
            px-6
            py-3
            rounded-2xl
            font-extrabold
            text-sm
            shadow-md
            shadow-emerald-600/20
            hover:shadow-lg
            hover:shadow-emerald-600/30
            flex
            items-center
            gap-2
            transition-all
            active:scale-95
            disabled:opacity-60
          "
        >
          <Save size={18} />
          <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
        </button>
      </div>


      {/* ======================================================
          1. INFORMASI TOKO
      ====================================================== */}
      <div
        className="
          bg-gradient-to-b
          from-white
          via-white
          to-emerald-50/20
          rounded-3xl
          p-6
          sm:p-8
          border
          border-emerald-100/70
          shadow-sm
        "
      >

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <Store size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
              Informasi Toko
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Data ini akan tercetak di bagian atas struk belanja
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Nama Toko
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="
                w-full
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                p-3.5
                text-sm
                font-medium
                text-gray-800
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
              "
              placeholder="Nama Toko Anda"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Nama Pemilik / Kasir Utama
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="
                w-full
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                p-3.5
                text-sm
                font-medium
                text-gray-800
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
              "
              placeholder="Nama Pemilik"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Nomor Telepon / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="
                w-full
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                p-3.5
                text-sm
                font-medium
                text-gray-800
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
              "
              placeholder="081234567890"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Alamat Toko
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="
                w-full
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                p-3.5
                text-sm
                font-medium
                text-gray-800
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
              "
              placeholder="Jl. Mawar No. 123"
            />
          </div>

        </div>

      </div>


      {/* ======================================================
          2. PENGATURAN STRUK & PAJAK
      ====================================================== */}
      <div
        className="
          bg-gradient-to-b
          from-white
          via-white
          to-emerald-50/20
          rounded-3xl
          p-6
          sm:p-8
          border
          border-emerald-100/70
          shadow-sm
        "
      >

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <Receipt size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
              Pengaturan Struk Belanja
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Sesuaikan elemen yang tampil pada struk digital & kertas thermal
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

          {[
            { label: "Tampilkan Logo Toko", val: showLogo, set: () => setShowLogo(!showLogo) },
            { label: "Tampilkan Alamat Toko", val: showAddress, set: () => setShowAddress(!showAddress) },
            { label: "Tampilkan Nomor HP", val: showPhone, set: () => setShowPhone(!showPhone) },
            { label: "Tampilkan Pajak Transaksi", val: showTax, set: () => setShowTax(!showTax) },
          ].map((toggle, idx) => (
            <label
              key={idx}
              className="
                flex
                items-center
                justify-between
                p-4
                rounded-2xl
                bg-gray-50/80
                border
                border-gray-200/80
                hover:border-emerald-300
                cursor-pointer
                transition-all
              "
            >
              <span className="text-sm font-bold text-gray-800">{toggle.label}</span>
              <input
                type="checkbox"
                checked={toggle.val}
                onChange={toggle.set}
                className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer accent-emerald-600"
              />
            </label>
          ))}

        </div>

        {/* Tax & Discount Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Pajak Transaksi (%)
            </label>
            <input
              type="number"
              min="0"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              className="
                w-full
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                p-3.5
                text-sm
                font-medium
                text-gray-800
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
              "
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Diskon Default (%)
            </label>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="
                w-full
                bg-gray-50/80
                border
                border-gray-200
                rounded-2xl
                p-3.5
                text-sm
                font-medium
                text-gray-800
                focus:outline-none
                focus:bg-white
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
                transition-all
              "
              placeholder="0"
            />
          </div>

        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Catatan Footer Struk
          </label>
          <textarea
            rows={3}
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
            className="
              w-full
              bg-gray-50/80
              border
              border-gray-200
              rounded-2xl
              p-3.5
              text-sm
              font-medium
              text-gray-800
              focus:outline-none
              focus:bg-white
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-500/10
              transition-all
              resize-none
            "
            placeholder="Terima kasih telah berbelanja!"
          />
        </div>

      </div>


      {/* ======================================================
          3. METODE PEMBAYARAN & NOTIFIKASI
      ====================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pembayaran */}
        <div
          className="
            bg-gradient-to-b
            from-white
            via-white
            to-emerald-50/20
            rounded-3xl
            p-6
            sm:p-8
            border
            border-emerald-100/70
            shadow-sm
          "
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <CreditCard size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Default Pembayaran
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Metode bayar yang otomatis terpilih
              </p>
            </div>
          </div>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="
              w-full
              bg-gray-50/80
              border
              border-gray-200
              rounded-2xl
              p-3.5
              text-sm
              font-bold
              text-gray-800
              focus:outline-none
              focus:bg-white
              focus:border-emerald-500
              focus:ring-4
              focus:ring-emerald-500/10
              cursor-pointer
            "
          >
            <option>Tunai</option>
            <option>QRIS</option>
            <option>Transfer</option>
            <option>Debit</option>
            <option>E-Wallet</option>
          </select>
        </div>

        {/* Notifikasi */}
        <div
          className="
            bg-gradient-to-b
            from-white
            via-white
            to-emerald-50/20
            rounded-3xl
            p-6
            sm:p-8
            border
            border-emerald-100/70
            shadow-sm
          "
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <Bell size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                Preferensi Sistem
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Suara dan otomatisasi pencetakan
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Peringatan stok menipis", val: stockNotif, set: () => setStockNotif(!stockNotif) },
              { label: "Suara kasir saat sukses bayar", val: soundNotif, set: () => setSoundNotif(!soundNotif) },
              { label: "Print struk otomatis setelah bayar", val: autoPrint, set: () => setAutoPrint(!autoPrint) },
            ].map((pref, i) => (
              <label
                key={i}
                className="
                  flex
                  items-center
                  justify-between
                  p-3
                  rounded-xl
                  hover:bg-emerald-50/50
                  cursor-pointer
                  transition-colors
                "
              >
                <span className="text-xs sm:text-sm font-semibold text-gray-700">{pref.label}</span>
                <input
                  type="checkbox"
                  checked={pref.val}
                  onChange={pref.set}
                  className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer accent-emerald-600"
                />
              </label>
            ))}
          </div>
        </div>

      </div>


      {/* ======================================================
          4. BACKUP DATA & RESET
      ====================================================== */}
      <div
        className="
          bg-gradient-to-b
          from-white
          via-white
          to-emerald-50/20
          rounded-3xl
          p-6
          sm:p-8
          border
          border-emerald-100/70
          shadow-sm
        "
      >

        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <Database size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Cadangan & Reset Data Toko
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Data transaksi tersimpan aman di database cloud Supabase
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
          Anda dapat mengunduh salinan berkas cadangan (JSON) untuk keperluan arsip lokal. Fitur reset akan mengosongkan seluruh riwayat penjualan dan daftar produk di akun toko ini.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={backupData}
            className="
              flex
              items-center
              gap-2
              bg-white
              hover:bg-emerald-50
              text-emerald-700
              border
              border-emerald-200
              px-5
              py-3
              rounded-2xl
              font-bold
              text-xs
              sm:text-sm
              shadow-sm
              transition-all
              active:scale-95
            "
          >
            <Download size={17} />
            <span>Download Backup (JSON)</span>
          </button>

          <button
            onClick={resetAll}
            disabled={resetting}
            className="
              flex
              items-center
              gap-2
              bg-rose-50
              hover:bg-rose-100
              text-rose-700
              border
              border-rose-200
              px-5
              py-3
              rounded-2xl
              font-bold
              text-xs
              sm:text-sm
              transition-all
              active:scale-95
              disabled:opacity-60
            "
          >
            <RotateCcw size={17} />
            <span>{resetting ? "Sedang Mengosongkan..." : "Reset Produk & Riwayat"}</span>
          </button>
        </div>

      </div>


      {/* ======================================================
          5. TENTANG APLIKASI
      ====================================================== */}
      <div
        className="
          bg-gradient-to-b
          from-white
          via-white
          to-emerald-50/20
          rounded-3xl
          p-6
          sm:p-8
          border
          border-emerald-100/70
          shadow-sm
        "
      >
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <Info size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Tentang Aplikasi
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Informasi versi dan pengembang
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Aplikasi</span>
            <span className="font-extrabold text-gray-800 text-base mt-0.5 block">Cashier-in POS</span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Versi</span>
            <span className="font-extrabold text-emerald-700 text-base mt-0.5 block">1.0.0 Stable</span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/60">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Developer</span>
            <span className="font-extrabold text-gray-800 text-base mt-0.5 block">Bibinn</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function Settings() {
  const { store, storeLoading, updateStore } = useStore();
  const { products, history, resetAllData } = useProducts();

  if (storeLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-emerald-700 font-semibold text-sm animate-pulse">
        Memuat data pengaturan toko...
      </div>
    );
  }

  return (
    <SettingsForm
      key={store.name + store.phone}
      store={store}
      updateStore={updateStore}
      products={products}
      history={history}
      resetAllData={resetAllData}
    />
  );
}