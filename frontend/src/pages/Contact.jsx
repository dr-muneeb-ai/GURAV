import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";
import Newsletter from "../components/Newsletter";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import {
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

const Contact = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext);

  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);

  const pollRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Converts the backend's { sender, message, _id } shape into the
  // { id, sender, text } shape the UI already renders.
  const mapMessages = (msgs = []) =>
    msgs.map((m) => ({
      id: m._id,
      sender: m.sender, // "customer" | "admin"
      text: m.message,
    }));

  const fetchChat = useCallback(
    async ({ silent } = {}) => {
      if (!token) return;

      try {
        if (!silent) setLoadingChat(true);

        const { data } = await axios.get(`${backendUrl}/api/chat/my`, {
          headers: { token },
        });

        if (data.success) {
          setChatMessages(mapMessages(data.chat.messages));
        }
      } catch (error) {
        console.log(error);
        if (!silent) toast.error("Could not load chat. Please try again.");
      } finally {
        if (!silent) setLoadingChat(false);
      }
    },
    [backendUrl, token]
  );

  // Load chat when the widget opens, then poll every 4s for admin replies
  // while it stays open. This is a simple polling-based "live" chat since
  // there's no websocket server — good enough for low-traffic support chat.
  useEffect(() => {
    if (!showChat || !token) return;

    fetchChat();

    pollRef.current = setInterval(() => {
      fetchChat({ silent: true });
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [showChat, token, fetchChat]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, showChat]);

  const openChat = () => {
    if (!token) {
      toast.error("Please login to use live chat");
      navigate("/login");
      return;
    }
    setShowChat(true);
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    if (!token) {
      toast.error("Please login to send a message");
      navigate("/login");
      return;
    }

    // Optimistic UI: show the message immediately, replace with server
    // state once the request resolves.
    const optimisticId = `temp-${Date.now()}`;

    setChatMessages((prev) => [
      ...prev,
      { id: optimisticId, sender: "customer", text: trimmedMessage },
    ]);
    setMessage("");
    setSending(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/chat/send`,
        { message: trimmedMessage },
        { headers: { token } }
      );

      if (data.success) {
        setChatMessages(mapMessages(data.chat.messages));
      } else {
        toast.error(data.message || "Message failed to send");
        // Roll back the optimistic message on failure
        setChatMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Message failed to send");
      setChatMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#121212] via-[#ece7e2] to-[#121212] py-12 sm:py-16 rounded-3xl overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* ================= HERO ================= */}
        <div className="text-center pt-4 sm:pt-8">
          <Title text1={"CONTACT"} text2={"US"} />

          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
            We'd love to hear from you — reach out anytime.
          </p>
        </div>

        {/* ================= MAIN CONTACT CARD ================= */}
        <div className="my-10 sm:my-14 bg-white rounded-[28px] sm:rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="flex flex-col md:flex-row">

            <img
              className="w-full md:w-[46%] h-56 sm:h-72 md:h-auto object-cover"
              src={assets.contact_img}
              alt="Contact Us"
              loading="lazy"
            />

            <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-5 p-6 sm:p-10">

              <p
                className="font-normal text-2xl sm:text-3xl text-[#1d1d1b]"
                style={{ fontFamily: "'Prata', serif" }}
              >
                Drip District
              </p>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Australia <br />
                Operating from Adelaide & Sydney
              </p>

              <div className="w-12 h-[3px] bg-[#b9572c] rounded-full"></div>

              {/* CONTACT DETAILS */}
              <div className="flex flex-col gap-3 text-sm sm:text-base">

                <a
                  href="mailto:support@dripdistrict.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-[#b9572c] transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#f5f2ec] flex items-center justify-center shrink-0">
                    <FaEnvelope
                      size={13}
                      className="text-[#b9572c]"
                    />
                  </span>

                  support@dripdistrict.com
                </a>

                <a
                  href="tel:+61XXXXXXXXX"
                  className="flex items-center gap-3 text-gray-700 hover:text-[#b9572c] transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#f5f2ec] flex items-center justify-center shrink-0">
                    <FaPhone
                      size={13}
                      className="text-[#b9572c]"
                    />
                  </span>

                  +61 XXX XXX XXX
                </a>

                <div className="flex items-start gap-3 text-gray-500">

                  <span className="w-9 h-9 rounded-full bg-[#f5f2ec] flex items-center justify-center shrink-0">
                    <FaClock
                      size={13}
                      className="text-[#b9572c]"
                    />
                  </span>

                  <span>
                    Monday – Saturday
                    <br />
                    9:00 AM – 6:00 PM (AEST)
                  </span>

                </div>

              </div>

              {/* SOCIAL MEDIA */}
              <div className="flex gap-3 mt-2 flex-wrap">

                <a
                  href="https://www.instagram.com/dripdistrictaus?igsh=MXI2ZDRwZHl0ems3Zg=="
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1d1d1b] hover:text-white hover:border-[#1d1d1b] transition-all duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram size={15} />
                </a>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1d1d1b] hover:text-white hover:border-[#1d1d1b] transition-all duration-300"
                  aria-label="TikTok"
                >
                  <FaTiktok size={14} />
                </a>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1d1d1b] hover:text-white hover:border-[#1d1d1b] transition-all duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={14} />
                </a>

              </div>
            </div>
          </div>
        </div>

        {/* ================= SHIPPING INFO ================= */}
        <div className="mb-10 sm:mb-16">

          <p
            className="text-center text-2xl sm:text-3xl text-[#1d1d1b] mb-6 sm:mb-8"
            style={{ fontFamily: "'Prata', serif" }}
          >
            Shipping Information
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

            {[
              {
                title: "Shipping Location",
                desc: "Australia-wide shipping",
              },
              {
                title: "Based In",
                desc: "Adelaide & Sydney, Australia",
              },
              {
                title: "Delivery",
                desc: "Fast, reliable & secure delivery with tracking",
              },
            ].map((item, i) => (

              <div
                key={i}
                className="rounded-2xl p-6 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                <p className="font-semibold text-[#b9572c] text-xs uppercase tracking-[2px] mb-2">
                  {String(i + 1).padStart(2, "0")}
                </p>

                <p className="font-medium text-[#1d1d1b] mb-1">
                  {item.title}
                </p>

                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>
        </div>

        {/* ================= CUSTOMER SUPPORT ================= */}
        <div className="mb-4 sm:mb-8">

          <p
            className="text-center text-2xl sm:text-3xl text-[#1d1d1b] mb-6 sm:mb-8"
            style={{ fontFamily: "'Prata', serif" }}
          >
            Customer Support
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

            {[
              "Contact Form",
              "Instagram DM",
              "Live Chat",
              "FAQ",
            ].map((item, i) => (

              <div
                key={i}
                onClick={() => {
                  if (item === "Live Chat") {
                    openChat();
                  }
                }}
                className={`
                  rounded-xl
                  p-4
                  sm:p-5
                  text-center
                  text-xs
                  sm:text-sm
                  text-[#1d1d1b]
                  font-medium
                  bg-white/90
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  shadow-sm
                  hover:shadow-lg

                  ${
                    item === "Live Chat"
                      ? "cursor-pointer hover:bg-[#1d1d1b] hover:text-white hover:-translate-y-1"
                      : "cursor-default"
                  }
                `}
              >
                {item}
              </div>

            ))}

          </div>
        </div>
      </div>

      {/* =========================================================
          LIVE CHAT POPUP
      ========================================================= */}

      {showChat && (
        <>
          {/* BACKDROP - MOBILE */}
          <div
            onClick={() => setShowChat(false)}
            className="
              fixed
              inset-0
              bg-black/30
              backdrop-blur-[2px]
              z-[90]
              sm:hidden
            "
          ></div>

          {/* CHAT WINDOW */}
          <div
            className="
              fixed
              z-[100]
              bottom-5
              right-5
              w-[360px]
              max-w-[calc(100vw-24px)]
              bg-white
              rounded-[24px]
              overflow-hidden
              shadow-[0_25px_80px_rgba(0,0,0,0.25)]
              border
              border-gray-200
            "
          >

            {/* CHAT HEADER */}
            <div className="bg-[#1d1d1b] text-white px-5 py-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="relative">

                  <div className="w-10 h-10 rounded-full bg-[#b9572c] flex items-center justify-center">
                    <FaEnvelope size={15} />
                  </div>

                  <span className="
                    absolute
                    bottom-0
                    right-0
                    w-3
                    h-3
                    bg-green-500
                    rounded-full
                    border-2
                    border-[#1d1d1b]
                  "></span>

                </div>

                <div>

                  <h3
                    className="text-base sm:text-lg"
                    style={{ fontFamily: "'Prata', serif" }}
                  >
                    Customer Support
                  </h3>

                  <p className="text-[11px] text-gray-300">
                    We're here to help
                  </p>

                </div>

              </div>

              <button
                onClick={() => setShowChat(false)}
                className="
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-gray-300
                  hover:bg-white/10
                  hover:text-white
                  transition
                "
              >
                ✕
              </button>

            </div>

            {/* CHAT MESSAGES */}
            <div className="
              h-[320px]
              bg-[#f8f5f0]
              p-4
              overflow-y-auto
              space-y-3
            ">

              {loadingChat ? (
                <p className="text-center text-xs text-gray-400 mt-10">
                  Loading chat...
                </p>
              ) : (

                chatMessages.map((chat) => (

                  <div
                    key={chat.id}
                    className={`flex ${
                      chat.sender === "customer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`
                        max-w-[82%]
                        px-4
                        py-3
                        text-sm
                        shadow-sm

                        ${
                          chat.sender === "customer"
                            ? "bg-[#b9572c] text-white rounded-2xl rounded-br-none"
                            : "bg-white text-gray-700 rounded-2xl rounded-tl-none"
                        }
                      `}
                    >
                      {chat.text}
                    </div>

                  </div>

                ))

              )}

              <div ref={messagesEndRef} />

            </div>

            {/* MESSAGE INPUT */}
            <div className="bg-white border-t border-gray-100 p-3">

              <div className="flex items-center gap-2">

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="
                    flex-1
                    min-w-0
                    px-4
                    py-3
                    bg-[#f8f5f0]
                    rounded-full
                    text-sm
                    text-gray-700
                    outline-none
                    border
                    border-transparent
                    focus:border-[#b9572c]
                  "
                />

                <button
                  onClick={sendMessage}
                  disabled={!message.trim() || sending}
                  className="
                    w-11
                    h-11
                    shrink-0
                    rounded-full
                    bg-[#b9572c]
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-[#9a4522]
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition
                  "
                >
                  <FaPaperPlane size={14} />
                </button>

              </div>

              <p className="text-[10px] text-gray-400 text-center mt-2">
                Drip District Customer Support
              </p>

            </div>

          </div>
        </>
      )}

      {/* ================= NEWSLETTER ================= */}
      <Newsletter />

    </div>
  );
};

export default Contact;
