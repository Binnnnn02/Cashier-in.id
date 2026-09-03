import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-slate-50/80 to-white text-gray-800 relative selection:bg-emerald-500 selection:text-white">
      {/* Subtle background radial glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-emerald-950/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-72
          lg:w-68
          transform
          transition-transform
          duration-300
          ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Sidebar closeSidebar={() => setOpen(false)} />
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen lg:ml-68 w-full lg:w-[calc(100%-17rem)] transition-all">
        <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setOpen(!open)}
              className="p-3 rounded-2xl bg-white shadow-sm border border-emerald-100 text-emerald-800 hover:bg-emerald-50 transition active:scale-95"
              aria-label="Toggle Navigation"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="font-extrabold text-emerald-800 text-lg">Cashier-in</span>
          </div>

          {/* HEADER */}
          <Header />

          {/* PAGE CONTENT */}
          <div className="mt-6 sm:mt-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}