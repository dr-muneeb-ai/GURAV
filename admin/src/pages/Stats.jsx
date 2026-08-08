import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

// Converts an ISO country code ("PK", "AU") into its flag emoji (🇵🇰, 🇦🇺)
const countryCodeToFlag = (code) => {
  if (!code || code === "XX") return "🏳️";

  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
};

// ================= Small Building Blocks =================

const OverviewNumber = ({ label, value, loading }) => (
  <div className="flex flex-col">
    <span
      className="text-xs uppercase tracking-[0.2em] text-red-400"
      style={{ fontFamily: "Prata, serif" }}
    >
      {label}
    </span>
    <span className="text-2xl font-bold text-white mt-1">
      {loading ? "—" : value}
    </span>
  </div>
);

const CountryRow = ({ row, maxCount }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-red-950/50 last:border-b-0">
    <span className="text-xl w-7 text-center shrink-0">
      {countryCodeToFlag(row.countryCode)}
    </span>

    <span className="text-sm text-red-100 flex-1 truncate">
      {row.country}
    </span>

    <div className="w-28 h-1.5 bg-black/40 rounded-full overflow-hidden hidden sm:block">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#8B0000] via-[#DC143C] to-[#FF1744] shadow-[0_0_10px_rgba(220,20,60,.6)]"
        style={{ width: `${(row.count / maxCount) * 100}%` }}
      ></div>
    </div>

    <span className="text-sm font-semibold text-red-300 w-8 text-right">
      {row.count}
    </span>
  </div>
);

const AudiencePanel = ({ title, rows, loading, emptyText }) => {
  const maxCount = rows[0]?.count || 1;

  return (
    <div className="card-shine relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-[0_0_30px_rgba(255,0,0,0.15)] hover:shadow-[0_0_50px_rgba(255,0,0,0.35)] transition-all duration-500">
      <h3
        className="text-sm uppercase tracking-[0.2em] text-red-300"
        style={{ fontFamily: "Prata, serif" }}
      >
        {title}
      </h3>

      <div className="mt-4">
        {loading ? (
          <p className="text-gray-500 text-sm py-4">Loading...</p>
        ) : rows.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">{emptyText}</p>
        ) : (
          rows.map((row) => (
            <CountryRow key={row.countryCode} row={row} maxCount={maxCount} />
          ))
        )}
      </div>
    </div>
  );
};

// ================= Main Page =================

const Stats = () => {
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("live"); // "live" | "alltime"

  const loadTraffic = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/visitor/stats");

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

  const activeRows =
    tab === "live"
      ? traffic?.liveByCountry || []
      : traffic?.totalByCountry || [];

  return (
    <div className="space-y-8">

      {/* Heading */}

      <div>
        <h1
          className="text-4xl font-semibold text-white"
          style={{ fontFamily: "Prata, serif" }}
        >
          Live Stats
        </h1>

        <p className="text-gray-500 mt-2">
          Real-time visitor and audience analytics
        </p>
      </div>

      {/* ================= NOW STRIP ================= */}

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
      "
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-8">

          <div className="flex items-center gap-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>

            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] text-red-400"
                style={{ fontFamily: "Prata, serif" }}
              >
                Now
              </p>
              <p className="text-4xl font-bold leading-tight text-white">
                {loading ? "—" : traffic?.liveVisitors ?? 0}
                <span className="text-base font-normal text-gray-500 ml-2">
                  viewers
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 sm:ml-auto">
            <OverviewNumber label="Today" value={traffic?.todayVisitors ?? 0} loading={loading} />
            <OverviewNumber label="This Week" value={traffic?.weekVisitors ?? 0} loading={loading} />
            <OverviewNumber label="This Month" value={traffic?.monthVisitors ?? 0} loading={loading} />
            <OverviewNumber label="All Time" value={traffic?.totalVisitors ?? 0} loading={loading} />
          </div>

        </div>
      </div>

      {/* ================= AUDIENCE ================= */}

      <div>

        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-xl tracking-[0.1em] text-red-300"
            style={{ fontFamily: "Prata, serif" }}
          >
            Audience by Country
          </h2>

          <div className="flex bg-black/30 border border-red-500/20 rounded-xl p-1">
            <button
              onClick={() => setTab("live")}
              style={{ fontFamily: "Prata, serif" }}
              className={`px-4 py-2 text-xs font-bold tracking-[0.05em] rounded-lg transition-all duration-300 ${
                tab === "live"
                  ? "bg-gradient-to-r from-[#8B0000] via-[#DC143C] to-[#FF1744] text-white shadow-[0_0_20px_rgba(220,20,60,.45)]"
                  : "text-gray-400 hover:text-red-300"
              }`}
            >
              LIVE NOW
            </button>
            <button
              onClick={() => setTab("alltime")}
              style={{ fontFamily: "Prata, serif" }}
              className={`px-4 py-2 text-xs font-bold tracking-[0.05em] rounded-lg transition-all duration-300 ${
                tab === "alltime"
                  ? "bg-gradient-to-r from-[#8B0000] via-[#DC143C] to-[#FF1744] text-white shadow-[0_0_20px_rgba(220,20,60,.45)]"
                  : "text-gray-400 hover:text-red-300"
              }`}
            >
              ALL TIME
            </button>
          </div>
        </div>

        <AudiencePanel
          title={tab === "live" ? "Live Traffic by Country" : "All-Time Traffic by Country"}
          rows={activeRows}
          loading={loading}
          emptyText={
            tab === "live"
              ? "No active visitors right now."
              : "No visitor data yet."
          }
        />

      </div>

    </div>
  );
};

export default Stats;
