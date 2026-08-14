import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";

const Cart = () => {
  const {
    products,
    cartItems,
    currency,
    updateQuantity,
    navigate,
    backendUrl,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempData.push({
              _id: itemId,
              size,
              quantity: cartItems[itemId][size],
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  const scrollToCheckout = () => {
    const section = document.getElementById("checkout-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#121212]
      via-[#ece7e2]
      to-[#121212]
      py-8
      sm:py-16
      px-3
      sm:px-5
      pb-24
      lg:pb-16
      rounded-[24px]
      sm:rounded-[40px]
    "
    >
      {/* ================= HERO ================= */}

      <div className="max-w-[1550px] mx-auto">

        <div
          className="
          rounded-[24px]
          sm:rounded-[40px]
          overflow-hidden
          bg-gradient-to-r
          from-[#1d1d1b]
          via-[#262626]
          to-[#111]
          p-5
          sm:p-10
          lg:p-14
          shadow-[0_35px_90px_rgba(0,0,0,0.45)]
        "
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">

            <div>

              <p className="uppercase tracking-[4px] sm:tracking-[8px] text-[#b9572c] text-[10px] sm:text-sm">
                Premium Shopping Cart
              </p>

              <h1
                className="text-3xl sm:text-5xl lg:text-7xl text-white mt-2 sm:mt-4"
                style={{ fontFamily: "'Prata', serif" }}
              >
                Your Cart
              </h1>

              <p className="text-gray-300 mt-3 sm:mt-6 max-w-xl leading-6 sm:leading-8 text-sm sm:text-base"
              style={{ fontFamily: "'Prata', serif" }}>
                Review your selected products before checkout.
                Premium quality. Secure payment. Fast delivery.
              </p>

            </div>

            <div
              className="
              bg-white/10
              backdrop-blur-xl
              rounded-2xl
              sm:rounded-3xl
              p-4
              sm:p-8
              border
              border-white/20
              min-w-[140px]
              sm:min-w-[260px]
            "
            >

              <p className="text-white text-sm sm:text-lg">
                Cart Items
              </p>

              <h2
                className="text-3xl sm:text-6xl text-[#b9572c] mt-1 sm:mt-3"
                style={{ fontFamily: "'Prata', serif" }}
              >
                {cartData.length}
              </h2>

            </div>

          </div>
        </div>

        {/* ================= CART ITEMS ================= */}

        <div className="mt-8 sm:mt-14 space-y-4 sm:space-y-8">

          {cartData.length > 0 ? (

            cartData.map((item, index) => {

              const productData = products.find(
                (product) => product._id === item._id
              );

              if (!productData) return null;

              return (

                <div
                  key={index}
                  className="
                  bg-gradient-to-br
                  from-[#23201D]
                  to-[#f4f4f4]
                  rounded-[20px]
                  sm:rounded-[34px]
                  border
                  border-white
                  shadow-[0_25px_70px_rgba(0,0,0,0.12)]
                  hover:shadow-[0_35px_90px_rgba(185,87,44,0.18)]
                  transition-all
                  duration-500
                  p-4
                  sm:p-7
                "
                >

                  <div
                    className="
                    grid
                    lg:grid-cols-[180px_1fr_auto]
                    gap-4
                    sm:gap-8
                    items-center
                  "
                  >

                    {/* IMAGE */}

                    <img
                      src={productData.image[0]}
                      alt={productData.name}
                      className="
                      w-24
                      h-24
                      sm:w-40
                      sm:h-40
                      object-cover
                      rounded-2xl
                      sm:rounded-3xl
                      border
                      border-gray-200
                      shadow-lg
                    "
                    />

                    {/* PRODUCT INFO */}

                    <div>

                      <h2
                        className="text-xl sm:text-3xl text-[#1d1d1b]"
                        style={{ fontFamily: "'Prata', serif" }}
                      >
                        {productData.name}
                      </h2>

                      <p className="mt-2 sm:mt-4 text-gray-500 leading-6 sm:leading-7 text-sm sm:text-base">
                        {productData.description}
                      </p>

                      <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-6">

                        <span
                          className="
                          px-3
                          sm:px-5
                          py-1.5
                          sm:py-2
                          rounded-full
                          bg-[#b9572c]
                          text-white
                          text-xs
                          sm:text-sm
                          font-semibold
                        "
                        >
                          Size : {item.size}
                        </span>

                        <span
                          className="
                          px-3
                          sm:px-5
                          py-1.5
                          sm:py-2
                          rounded-full
                          bg-[#121212]
                          text-white
                          text-xs
                          sm:text-sm
                        "
                        >
                          {currency}
                          {productData.price}
                        </span>

                      </div>
                    </div>
                                        {/* RIGHT SIDE */}

                    <div className="flex flex-col items-end gap-3 sm:gap-6">

                      {/* PRICE */}

                      <h2
                        className="text-2xl sm:text-4xl text-[#b9572c]"
                        style={{ fontFamily: "'Prata', serif" }}
                      >
                        {currency}
                        {productData.price * item.quantity}
                      </h2>

                      {/* QUANTITY */}

                      <div
                        className="
                        flex
                        items-center
                        rounded-full
                        overflow-hidden
                        border
                        border-gray-300
                        bg-white
                      "
                      >

                        <button
                          onClick={() =>
                            item.quantity > 1 &&
                            updateQuantity(
                              item._id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="
                          px-3
                          sm:px-5
                          py-2
                          sm:py-3
                          hover:bg-[#b9572c]
                          hover:text-white
                          transition
                        "
                        >
                          −
                        </button>

                        <span
                          className="
                          w-10
                          sm:w-14
                          text-center
                          font-semibold
                          text-sm
                          sm:text-base
                        "
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="
                          px-3
                          sm:px-5
                          py-2
                          sm:py-3
                          hover:bg-[#b9572c]
                          hover:text-white
                          transition
                        "
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}

                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.size,
                            0
                          )
                        }
                        className="
                        flex
                        items-center
                        gap-2
                        text-red-500
                        hover:text-red-700
                        transition
                        text-sm
                        sm:text-base
                      "
                      >
                        <img
                          src={assets.bin_icon}
                          alt=""
                          className="w-4 sm:w-5"
                        />

                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              );

            })

          ) : (

            <div
              className="
              rounded-[24px]
              sm:rounded-[40px]
              bg-white
              shadow-xl
              p-8
              sm:p-20
              text-center
            "
            >

              <img
                src={assets.cart_icon}
                className="w-14 sm:w-24 mx-auto opacity-50"
                alt=""
              />

              <h2
                className="text-2xl sm:text-4xl mt-4 sm:mt-8"
                style={{ fontFamily: "'Prata', serif" }}
              >
                Your Cart is Empty
              </h2>

              <p className="mt-2 sm:mt-5 text-gray-500 text-sm sm:text-base">
                Add some beautiful products to continue shopping.
              </p>

              <button
                onClick={() => navigate("/collection")}
                className="
                mt-4
                sm:mt-8
                bg-[#b9572c]
                text-white
                px-6
                sm:px-8
                py-2.5
                sm:py-3
                text-sm
                sm:text-base
                rounded-full
                hover:scale-105
                transition
              "
              >
                Continue Shopping
              </button>

            </div>

          )}

        </div>
                {/* ================= CHECKOUT SECTION ================= */}

        <div id="checkout-section" className="mt-10 sm:mt-20 grid lg:grid-cols-[1.4fr_420px] gap-6 sm:gap-10 scroll-mt-6">

          {/* LEFT CARD */}

          <div
            className="
            rounded-[24px]
            sm:rounded-[40px]
            bg-gradient-to-br
            from-[#1d1d1b]
            via-[#252525]
            to-[#111]
            p-5
            sm:p-10
            shadow-[0_35px_90px_rgba(0,0,0,0.45)]
          "
          >

            <h2
              className="text-2xl sm:text-4xl text-white"
              style={{ fontFamily: "'Prata', serif" }}
            >
              Why Shop With Us?
            </h2>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-6 mt-5 sm:mt-10">

              <div className="bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10">
                <h3 className="text-[#b9572c] text-base sm:text-xl font-semibold">
                  Premium Quality
                </h3>

                <p className="text-gray-300 mt-1.5 sm:mt-3 leading-5 sm:leading-7 text-xs sm:text-base">
                  Carefully crafted handmade products made with premium
                  materials.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10">
                <h3 className="text-[#b9572c] text-base sm:text-xl font-semibold">
                  Secure Payments
                </h3>

                <p className="text-gray-300 mt-1.5 sm:mt-3 leading-5 sm:leading-7 text-xs sm:text-base">
                  Safe and encrypted checkout experience with trusted payment
                  methods.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10">
                <h3 className="text-[#b9572c] text-base sm:text-xl font-semibold">
                  Fast Shipping
                </h3>

                <p className="text-gray-300 mt-1.5 sm:mt-3 leading-5 sm:leading-7 text-xs sm:text-base">
                  Quick dispatch and reliable delivery to your doorstep.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10">
                <h3 className="text-[#b9572c] text-base sm:text-xl font-semibold">
                  Easy Returns
                </h3>

                <p className="text-gray-300 mt-1.5 sm:mt-3 leading-5 sm:leading-7 text-xs sm:text-base">
                  Hassle-free return policy with customer-first support.
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div
            className="
            rounded-[24px]
            sm:rounded-[40px]
            bg-[#23201D]
            backdrop-blur-xl
            p-4
            sm:p-8
            shadow-[0_25px_70px_rgba(0,0,0,0.12)]
          "
          >

            <CartTotal />

            <button
              onClick={() => navigate("/place-order")}
              className="
              mt-4
              sm:mt-8
              w-full
              py-3
              sm:py-4
              rounded-full
              bg-[#b9572c]
              text-white
              text-sm
              sm:text-lg
              font-semibold
              hover:bg-[#a74d25]
              hover:scale-[1.02]
              transition-all
              duration-300
              shadow-[0_20px_45px_rgba(185,87,44,0.45)]
            "
            >
              Proceed To Checkout →
            </button>

            <p className="text-center text-gray-500 mt-3 sm:mt-6 text-[10px] sm:text-sm">
              Secure SSL Encrypted Checkout
            </p>

          </div>

        </div>

      </div>

      {/* ================= MOBILE STICKY CHECKOUT BAR ================= */}
      <div
        className="
        lg:hidden
        fixed
        bottom-0
        left-0
        w-full
        z-50
        bg-[#1d1d1b]/95
        backdrop-blur-md
        border-t
        border-white/10
        px-4
        py-3
        shadow-[0_-10px_30px_rgba(0,0,0,0.35)]
      "
      >
        <button
          onClick={scrollToCheckout}
          className="
          w-full
          py-3
          rounded-full
          bg-[#b9572c]
          text-white
          text-sm
          font-semibold
          hover:bg-[#a74d25]
          active:scale-[0.98]
          transition-all
          duration-300
        "
        >
          Proceed To Checkout →
        </button>
      </div>

    </div>
  );
};

export default Cart;
