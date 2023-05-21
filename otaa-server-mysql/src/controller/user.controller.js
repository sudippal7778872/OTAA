const db = require("../model");
const User = db.user;

exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((result) => {
      return res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      console.log("error", err.message);
    });
};
