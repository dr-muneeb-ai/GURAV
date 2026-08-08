import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {

  const navigate = useNavigate();

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      px-5
      bg-gradient-to-br
      from-[#F3EFE8]
      via-[#ECE4D8]
      to-[#F3EFE8]
      "
    >

      <div
        className="
        w-full
        max-w-xl
        bg-white/40
        backdrop-blur-xl
        border
        border-[#B9572C]/20
        rounded-tl-[120px]
        rounded-br-[120px]
        p-10
        text-center
        shadow-[0_10px_40px_rgba(185,87,44,0.18)]
        "
      >

        <FaCheckCircle
          className="
          text-green-500
          text-7xl
          mx-auto
          mb-6
          "
        />

        <h1 className="text-4xl font-bold text-[#B9572C]">
          Payment Successful ✅
        </h1>

        <p className="mt-5 text-gray-700 leading-7">
          Thanks for shopping.
          <br />
          Your order has been placed successfully.
        </p>

        <div
          className="
          mt-8
          rounded-2xl
          border
          border-[#B9572C]/20
          bg-white/50
          p-5
          "
        >

          <p className="text-gray-500">
            Order ID
          </p>

          <h2 className="text-xl font-bold text-[#B9572C] mt-2">
            #ORD102547
          </h2>

        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">

          <button
            onClick={() => navigate("/orders")}
            className="
            flex-1
            bg-[#B9572C]
            text-white
            py-3
            rounded-xl
            shadow-[0_0_25px_rgba(185,87,44,0.5)]
            hover:scale-105
            transition-all
            duration-300
            "
          >
            VIEW MY ORDERS
          </button>

          <button
            onClick={() => navigate("/collection")}
            className="
            flex-1
            border
            border-[#B9572C]
            text-[#B9572C]
            py-3
            rounded-xl
            hover:bg-[#B9572C]
            hover:text-white
            transition-all
            duration-300
            "
          >
            CONTINUE SHOPPING
          </button>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;
