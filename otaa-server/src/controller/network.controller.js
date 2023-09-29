const Network = require("../model/network.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { exec } = require("child_process");
const { PythonShell } = require("python-shell");

exports.getAllNetworkDetails = catchAsync(async (req, res, next) => {
  const pageSize = req.body.pageSize;
  const pageNumber = req.body.pageNumber;
  console.log("body is ", req.body);
  // const projection = {
  //   _id: 0,
  //   Network_Graph: 0,
  //   Network_Summary: {
  //     $slice: [pageSize * (pageNumber - 1), pageSize],
  //   }
  // };
  const query = { UserID: req.body.userId };
  const pipeline = [
    { $match: query }, // Filter documents with userId: 1
    {
      $project: {
        Network_Summary: {
          $slice: ["$Network_Summary", pageSize * pageNumber, pageSize],
        }, // Select the first 4 objects
        Total_Count: { $size: "$Network_Summary" }, // Calculate the total count of objects in network_summary
      },
    },
  ];

  const doc = await Network.aggregate(pipeline);
  const document = doc[0];

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

exports.deleteNetworkCollection = catchAsync(async (req, res, next) => {
  const result = await Network.deleteMany();
  if (!result) {
    return next(appError("No Document found", 404));
  }
  return res.status(200).json({ status: "success", data: result });
});
