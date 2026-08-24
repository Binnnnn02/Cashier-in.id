import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  User,
  Store,
  History,
  Sparkles,
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
    name: "Pengaturan",
    icon: Settings,
    path: "/settings",
  },
  {
    name: "Akun",
    icon: User,
    path: "/account",
  },
  {
    name: "Riwayat",
    icon: History,
    path: "/history",
  },
];

export default function Sidebar({ closeSidebar }) {
  const { store } = useStore();

  return (
    <aside className="w-full h-full bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white flex flex-col shadow-2xl border-r border-emerald-700/30">

      {/* Logo dan Nama Toko */}
      <div className="px-6 py-6 border-b border-emerald-700/40">
        <div className="flex items-center gap-3.5">
          <div className="bg-gradient-to-tr from-emerald-500 to-emerald-300 text-emerald-950 p-2.5 rounded-2xl shadow-lg shadow-emerald-950/40 shrink-0">
            <Store size={22} className="stroke-[2.5]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg text-white tracking-tight truncate">
                {store?.name || "Cashier-in"}
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                POS Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-300/60">
          Menu Utama
        </p>

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-white text-emerald-900 font-bold shadow-lg shadow-emerald-950/20 translate-x-1"
                    : "text-emerald-100/90 hover:text-white hover:bg-white/10 font-medium hover:translate-x-0.5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-emerald-950/40 text-emerald-300 group-hover:bg-emerald-750 group-hover:text-white"
                      }`}
                    >
                      <Icon size={18} className="stroke-[2.2]" />
                    </div>

                    <span className="text-sm tracking-wide">
                      {menu.name}
                    </span>
                  </div>

                  {isActive && (
                    <span className="w-1.5 h-5 bg-emerald-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Branding */}
      <div className="p-4 mx-4 mb-4 rounded-2xl bg-emerald-950/50 border border-emerald-700/30 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-emerald-200/80">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Cashier-in v1.0</span>
          </div>
          <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full font-semibold text-emerald-300">
            PRO
          </span>
        </div>
      </div>

    </aside>
  );
}
