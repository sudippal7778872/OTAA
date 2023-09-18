const mongoose = require("mongoose");

const eventDetailSchema = new mongoose.Schema({
  Timestamp: {
    type: String,
    default: "-",
  },
  Source: {
    type: String,
    default: "-",
  },
  Destination: {
    type: String,
    default: "-",
  },
  Transport_Layer_Protocol: {
    type: String,
    default: "-",
  },
  Source_Port: {
    type: String,
    default: "-",
  },
  Destination_Port: {
    type: String,
    default: "-",
  },
  Event_Detected: {
    type: String,
    default: "-",
  },
});

const eventSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },
  events: {
    type: [eventDetailSchema],
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
  },
  UpdatedBy: {
    type: String,
  },
});

const eventPlaylist = new mongoose.model("event", eventSchema);

module.exports = eventPlaylist;
