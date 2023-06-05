const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  
  "Vendor Id": {
    type: String,
    default: "-",
  },
  "Device Type": {
    type: String,
    default: "-",
  },
  "Product Name": {
    type: String,
    default: "-",
  },
  "Firmware Version": {
    type: String,
    default: "-",
  },
  "Serial Number": {
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
  "System Name": {
    type: String,
    default: "-",
  },
  "System Description": {
    type: String,
    default: "-",
  },
  "Module Number": {
    type: String,
    default: "-",
  },
  "CPU Type": {
    type: String,
    default: "-",
  },
  "Addtional Component": {
    type: String,
    default: "-",
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  userId:{
    type: String,
    required:[true, "User id is required"],
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
