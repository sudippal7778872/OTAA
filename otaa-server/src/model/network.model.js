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
  Source_Port: {
    type: String,
  },
  Destination_Port: {
    type: String,
  },
});

const networkSummerySchema = new mongoose.Schema({
  Device_A: {
    type: String,
    default: "-",
  },
  Device_B: {
    type: String,
    default: "-",
  },
  First_Seen_Date: {
    type: Date,
  },
  Last_Seen_Date: {
    type: Date,
  },
  Total_Bandwidth: {
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
});

const graphSchema = new mongoose.Schema({
  directed: {
    type: Boolean,
  },
  multigraph: {
    type: Boolean,
  },
  graph: {
    type: Object,
  },
  nodes: {
    type: [
      {
        id: String,
        label: String,
      },
    ],
  },
  edges: {
    type: [
      {
        from: String,
        to: String,
      },
    ],
  },
});

const networkSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: [true, "User id is required"],
  },
  Network_Summary: {
    type: [networkSummerySchema],
  },
  Network_Graph: {
    type: [graphSchema],
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
  },
  CreatedBy: {
    type: String,
  },
  UpdatedBy: {
    type: String,
  },
});

const networkPlaylist = new mongoose.model("network", networkSchema);

module.exports = networkPlaylist;
