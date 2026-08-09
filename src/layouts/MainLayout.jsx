import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function MainLayout() {

  const [open, setOpen] = useState(false);

  return (

    <div className="min-h-screen bg-emerald-50">

      {/* MOBILE OVERLAY */}

      {open && (

        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            lg:hidden
          "
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
          lg:w-64
          transform
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >

        <Sidebar
          closeSidebar={() => setOpen(false)}
        />

      </aside>


      {/* MAIN CONTENT */}

      <main
        className="
          min-h-screen
          lg:ml-64
          w-full
          lg:w-[calc(100%-16rem)]
        "
      >

        <div
          className="
            w-full
            max-w-[1600px]
            mx-auto
            p-4
            sm:p-6
            lg:p-8
          "
        >


          {/* MOBILE MENU */}

          <button
            onClick={() => setOpen(true)}
            className="
              lg:hidden
              mb-4
              p-3
              rounded-xl
              bg-white
              shadow-sm
              border
            "
          >

            <Menu size={22} />

          </button>


          {/* HEADER */}

          <Header />


          {/* PAGE */}

          <div className="mt-6">

            <Outlet />

          </div>

        </div>

      </main>

    </div>

  );

}