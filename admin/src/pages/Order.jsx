import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  // ============================================
  // FETCH ALL ORDERS
  // ============================================

  const fetchAllOrders = async (searchTerm = "", pageNum = 1) => {
    if (!token) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `${backendUrl}/api/order/list?page=${pageNum}&limit=10&search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalOrders(response.data.totalOrders || 0);
        setPage(pageNum);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // UPDATE ORDER STATUS
  // ============================================

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      const response = await axios.put(
        `${backendUrl}/api/order/status/${orderId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        // Update local order immediately
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
          )
        );

        toast.success("Status updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  // ============================================
  // DELETE ORDER
  // ============================================

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      // Backend route is:
      // DELETE /api/order/delete/:id

      const response = await axios.delete(
        `${backendUrl}/api/order/delete/${orderId}`,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order deleted successfully");

        // Refresh current page
        await fetchAllOrders(search, page);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete order"
      );
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    if (token) {
      fetchAllOrders("", 1);
    }
  }, [token]);

  // ============================================
  // SEARCH
  // ============================================

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    fetchAllOrders(search, 1);
  };

  // ============================================
  // PAGINATION
  // ============================================

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;

    fetchAllOrders(search, newPage);
  };

  // ============================================
  // PAYMENT STATUS
  // ============================================

  const getPaymentStatus = (order) => {
    // COD payment is NOT supposed to be completed
    // until customer pays on delivery.
    if (order.paymentMethod === "cod") {
      return {
        text: "COD - Pay on Delivery",
        className: "text-orange-600",
      };
    }

    // Stripe / PayPal
    if (order.payment) {
      return {
        text: "Paid",
        className: "text-green-600",
      };
    }

    return {
      text: "Pending Payment",
      className: "text-red-500",
    };
  };

  return (
    <div
      className="
      min-h-screen
      px-4
      sm:px-6
      lg:px-8
      py-8
      bg-gradient-to-br
      from-[#F8F5F0]
      via-[#FDFBF8]
      to-[#EEE7DB]
      "
    >
      {/* ============================================
          TITLE
      ============================================ */}

      <h3
        className="
        text-3xl
        sm:text-4xl
        lg:text-5xl
        mb-8
        lg:mb-10
        text-center
        text-[#B9572C]
        "
        style={{
          fontFamily: "Prata, serif",
        }}
      >
        Orders Management
      </h3>

      {/* ============================================
          SEARCH BAR
      ============================================ */}

      <div className="mb-6 flex justify-center">
        <form
          onSubmit={handleSearch}
          className="
          flex
          gap-2
          max-w-md
          w-full
          "
        >
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
            flex-1
            px-4
            sm:px-5
            py-3
            rounded-2xl
            bg-white/60
            backdrop-blur-xl
            border
            border-[#B9572C]/20
            outline-none
            focus:ring-2
            focus:ring-[#B9572C]/30
            "
          />

          <button
            type="submit"
            className="
            px-5
            sm:px-6
            py-3
            bg-[#B9572C]
            text-white
            rounded-2xl
            hover:bg-[#9A4522]
            shadow-[0_0_20px_rgba(185,87,44,0.35)]
            transition
            "
          >
            Search
          </button>
        </form>
      </div>

      {/* ============================================
          ORDERS COUNT
      ============================================ */}

      <div className="mb-6 text-center text-gray-600">
        Total Orders: {totalOrders}{" "}
        <span className="mx-2">|</span>
        Page {page} of {totalPages}
      </div>

      {/* ============================================
          ORDERS
      ============================================ */}

      <div className="space-y-6 lg:space-y-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No orders found
          </div>
        ) : (
          orders.map((order) => {
            const paymentStatus = getPaymentStatus(order);

            return (
              <div
                key={order._id}
                className="
                bg-white/60
                backdrop-blur-xl
                border
                border-[#B9572C]/20
                rounded-3xl
                p-5
                sm:p-6
                lg:p-8
                shadow-[0_10px_35px_rgba(185,87,44,0.12)]
                "
              >
                <div
                  className="
                  flex
                  flex-col
                  lg:flex-row
                  gap-8
                  "
                >
                  {/* ============================================
                      LEFT SECTION
                  ============================================ */}

                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <img
                        src={assets.parcel_icon}
                        alt="Parcel Icon"
                        className="
                        w-16
                        h-16
                        sm:w-20
                        sm:h-20
                        rounded-full
                        bg-[#B9572C]/10
                        p-3
                        shrink-0
                        "
                      />

                      <div className="space-y-3">
                        {/* CUSTOMER NAME */}

                        <div
                          className="
                          text-xl
                          sm:text-2xl
                          font-semibold
                          text-[#B9572C]
                          "
                          style={{
                            fontFamily: "Prata, serif",
                          }}
                        >
                          {order.address?.firstName}{" "}
                          {order.address?.lastName}
                        </div>

                        {/* ADDRESS */}

                        <div className="text-sm text-gray-600 leading-6">
                          {order.address?.street}
                          <br />

                          {order.address?.city},{" "}
                          {order.address?.state},{" "}
                          {order.address?.country},{" "}
                          {order.address?.pinCode}

                          <br />

                          Phone: {order.address?.phone}
                        </div>
                      </div>
                    </div>

                    {/* ============================================
                        ITEMS
                    ============================================ */}

                    <div className="mt-6 text-sm text-gray-700">
                      <strong>Items:</strong>

                      <ul className="list-disc ml-5 mt-2 space-y-1">
                        {order.items?.map((item, i) => (
                          <li key={i}>
                            {item.name} × {item.quantity}{" "}
                            <span className="text-gray-500">
                              ({item.size})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ============================================
                      RIGHT SECTION
                  ============================================ */}

                  <div
                    className="
                    w-full
                    lg:w-[360px]
                    space-y-4
                    text-sm
                    text-gray-700
                    "
                  >
                    {/* PAYMENT METHOD */}

                    <p>
                      <span className="font-semibold">
                        Payment Method:
                      </span>{" "}
                      <span className="uppercase">
                        {order.paymentMethod}
                      </span>
                    </p>

                    {/* PAYMENT STATUS */}

                    <p>
                      <span className="font-semibold">
                        Payment Status:
                      </span>{" "}
                      <span
                        className={`font-bold ${paymentStatus.className}`}
                      >
                        {paymentStatus.text}
                      </span>
                    </p>

                    {/* DATE */}

                    <p>
                      <span className="font-semibold">
                        Date:
                      </span>{" "}
                      {order.date
                        ? new Date(
                            order.date
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                    {/* TOTAL */}

                    <p
                      className="
                      text-2xl
                      font-bold
                      text-[#B9572C]
                      "
                    >
                      {currency}
                      {order.amount}
                    </p>

                    {/* ============================================
                        ORDER STATUS
                    ============================================ */}

                    <div>
                      <label className="block mb-2 font-semibold">
                        Order Status
                      </label>

                      <select
                        onChange={(event) =>
                          statusHandler(
                            event,
                            order._id
                          )
                        }
                        value={order.status}
                        className="
                        w-full
			  rounded-xl
			  border
			  border-[#B9572C]/20
			  px-4
			  py-3
			  outline-none
			  shadow-sm
			  focus:ring-2
			  focus:ring-[#B9572C]/30
			  "
                      >
                        <option value="Order Placed">
                          Order Placed
                        </option>

                        <option value="Packed">
                          Packed
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Out for delivery">
                          Out For Delivery
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>
                      </select>
                    </div>

                    {/* ============================================
                        DELETE
                    ============================================ */}

                    <button
                      onClick={() =>
                        deleteOrder(order._id)
                      }
                      className="
                      w-full
                      mt-2
                      px-4
                      py-3
                      bg-[#7A1E1E]
                      hover:bg-[#5F1717]
                      text-white
                      rounded-xl
                      transition-colors
                      shadow-lg
                      "
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ============================================
          PAGINATION
      ============================================ */}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
          {/* PREVIOUS */}

          <button
            onClick={() =>
              handlePageChange(page - 1)
            }
            disabled={page === 1}
            className="
            px-4
            py-2
            bg-gray-300
            text-gray-700
            rounded-lg
            disabled:opacity-50
            disabled:cursor-not-allowed
            hover:bg-gray-400
            transition
            "
          >
            Previous
          </button>

          {/* PAGE NUMBERS */}

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() =>
                handlePageChange(pageNum)
              }
              className={`
              px-4
              py-2
              rounded-lg
              transition-colors
              ${
                pageNum === page
                  ? "bg-[#B9572C] text-white"
                  : "bg-white border border-[#B9572C]/20 text-gray-700 hover:bg-gray-300"
              }
              `}
            >
              {pageNum}
            </button>
          ))}

          {/* NEXT */}

          <button
            onClick={() =>
              handlePageChange(page + 1)
            }
            disabled={page === totalPages}
            className="
            px-4
            py-2
            bg-gray-300
            text-gray-700
            rounded-lg
            disabled:opacity-50
            disabled:cursor-not-allowed
            hover:bg-gray-400
            transition
            "
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Order;
