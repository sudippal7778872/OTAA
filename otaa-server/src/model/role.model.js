const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Role can't be blank`],
  },
  CreatedAt: {
    type: Date,
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

const rolePlaylist = new mongoose.model("role", roleSchema);

module.exports = rolePlaylist;
