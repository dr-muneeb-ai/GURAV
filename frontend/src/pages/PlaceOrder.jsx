import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";

import {
  FaMoneyBillWave,
  FaPaypal,
  FaCreditCard,
  FaArrowRight,
  FaShieldAlt,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const {
    getCartAmount,
    delivery_fee,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");

  // COD Extra Fee
  const codFee = method === "cod" ? 5 : 0;

  // Grand Total
  const grandTotal =
    getCartAmount() +
    delivery_fee +
    codFee;

  const handleContinue = () => {
    navigate("/payment", {
      state: {
        method,
        codFee,
      },
    });
  };

  return (
    <div
      className="
      min-h-screen
      bg-[#0f0f0f]
      text-white
      relative
      overflow-hidden
    "
    >
      {/* Background Glow */}

      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-[#B9572C]/10 blur-[140px]" />

      <div className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-[#B9572C]/10 blur-[130px]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-8 sm:py-14">

        {/* Heading */}

        <div className="text-center mb-8 sm:mb-14">

          <h1
            className="text-3xl sm:text-5xl mb-2 sm:mb-4"
            style={{ fontFamily: "'Prata', serif" }}
          >
            Checkout
          </h1>

          <p className="text-gray-400 text-sm sm:text-base">
            Choose your payment method before continuing
          </p>

        </div>

        <div className="grid lg:grid-cols-[1.8fr_1fr] gap-6 sm:gap-10">

          {/* LEFT */}

          <div
            className="
            rounded-[22px]
            sm:rounded-[35px]
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            p-4
            sm:p-10
          "
          >

            <div className="mb-6 sm:mb-10">
              <Title text1={"PAYMENT"} text2={"METHOD"} />
            </div>

            {/* Security */}

            <div
              className="
              mb-6
              sm:mb-10
              rounded-2xl
              sm:rounded-3xl
              border
              border-[#2d2d2d]
              bg-[#171717]
              p-4
              sm:p-6
              flex
              items-center
              gap-3
              sm:gap-5
            "
            >
              <div
                className="
                w-11
                h-11
                sm:w-16
                sm:h-16
                rounded-full
                bg-[#B9572C]
                flex
                items-center
                justify-center
                text-lg
                sm:text-3xl
                flex-shrink-0
              "
              >
                <FaShieldAlt />
              </div>

              <div>

                <h3 className="text-base sm:text-2xl font-semibold">
                  Secure Checkout
                </h3>

                <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-base">
                  SSL Encryption • 100% Secure Payment
                </p>

              </div>

            </div>

            {/* ================= PAYMENT OPTIONS ================= */}
                        <div className="space-y-3 sm:space-y-6">

              {/* ================= COD ================= */}

              <div
                onClick={() => setMethod("cod")}
                className={`
                  cursor-pointer
                  rounded-2xl
                  sm:rounded-3xl
                  p-4
                  sm:p-7
                  border-2
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  ${
                    method === "cod"
                      ? "border-[#B9572C] bg-[#1c1c1c] shadow-[0_0_40px_rgba(185,87,44,0.25)]"
                      : "border-[#2b2b2b] bg-[#161616] hover:border-[#B9572C]"
                  }
                `}
              >

                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-3 sm:gap-5">

                    <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#B9572C] flex items-center justify-center text-lg sm:text-3xl flex-shrink-0">
                      <FaMoneyBillWave />
                    </div>

                    <div>

                      <h2
                        className="text-base sm:text-2xl"
                        style={{ fontFamily: "'Prata', serif" }}
                      >
                        Cash On Delivery
                      </h2>

                      <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-base">
                        Pay after receiving your parcel.
                      </p>

                    </div>

                  </div>

                  {method === "cod" && (
                    <FaCheckCircle className="text-[#B9572C] text-lg sm:text-3xl flex-shrink-0" />
                  )}

                </div>

                <div className="mt-3 sm:mt-6 flex justify-between text-sm sm:text-base">

                  <span className="text-gray-400">
                    Handling Fee
                  </span>

                  <span className="text-[#B9572C] font-bold">
                    + A$5
                  </span>

                </div>

              </div>

              {/* ================= STRIPE ================= */}

              <div
                onClick={() => setMethod("stripe")}
                className={`
                  cursor-pointer
                  rounded-2xl
                  sm:rounded-3xl
                  p-4
                  sm:p-7
                  border-2
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  ${
                    method === "stripe"
                      ? "border-[#635BFF] bg-[#1c1c1c] shadow-[0_0_40px_rgba(99,91,255,0.25)]"
                      : "border-[#2b2b2b] bg-[#161616] hover:border-[#635BFF]"
                  }
                `}
              >

                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-3 sm:gap-5">

                    <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#635BFF] flex items-center justify-center text-lg sm:text-3xl flex-shrink-0">
                      <FaCreditCard />
                    </div>

                    <div>

                      <h2
                        className="text-base sm:text-2xl"
                        style={{ fontFamily: "'Prata', serif" }}
                      >
                        Stripe
                      </h2>

                      <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-base">
                        Visa • Mastercard • American Express
                      </p>

                    </div>

                  </div>

                  {method === "stripe" && (
                    <FaCheckCircle className="text-[#635BFF] text-lg sm:text-3xl flex-shrink-0" />
                  )}

                </div>

                <div className="mt-3 sm:mt-6 flex justify-between text-sm sm:text-base">

                  <span className="text-gray-400">
                    Transaction Fee
                  </span>

                  <span className="text-green-400 font-bold">
                    FREE
                  </span>

                </div>

              </div>

              {/* ================= PAYPAL ================= */}

              <div
                onClick={() => setMethod("paypal")}
                className={`
                  cursor-pointer
                  rounded-2xl
                  sm:rounded-3xl
                  p-4
                  sm:p-7
                  border-2
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  ${
                    method === "paypal"
                      ? "border-[#0070BA] bg-[#1c1c1c] shadow-[0_0_40px_rgba(0,112,186,0.25)]"
                      : "border-[#2b2b2b] bg-[#161616] hover:border-[#0070BA]"
                  }
                `}
              >

                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-3 sm:gap-5">

                    <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#0070BA] flex items-center justify-center text-lg sm:text-3xl flex-shrink-0">
                      <FaPaypal />
                    </div>

                    <div>

                      <h2
                        className="text-base sm:text-2xl"
                        style={{ fontFamily: "'Prata', serif" }}
                      >
                        PayPal
                      </h2>

                      <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-base">
                        Fast & Secure Online Payment
                      </p>

                    </div>

                  </div>

                  {method === "paypal" && (
                    <FaCheckCircle className="text-[#0070BA] text-lg sm:text-3xl flex-shrink-0" />
                  )}

                </div>

                <div className="mt-3 sm:mt-6 flex justify-between text-sm sm:text-base">

                  <span className="text-gray-400">
                    Transaction Fee
                  </span>

                  <span className="text-green-400 font-bold">
                    FREE
                  </span>

                </div>

              </div>

            </div>

            {/* Features */}

            <div className="grid md:grid-cols-2 gap-3 sm:gap-5 mt-6 sm:mt-10">

              <div className="rounded-xl sm:rounded-2xl bg-[#171717] p-4 sm:p-5 border border-[#2d2d2d]">
                <FaLock className="text-[#B9572C] text-xl sm:text-3xl mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-lg font-semibold">
                  Safe Payment
                </h3>
                <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">
                  Every payment is protected with SSL encryption.
                </p>
              </div>

              <div className="rounded-xl sm:rounded-2xl bg-[#171717] p-4 sm:p-5 border border-[#2d2d2d]">
                <FaShieldAlt className="text-[#B9572C] text-xl sm:text-3xl mb-2 sm:mb-4" />
                <h3 className="text-sm sm:text-lg font-semibold">
                  Buyer Protection
                </h3>
                <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm">
                  Secure checkout with trusted payment partners.
                </p>
              </div>

            </div>

          </div>
                    {/* ================= RIGHT SIDE ================= */}

          <div>

            <div
              className="
                lg:sticky
                lg:top-8
                rounded-[22px]
                sm:rounded-[35px]
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                p-4
                sm:p-8
                shadow-[0_20px_60px_rgba(0,0,0,0.35)]
              "
            >

              <h2
                className="text-xl sm:text-3xl mb-4 sm:mb-8"
                style={{ fontFamily: "'Prata', serif" }}
              >
                Order Summary
              </h2>

              <CartTotal />

              {/* COD Fee */}

              {method === "cod" && (

                <div className="flex justify-between mt-4 sm:mt-6 text-sm sm:text-lg">

                  <span className="text-gray-400">
                    Cash On Delivery Fee
                  </span>

                  <span className="font-bold text-[#B9572C]">
                    + A$5
                  </span>

                </div>

              )}

              {/* Grand Total */}

              <div className="border-t border-white/10 my-4 sm:my-7"></div>

              <div className="flex justify-between items-center">

                <span
                  className="text-base sm:text-2xl"
                  style={{ fontFamily: "'Prata', serif" }}
                >
                  Grand Total
                </span>

                <span
                  className="text-xl sm:text-3xl text-[#B9572C]"
                  style={{ fontFamily: "'Prata', serif" }}
                >
                  A${grandTotal.toFixed(2)}
                </span>

              </div>

              {/* Continue */}

              <button
                onClick={handleContinue}
                className="
                  mt-5
                  sm:mt-10
                  w-full
                  h-12
                  sm:h-16
                  rounded-xl
                  sm:rounded-2xl
                  bg-[#B9572C]
                  hover:bg-[#cf6737]
                  hover:scale-[1.02]
                  active:scale-95
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  gap-2
                  sm:gap-3
                  text-sm
                  sm:text-lg
                  font-semibold
                  shadow-[0_0_35px_rgba(185,87,44,0.45)]
                "
              >
                Continue

                <FaArrowRight />

              </button>

              {/* Bottom Features */}

              <div className="border-t border-white/10 my-5 sm:my-8"></div>

              <div className="space-y-3 sm:space-y-5">

                <div className="flex gap-3 sm:gap-4">

                  <FaShieldAlt className="text-[#B9572C] text-base sm:text-xl mt-1 flex-shrink-0" />

                  <div>

                    <h4 className="font-semibold text-sm sm:text-base">
                      Secure Checkout
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-400">
                      Your payment is encrypted with SSL.
                    </p>

                  </div>

                </div>

                <div className="flex gap-3 sm:gap-4">

                  <FaLock className="text-[#B9572C] text-base sm:text-xl mt-1 flex-shrink-0" />

                  <div>

                    <h4 className="font-semibold text-sm sm:text-base">
                      Privacy Protected
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-400">
                      Your personal information is never shared.
                    </p>

                  </div>

                </div>

                <div className="flex gap-3 sm:gap-4">

                  <FaCheckCircle className="text-[#B9572C] text-base sm:text-xl mt-1 flex-shrink-0" />

                  <div>

                    <h4 className="font-semibold text-sm sm:text-base">
                      Trusted Payment
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-400">
                      Stripe, PayPal and Cash On Delivery supported.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PlaceOrder;
