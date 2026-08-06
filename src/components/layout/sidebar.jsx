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

export default function Sidebar() {

  const { store } = useStore();
  <h1 className="font-bold text-xl">
  {store.name}
  </h1>

  return (
    <aside className="w-64 bg-emerald-700 text-white flex flex-col shadow-xl">

      <div className="flex items-center gap-3 px-6 py-7 border-b border-emerald-600">

        <div className="bg-white text-emerald-700 p-2 rounded-xl">
          <Store size={24} />
        </div>

        <div>
          <h1 className="font-bold text-xl">
          {store.name || "KasirKu"}
        </h1>

        <p className="text-sm text-emerald-100">
          Point of Sale
        </p>
        </div>

      </div>

      <nav className="flex-1 p-4">

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (

            <NavLink
  key={menu.path}
  to={menu.path}
  className={({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
      isActive
        ? "bg-white text-emerald-700 font-semibold shadow"
        : "hover:bg-emerald-600"
    }`
  }
>

  <Icon size={20} />

  <span>
    {menu.name}
  </span>

</NavLink>

          );

        })}

      </nav>

      <div className="border-t border-emerald-600 p-5">

        <p className="text-sm text-emerald-100">
          © 2026 KasirKu
        </p>

      </div>

    </aside>
  );
}