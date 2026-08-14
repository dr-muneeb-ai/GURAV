import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Chat = ({ token }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // ==========================================
  // GET ALL CHATS
  // ==========================================

  const fetchChats = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/chat/admin/all`,
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        setChats(data.chats || []);

        // Refresh currently selected chat
        if (selectedChat) {
          const updated = data.chats.find(
            (chat) => chat._id === selectedChat._id
          );

          if (updated) {
            setSelectedChat(updated);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================================
  // INITIAL LOAD + AUTO REFRESH
  // ==========================================

  useEffect(() => {
    fetchChats();

    const interval = setInterval(() => {
      fetchChats();
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  // ==========================================
  // SELECT CHAT
  // ==========================================

  const openChat = (chat) => {
    setSelectedChat(chat);
  };

  // ==========================================
  // SEND ADMIN MESSAGE
  // ==========================================

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedChat || sending) {
      return;
    }

    try {
      setSending(true);

      const { data } = await axios.post(
        `${backendUrl}/api/chat/admin/${selectedChat._id}/send`,
        {
          message,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        setSelectedChat(data.chat);
        setMessage("");
        await fetchChats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // DELETE CHAT
  // ==========================================

  const deleteChat = async (chatId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complete chat?"
    );

    if (!confirmed) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/chat/admin/${chatId}`,
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success("Chat deleted successfully");

        setChats((prev) =>
          prev.filter((chat) => chat._id !== chatId)
        );

        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete chat"
      );
    }
  };

  // ==========================================
  // LAST MESSAGE
  // ==========================================

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages";
    }

    const last =
      chat.messages[chat.messages.length - 1];

    return last.message;
  };

  return (
    <div
      className="
        min-h-[calc(100vh-100px)]
        bg-gradient-to-br
        from-[#09090B]
        via-[#111111]
        to-[#1A0008]
        rounded-3xl
        overflow-hidden
        border
        border-red-500/10
      "
    >
      {/* HEADER */}

      <div className="p-5 sm:p-8 border-b border-red-500/10">
        <h1
          className="text-2xl sm:text-4xl text-white"
          style={{ fontFamily: "Prata, serif" }}
        >
          Customer Support
        </h1>

        <p className="text-gray-500 mt-2 text-sm">
          Manage customer conversations and support requests.
        </p>
      </div>

      {/* MAIN */}

      <div className="flex flex-col lg:flex-row h-[calc(100vh-230px)] min-h-[600px]">

        {/* =====================================
            CHAT LIST
        ===================================== */}

        <div
          className="
            w-full
            lg:w-[350px]
            border-b
            lg:border-b-0
            lg:border-r
            border-red-500/10
            overflow-y-auto
          "
        >
          <div className="p-4">

            <p className="text-xs uppercase tracking-[3px] text-red-400 mb-4">
              Conversations ({chats.length})
            </p>

            {loading ? (
              <p className="text-gray-500">
                Loading...
              </p>
            ) : chats.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  No customer chats yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">

                {chats.map((chat) => {

                  const active =
                    selectedChat?._id === chat._id;

                  return (
                    <button
                      key={chat._id}
                      onClick={() => openChat(chat)}
                      className={`
                        w-full
                        text-left
                        p-4
                        rounded-2xl
                        transition-all
                        border
                        ${
                          active
                            ? "bg-gradient-to-r from-[#8B0000] to-[#DC143C] border-red-500/40 text-white shadow-[0_0_20px_rgba(220,20,60,.25)]"
                            : "bg-white/[0.03] border-white/5 text-gray-300 hover:bg-white/[0.06]"
                        }
                      `}
                    >

                      <div className="flex justify-between gap-3">

                        <div className="min-w-0">

                          <p
                            className="font-semibold truncate"
                            style={{
                              fontFamily:
                                "Prata, serif",
                            }}
                          >
                            {chat.userId?.name ||
                              "Unknown Customer"}
                          </p>

                          <p className="text-xs text-gray-500 truncate mt-1">
                            {chat.userId?.email ||
                              "No email"}
                          </p>

                        </div>

                        <span className="text-xs text-gray-500 shrink-0">
                          {chat.messages?.length || 0}
                        </span>

                      </div>

                      <p
                        className={`
                          text-xs
                          mt-3
                          truncate
                          ${
                            active
                              ? "text-red-100"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {getLastMessage(chat)}
                      </p>

                    </button>
                  );
                })}

              </div>
            )}

          </div>
        </div>

        {/* =====================================
            CHAT WINDOW
        ===================================== */}

        <div className="flex-1 flex flex-col min-w-0">

          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">

                <div className="text-5xl mb-5">
                  💬
                </div>

                <h2
                  className="text-xl text-gray-300"
                  style={{
                    fontFamily: "Prata, serif",
                  }}
                >
                  Select a conversation
                </h2>

                <p className="text-gray-600 text-sm mt-2">
                  Choose a customer from the left.
                </p>

              </div>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}

              <div
                className="
                  p-4
                  sm:p-5
                  border-b
                  border-red-500/10
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <div className="min-w-0">

                  <h2
                    className="text-lg sm:text-xl text-white truncate"
                    style={{
                      fontFamily: "Prata, serif",
                    }}
                  >
                    {selectedChat.userId?.name ||
                      "Customer"}
                  </h2>

                  <p className="text-xs text-gray-500 truncate">
                    {selectedChat.userId?.email}
                  </p>

                </div>

                <button
                  onClick={() =>
                    deleteChat(selectedChat._id)
                  }
                  className="
                    shrink-0
                    px-3
                    sm:px-4
                    py-2
                    rounded-xl
                    bg-[#7A1E1E]
                    hover:bg-[#5F1717]
                    text-white
                    text-xs
                    sm:text-sm
                    transition
                  "
                >
                  Delete Chat
                </button>

              </div>

              {/* MESSAGES */}

              <div
                className="
                  flex-1
                  overflow-y-auto
                  p-4
                  sm:p-6
                  space-y-4
                "
              >

                {selectedChat.messages?.map(
                  (item) => {

                    const isAdmin =
                      item.sender === "admin";

                    return (
                      <div
                        key={item._id}
                        className={`
                          flex
                          ${
                            isAdmin
                              ? "justify-end"
                              : "justify-start"
                          }
                        `}
                      >

                        <div
                          className={`
                            max-w-[80%]
                            sm:max-w-[65%]
                            rounded-2xl
                            px-4
                            py-3
                            ${
                              isAdmin
                                ? "bg-[#B9572C] text-white rounded-br-md"
                                : "bg-white/[0.07] text-gray-200 border border-white/5 rounded-bl-md"
                            }
                          `}
                        >

                          <p className="text-sm leading-6 whitespace-pre-wrap">
                            {item.message}
                          </p>

                          <p
                            className={`
                              text-[10px]
                              mt-2
                              ${
                                isAdmin
                                  ? "text-white/60"
                                  : "text-gray-600"
                              }
                            `}
                          >
                            {new Date(
                              item.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

              {/* SEND MESSAGE */}

              <form
                onSubmit={sendMessage}
                className="
                  p-4
                  sm:p-5
                  border-t
                  border-red-500/10
                  flex
                  gap-2
                "
              >

                <input
                  type="text"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder="Write a reply..."
                  className="
                    flex-1
                    min-w-0
                    px-4
                    py-3
                    rounded-xl
                    bg-white/[0.05]
                    border
                    border-white/10
                    text-white
                    placeholder-gray-600
                    outline-none
                    focus:border-red-500/40
                  "
                />

                <button
                  type="submit"
                  disabled={
                    sending ||
                    !message.trim()
                  }
                  className="
                    px-5
                    sm:px-6
                    rounded-xl
                    bg-[#B9572C]
                    hover:bg-[#9A4522]
                    text-white
                    disabled:opacity-40
                    transition
                  "
                >
                  {sending ? "..." : "Send"}
                </button>

              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default Chat;
