const mongoose = require("mongoose");

const conversionSchema = new mongoose.Schema({
  Timestamp: {
    type: Date,
  },
  Source: {
    type: String,
  },
  Destination: {
    type: String,
  },
  Protocol: {
    type: String,
  },
  SourcePort: {
    type: String,
  },
  DestinationPort: {
    type: String,
  },
});

const networkSchema = new mongoose.Schema({
  DeviceA: {
    type: String,
    default: "-",
  },
  DeviceB: {
    type: String,
    default: "-",
  },
  FirstSeenDate: {
    type: Date,
    // default: Date.now(),
  },
  LastSeenDate: {
    type: Date,
    // default: Date.now(),
  },
  TotalBandwidth: {
    type: String,
  },
  Protocol: {
    type: String,
    default: "-",
  },
  Port: {
    type: String,
    default: "-",
  },
  Conversation: {
    type: [conversionSchema],
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: String,
    required: [true, "User id is required"],
  },
  UpdatedAt: {
    type: Date,
  },
  UpdatedBy: {
    type: String,
  },
});

const networkPlaylist = new mongoose.model("network", networkSchema);

module.exports = networkPlaylist;
