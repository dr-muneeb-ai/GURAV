import {
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const currency = "A$";
  const delivery_fee = 5;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ================= CART =================

  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("cartItems");

      return localCart
        ? JSON.parse(localCart)
        : {};
    } catch (error) {
      console.error("Cart localStorage error:", error);
      return {};
    }
  });

  const [products, setProducts] = useState([]);

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch (error) {
      return null;
    }
  });

  const navigate = useNavigate();

  // IMPORTANT:
  // useRef instead of { current: false }
  const hasSyncedRef = useRef(false);

  // ================= ADD TO CART =================

  const addToCart = async (
    itemId,
    size,
    showToast = true
  ) => {
    if (!size) {
      toast.error("Select a size for the product");
      return false;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {
        [size]: 1,
      };
    }

    setCartItems(cartData);

    if (showToast) {
      toast.success("Added to cart");
    }

    // Sync only if logged in
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          {
            itemId,
            size,
          },
          {
            headers: {
              token,
            },
          }
        );

        if (!response.data.success) {
          console.log(
            "Cart add response:",
            response.data
          );
        }
      } catch (error) {
        console.error(
          "Cart add sync failed:",
          error
        );

        // Don't show annoying error after successful local add
        // The cart is already saved locally.
      }
    }

    return true;
  };

  // ================= CART COUNT =================

  const getCartItems = () => {
    return Object.values(cartItems).reduce(
      (total, sizes) =>
        total +
        Object.values(sizes).reduce(
          (sum, qty) => sum + qty,
          0
        ),
      0
    );
  };

  // ================= CART AMOUNT =================

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce(
      (total, [itemId, sizes]) => {
        const product = products.find(
          (p) => p._id === itemId
        );

        if (!product) return total;

        return (
          total +
          Object.values(sizes).reduce(
            (sum, qty) =>
              sum + qty * product.price,
            0
          )
        );
      },
      0
    );
  };

  // ================= UPDATE QUANTITY =================

  const updateQuantity = async (
    itemId,
    size,
    quantity
  ) => {
    const cartData = structuredClone(cartItems);

    if (!cartData[itemId]) return;

    if (quantity <= 0) {
      delete cartData[itemId][size];

      if (
        Object.keys(cartData[itemId]).length === 0
      ) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          {
            itemId,
            size,
            quantity,
          },
          {
            headers: {
              token,
            },
          }
        );
      } catch (error) {
        console.error(
          "Cart update sync failed:",
          error
        );

        // Don't show toast for background sync failure.
      }
    }
  };

  // ================= PRODUCTS =================

  const getProductsData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list`
      );

      if (response.data.success) {
        setProducts(
          response.data.products
        );
      }
    } catch (error) {
      console.error(
        "Products loading error:",
        error
      );
    }
  };

  // ================= GET USER CART =================

  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        {
          headers: {
            token: userToken,
          },
        }
      );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );
      }
    } catch (error) {
      console.error(
        "Get user cart error:",
        error
      );
    }
  };

  // ================= PRODUCTS ON LOAD =================

  useEffect(() => {
    if (!backendUrl) return;

    getProductsData();
  }, [backendUrl]);

  // ================= SAVE GUEST CART =================

  useEffect(() => {
    if (!token) {
      try {
        localStorage.setItem(
          "cartItems",
          JSON.stringify(cartItems)
        );
      } catch (error) {
        console.error(
          "Failed to save cart:",
          error
        );
      }
    }
  }, [cartItems, token]);

  // ================= CART LOGIN SYNC =================

  useEffect(() => {
    if (!backendUrl) return;

    if (!token) return;

    // Prevent repeated sync
    if (hasSyncedRef.current) return;

    hasSyncedRef.current = true;

    const syncCart = async () => {
      try {
        // Get server cart
        const response = await axios.post(
          `${backendUrl}/api/cart/get`,
          {},
          {
            headers: {
              token,
            },
          }
        );

        const serverCart =
          response.data.success &&
          response.data.cartData
            ? response.data.cartData
            : {};

        // Current local cart
        const localCart = structuredClone(
          cartItems
        );

        // If server has no cart,
        // keep local cart.
        if (
          Object.keys(serverCart).length === 0
        ) {
          setCartItems(localCart);
          return;
        }

        // Merge server + local cart
        const mergedCart = structuredClone(
          serverCart
        );

        for (const itemId in localCart) {
          if (!mergedCart[itemId]) {
            mergedCart[itemId] = {};
          }

          for (const size in localCart[itemId]) {
            const localQty =
              localCart[itemId][size] || 0;

            const serverQty =
              mergedCart[itemId][size] || 0;

            mergedCart[itemId][size] =
              serverQty + localQty;
          }
        }

        setCartItems(mergedCart);

        console.log(
          "Cart synced successfully"
        );
      } catch (error) {
        console.error(
          "Cart sync failed:",
          error
        );

        // IMPORTANT:
        // Don't show "Sync Error" toast to user.
        // Login should remain successful.
      }
    };

    syncCart();
  }, [token, backendUrl]);

  // ================= RESET SYNC WHEN LOGGING OUT =================

  useEffect(() => {
    if (!token) {
      hasSyncedRef.current = false;
    }
  }, [token]);

  // ================= VISITOR TRACKING =================

  useEffect(() => {
    if (!backendUrl) return;

    let sessionId =
      localStorage.getItem("visitorId");

    if (!sessionId) {
      sessionId =
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2);

      localStorage.setItem(
        "visitorId",
        sessionId
      );
    }

    const sendVisitor = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/visitor/track`,
          {
            sessionId,
          }
        );

        console.log(
          "Visitor Response:",
          response.data
        );
      } catch (error) {
        console.error(
          "Visitor Tracking Error:",
          error
        );
      }
    };

    sendVisitor();

    const interval = setInterval(
      sendVisitor,
      60000
    );

    return () => {
      clearInterval(interval);
    };
  }, [backendUrl]);

  // ================= CONTEXT =================

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,

        currency,
        delivery_fee,

        search,
        setSearch,

        showSearch,
        setShowSearch,

        cartItems,
        setCartItems,

        addToCart,
        updateQuantity,

        getCartItems,
        getCartAmount,

        navigate,

        backendUrl,

        token,
        setToken,

        user,
        setUser,

        getUserCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
