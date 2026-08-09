import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

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
} from "lucide-react";

export default function Account() {

  const navigate = useNavigate();

  const { store } = useStore();

  const { admin, setAdmin } = useAuth();

  const logout = () => {

    if (!window.confirm("Yakin ingin logout?"))
      return;

    setAdmin(null);

    toast.success("Logout berhasil");

    navigate("/login");

  };

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Akun
        </h1>

        <p className="text-gray-500 mt-1">
          Informasi akun dan toko.
        </p>

      </div>

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

            <span className="inline-block mt-3 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full">

              Starter Plan

            </span>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">

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

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-xl font-bold mb-6">

            Status Akun

          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-4">

              <Calendar className="text-blue-600" />

              <div>

                <p className="text-gray-500 text-sm">

                  Bergabung

                </p>

                <h3 className="font-semibold">

                  {new Date().toLocaleDateString("id-ID")}

                </h3>

              </div>

            </div>

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

            <div className="flex items-center gap-4">

              <ShieldCheck className="text-green-600" />

              <div>

                <p className="text-gray-500 text-sm">

                  Status

                </p>

                <h3 className="font-semibold text-green-600">

                  Aktif

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-bold mb-6">

          Pengaturan Akun

        </h2>

        <div className="flex flex-wrap gap-4">

          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl">

            <Pencil size={18} />

            Edit Profil

          </button>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl">

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

    </div>

  );

}