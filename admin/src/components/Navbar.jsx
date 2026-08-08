import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-red-500/20 bg-[#09090B]/95 backdrop-blur-2xl shadow-[0_0_35px_rgba(220,20,60,0.18)]">

      <div className="flex items-center justify-between px-6 py-4">

        {/* Left */}

        <div className="flex items-center gap-5">

          <div className="flex items-center justify-center">
  <img
    src={assets.logo}
    alt="Logo"
    className="
      h-16
      w-auto
      object-contain
      drop-shadow-[0_0_15px_rgba(220,20,60,.55)]
      hover:scale-110
      transition-all
      duration-300
    "
  />
</div>
          <div>

            <h1
              className="
              text-xl
              font-black
              tracking-wider
              text-white
              "
              style={{ fontFamily: "Prata, serif" }}
            >
              Control Panel
            </h1>

            <p
              className="
              mt-1
              text-sm
              tracking-[0.2em]
              text-red-400
              "
              style={{ fontFamily: "Prata, serif" }}
            >
              Redefining the art of drip 
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          <div
            className="
            rounded-full
            border
            border-red-500/40
            bg-red-500/10
            px-3
            py-2
            text-sm
            font-bold
            tracking-[0.05em]
            text-red-300
            shadow-[0_0_20px_rgba(220,20,60,.35)]
            lg:block
            "
            style={{ fontFamily: "Prata, serif" }}
          >
            ● System Online
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken("");
            }}
            style={{ fontFamily: "Prata, serif" }}
            className="
            rounded-xl
            border
            border-red-500/40
            bg-gradient-to-r
            from-[#8B0000]
            via-[#DC143C]
            to-[#FF1744]
            px-4
            py-2
            text-sm
            font-bold
            tracking-[0.1em]
            text-white
            shadow-[0_0_25px_rgba(220,20,60,.45)]
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-[0_0_45px_rgba(220,20,60,.75)]
            active:scale-95
            "
          >
            LOGOUT
          </button>

        </div>

      </div>

    </header>
  );
};

export default Navbar;
