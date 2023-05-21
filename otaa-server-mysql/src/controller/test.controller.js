const db = require("../model");
const Test = db.test;

exports.getAllTests = (req, res) => {
  Test.findAll()
    .then((result) => {
      //   console.log(result);
      return res.status(200).json({
        status: "success",
        data: result[0],
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "failed",
        error: err.message,
      });
    });
};
