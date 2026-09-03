import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

import EditProfileModal from "../components/account/EditProfileModal";
import ChangePasswordModal from "../components/account/ChangePasswordModal";
import RenewSubscriptionModal from "../components/account/RenewSubscriptionModal";

import {
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Crown,
  ShieldCheck,
  Pencil,
  Lock,
  LogOut,
  AlertTriangle,
  Sparkles,
  Zap,
} from "lucide-react";


// ============================================================
// HELPER LANGGANAN
// ============================================================

const formatSubscriptionDate = (date) => {

  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

};


const getDaysRemaining = (date) => {

  if (!date) return null;

  const expires = new Date(date);

  if (Number.isNaN(expires.getTime())) {
    return null;
  }

  const now = new Date();

  const diff =
    expires.getTime() - now.getTime();

  return Math.ceil(
    diff / (1000 * 60 * 60 * 24)
  );

};


// ============================================================
// ACCOUNT
// ============================================================

export default function Account() {

  const navigate = useNavigate();

  const { store } = useStore();

  const {
    admin,
    logout: authLogout,
    updateEmail,
    changePassword,
  } = useAuth();

  const [openEditProfile, setOpenEditProfile] =
    useState(false);

  const [openChangePassword, setOpenChangePassword] =
    useState(false);

  const [openRenewSubscription, setOpenRenewSubscription] =
    useState(false);


  // ==========================================================
  // STATUS LANGGANAN
  // ==========================================================

  const daysRemaining = getDaysRemaining(
    store.subscriptionExpiresAt
  );

  const subscriptionIsActive =
    store.subscriptionStatus === "active" &&
    daysRemaining !== null &&
    daysRemaining > 0;

  const subscriptionExpiringSoon =
    subscriptionIsActive &&
    daysRemaining <= 7;

  const subscriptionExpired =
    daysRemaining !== null &&
    daysRemaining <= 0;


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async () => {

    if (!window.confirm("Yakin ingin logout dari akun ini?")) {
      return;
    }

    await authLogout();

    toast.success("Logout berhasil");

    navigate("/login");

  };


  return (

    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Akun & Toko
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          Kelola informasi profil kasir, keamanan akun, dan masa aktif langganan.
        </p>

      </div>


      {/* ======================================================
          ALERT LANGGANAN
      ====================================================== */}

      {subscriptionExpiringSoon && (

        <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-amber-100/40 to-white p-5 sm:p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">

              <AlertTriangle
                size={22}
                className="stroke-[2.5]"
              />

            </div>

            <div className="flex-1">

              <h2 className="font-extrabold text-amber-900 text-base">

                Masa Aktif Langganan Segera Berakhir

              </h2>

              <p className="text-xs sm:text-sm text-amber-800/90 mt-1">

                Langganan toko Anda tersisa{" "}
                <strong className="font-black text-amber-950 underline">
                  {daysRemaining} hari lagi
                </strong>
                {" "}dan akan berakhir pada{" "}
                <span className="font-bold">
                  {formatSubscriptionDate(
                    store.subscriptionExpiresAt
                  )}
                </span>.

              </p>

              <button
                onClick={() => setOpenRenewSubscription(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm transition-all"
              >
                <Zap size={14} />
                <span>Perpanjang Sekarang</span>
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          PROFIL UTAMA HERO CARD
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 border border-emerald-600/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          <div className="flex items-center gap-5 sm:gap-6">

            <div className="relative shrink-0">

              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-emerald-300 text-emerald-950 flex items-center justify-center shadow-lg border-2 border-white/40">

                <User
                  size={42}
                  className="stroke-[2.2]"
                />

              </div>

            </div>

            <div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-2 border border-white/20">
                <Sparkles size={13} className="text-emerald-300" />
                <span>Akun Terverifikasi</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {store.name || "Toko Kasir"}
              </h2>

              <p className="text-emerald-100/80 text-sm font-medium mt-0.5">
                {store.owner ? `Pemilik: ${store.owner}` : "Akun Admin"} • {admin?.email}
              </p>

            </div>

          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm ${
                subscriptionIsActive
                  ? "bg-white text-emerald-800 border border-emerald-200 shadow-emerald-900/20"
                  : "bg-rose-500 text-white"
              }`}
            >
              <Crown size={15} className={subscriptionIsActive ? "text-amber-500" : "text-white"} />
              {subscriptionIsActive ? "Starter Plan (Aktif)" : "Langganan Tidak Aktif"}
            </span>
          </div>

        </div>

      </div>


      {/* ======================================================
          INFORMASI AKUN + STATUS GRID
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* INFORMASI AKUN */}

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

          <h2 className="text-lg font-extrabold text-gray-900 mb-6 pb-4 border-b border-gray-100">
            Informasi Toko
          </h2>

          <div className="space-y-5">


            <div className="flex items-center gap-4">

              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Store size={18} />
              </div>

              <div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Nama Toko
                </p>

                <h3 className="font-extrabold text-gray-800 text-sm mt-0.5">
                  {store.name || "-"}
                </h3>

              </div>

            </div>


            <div className="flex items-center gap-4">

              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <User size={18} />
              </div>

              <div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Pemilik / Kasir
                </p>

                <h3 className="font-extrabold text-gray-800 text-sm mt-0.5">
                  {store.owner || "-"}
                </h3>

              </div>

            </div>


            <div className="flex items-center gap-4">

              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Mail size={18} />
              </div>

              <div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Email Login
                </p>

                <h3 className="font-extrabold text-gray-800 text-sm mt-0.5">
                  {admin?.email || "-"}
                </h3>

              </div>

            </div>


            <div className="flex items-center gap-4">

              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Phone size={18} />
              </div>

              <div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Nomor Telepon
                </p>

                <h3 className="font-extrabold text-gray-800 text-sm mt-0.5">
                  {store.phone || "-"}
                </h3>

              </div>

            </div>


            <div className="flex items-center gap-4">

              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <MapPin size={18} />
              </div>

              <div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Alamat
                </p>

                <h3 className="font-extrabold text-gray-800 text-sm mt-0.5">
                  {store.address || "-"}
                </h3>

              </div>

            </div>


          </div>

        </div>


        {/* STATUS LANGGANAN */}

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

          <h2 className="text-lg font-extrabold text-gray-900 mb-6 pb-4 border-b border-gray-100">
            Status Paket & Masa Aktif
          </h2>

          <div className="space-y-5">


            {/* PAKET */}

            <div className="flex items-center gap-4">

              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Crown size={18} />
              </div>

              <div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Paket Langganan
                </p>

                <h3 className="font-extrabold text-gray-800 text-sm mt-0.5">
                  Starter Plan (Full Access)
                </h3>

              </div>

            </div>


            {/* STATUS */}

            <div className="flex items-center gap-4">

              <div className={`p-2.5 rounded-xl ${subscriptionIsActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                <ShieldCheck size={18} />
              </div>

              <div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Status Akun
                </p>

                <h3
                  className={`font-extrabold text-sm mt-0.5 ${
                    subscriptionIsActive
                      ? "text-emerald-700"
                      : "text-rose-600"
                  }`}
                >

                  {subscriptionIsActive
                    ? "Aktif Beroperasi"
                    : "Tidak Aktif"}

                </h3>

              </div>

            </div>


            {/* TANGGAL BERAKHIR */}

            <div className="flex items-center gap-4">

              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Calendar size={18} />
              </div>

              <div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Tanggal Berakhir
                </p>

                <h3 className="font-extrabold text-gray-800 text-sm mt-0.5">

                  {formatSubscriptionDate(
                    store.subscriptionExpiresAt
                  )}

                </h3>

              </div>

            </div>


            {/* SISA HARI */}

            {daysRemaining !== null && (

              <div className="flex items-center gap-4">

                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                  <Calendar size={18} />
                </div>

                <div>

                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    Sisa Waktu
                  </p>

                  <h3
                    className={`font-extrabold text-sm mt-0.5 ${
                      subscriptionExpiringSoon
                        ? "text-amber-700"
                        : subscriptionExpired
                          ? "text-rose-600"
                          : "text-emerald-700"
                    }`}
                  >

                    {subscriptionExpired
                      ? "Sudah Berakhir"
                      : `${daysRemaining} Hari`}

                  </h3>

                </div>

              </div>

            )}

          </div>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={() => setOpenRenewSubscription(true)}
              className="
                w-full
                py-3
                bg-gradient-to-r
                from-emerald-600
                to-emerald-700
                hover:from-emerald-700
                hover:to-emerald-800
                text-white
                rounded-2xl
                font-extrabold
                text-sm
                shadow-sm
                transition-all
                active:scale-95
              "
            >
              Perpanjang Langganan
            </button>
          </div>

        </div>


      </div>


      {/* ======================================================
          AKSI PENGATURAN AKUN
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

        <h2 className="text-lg font-extrabold text-gray-900 mb-6 pb-4 border-b border-gray-100">
          Tindakan Akun
        </h2>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() =>
              setOpenEditProfile(true)
            }
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

            <Pencil size={16} />

            <span>Edit Email Profil</span>

          </button>


          <button
            onClick={() =>
              setOpenChangePassword(true)
            }
            className="
              flex
              items-center
              gap-2
              bg-white
              hover:bg-blue-50
              text-blue-700
              border
              border-blue-200
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

            <Lock size={16} />

            <span>Ganti Password</span>

          </button>


          <button
            onClick={logout}
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
            "
          >

            <LogOut size={16} />

            <span>Keluar (Logout)</span>

          </button>

        </div>

      </div>


      {/* ======================================================
          MODALS
      ====================================================== */}

      <EditProfileModal
        key={openEditProfile ? (admin?.email || "open") : "closed"}
        open={openEditProfile}
        account={admin}
        onClose={() =>
          setOpenEditProfile(false)
        }
        onSave={async ({ email }) => {

          const result =
            await updateEmail(email);

          if (!result.success) {

            toast.error(
              result.message ||
              "Gagal memperbarui profil"
            );

            return false;

          }

          toast.success(
            "Permintaan ganti email dikirim. Cek inbox email lama & baru untuk konfirmasi.",
            { duration: 6000 }
          );

          return true;

        }}
      />


      <ChangePasswordModal
        key={openChangePassword ? "pw-open" : "pw-closed"}
        open={openChangePassword}
        onClose={() =>
          setOpenChangePassword(false)
        }
        onSave={async (
          currentPassword,
          newPassword
        ) => {

          const result =
            await changePassword(
              currentPassword,
              newPassword
            );

          if (!result.success) {

            toast.error(
              result.message ||
              "Gagal mengubah password"
            );

            return false;

          }

          toast.success(
            "Password berhasil diubah"
          );

          return true;

        }}
      />


      <RenewSubscriptionModal
        key={openRenewSubscription ? "renew-open" : "renew-closed"}
        open={openRenewSubscription}
        onClose={() => setOpenRenewSubscription(false)}
      />

    </div>

  );

}