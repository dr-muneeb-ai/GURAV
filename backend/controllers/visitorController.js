import geoip from "geoip-lite";
import Visitor from "../models/Visitor.js";

// ================= Helpers =================

// Pull the real client IP, accounting for proxies/load balancers.
// Requires `app.set("trust proxy", true)` in server.js for X-Forwarded-For
// to be trusted correctly in production.
const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];

  let ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress;

  // Normalize IPv4-mapped IPv6 addresses like "::ffff:203.0.113.5"
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  return ip || "";
};

const lookupLocation = (ip) => {
  // geoip-lite can't resolve localhost / private IPs (normal in local dev)
  if (
    !ip ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  ) {
    return { country: "Unknown", countryCode: "XX", city: "" };
  }

  const geo = geoip.lookup(ip);

  if (!geo) {
    return { country: "Unknown", countryCode: "XX", city: "" };
  }

  return {
    country: regionNames.of(geo.country) || geo.country,
    countryCode: geo.country,
    city: geo.city || "",
  };
};

// Converts ISO country codes ("AU", "US") to full names ("Australia", "United States")
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

// ================= Track Visitor =================

const trackVisitor = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const ip = getClientIp(req);
    const { country, countryCode, city } = lookupLocation(ip);

    let visitor = await Visitor.findOne({ sessionId });

    if (visitor) {
      visitor.lastActive = new Date();
      // Refresh location in case the visitor moved networks (VPN, mobile data, etc.)
      visitor.ip = ip;
      visitor.country = country;
      visitor.countryCode = countryCode;
      visitor.city = city;
      await visitor.save();
    } else {
      await Visitor.create({
        sessionId,
        ip,
        country,
        countryCode,
        city,
      });
    }

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= Visitor Statistics =================

const visitorStats = async (req, res) => {
  try {

    const totalVisitors = await Visitor.countDocuments();

    const liveWindow = new Date(Date.now() - 5 * 60 * 1000);

    const liveVisitors = await Visitor.countDocuments({
      lastActive: { $gte: liveWindow },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayVisitors = await Visitor.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    const weekVisitors = await Visitor.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    const monthVisitors = await Visitor.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    // ================= Country breakdown - live visitors (last 5 min) =================

    const liveByCountry = await Visitor.aggregate([
      { $match: { lastActive: { $gte: liveWindow } } },
      {
        $group: {
          _id: { country: "$country", countryCode: "$countryCode" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // ================= Country breakdown - all-time =================

    const totalByCountry = await Visitor.aggregate([
      {
        $group: {
          _id: { country: "$country", countryCode: "$countryCode" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const formatCountryBreakdown = (rows) =>
      rows.map((row) => ({
        country: row._id.country,
        countryCode: row._id.countryCode,
        count: row.count,
      }));

    res.json({
      success: true,
      traffic: {
        totalVisitors,
        liveVisitors,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        liveByCountry: formatCountryBreakdown(liveByCountry),
        totalByCountry: formatCountryBreakdown(totalByCountry),
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export {
  trackVisitor,
  visitorStats,
};
