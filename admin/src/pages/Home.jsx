import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Converts an ISO country code ("PK", "AU") into its flag emoji (🇵🇰, 🇦🇺)
const countryCodeToFlag = (code) => {
  if (!code || code === "XX") return "🏳️";

  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
};

const Home = () => {
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTraffic();

    // Refresh every 15 seconds for a "live" feel
    const interval = setInterval(loadTraffic, 15000);

    return () => clearInterval(interval);
  }, []);

  const liveByCountry = traffic?.liveByCountry || [];
  const maxCount = liveByCountry[0]?.count || 1;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome 👋</h1>
      <p className="text-gray-500 mt-2">
        Gurav Drip District Admin Dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">Products</h2>
          <h1 className="text-3xl font-bold mt-2">--</h1>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">Orders</h2>
          <h1 className="text-3xl font-bold mt-2">--</h1>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">Revenue</h2>
          <h1 className="text-3xl font-bold mt-2">₹0</h1>
        </div>

      </div>

      {/* ================= LIVE TRAFFIC ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">Live Visitors</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <h1 className="text-3xl font-bold">
              {loading ? "--" : traffic?.liveVisitors ?? 0}
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">Active in the last 5 minutes</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">Today's Visitors</h2>
          <h1 className="text-3xl font-bold mt-2">
            {loading ? "--" : traffic?.todayVisitors ?? 0}
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500">This Week</h2>
          <h1 className="text-3xl font-bold mt-2">
            {loading ? "--" : traffic?.weekVisitors ?? 0}
          </h1>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Live Traffic by Country</h2>
          <span className="text-xs text-gray-400">Auto-refreshes every 15s</span>
        </div>

        {loading ? (

          <p className="text-gray-400 text-sm">Loading traffic data...</p>

        ) : liveByCountry.length === 0 ? (

          <p className="text-gray-400 text-sm">
            No active visitors right now. Check back once someone's browsing the site.
          </p>

        ) : (

          <div className="space-y-4">
            {liveByCountry.map((row) => (
              <div key={row.countryCode} className="flex items-center gap-4">

                <span className="text-2xl w-8 text-center">
                  {countryCodeToFlag(row.countryCode)}
                </span>

                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{row.country}</span>
                    <span className="text-gray-500">{row.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#B9572C] h-2 rounded-full transition-all"
                      style={{
                        width: `${(row.count / maxCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        )}

      </div>

    </div>
  );
};

export default Home;
