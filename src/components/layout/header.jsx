import {
  Search,
  Bell,
  UserCircle,
} from "lucide-react";

export default function Header() {

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">

      {/* Kiri */}

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          {today}
        </p>

      </div>

      {/* Kanan */}

      <div className="flex items-center gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari..."
            className="pl-11 pr-4 py-3 w-72 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

        </div>

        {/* Notification */}

        <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">

          <Bell size={20} />

        </button>

        {/* User */}

        <button className="flex items-center gap-3 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition">

          <UserCircle size={22} />

          <span>
            Admin
          </span>

        </button>

      </div>

    </header>
  );
}