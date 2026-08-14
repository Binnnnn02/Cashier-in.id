// src/pages/Account.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Calendar,
  Crown,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Store,
  User,
  X,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

export default function Account() {
  const navigate = useNavigate();
  const { store, setStore } = useStore();
  const { admin, account, setAdmin, updateAccount } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const [profile, setProfile] = useState({
    storeName: store.name || "",
    owner: store.owner || "",
    email: admin?.email || account?.email || "",
    phone: store.phone || "",
    address: store.address || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const logout = () => {
    if (!window.confirm("Yakin ingin logout?")) return;

    setAdmin(null);
    toast.success("Logout berhasil");
    navigate("/login");
  };

  const saveProfile = (event) => {
    event.preventDefault();

    if (!profile.storeName.trim() || !profile.owner.trim()) {
      toast.error("Nama toko dan pemilik wajib diisi");
      return;
    }

    if (!profile.email.trim()) {
      toast.error("Email wajib diisi");
      return;
    }

    setStore((previous) => ({
      ...previous,
      name: profile.storeName.trim(),
      owner: profile.owner.trim(),
      phone: profile.phone.trim(),
      address: profile.address.trim(),
      email: profile.email.trim(),
    }));

    updateAccount({
      email: profile.email.trim(),
    });

    setAdmin((previous) => ({
      ...previous,
      email: profile.email.trim(),
    }));

    setOpenProfile(false);
    toast.success("Profil dan informasi toko berhasil diperbarui");
  };

  const changePassword = (event) => {
    event.preventDefault();

    if (passwordData.currentPassword !== account.password) {
      toast.error("Password saat ini tidak sesuai");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Konfirmasi password tidak sama");
      return;
    }

    updateAccount({
      password: passwordData.newPassword,
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setOpenPassword(false);
    toast.success("Password berhasil diubah");
  };

  const infoItems = [
    {
      icon: Store,
      label: "Nama Toko",
      value: store.name || "-",
    },
    {
      icon: User,
      label: "Pemilik",
      value: store.owner || "-",
    },
    {
      icon: Mail,
      label: "Email",
      value: admin?.email || account?.email || "-",
    },
    {
      icon: Phone,
      label: "Nomor HP",
      value: store.phone || "-",
    },
    {
      icon: MapPin,
      label: "Alamat",
      value: store.address || "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Profil & Toko
        </h1>

        <p className="mt-1 text-gray-500">
          Kelola informasi akun dan toko Anda.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-emerald-600 sm:h-28 sm:w-28">
            <User size={50} className="text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {store.name || "KasirKu"}
            </h2>

            <p className="mt-1 text-gray-500">
              {store.owner || "Pemilik Toko"}
            </p>

            <span className="mt-3 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
              {account?.role || "Owner"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-6 text-xl font-bold">Informasi Toko</h2>

          <div className="space-y-5">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <Icon className="shrink-0 text-emerald-600" size={21} />

                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="truncate font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-6 text-xl font-bold">Status Akun</h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Calendar className="text-blue-600" size={21} />

              <div>
                <p className="text-sm text-gray-500">Hari ini</p>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Crown className="text-yellow-500" size={21} />

              <div>
                <p className="text-sm text-gray-500">Paket</p>
                <p className="font-semibold">Starter Plan</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck className="text-emerald-600" size={21} />

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold text-emerald-600">Aktif</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-6 text-xl font-bold">Pengaturan Akun</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => setOpenProfile(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
          >
            <Pencil size={18} />
            Edit Profil & Toko
          </button>

          <button
            type="button"
            onClick={() => setOpenPassword(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <Lock size={18} />
            Ganti Password
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {openProfile && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center sm:justify-center sm:p-4">
          <form
            onSubmit={saveProfile}
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 sm:max-w-md sm:rounded-2xl sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Profil & Toko</h2>

              <button
                type="button"
                onClick={() => setOpenProfile(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama Toko</label>

                <input
                  type="text"
                  value={profile.storeName}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      storeName: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Nama Pemilik</label>

                <input
                  type="text"
                  value={profile.owner}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      owner: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>

                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Nomor HP</label>

                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Alamat Toko</label>

                <textarea
                  rows={3}
                  value={profile.address}
                  onChange={(event) =>
                    setProfile((previous) => ({
                      ...previous,
                      address: event.target.value,
                    }))
                  }
                  className="mt-1 w-full resize-none rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Simpan Profil & Toko
            </button>
          </form>
        </div>
      )}

      {openPassword && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 sm:items-center sm:justify-center sm:p-4">
          <form
            onSubmit={changePassword}
            className="w-full rounded-t-3xl bg-white p-5 sm:max-w-md sm:rounded-2xl sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Ganti Password</h2>

              <button
                type="button"
                onClick={() => setOpenPassword(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Password Saat Ini
                </label>

                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(event) =>
                    setPasswordData((previous) => ({
                      ...previous,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Password Baru</label>

                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(event) =>
                    setPasswordData((previous) => ({
                      ...previous,
                      newPassword: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Konfirmasi Password Baru
                </label>

                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(event) =>
                    setPasswordData((previous) => ({
                      ...previous,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Ubah Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}