import React from "react";
import { assets } from "../assets/assets";

const Ourpolicy = () => {
  return (
    <section className="py-20 bg-[#D3D3D3]">

      <div className="text-center mb-14">

        <p className="uppercase tracking-[5px] text-[#b9572c] text-sm font-semibold">
          WHY CHOOSE US
        </p>

        <h2
          className="text-4xl mt-3 text-[#1d1d1b]"
          style={{ fontFamily: "'Prata', serif" }}
        >
          Premium Shopping Experience
        </h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

        {/* Exchange */}
        <div className="group">

          <div className="w-20 h-20 mx-auto rounded-full border border-[#b9572c]/30 flex items-center justify-center transition duration-300 group-hover:bg-[#b9572c]">

            <img
              src={assets.exchange_icon}
              alt=""
              className="w-10 transition duration-300 group-hover:brightness-0 group-hover:invert"
            />

          </div>

          <h3 className="mt-8 text-xl font-semibold text-[#1d1d1b]">
            Easy Exchange
          </h3>

          <p className="mt-3 text-gray-600 leading-7">
            Hassle-free exchange process with fast customer support.
          </p>

        </div>

        {/* Returns */}
        <div className="group">

          <div className="w-20 h-20 mx-auto rounded-full border border-[#b9572c]/30 flex items-center justify-center transition duration-300 group-hover:bg-[#b9572c]">

            <img
              src={assets.quality_icon}
              alt=""
              className="w-10 transition duration-300 group-hover:brightness-0 group-hover:invert"
            />

          </div>

          <h3 className="mt-8 text-xl font-semibold text-[#1d1d1b]">
            7-Day Returns
          </h3>

          <p className="mt-3 text-gray-600 leading-7">
            Shop confidently with our simple return policy.
          </p>

        </div>

        {/* Support */}
        <div className="group">

          <div className="w-20 h-20 mx-auto rounded-full border border-[#b9572c]/30 flex items-center justify-center transition duration-300 group-hover:bg-[#b9572c]">

            <img
              src={assets.support_img}
              alt=""
              className="w-10 transition duration-300 group-hover:brightness-0 group-hover:invert"
            />

          </div>

          <h3 className="mt-8 text-xl font-semibold text-[#1d1d1b]">
            Premium Support
          </h3>

          <p className="mt-3 text-gray-600 leading-7">
            Our team is here to help whenever you need assistance.
          </p>

        </div>

      </div>

    </section>
  );
};

export default Ourpolicy;
