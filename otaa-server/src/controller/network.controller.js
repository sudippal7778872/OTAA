const Network = require("../model/network.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { exec } = require("child_process");
const { PythonShell } = require("python-shell");

exports.getAllNetworkDetails = catchAsync(async (req, res, next) => {
  // console.log("body is", req.body);
  const document = await Network.find({ UserID: req.body.userId });
  if (!document) {
    return next(appError("No Document found", 404));
  }
  res.status(200).json({ status: "success", data: document });
});

exports.getNetworkGraphDetailsById = catchAsync(async (req, res, next) => {
  const document = await Network.find({ UserID: req.body.userId });
  const graphDocument = await document[0].Network_Graph;
  // console.log(document[0].Network_Graph);
  if (!document) {
    return next(appError("No Document found", 404));
  }
  res.status(200).json({ status: "success", data: graphDocument });
});
