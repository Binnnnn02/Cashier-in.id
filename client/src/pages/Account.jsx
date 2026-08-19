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
  Camera,
  Pencil,
  Lock,
  LogOut,
  AlertTriangle,
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

    if (!window.confirm("Yakin ingin logout?")) {
      return;
    }

    await authLogout();

    toast.success("Logout berhasil");

    navigate("/login");

  };


  return (

    <div className="space-y-6">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>

        <h1 className="text-3xl font-bold">
          Akun
        </h1>

        <p className="text-gray-500 mt-1">
          Informasi akun dan toko.
        </p>

      </div>


      {/* ======================================================
          ALERT LANGGANAN
      ====================================================== */}

      {subscriptionExpiringSoon && (

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">

              <AlertTriangle
                size={23}
                className="text-amber-600"
              />

            </div>

            <div className="flex-1">

              <h2 className="font-bold text-amber-800">

                Langganan hampir habis

              </h2>

              <p className="text-sm text-amber-700 mt-1">

                Langganan toko Anda tersisa{" "}

                <strong>
                  {daysRemaining} hari
                </strong>

                {" "}dan akan berakhir pada{" "}

                <strong>
                  {formatSubscriptionDate(
                    store.subscriptionExpiresAt
                  )}
                </strong>.

              </p>

              <button
                onClick={() => setOpenRenewSubscription(true)}
                className="mt-3 text-sm font-semibold text-amber-800 hover:text-amber-900 underline"
              >
                Perpanjang langganan
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          PROFIL UTAMA
      ====================================================== */}

      <div className="bg-white rounded-2xl shadow-sm p-8">

        <div className="flex items-center gap-8">

          <div className="relative">

            <div className="w-28 h-28 rounded-full bg-emerald-600 flex items-center justify-center">

              <User
                size={55}
                className="text-white"
              />

            </div>

            <button
              className="absolute bottom-0 right-0 bg-white rounded-full shadow p-2"
            >
              <Camera size={18} />
            </button>

          </div>

          <div>

            <h2 className="text-3xl font-bold">

              {store.name}

            </h2>

            <p className="text-gray-500 mt-1">

              {store.owner || "Owner"}

            </p>

            <span
              className={`inline-block mt-3 px-4 py-1 rounded-full ${
                subscriptionIsActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >

              {subscriptionIsActive
                ? "Starter Plan"
                : "Langganan Tidak Aktif"}

            </span>

          </div>

        </div>

      </div>


      {/* ======================================================
          INFORMASI AKUN + STATUS
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* ====================================================
            INFORMASI AKUN
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold mb-6">

            Informasi Akun

          </h2>

          <div className="space-y-5">


            <div className="flex items-center gap-4">

              <Store className="text-emerald-600" />

              <div>

                <p className="text-gray-500 text-sm">
                  Nama Toko
                </p>

                <h3 className="font-semibold">
                  {store.name}
                </h3>

              </div>

            </div>


            <div className="flex items-center gap-4">

              <User className="text-emerald-600" />

              <div>

                <p className="text-gray-500 text-sm">
                  Pemilik
                </p>

                <h3 className="font-semibold">
                  {store.owner || "-"}
                </h3>

              </div>

            </div>


            <div className="flex items-center gap-4">

              <Mail className="text-emerald-600" />

              <div>

                <p className="text-gray-500 text-sm">
                  Email
                </p>

                <h3 className="font-semibold">
                  {admin?.email || "-"}
                </h3>

              </div>

            </div>


            <div className="flex items-center gap-4">

              <Phone className="text-emerald-600" />

              <div>

                <p className="text-gray-500 text-sm">
                  Nomor HP
                </p>

                <h3 className="font-semibold">
                  {store.phone || "-"}
                </h3>

              </div>

            </div>


            <div className="flex items-center gap-4">

              <MapPin className="text-emerald-600" />

              <div>

                <p className="text-gray-500 text-sm">
                  Alamat
                </p>

                <h3 className="font-semibold">
                  {store.address || "-"}
                </h3>

              </div>

            </div>

          </div>

        </div>


        {/* ====================================================
            STATUS AKUN
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold mb-6">

            Status Akun

          </h2>

          <div className="space-y-5">


            {/* BERGABUNG */}

            <div className="flex items-center gap-4">

              <Calendar className="text-blue-600" />

              <div>

                <p className="text-gray-500 text-sm">
                  Bergabung
                </p>

                <h3 className="font-semibold">

                  {new Date().toLocaleDateString(
                    "id-ID"
                  )}

                </h3>

              </div>

            </div>


            {/* PAKET */}

            <div className="flex items-center gap-4">

              <Crown className="text-yellow-500" />

              <div>

                <p className="text-gray-500 text-sm">
                  Paket
                </p>

                <h3 className="font-semibold">

                  Starter Plan

                </h3>

              </div>

            </div>


            {/* STATUS */}

            <div className="flex items-center gap-4">

              <ShieldCheck
                className={
                  subscriptionIsActive
                    ? "text-green-600"
                    : "text-red-600"
                }
              />

              <div>

                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <h3
                  className={`font-semibold ${
                    subscriptionIsActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >

                  {subscriptionIsActive
                    ? "Aktif"
                    : "Tidak Aktif"}

                </h3>

              </div>

            </div>


            {/* =================================================
                TANGGAL BERAKHIR
            ================================================= */}

            <div className="flex items-center gap-4">

              <Calendar
                className={
                  subscriptionExpiringSoon
                    ? "text-amber-600"
                    : "text-emerald-600"
                }
              />

              <div>

                <p className="text-gray-500 text-sm">
                  Langganan Berakhir
                </p>

                <h3
                  className={`font-semibold ${
                    subscriptionExpiringSoon
                      ? "text-amber-600"
                      : subscriptionExpired
                        ? "text-red-600"
                        : ""
                  }`}
                >

                  {formatSubscriptionDate(
                    store.subscriptionExpiresAt
                  )}

                </h3>

              </div>

            </div>


            {/* =================================================
                SISA HARI
            ================================================= */}

            {daysRemaining !== null && (

              <div className="flex items-center gap-4">

                <Calendar
                  className={
                    subscriptionExpiringSoon
                      ? "text-amber-600"
                      : subscriptionExpired
                        ? "text-red-600"
                        : "text-emerald-600"
                  }
                />

                <div>

                  <p className="text-gray-500 text-sm">
                    Sisa Langganan
                  </p>

                  <h3
                    className={`font-semibold ${
                      subscriptionExpiringSoon
                        ? "text-amber-600"
                        : subscriptionExpired
                          ? "text-red-600"
                          : "text-emerald-600"
                    }`}
                  >

                    {subscriptionExpired
                      ? "Sudah berakhir"
                      : `${daysRemaining} hari`}

                  </h3>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ======================================================
          PENGATURAN AKUN
      ====================================================== */}

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-bold mb-6">

          Pengaturan Akun

        </h2>

        <div className="flex flex-wrap gap-4">


          <button
            onClick={() =>
              setOpenEditProfile(true)
            }
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl"
          >

            <Pencil size={18} />

            Edit Profil

          </button>


          <button
            onClick={() =>
              setOpenChangePassword(true)
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >

            <Lock size={18} />

            Ganti Password

          </button>


          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </div>


      {/* ======================================================
          EDIT PROFILE MODAL
      ====================================================== */}

      <EditProfileModal
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


      {/* ======================================================
          CHANGE PASSWORD MODAL
      ====================================================== */}

      <ChangePasswordModal
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


      {/* ======================================================
          RENEW SUBSCRIPTION MODAL
      ====================================================== */}

      <RenewSubscriptionModal
        open={openRenewSubscription}
        onClose={() => setOpenRenewSubscription(false)}
      />

    </div>

  );

}