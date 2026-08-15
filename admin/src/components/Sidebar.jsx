import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";

const linkBase =
  "group relative flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 overflow-hidden";

const Sidebar = ({ isOpen, onClose }) => {
  const links = [
    { to: "/", label: "Dashboard", icon: "🌐" },
    { to: "/add", label: "Add Product", icon: "✚" },
    { to: "/list", label: "Products", icon: "📦" },
    { to: "/orders", label: "Orders", icon: "🛒" },
    { to: "/chat", label: "Customer Support", icon: "💬" },
    { to: "/stats", label: "Stats", icon: "📊" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px]
          bg-[#09090B] border-r border-red-500/20 backdrop-blur-xl
          shadow-[0_0_40px_rgba(220,20,60,.12)]
          transition-transform duration-300 ease-out
          overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:block md:w-[290px]
          md:min-h-[calc(100vh-82px)]
        `}
      >
        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden w-9 h-9 rounded-full border border-red-500/30 flex items-center justify-center text-red-300 hover:bg-red-500/10 transition"
        >
          ✕
        </button>

        {/* Logo Section */}

        <div className="px-6 pt-8">

          <div className="flex items-center gap-4">

            <img
              src={assets.logo}
              alt="Logo"
              className="h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(220,20,60,.55)]"
            />

            <div>

              <h2
                className="text-xl text-white tracking-wide"
                style={{ fontFamily: "Prata, serif" }}
              >
                Gurav
              </h2>

              <p
                className="text-xs uppercase tracking-[0.35em] text-red-400"
                style={{ fontFamily: "Prata, serif" }}
              >
                Drip District
              </p>

            </div>

          </div>

        </div>

        {/* Navigation */}

        <div className="mt-10 px-4 space-y-3 pb-40">

          {links.map((link) => (

            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B0000] via-[#DC143C] to-[#FF1744] text-white shadow-[0_0_25px_rgba(220,20,60,.45)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white hover:shadow-[0_0_18px_rgba(220,20,60,.18)]"
                }`
              }
            >
              <span
                className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-red-500/20
                bg-black/30
                text-lg
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:text-red-400
                "
              >
                {link.icon}
              </span>

              <span
                className="text-[15px]"
                style={{ fontFamily: "Prata, serif" }}
              >
                {link.label}
              </span>

            </NavLink>

          ))}

        </div>

        {/* Bottom Card */}

        <div className="absolute bottom-6 left-4 right-4">

          <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#111111] to-[#1A1A1A] p-5 shadow-[0_0_25px_rgba(220,20,60,.18)]">

            <h3
              className="text-lg text-white"
              style={{ fontFamily: "Prata, serif" }}
            >
              Admin Panel
            </h3>

            <div className="mt-4 h-2 rounded-full bg-gray-800 overflow-hidden">

              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#DC143C] to-[#FF1744] shadow-[0_0_15px_rgba(220,20,60,.6)]"></div>

            </div>

          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;
