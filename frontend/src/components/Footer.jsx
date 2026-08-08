import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { SiStripe, SiPaypal } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#1d1d1b] to-[#131312] text-white mt-24 overflow-hidden">

      {/* Top hairline glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b9572c]/60 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-[#b9572c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16">

        {/* Top Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>

            <div className="logo-wrapper">
		  <img
		    src="/drip-logo.svg"
		    alt="Drip District"
		    className="logo-svg"
		  />

		  <span className="logo-shine"></span>
		</div>

            <p className="mt-5 text-gray-400 leading-7">
              Redefining the Art of Drip.
            </p>

            <p className="mt-5 text-gray-500">
              Australia Based
              <br />
              Adelaide & Sydney
            </p>

          </div>

          {/* Shop */}
          <div>

            <h3 className="text-lg font-semibold uppercase tracking-[4px] mb-2 text-white">
              Shop
            </h3>
            <span className="block h-px w-8 bg-[#b9572c] mb-5" />

            <ul className="space-y-3 text-gray-400">

              <li>
                <Link
                  to="/collection"
                  className="hover:text-[#b9572c] transition"
                >
                  New Arrivals
                </Link>
              </li>

              <li>
                <Link
                  to="/collection"
                  className="hover:text-[#b9572c] transition"
                >
                  Best Sellers
                </Link>
              </li>

              <li>
                <Link
                  to="/collection"
                  className="hover:text-[#b9572c] transition"
                >
                  Collection
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#b9572c] transition"
                >
                  Contact
                </Link>
              </li>

            </ul>

          </div>

          {/* Support */}
          <div>

            <h3 className="text-lg font-semibold uppercase tracking-[4px] mb-2 text-white">
              Support
            </h3>
            <span className="block h-px w-8 bg-[#b9572c] mb-5" />

            <ul className="space-y-3 text-gray-400">

              <li>
                <Link
                  to="/delivery"
                  className="hover:text-[#b9572c] transition"
                >
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/return-policy"
                  className="hover:text-[#b9572c] transition"
                >
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-[#b9572c] transition"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-[#b9572c] transition"
                >
                  Terms & Conditions
                </Link>
              </li>

            </ul>

          </div>

          {/* Follow */}
          <div>

            <h3 className="text-lg font-semibold uppercase tracking-[4px] mb-2 text-white">
              Follow Us
            </h3>
            <span className="block h-px w-8 bg-[#b9572c] mb-5" />

            <div className="flex gap-4 text-xl">

              <a
                href="https://www.instagram.com/dripdistrictaus"
                target="_blank"
                rel="noreferrer"
                className="
                  h-11 w-11 flex items-center justify-center
                  rounded-full bg-white/5 border border-white/10
                  text-gray-300
                  hover:text-[#b9572c] hover:border-[#b9572c]/40
                  hover:shadow-[0_0_20px_rgba(185,87,44,0.35)]
                  transition-all duration-300
                "
              >
                <FaInstagram />
              </a>

              <a
                href="https://t.me/dripdistrictx"
                target="_blank"
                rel="noreferrer"
                className="
                  h-11 w-11 flex items-center justify-center
                  rounded-full bg-white/5 border border-white/10
                  text-gray-300
                  hover:text-[#b9572c] hover:border-[#b9572c]/40
                  hover:shadow-[0_0_20px_rgba(185,87,44,0.35)]
                  transition-all duration-300
                "
              >
                <FaTelegramPlane />
              </a>

            </div>

          </div>

        </div>

        {/* Payment Methods */}

        <div className="border-t border-white/10 mt-14 pt-10">

          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#b9572c]" />
            <h3
              className="uppercase tracking-[5px] text-[#d4774c] font-semibold text-sm"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Secure Payments
            </h3>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#b9572c]" />
          </div>

          <div
            className="
              bg-white/[0.03]
              border border-white/10
              rounded-2xl
              p-8
              shadow-[0_20px_50px_rgba(0,0,0,0.35)]
            "
          >
            <div className="flex flex-wrap justify-center items-center gap-6">

              <div
                className="
                  flex items-center gap-2
                  px-6 py-3 rounded-full
                  bg-white/[0.04] border border-white/10
                  hover:border-[#635bff]/50 transition
                "
              >
                <SiStripe className="text-2xl" style={{ color: "#635bff" }} />
                <span className="text-sm font-semibold tracking-wide text-gray-300">
                  Stripe
                </span>
              </div>

              <div
                className="
                  flex items-center gap-2
                  px-6 py-3 rounded-full
                  bg-white/[0.04] border border-white/10
                  hover:border-[#009cde]/50 transition
                "
              >
                <SiPaypal className="text-2xl" style={{ color: "#009cde" }} />
                <span className="text-sm font-semibold tracking-wide text-gray-300">
                  PayPal
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Copyright */}

      <div className="relative border-t border-white/10">

        <p className="text-center text-gray-500 py-6 text-sm tracking-wide">
          © 2026 Drip District. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;
