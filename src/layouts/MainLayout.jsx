import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function MainLayout() {
  const [open, setOpen] =useState(false);

  return (
    <div className="flex min-h-screen bg-emerald-50">

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static z-50
        h-screen
        transition-all duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <Sidebar closeSidebar={() => setOpen(false)} />
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden mb-4 p-2 rounded-xl bg-white shadow"
        >
          <Menu />
        </button>

        <Header />

        <div className="mt-6">
          <Outlet />
        </div>

      </main>

    </div>
  );
}