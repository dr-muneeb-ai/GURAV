import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";

import {
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Payment method from PlaceOrder
  const { method = "cod", codFee = 0 } =
    location.state || {};

  const {
    currency,
    delivery_fee,
    getCartAmount,
    backendUrl,
    token,
    cartItems,
    products,
    setCartItems,
  } = useContext(ShopContext);

  const [loading, setLoading] = useState(false);

  const grandTotal =
    getCartAmount() +
    delivery_fee +
    codFee;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputStyle = `
    w-full
    h-14
    px-5
    rounded-2xl
    bg-[#181818]
    border
    border-[#2d2d2d]
    text-white
    outline-none
    transition-all
    duration-300
    focus:border-[#B9572C]
    focus:shadow-[0_0_20px_rgba(185,87,44,0.25)]
  `;

  const isFormValid = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "street",
      "city",
      "state",
      "pinCode",
      "country",
    ];

    const missing = required.some((field) => !formData[field]?.trim());

    if (missing) {
      toast.error("Please fill in all shipping details");
      return false;
    }

    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setLoading(true);

    try {

      let orderItems = [];

      for (const productId in cartItems) {

        for (const size in cartItems[productId]) {

          if (cartItems[productId][size] > 0) {

            const itemInfo = products.find(
              (item) => item._id === productId
            );

            if (itemInfo) {

              orderItems.push({
                ...itemInfo,
                quantity: cartItems[productId][size],
                size,
              });

            }

          }

        }

      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setLoading(false);
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: grandTotal,
        paymentMethod: method,
      };

      switch (method) {

        case "cod": {

          const { data } = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            {
              headers: { token },
            }
          );

          if (data.success) {

            setCartItems({});
            toast.success("Order Placed Successfully");
            navigate("/orders");

          } else {

            toast.error(data.message);

          }

          break;
        }

        case "stripe": {

          const { data } = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            {
              headers: { token },
            }
          );

          if (data.success) {

            // Cart is cleared on the Orders page once payment is verified,
            // not here — the customer hasn't actually paid yet.
            window.location.replace(
              data.session_url
            );

          } else {

            toast.error(data.message);

          }

          break;
        }

        case "paypal": {

          const { data } = await axios.post(
            backendUrl + "/api/order/paypal",
            orderData,
            {
              headers: { token },
            }
          );

          if (data.success) {

            window.location.replace(
              data.approval_url
            );

          } else {

            toast.error(data.message);

          }

          break;
        }

        default:
          break;
      }

    } catch (error) {

      console.log(error);
      toast.error(error?.response?.data?.message || error.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="
        min-h-screen
        bg-[#111111]
        text-white
        relative
        overflow-hidden
      "
    >
          {/* Background Glow */}

      <div className="absolute w-[420px] h-[420px] bg-[#B9572C]/10 blur-[140px] rounded-full -top-36 -left-32"></div>

      <div className="absolute w-[380px] h-[380px] bg-[#B9572C]/10 blur-[130px] rounded-full bottom-0 right-0"></div>

      <div className="max-w-7xl mx-auto py-14 px-5">

        <div className="mb-12">
          <Title text1={"PAYMENT"} text2={"DETAILS"} />
        </div>

        <div className="grid lg:grid-cols-[1.8fr_1fr] gap-10">

          {/* ================= LEFT SIDE ================= */}

          <div
            className="
              rounded-[35px]
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              p-10
            "
          >

            {/* ================= COD ================= */}

            {method === "cod" && (

              <>
                <h2
                  className="text-2xl text-[#B9572C] mb-6"
                  style={{ fontFamily: "'Prata', serif" }}
                >
                  Cash On Delivery
                </h2>

                <div className="rounded-3xl bg-[#181818] border border-[#2d2d2d] p-8">

                  <p className="text-lg">
                    You will pay after receiving your order.
                  </p>

                  <div className="mt-5 flex justify-between">

                    <span>Cash Handling Fee</span>

                    <span className="text-[#B9572C] font-bold">
                      + A$5.00
                    </span>

                  </div>

                </div>

              </>

            )}

            {/* ================= STRIPE ================= */}

            {method === "stripe" && (

              <>
                <h2
                  className="text-2xl text-[#635BFF] mb-6"
                  style={{ fontFamily: "'Prata', serif" }}
                >
                  Stripe Checkout
                </h2>

                <div className="rounded-3xl bg-[#181818] border border-[#2d2d2d] p-8">

                  <p className="text-lg">
                    After clicking <b>Pay Now</b> you will be redirected securely to Stripe Checkout.
                    We never see or store your card details.
                  </p>

                </div>

              </>

            )}

            {/* ================= PAYPAL ================= */}

            {method === "paypal" && (

              <>
                <h2
                  className="text-2xl text-[#0070BA] mb-6"
                  style={{ fontFamily: "'Prata', serif" }}
                >
                  PayPal Checkout
                </h2>

                <div className="rounded-3xl bg-[#181818] border border-[#2d2d2d] p-8">

                  <p className="text-lg">
                    After clicking <b>Pay Now</b> you will continue to PayPal's secure checkout.
                  </p>

                </div>

              </>

            )}

            {/* ================= SHIPPING FORM ================= */}

            <div className="mt-10">

              <h2
                className="text-2xl mb-6"
                style={{ fontFamily: "'Prata', serif" }}
              >
                Shipping Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  className={inputStyle}
                  required
                />

                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  className={inputStyle}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={onChangeHandler}
                  className={inputStyle}
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={onChangeHandler}
                  className={inputStyle}
                  required
                />

                <input
                  name="street"
                  placeholder="Street Address"
                  value={formData.street}
                  onChange={onChangeHandler}
                  className={`${inputStyle} md:col-span-2`}
                  required
                />

                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={onChangeHandler}
                  className={inputStyle}
                  required
                />

                <input
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={onChangeHandler}
                  className={inputStyle}
                  required
                />

                <input
                  name="pinCode"
                  placeholder="Postal Code"
                  value={formData.pinCode}
                  onChange={onChangeHandler}
                  className={inputStyle}
                  required
                />

                <input
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={onChangeHandler}
                  className={inputStyle}
                  required
                />

              </div>

            </div>

          </div>
                    {/* ================= RIGHT SIDE ================= */}

          <div>

            <div
              className="
                rounded-[35px]
                bg-white/5
                backdrop-blur-xl
                border
                border-white/10
                p-8
                sticky
                top-8
              "
            >

              <h2
                className="text-3xl mb-8"
                style={{ fontFamily: "'Prata', serif" }}
              >
                Order Summary
              </h2>

              <CartTotal />

              {method === "cod" && (

                <div className="mt-6">

                  <div className="flex justify-between text-lg">

                    <span>Cash On Delivery Fee</span>

                    <span className="text-[#B9572C] font-bold">
                      + A$5.00
                    </span>

                  </div>

                </div>

              )}

              <div className="border-t border-white/10 my-7"></div>

              <div className="flex justify-between items-center">

                <span className="text-xl">
                  Total Payable
                </span>

                <span
                  className="text-3xl text-[#B9572C]"
                  style={{ fontFamily: "'Prata', serif" }}
                >
                  {currency}
                  {grandTotal.toFixed(2)}
                </span>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-8
                  w-full
                  h-16
                  rounded-2xl
                  bg-[#B9572C]
                  hover:bg-[#a44f27]
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  shadow-[0_0_35px_rgba(185,87,44,0.35)]
                  flex
                  items-center
                  justify-center
                  gap-3
                  text-lg
                  font-semibold
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                {loading ? (

                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>

                ) : (

                  <>
                    Pay Now
                    <FaArrowRight />
                  </>

                )}

              </button>

              <div className="mt-10 space-y-5">

                <div className="flex items-center gap-3 text-gray-300">
                  <FaLock className="text-[#B9572C]" />
                  SSL Encrypted Checkout
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <FaShieldAlt className="text-[#B9572C]" />
                  100% Secure Payment
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <FaCheckCircle className="text-[#B9572C]" />
                  Trusted Worldwide
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </form>
  );
};

export default Payment;
