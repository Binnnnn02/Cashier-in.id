import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  User,
  Store,
  History,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Produk",
    icon: Package,
    path: "/products",
  },
  {
    name: "Statistik",
    icon: BarChart3,
    path: "/statistics",
  },
  {
    name: "Riwayat",
    icon: History,
    path: "/history",
  },
  {
    name: "Pengaturan",
    icon: Settings,
    path: "/settings",
  },
  {
    name: "Akun",
    icon: User,
    path: "/account",
  },
];

export default function Sidebar({ closeSidebar }) {

  const { store } = useStore();

  return (

    <aside className="w-full h-full bg-white text-gray-700 flex flex-col border-r border-gray-100">

      {/* Logo dan Nama Toko */}

      <div className="px-6 py-6 border-b border-gray-100">

        <div className="flex items-center gap-3.5">

          <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shrink-0">
            <Store size={22} className="stroke-[2.5]" />
          </div>

          <div className="min-w-0">

            <h1 className="font-display font-bold text-lg text-gray-900 tracking-tight truncate">
              {store?.name || "Cashier-in"}
            </h1>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              POS Aktif
            </span>

          </div>

        </div>

      </div>

      {/* Menu Navigation */}

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">

        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Menu Utama
        </p>

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (

            <NavLink
              key={menu.path}
              to={menu.path}
              end={menu.path === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-colors duration-150 ${
                  isActive
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                }`
              }
            >

              {({ isActive }) => (

                <>

                  <Icon
                    size={18}
                    className={`stroke-[2.2] shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-emerald-600"
                    }`}
                  />

                  <span className="text-sm tracking-wide">
                    {menu.name}
                  </span>

                </>

              )}

            </NavLink>

          );

        })}

      </nav>

      {/* Footer Branding */}

      <div className="p-4 mx-4 mb-4 rounded-2xl bg-emerald-50 border border-emerald-100">

        <div className="flex items-center justify-between text-xs">

          <span className="font-semibold text-emerald-700">
            Cashier-in v1.0
          </span>

          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
            PRO
          </span>

        </div>

      </div>

    </aside>

  );

}