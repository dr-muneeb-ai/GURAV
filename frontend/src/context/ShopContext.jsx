import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const currency = "A$"; // display text for currency
  const delivery_fee = 5;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("cartItems");
      return localCart ? JSON.parse(localCart) : {};
    } catch (e) {
      return {};
    }
  });
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const navigate = useNavigate();

  // Add product to cart
  const addToCart = async (itemId, size, showToast = true) => {
  if (!size) {
    toast.error("Select a size for the product");
    return false;
  }

  let cartData = structuredClone(cartItems);

  if (cartData[itemId]) {
    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }
  } else {
    cartData[itemId] = {};
    cartData[itemId][size] = 1;
  }

  setCartItems(cartData);

  if (showToast) {
    toast.success("Added to cart");
  }

  if (token) {
    try {
      await axios.post(
        backendUrl + "/api/cart/add",
        { itemId, size },
        { headers: { token } }
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to sync cart with server");
      return false;
    }
  }

  return true;
};

  // Get total number of items in the cart
  const getCartItems = () => {
    return Object.values(cartItems).reduce(
      (total, sizes) =>
        total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0),
      0,
    );
  };

  // Get total cart price
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      let product = products.find((p) => p._id === itemId);
      if (!product) return total;

      return (
        total +
        Object.values(sizes).reduce((sum, qty) => sum + qty * product.price, 0)
      );
    }, 0);
  };

  // Update quantity
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // Get products data from local JSON file (frontend-managed)
  const getProductsData = async () => {
  try {

    const response = await axios.get(
      backendUrl + "/api/product/list"
    );

    if (response.data.success) {
      setProducts(response.data.products);
    }

  } catch (error) {
    console.log(error);
  }
};

  // Get user cart data
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  // Persist cart to localStorage for guest users
  useEffect(() => {
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  // whenever a token becomes available we need to synchronize cart data
  const hasSyncedRef = { current: false };

  useEffect(() => {
    const syncCart = async (newToken) => {
      try {
        // fetch server cart
        const response = await axios.post(
          backendUrl + "/api/cart/get",
          {},
          { headers: { token: newToken } },
        );
        let serverCart =
          response.data.success && response.data.cartData
            ? response.data.cartData
            : {};

        // merge local cart (cartItems) with serverCart
        const merged = { ...serverCart };
        for (const itemId in cartItems) {
          merged[itemId] = merged[itemId] || {};
          for (const size in cartItems[itemId]) {
            merged[itemId][size] =
              (merged[itemId][size] || 0) + cartItems[itemId][size];
          }
        }

        setCartItems(merged);

        // push any local-only entries to the server
        for (const itemId in cartItems) {
          for (const size in cartItems[itemId]) {
            const qty = cartItems[itemId][size];
            for (let i = 0; i < qty; i++) {
              await axios.post(
                backendUrl + "/api/cart/add",
                { itemId, size },
                { headers: { token: newToken } },
              );
            }
          }
        }
      } catch (err) {
        console.error("cart sync failed", err);
      }
    };

    if (!hasSyncedRef.current) {
      if (token) {
        hasSyncedRef.current = true;
        syncCart(token);
      } else if (localStorage.getItem("token")) {
        const stored = localStorage.getItem("token");
        setToken(stored);
        hasSyncedRef.current = true;
        syncCart(stored);
      }
    }
  }, [token, backendUrl]);
// ================= Visitor Tracking =================

// ================= Visitor Tracking =================

useEffect(() => {
  if (!backendUrl) return;

  let sessionId = localStorage.getItem("visitorId");

  if (!sessionId) {
    sessionId = Date.now() + "-" + Math.random().toString(36).slice(2);
    localStorage.setItem("visitorId", sessionId);
  }

  const sendVisitor = async () => {
    console.log("Sending visitor...", sessionId);

    try {
      const res = await axios.post(
        `${backendUrl}/api/visitor/track`,
        { sessionId }
      );

      console.log("Visitor Response:", res.data);
    } catch (err) {
      console.error("Visitor Tracking Error:", err);
    }
  };

  sendVisitor();

  const interval = setInterval(sendVisitor, 60000);

  return () => clearInterval(interval);

}, [backendUrl]);
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
        addToCart,
        setCartItems,
        getCartItems,
        getCartAmount,
        updateQuantity,
        navigate,
        backendUrl,
        token,
        setToken,
        user,
        setUser,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
