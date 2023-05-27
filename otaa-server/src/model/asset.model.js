const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  VendorId: {
    type: String,
    default: "-",
  },
  DeviceType: {
    type: String,
    default: "-",
  },
  ProductName: {
    type: String,
    default: "-",
  },
  FirmwareVersion: {
    type: String,
    default: "-",
  },
  SerialNumber: {
    type: String,
    default: "-",
  },
  IP: {
    type: String,
    default: "-",
  },
  Mac: {
    type: String,
    default: "-",
  },
  SystemName: {
    type: String,
    default: "-",
  },
  SystemDescription: {
    type: String,
    default: "-",
  },
  ModuleNumber: {
    type: String,
    default: "-",
  },
  CPUType: {
    type: String,
    default: "-",
  },
  AddtionalComponent: {
    type: String,
    default: "-",
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  CreatedBy: {
    type: String,
    required: [true, "User Id is Required"],
  },
  UpdatedAt: {
    type: Date,
  },
  UpdatedBy: {
    type: String,
  },
});

const assetPlaylist = new mongoose.model("asset", assetSchema);

module.exports = assetPlaylist;
