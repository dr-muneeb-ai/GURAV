import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Add from "./pages/Add";
import Orders from "./pages/Order";
import Settings from "./pages/Settings";
import List from "./pages/List";
import Edit from "./pages/Edit";
import Stats from "./pages/Stats";
export const backendUrl = "http://localhost:4000";
export const currency = "A$.";

const Dashboard = () => {

  const token = localStorage.getItem("token");

  const [dashboard, setDashboard] = useState({
  revenue: 0,
  totalProducts: 0,
  totalUsers: 0,
  totalOrders: 0,
  latestOrders: [],
  monthlyRevenue: [],
  latestProducts: [],
  salesOverview: [],
  
});
    const [traffic,setTraffic]=useState({

	totalVisitors:0,
	liveVisitors:0,
	todayVisitors:0,
	weekVisitors:0,
	monthVisitors:0

	});
	useEffect(() => {

    const loadDashboard = async () => {

      try {

        const { data } = await axios.get(
          backendUrl + "/api/admin/dashboard",
          {
            headers: {
              token,
            },
          }
        );

        if (data.success) {

          setDashboard({
            revenue: data.stats.revenue,
            totalProducts: data.stats.totalProducts,
            totalUsers: data.stats.totalUsers,
            totalOrders: data.stats.totalOrders,
            latestOrders: data.latestOrders,
            monthlyRevenue: data.monthlyRevenue,
            latestProducts: data.latestProducts,
            salesOverview: data.salesOverview || [],
          });

        }

      } catch (error) {
        console.log(error);
      }

    };

    loadDashboard();

  }, [token]);



// Traffic Stats Refresh
useEffect(() => {

  const loadTraffic = async () => {

    try {

      const { data } = await axios.get(
        backendUrl + "/api/visitor/stats"
      );

      if (data.success) {
        setTraffic(data.traffic);
      }

    } catch (error) {
      console.log(error);
    }

  };

  loadTraffic();

  const interval = setInterval(loadTraffic, 10000);

  return () => clearInterval(interval);

}, []);


// Traffic State Debug
useEffect(() => {

  console.log("Traffic State:", traffic);
  console.log("Total:", traffic.totalVisitors);
  console.log("Live:", traffic.liveVisitors);
  console.log("Today:", traffic.todayVisitors);
  console.log("Week:", traffic.weekVisitors);
  console.log("Month:", traffic.monthVisitors);

}, [traffic]);


  // Visitor Tracking

  useEffect(() => {

    let sessionId =
      localStorage.getItem("visitorId");

    if (!sessionId) {

      sessionId =
        Date.now() + "-" + Math.random();

      localStorage.setItem(
        "visitorId",
        sessionId
      );

    }

    const sendVisitor = () => {

      axios.post(
        backendUrl + "/api/visitor/track",
        {
          sessionId,
        }
      );

    };

    sendVisitor();

    const interval =
      setInterval(sendVisitor, 60000);

    return () => clearInterval(interval);

  }, []);

  const stats = [

    {
      title: "Revenue",
      value: `A$. ${dashboard.revenue}`,
      icon: "💰",
      color: "from-amber-500 to-orange-600",
    },

    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: "📦",
      color: "from-[#8f5b3b] to-[#c98d69]",
    },

    {
      title: "Orders",
      value: dashboard.totalOrders,
      icon: "🛍️",
      color: "from-emerald-500 to-emerald-700",
    },

    {
      title: "Customers",
      value: dashboard.totalUsers,
      icon: "👥",
      color: "from-blue-500 to-indigo-600",
    },

  ];

  return (
    <div className="space-y-8">

      {/* Heading */}

      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-semibold text-slate-900 text-white"
            style={{ fontFamily: "Prata, serif" }}
          >
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome Redefining the Art of Drip
          </p>
        </div>

        <button className="rounded-xl bg-transparent px-5 py-3 text-white hover:scale-105 transition">
          + Add Product
        </button>
      </div>

      {/* Stats Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
	  {stats.map((item) => (
	    <div
	      key={item.title}
	      className="card-shine relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-[0_0_30px_rgba(255,0,0,0.15)] hover:shadow-[0_0_50px_rgba(255,0,0,0.35)] transition-all duration-500 hover:-translate-y-2"
	    >
	      <div
		className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white bg-gradient-to-r ${item.color}`}
	      >
		{item.icon}
	      </div>

	      <p className="mt-5 text-gray-500">{item.title}</p>

	      <h2 className="text-3xl font-bold mt-2">
		{item.value}
	      </h2>
	    </div>
	  ))}
	</div>
	{/* Website Traffic */}

	<div className="grid md:grid-cols-5 gap-6">

	<div className="card-shine relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-[0_0_30px_rgba(255,0,0,0.15)] hover:shadow-[0_0_50px_rgba(255,0,0,0.35)] transition-all duration-500 hover:-translate-y-2">
	<h2 className="text-gray-500">
	👁 Total Visitors
	</h2>

	<h1 className="text-3xl font-bold mt-3">
	{traffic.totalVisitors}
	</h1>
	</div>


	<div className="card-shine relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-[0_0_30px_rgba(255,0,0,0.15)] hover:shadow-[0_0_50px_rgba(255,0,0,0.35)] transition-all duration-500 hover:-translate-y-2">
	<h2 className="text-gray-500">
	🟢 Live Visitors
	</h2>

	<h1 className="text-3xl font-bold mt-3">
	{traffic.liveVisitors}
	</h1>
	</div>



	<div className="card-shine relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-[0_0_30px_rgba(255,0,0,0.15)] hover:shadow-[0_0_50px_rgba(255,0,0,0.35)] transition-all duration-500 hover:-translate-y-2">
	<h2 className="text-gray-500">
	📈 Today Visitors
	</h2>

	<h1 className="text-3xl font-bold mt-3">
	{traffic.todayVisitors}
	</h1>
	</div>



	<div className="card-shine relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-[0_0_30px_rgba(255,0,0,0.15)] hover:shadow-[0_0_50px_rgba(255,0,0,0.35)] transition-all duration-500 hover:-translate-y-2">
	<h2 className="text-gray-500">
	📅 This Week
	</h2>

	<h1 className="text-3xl font-bold mt-3">
	{traffic.weekVisitors}
	</h1>
	</div>



	<div className="card-shine relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-[0_0_30px_rgba(255,0,0,0.15)] hover:shadow-[0_0_50px_rgba(255,0,0,0.35)] transition-all duration-500 hover:-translate-y-2">
	<h2 className="text-gray-500">
	📆 This Month
	</h2>

	<h1 className="text-3xl font-bold mt-3">
	{traffic.monthVisitors}
	</h1>
	</div>


	</div>

      {/* Analytics Section */}

	<div className="grid lg:grid-cols-3 gap-6">

	  {/* Revenue Analytics */}

	  <div className="lg:col-span-2 rounded-3xl bg-transparent p-6 shadow">

	    <h2 className="text-xl font-semibold mb-6">
	      Revenue Analytics
	    </h2>

	    <div className="flex items-end justify-between h-72 rounded-2xl border border-red-500/10 bg-black/20 p-4">

	      {(dashboard.monthlyRevenue || []).map((value, i) => (

		<div key={i} className="flex flex-col items-center">

		  <div
		    className="
			w-8
			rounded-t-xl
			bg-gradient-to-t
			from-[#3b0008]
			via-[#ff003c]
			to-[#ff7b9d]
			shadow-[0_0_20px_rgba(255,0,60,.75)]
			transition-all
			duration-300
			hover:scale-110
			hover:shadow-[0_0_35px_rgba(255,0,60,1)]
			"
		    style={{
		      height: `${Math.max(value / 20, 10)}px`,
		    }}
		  />

		  <span
		  className="mt-3 text-xs tracking-[0.15em] text-red-200"
		  style={{ fontFamily: "Prata, serif" }}
		>
		    {[
		      "Jan","Feb","Mar","Apr","May","Jun",
		      "Jul","Aug","Sep","Oct","Nov","Dec"
		    ][i]}
		  </span>

		</div>

	      ))}

	    </div>

	  </div>

	  {/* Sales Overview */}

	<div
	  className="
	  relative
	  overflow-hidden
	  rounded-3xl
	  border
	  border-red-500/20
	  bg-gradient-to-br
	  from-[#070707]
	  via-[#101010]
	  to-[#1b0008]
	  p-8
	  shadow-[0_0_30px_rgba(255,0,60,.18)]
	  hover:shadow-[0_0_70px_rgba(255,0,60,.35)]
	  transition-all
	  duration-500
	  before:absolute
	  before:top-0
	  before:left-[-130%]
	  before:h-full
	  before:w-[70%]
	  before:rotate-12
	  before:bg-gradient-to-r
	  before:from-transparent
	  before:via-red-500/15
	  before:to-transparent
	  before:duration-1000
	  hover:before:left-[140%]
	"
	>
	  <h2
	    className="relative z-10 mb-8 text-lg tracking-[0.18em] text-red-300 text-extrabold"
	    style={{ fontFamily: "Prata, serif" }}
	  >
	    Sales Overview
	  </h2>

	  <div className="relative z-10 space-y-5">
	    {dashboard.salesOverview.map((item) => (
	      <div key={item.category}>
		<div className="mb-3 flex justify-between text-red-100">
		  <span>{item.category}</span>
		  <span>{item.percentage}%</span>
		</div>

		<div className="h-3 overflow-hidden rounded-full border border-red-900 bg-black">
		  <div
		    className="h-3 rounded-full shadow-[0_0_18px_rgba(255,0,60,.8)] transition-all duration-500"
		    style={{
		      width: `${item.percentage}%`,
		      backgroundColor: item.color,
		    }}
		  />
		</div>
	      </div>
	    ))}
	  </div>
	</div>

     <div
	  className="
	  lg:col-span-2
	  relative
	  overflow-hidden
	  rounded-3xl
	  border
	  border-red-500/20
	  bg-gradient-to-br
	  from-[#070707]
	  via-[#111111]
	  to-[#1a0008]
	  p-8
	  shadow-[0_0_30px_rgba(255,0,60,.18)]
	  hover:shadow-[0_0_70px_rgba(255,0,60,.35)]
	  transition-all
	  duration-500
	  before:absolute
	  before:top-0
	  before:left-[-130%]
	  before:h-full
	  before:w-[70%]
	  before:rotate-12
	  before:bg-gradient-to-r
	  before:from-transparent
	  before:via-red-500/15
	  before:to-transparent
	  before:duration-1000
	  hover:before:left-[140%]
	"
	>
	  <div className="relative z-10 flex items-center justify-between mb-6">
	    <h2
	      className="text-xl tracking-[0.15em] text-red-300 text-bold"
	      style={{ fontFamily: "Prata, serif" }}
	    >
	      Recent Orders
	    </h2>

	    <button className="text-red-400 hover:text-red-300">
	      View All
	    </button>
	  </div>

	  <table className="relative z-10 w-full text-red-100">
	    <thead className="border-b border-red-900 text-red-300">
	      <tr>
		<th className="py-3 text-left">Customer</th>
		<th className="text-left">Product</th>
		<th className="text-left">Amount</th>
		<th className="text-left">Status</th>
	      </tr>
	    </thead>

	    <tbody>
	      {dashboard.latestOrders.map((order) => (
		<tr
		  key={order._id}
		  className="border-b border-red-950 hover:bg-red-950/20 transition"
		>
		  <td className="py-4">
		    {order.address?.firstName} {order.address?.lastName}
		  </td>

		  <td>
		    {order.items?.length ? order.items[0].name : "-"}
		  </td>

		  <td>A$. {order.amount}</td>

		  <td>
		    <span
		      className={`rounded-full px-3 py-1 text-xs ${
		        order.status === "Delivered"
		          ? "bg-green-500/20 text-green-400"
		          : order.status === "Pending"
		          ? "bg-yellow-500/20 text-yellow-300"
		          : "bg-blue-500/20 text-blue-300"
		      }`}
		    >
		      {order.status}
		    </span>
		  </td>
		</tr>
	      ))}
	    </tbody>
	  </table>
	</div>

        {/* Latest Products */}

        <div   className="
	  relative
	  overflow-hidden
	  rounded-3xl
	  border
	  border-red-500/20
	  bg-gradient-to-br
	  from-[#070707]
	  via-[#101010]
	  to-[#1b0008]
	  p-8
	  shadow-[0_0_30px_rgba(255,0,60,.18)]
	  hover:shadow-[0_0_70px_rgba(255,0,60,.35)]
	  transition-all
	  duration-500
	">

          <h2
	  className="mb-8 text-xl tracking-[0.1em] text-red-300 text-extrabold"
	  style={{ fontFamily: "Prata, serif" }}
	>
            Latest Products
          </h2>

          <div className="space-y-5">

            {dashboard.latestProducts.map((product) => (

		<div
		key={product._id}
		className="flex items-center justify-between border-b border-red-900/30 pb-3"
		>

		<div>

		<p className="font-semibold text-red-100">
		{product.name}
		</p>

		<p className="text-xs text-red-400">

		A$. {product.price}

		</p>

		</div>

		<span
		className={`font-semibold ${
		product.bestseller
		? "text-green-600"
		: "text-gray-500"
		}`}
		>

		{product.bestseller ? "Best Seller" : "Active"}

		</span>

		</div>

		))}

          </div>

        </div>

      </div>

      {/* Last Row */}

      </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <>
      <ToastContainer />

      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="min-h-screen bg-[#050505] relative overflow-hidden">

          <Navbar setToken={setToken} />

          <div className="flex">

            <Sidebar />

            <main className="flex-1 p-6">

              <Routes>

                <Route path="/" element={<Dashboard />} />

                <Route
                  path="/add"
                  element={<Add token={token} />}
                />
                <Route
		  path="/list"
		  element={<List token={token} />}
		/>
		<Route
		  path="/edit/:id"
		  element={<Edit token={token} />}
		/>
                <Route
                  path="/orders"
                  element={<Orders token={token} />}
                />

                <Route
                  path="/stats"
                  element={<Stats />}
                />

                <Route
                  path="/settings"
                  element={<Settings />}
                />

              </Routes>

            </main>

          </div>

        </div>
      )}
    </>
  );
}

export default App;
