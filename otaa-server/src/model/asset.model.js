// const mongoose = require("mongoose");

// const vunerabilitySchema = new mongoose.Schema({
//   Advisory_No: {
//     type: String,
//   },
//   Advisory_Links: {
//     type: [String],
//   },
//   Title: {
//     type: String,
//   },
//   Manufacturer: {
//     type: String,
//   },
//   Type: {
//     type: String,
//   },
// });

// const assetSchema = new mongoose.Schema({
//   Vendor_ID: {
//     type: String,
//     default: "-",
//   },
//   Device_Type: {
//     type: String,
//     default: "-",
//   },
//   Product_Name: {
//     type: String,
//     default: "-",
//   },
//   Version: {
//     type: String,
//     default: "-",
//   },
//   Serial_Number: {
//     type: String,
//     default: "-",
//   },
//   IP: {
//     type: String,
//     default: "-",
//   },
//   Mac: {
//     type: String,
//     default: "-",
//   },
//   System_Name: {
//     type: String,
//     default: "-",
//   },
//   System_Description: {
//     type: String,
//     default: "-",
//   },
//   Module_Number: {
//     type: String,
//     default: "-",
//   },
//   CPU_Type: {
//     type: String,
//     default: "-",
//   },
//   Addtional_Component: {
//     type: String,
//     default: "-",
//   },
//   Vulnerabilitiy: {
//     type: [vunerabilitySchema],
//   },

//   CreatedAt: {
//     type: Date,
//     default: Date.now(),
//   },
//   userId: {
//     type: String,
//     required: [true, "User id is required"],
//   },
//   UpdatedAt: {
//     type: Date,
//   },
//   UpdatedBy: {
//     type: String,
//   },
// });

// const assetPlaylist = new mongoose.model("asset", assetSchema);

// module.exports = assetPlaylist;
const mongoose = require("mongoose");

const vulnerabilitySchema = new mongoose.Schema({
  Advisory_No: {
    type: String,
    default: "-",
  },
  Advisory_Link: {
    type: [String],
    default: "-",
  },
  Title: {
    type: String,
    default: "-",
  },
  Manufacturer: {
    type: String,
    default: "-",
  },
  Type: {
    type: String,
    default: "-",
  },
});

const vulnerabilitySummerySchema = new mongoose.Schema({
  Advisory_No: {
    type: String,
    default: "-",
  },

  Title: {
    type: String,
    default: "-",
  },

  Type: {
    type: String,
    default: "-",
  },
  Asset_MAC: {
    type: String,
    default: "-",
  },
  Asset_IP: {
    type: String,
    default: "-",
  },
});

const assetSummerySchema = new mongoose.Schema({
  Vendor_ID: {
    type: String,
    default: "-",
  },
  Device_Type: {
    type: String,
    default: "-",
  },
  Product_Name: {
    type: String,
    default: "-",
  },
  Version: {
    type: String,
    default: "-",
  },
  Serial_Number: {
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
  Vulnerability: {
    type: [vulnerabilitySchema],
  },
  System_Name: {
    type: String,
    default: "-",
  },
  System_Description: {
    type: String,
    default: "-",
  },
  Module_Number: {
    type: String,
    default: "-",
  },
  CPU_Type: {
    type: String,
    default: "-",
  },
  Addtional_Component: {
    type: String,
    default: "-",
  },
});

const assetSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: [true, "User id is required"],
  },
  Asset_Summery: {
    type: [assetSummerySchema],
  },
  Vulnerability_Summery: {
    type: [vulnerabilitySummerySchema],
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

const assetPlaylist = new mongoose.model("asset", assetSchema);

module.exports = assetPlaylist;
