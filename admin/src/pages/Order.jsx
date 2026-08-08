import React from "react";
import { useEffect, useState } from "react";
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

  const fetchAllOrders = async (searchTerm = "", pageNum = 1) => {
    if (!token) {
      return null;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/order/list?page=${pageNum}&limit=10&search=${searchTerm}`,
        { headers: { token } },
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
        setTotalOrders(response.data.totalOrders);
        setPage(pageNum);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    // Optimistically update the local state
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: newStatus },
        { headers: { token } },
      );
      if (response.data.success) {
        // Status updated successfully, no need to re-fetch since we updated locally
        toast.success("Status updated successfully");
      } else {
        // Revert the optimistic update
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: order.status } : order,
          ),
        );
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      // Revert the optimistic update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: order.status } : order,
        ),
      );
      toast.error(error.message);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/delete",
        { orderId },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Order deleted successfully");
        await fetchAllOrders(search, page);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAllOrders(search, 1);
  };

  const handlePageChange = (newPage) => {
    fetchAllOrders(search, newPage);
  };
  return (
    <div
	  className="
	  min-h-screen
	  px-8
	  py-8
	  bg-gradient-to-br
	  from-[#F8F5F0]
	  via-[#FDFBF8]
	  to-[#EEE7DB]
	  "
	>
      <h3
	className="
	text-5xl
	mb-10
	text-center
	text-[#B9572C]
	"
	style={{ fontFamily: "Prata, serif" }}
	>
        Orders Management
      </h3>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md w-full">
          <input
		  type="text"
		  placeholder="Search by name..."
		  value={search}
		  onChange={(e) => setSearch(e.target.value)}
		  className="
		    flex-1
		    px-5
		    py-3
		    rounded-2xl
		    bg-white/60
		    backdrop-blur-xl
		    border
		    border-[#B9572C]/20
		    outline-none
		  "
		/>

		<button
		  type="submit"
		  className="
		    px-6
		    py-3
		    bg-[#B9572C]
		    text-white
		    rounded-2xl
		    hover:bg-[#9A4522]
		    shadow-[0_0_20px_rgba(185,87,44,0.35)]
		  "
		>
		  Search
		</button>
        </form>
      </div>

      {/* Orders Count */}
      <div className="mb-4 text-center text-gray-600">
        Total Orders: {totalOrders} | Page {page} of {totalPages}
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No orders found</div>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className="
		flex-1
		px-5
		py-3
		rounded-2xl
		bg-white/60
		backdrop-blur-xl
		border
		border-[#B9572C]/20
		outline-none
		"
            >
              {/* Left Section */}
              <div className="flex items-start gap-4 md:w-2/3">
                <img
                  src={assets.parcel_icon}
                  alt="Parcel Icon"
                  className="
			w-20
			h-20
			rounded-full
			bg-[#B9572C]/10
			p-3
			"
                />

                <div className="space-y-3">
                  <div className="text-gray-800 font-semibold text-2xl text-[#B9572C]"
                  style={{fontFamily:"Prata, serif"}}>
                    {order.address.firstName} {order.address.lastName}
                  </div>

                  <div className="text-sm text-gray-600">
                    {order.address.street}
                    <br />
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}, {order.address.pinCode}
                    <br />
                    Phone: {order.address.phone}
                  </div>

                  <div className="text-sm text-gray-700">
                    <strong>Items:</strong>
                    <ul className="list-disc ml-5 space-y-1">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.name} × {item.quantity}{" "}
                          <span className="text-gray-500">({item.size})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="mt-4 md:mt-0 md:w-1/3 space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p>
                  <span className="font-semibold">Payment Status:</span>{" "}
                  <span
                    className={`font-bold ${order.payment ? "text-green-600" : "text-red-500"}`}
                  >
                    {order.payment ? "Done" : "Pending"}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="text-lg font-bold text-[#B9572C] text-2xl">
                  {currency}
                  {order.amount}
                </p>

                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="
			w-full
			rounded-xl
			bg-white/70
			border
			border-[#B9572C]/20
			px-4
			py-3
			outline-none shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OrderPlaced">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipping">Shipped</option>
                  <option value="Out for delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

                {/* Delete Button */}
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="w-full mt-2 px-4 py-2 bg-[#7A1E1E] hover:bg-[#5F1717] text-white rounded-xl transition-colors shadow-lg"
                >
                  Delete Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg transition-colors ${pageNum === page ? "bg-[#B9572C] text-white" : "bg-white border border-[#B9572C]/20 text-gray-700 hover:bg-gray-300"}`}
              >
                {pageNum}
              </button>
            ),
          )}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Order;
