import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    ip: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "Unknown",
    },

    countryCode: {
      type: String,
      default: "XX",
    },

    city: {
      type: String,
      default: "",
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Visitor =
  mongoose.models.Visitor ||
  mongoose.model("Visitor", visitorSchema);

export default Visitor;
