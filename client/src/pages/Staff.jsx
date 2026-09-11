import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Trash2,
  UserCheck,
  Mail,
  ShieldCheck,
  ShoppingCart,
  Loader2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS, ROLE_COLORS } from "../lib/permissions";

/* ====================================
   ADD STAFF MODAL
==================================== */

function AddStaffModal({ open, onClose, onAdded, storeId }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("kasir");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setName("");
    setEmail("");
    setRole("kasir");
    onClose();
  };

  const handleAdd = async () => {

    if (!name.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Email tidak valid");
      return;
    }

    setSaving(true);

    // 1. Simpan record staff di tabel staff terlebih dahulu
    //    user_id masih null, akan diisi saat staff pertama kali login
    const { data: newStaff, error: insertError } = await supabase
      .from("staff")
      .insert({
        store_id: storeId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        user_id: null,
      })
      .select()
      .single();

    if (insertError) {
      toast.error("Gagal menambah staff: " + insertError.message);
      setSaving(false);
      return;
    }

    toast.success(`Staff "${name}" berhasil ditambahkan!`);
    setSaving(false);
    handleClose();
    onAdded(newStaff);

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
              <UserCheck size={20} className="stroke-[2.5]" />
            </div>
            <h2 className="font-bold text-gray-900">Tambah Staff</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Nama Staff
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Email Login
            </label>
            <input
              type="email"
              placeholder="staff@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition"
            />
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
              <Mail size={11} />
              Staff login menggunakan email ini di halaman Login.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">

              {/* Admin */}
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 transition text-left ${
                  role === "admin"
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-200 hover:bg-blue-50/40"
                }`}
              >
                <ShieldCheck size={18} className="shrink-0" />
                <div>
                  <p className="font-bold text-sm">Admin</p>
                  <p className="text-[10px] opacity-70 leading-tight">
                    Produk, statistik, pengaturan
                  </p>
                </div>
              </button>

              {/* Kasir */}
              <button
                type="button"
                onClick={() => setRole("kasir")}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 transition text-left ${
                  role === "kasir"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/40"
                }`}
              >
                <ShoppingCart size={18} className="shrink-0" />
                <div>
                  <p className="font-bold text-sm">Kasir</p>
                  <p className="text-[10px] opacity-70 leading-tight">
                    Dashboard & riwayat saja
                  </p>
                </div>
              </button>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm transition active:scale-95 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus size={16} className="stroke-[3]" />
                Tambah
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );

}


/* ====================================
   HALAMAN UTAMA
==================================== */

export default function Staff() {

  const { admin } = useAuth();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Load daftar staff milik toko ini
  const loadStaff = async () => {

    if (!admin?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("store_id", admin.id)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Gagal memuat daftar staff");
    } else {
      setStaffList(data || []);
    }

    setLoading(false);

  };

  useEffect(() => {
    loadStaff();
  }, [admin?.id]);

  const handleDeleteStaff = async (staff) => {

    if (!window.confirm(`Hapus staff "${staff.name}"? Aksi ini tidak dapat dibatalkan.`))
      return;

    setDeletingId(staff.id);

    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", staff.id);

    setDeletingId(null);

    if (error) {
      toast.error("Gagal menghapus staff");
    } else {
      toast.success(`Staff "${staff.name}" dihapus`);
      setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
    }

  };

  const handleStaffAdded = (newStaff) => {
    setStaffList((prev) => [...prev, newStaff]);
  };

  return (

    <div className="space-y-6 sm:space-y-8 animate-fade-in">


      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Kelola Staff
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Tambah dan kelola akun Admin & Kasir untuk toko Anda.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="
            w-full sm:w-auto
            bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700
            hover:from-emerald-700 hover:to-emerald-800
            text-white
            px-5 py-2.5
            rounded-2xl
            flex items-center justify-center gap-2
            text-xs sm:text-sm font-extrabold
            shadow-md shadow-emerald-600/20
            hover:shadow-lg hover:shadow-emerald-600/30
            transition-all active:scale-95
          "
        >
          <Plus size={18} className="stroke-[3]" />
          <span>Tambah Staff</span>
        </button>

      </div>


      {/* =========================
          PANDUAN SINGKAT
      ========================= */}

      <div className="bg-blue-50 border border-blue-100 rounded-3xl px-5 py-4 text-sm text-blue-800 space-y-1.5">
        <p className="font-bold flex items-center gap-2">
          <Mail size={15} />
          Cara kerja akun staff:
        </p>
        <ul className="text-xs text-blue-700 space-y-1 pl-5 list-disc">
          <li>Tambahkan staff dengan email mereka.</li>
          <li>Minta staff daftar akun di halaman <strong>Register</strong> menggunakan email yang sama.</li>
          <li>Sistem akan otomatis mengenali dan memberikan role yang sesuai saat login.</li>
        </ul>
      </div>


      {/* =========================
          TABEL STAFF
      ========================= */}

      <div
        className="bg-white rounded-3xl shadow-sm border border-emerald-100/70 overflow-hidden"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
      >

        {loading ? (

          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>

        ) : staffList.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
            <Users size={48} className="opacity-30" />
            <p className="font-semibold text-sm">Belum ada staff</p>
            <p className="text-xs text-gray-400">
              Klik "Tambah Staff" untuk menambah Admin atau Kasir.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">

              <thead className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white">
                <tr>
                  <th className="text-left px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="text-left px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-5 sm:px-7 py-4 text-xs font-bold uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {staffList.map((staff) => {

                  const colors = ROLE_COLORS[staff.role] ?? ROLE_COLORS.kasir;

                  return (
                    <tr
                      key={staff.id}
                      className="hover:bg-emerald-50/30 transition-colors"
                    >

                      {/* Nama */}
                      <td className="px-5 sm:px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm shrink-0">
                            {staff.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-gray-800">
                            {staff.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 sm:px-7 py-4">
                        <span className="text-sm text-gray-500">
                          {staff.email}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-5 sm:px-7 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                          {staff.role === "admin" ? (
                            <ShieldCheck size={11} />
                          ) : (
                            <ShoppingCart size={11} />
                          )}
                          {ROLE_LABELS[staff.role] ?? staff.role}
                        </span>
                      </td>

                      {/* Status akun */}
                      <td className="px-5 sm:px-7 py-4">
                        {staff.user_id ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Belum daftar
                          </span>
                        )}
                      </td>

                      {/* Hapus */}
                      <td className="px-5 sm:px-7 py-4 text-center">
                        <button
                          onClick={() => handleDeleteStaff(staff)}
                          disabled={deletingId === staff.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 border border-red-100 hover:border-red-200 text-xs font-semibold transition disabled:opacity-40"
                        >
                          {deletingId === staff.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                          Hapus
                        </button>
                      </td>

                    </tr>
                  );

                })}
              </tbody>

            </table>
          </div>

        )}

      </div>


      {/* Add Staff Modal */}
      <AddStaffModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={handleStaffAdded}
        storeId={admin?.id}
      />

    </div>

  );

}

