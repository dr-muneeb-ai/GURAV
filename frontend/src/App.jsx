import React, { useEffect } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Delivery from "./pages/Delivery";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Order from "./pages/Order";
import Product from "./pages/Product";
import PlaceOrder from "./pages/PlaceOrder";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Verify from "./pages/Verify";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  useEffect(() => {

    let sessionId = localStorage.getItem("visitorId");

    if (!sessionId) {

      sessionId = Date.now() + "-" + Math.random();

      localStorage.setItem(
        "visitorId",
        sessionId
      );

    }

    const sendVisitor = async () => {

      try {

        await axios.post(
          "http://localhost:4000/api/visitor/track",
          {
            sessionId,
          }
        );

      } catch (error) {

        console.log(error);

      }

    };

    // First visit
    sendVisitor();

    // Send heartbeat every 60 seconds
    const interval = setInterval(
      sendVisitor,
      60000
    );

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen bg-[#D3D3D0]">

      <ToastContainer />

      <Navbar />

      <main className="pt-20 max-w-[1450px] mx-auto px-6 lg:px-10">

        <SearchBar />

        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/collection"
            element={<Collection />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/delivery"
            element={<Delivery />}
          />

          <Route
            path="/product/:productId"
            element={<Product />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/place-order"
            element={<PlaceOrder />}
          />

          <Route
            path="/payment"
            element={<Payment />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          <Route
            path="/orders"
            element={<Order />}
          />

          <Route
            path="/return-policy"
            element={<ReturnPolicy />}
          />

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          <Route
            path="/verify"
            element={<Verify />}
          />

        </Routes>

      </main>

      <Footer />

    </div>
  );
};

export default App;
