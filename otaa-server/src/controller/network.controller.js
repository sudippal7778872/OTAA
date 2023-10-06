const Network = require("../model/network.model");
const Asset = require("./../model/asset.model");
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
  const document = await Network.find(
    { UserID: req.body.userId },
    { Network_Graph: 1 }
  );
  // console.log(document[0].Network_Graph);
  if (!document) {
    return next(appError("No Document found", 404));
  }
  res.status(200).json({ status: "success", data: document[0] });
});

exports.deleteNetworkCollection = catchAsync(async (req, res, next) => {
  const result = await Network.deleteMany();
  if (!result) {
    return next(appError("No Document found", 404));
  }
  return res.status(200).json({ status: "success", data: result });
});

//get network for specific Assets by assets id
const findAssetById = async (param) => {
  try {
    const { id, userId } = param;
    const result = await Asset.findOne({ _id: id, userId });
    return result;
  } catch (err) {
    console.log(`Error ocuured in NetworkController findAssetById ${err}`);
  }
};

exports.getNetworkForAssets = catchAsync(async (req, res, next) => {
  console.log("body is", req.body);
  const { id, userId, pageNumber, pageSize } = req.body;
  const result = await findAssetById({ id, userId });
  if (result) {
    console.log("result is", result.IP);
    const query = {
      UserID: userId,
      $or: [
        { "Network_Summary.Device_A": result.IP },
        { "Network_Summary.Device_B": result.IP },
      ],
    };
    const pipeline = [
      {
        $match: {
          UserID: userId,
          $or: [
            { "Network_Summary.Device_A": result.IP },
            { "Network_Summary.Device_B": result.IP },
          ],
        },
      },
      {
        $project: {
          UserID: 1,
          Network_Summary: {
            $filter: {
              input: "$Network_Summary",
              as: "summary",
              cond: {
                $or: [
                  { $eq: ["$$summary.Device_A", result.IP] },
                  { $eq: ["$$summary.Device_B", result.IP] },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          UserID: 1,
          Network_Summary: {
            $slice: ["$Network_Summary", pageSize * pageNumber, pageSize],
          }, // Slice the first 5 objects
        },
      },
    ];

    const document = await Network.aggregate(pipeline);
    return res.status(200).json({ status: "success", data: document });
  } else {
    return res.status(200).json({ status: "success", data: "no data found" });
  }
});
