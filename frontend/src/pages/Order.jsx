import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Order = () => {

  const {
  backendUrl,
  token,
  currency,
  setCartItems,
  user
} = useContext(ShopContext);

  const [orderData, setOrderData] = useState([])
  const [openOrder, setOpenOrder] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadOrderData = async () => {
    try {
      let orders = [];
      if (!token) {
        // Load from localStorage for guests
        const guestOrders = JSON.parse(localStorage.getItem("guestOrders")) || [];
        orders = guestOrders;
      } else {
        const response = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } });
        if (response.data.success) {
          orders = response.data.orders;
        }
      }

      let allOrdersItems = [];
      orders.forEach((order) => {
        order.items.forEach((item) => {
          item['status'] = order.status
          item['payment'] = order.payment
          item['paymentMethod'] = order.paymentMethod
          item['date'] = order.date
          allOrdersItems.push(item)
        })
      });
      setOrderData(allOrdersItems.reverse());
      
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  // ================= Verify Stripe / PayPal Payment =================
  // Runs once when the customer lands back on this page from Stripe
  // or PayPal Checkout (URL will contain ?success=true&method=...)
  useEffect(() => {
    const verifyPayment = async () => {
      const success = searchParams.get("success");
      const method = searchParams.get("method");

      if (success !== "true" || !method || !token) return;

      try {
        const payload = { method };

        if (method === "stripe") {
          payload.session_id = searchParams.get("session_id");
        }

        if (method === "paypal") {
          // PayPal appends this as "token" on the return_url
          payload.paypalOrderId = searchParams.get("token");
        }

        const { data } = await axios.post(
          backendUrl + "/api/order/verify-payment",
          payload,
          { headers: { token } }
        );

        if (data.success) {
          toast.success("Payment confirmed — order placed!");
          setCartItems({});
          loadOrderData();
        } else {
          toast.error(data.message || "Payment could not be verified");
        }
      } catch (error) {
        console.log(error);
        toast.error("Payment verification failed");
      } finally {
        // strip the query params so a page refresh doesn't re-trigger this
        setSearchParams({});
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'}/>
      </div>

      <div>
        {
          orderData.map((item,index) => (
            <div key={index} className="
		mb-6
		p-6
		rounded-3xl
		bg-white/40
		backdrop-blur-xl
		border
		border-[#B9572C]/20
		shadow-[0_10px_35px_rgba(185,87,44,0.15)]
		flex
		flex-col
		md:flex-row
		justify-between
		gap-6
		">
                <div className='flex item-start gap-6 text-sm'>
                  <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                  <div>
                    <p className='sm:text-base font-medium' >{item.name}</p>
                    <div className='flex item-center gap-3 mt-1 text-base text-gray'>
                      <p >{currency}{item.price}</p>
                      <p>Quantity: {item.quantity} </p>
                      <p>Size:{item.size}</p>
                    </div>
                    <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>

                  </div>
                </div>
                <div className="md:w-1/2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="w-2 h-2 rounded-full bg-green-500"></p>
                    <span
			  className={`px-3 py-1 rounded-full text-sm font-medium ${
			    item.status === "Order Placed"
			      ? "bg-yellow-100 text-yellow-700"
			      : item.status === "Packed"
			      ? "bg-blue-100 text-blue-700"
			      : item.status === "Shipped"
			      ? "bg-purple-100 text-purple-700"
			      : item.status === "Delivered"
			      ? "bg-green-100 text-green-700"
			      : "bg-gray-100 text-gray-700"
			  }`}
			>
			  {item.status}
			</span>
                  </div>
                  <button
		  onClick={() =>
		    setOpenOrder(openOrder === index ? null : index)
		  }
		  className="
		    bg-[#B9572C]
		    text-white
		    px-5
		    py-2
		    rounded-xl
		    shadow-[0_0_20px_rgba(185,87,44,0.35)]
		    hover:scale-105
		    transition-all
		  "
		>
		  {openOrder === index ? "Hide Tracking ▲" : "Track Order ▼"}
		</button>
		{openOrder === index && (
		  <div
		    className="
		      mt-8
		      w-full
		      bg-white/40
		      backdrop-blur-xl
		      border
		      border-[#B9572C]/20
		      rounded-2xl
		      p-6
		    "
		  >
		    <div className="flex justify-between text-center">

		      <div>
			<div className="w-5 h-5 rounded-full bg-green-500 mx-auto"></div>
			<p className="mt-2 text-sm">Order Placed</p>
		      </div>

		      <div>
			<div className="w-5 h-5 rounded-full bg-green-500 mx-auto"></div>
			<p className="mt-2 text-sm">Packed</p>
		      </div>

		      <div>
			<div
			  className={`w-5 h-5 rounded-full mx-auto ${
			    item.status === "Shipped" || item.status === "Delivered"
			      ? "bg-green-500"
			      : "bg-gray-300"
			  }`}
			></div>
			<p className="mt-2 text-sm">Shipped</p>
		      </div>

		      <div>
			<div
			  className={`w-5 h-5 rounded-full mx-auto ${
			    item.status === "Delivered"
			      ? "bg-green-500"
			      : "bg-gray-300"
			  }`}
			></div>
			<p className="mt-2 text-sm">Delivered</p>
		      </div>

		    </div>

		    <div className="h-1 bg-gray-300 rounded-full mt-5 relative">
		      <div className="absolute h-1 w-1/2 bg-[#B9572C] rounded-full"></div>
		    </div>

		    <p className="mt-5 text-center text-[#B9572C] font-semibold">
		      Estimated Delivery: 5-7 Business Days
		    </p>
		  </div>
		)}
                </div>
            </div>
          ))
        }
      </div>
      
    </div>
  )
}

export default Order;
