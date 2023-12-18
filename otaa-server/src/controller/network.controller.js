const Network = require("../model/network.model");
const Asset = require("./../model/asset.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { exec } = require("child_process");
const { PythonShell } = require("python-shell");
const assetsController = require("./asset.controller");

exports.getAllNetworkDetails = catchAsync(async (req, res, next) => {
  const pageSize = req.body.pageSize;
  const pageNumber = req.body.pageNumber;
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
const getAssetById = async (param) => {
  try {
    const { id, userId } = param;

    const pipeline = [
      { $match: { UserID: userId } },
      { $unwind: "$assets_summary" },
      { $match: { "assets_summary.Asset_ID": +id } },
      {
        $group: {
          _id: "$_id",
          UserID: { $first: "$UserID" },
          assets_summary: { $push: "$assets_summary" },
        },
      },
    ];
    const document = await Asset.aggregate(pipeline);
    return document[0].assets_summary[0];
  } catch (error) {
    console.log(`Error ocuured in NetworkController findAssetById ${err}`);
  }
};

exports.getNetworkForAssets = catchAsync(async (req, res, next) => {
  const { userId, pageNumber, pageSize } = req.body;
  const id = +req.body.id;
  const result = await getAssetById({ id, userId });
  if (result) {
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
          Total_Count: { $size: "$Network_Summary" },
        },
      },
    ];

    const doc = await Network.aggregate(pipeline);
    const document = doc[0];
    return res.status(200).json({ status: "success", data: document });
  } else {
    return res.status(200).json({ status: "success", data: "no data found" });
  }
});

// get network map details for corresponding Assets

exports.getNetworkMapForAssets = catchAsync(async (req, res, next) => {
  const { id, userId, pageNumber, pageSize } = req.body;
  // Find the asset by id and userId
  const result = await getAssetById({ id, userId });
  if (result) {
    // Construct the MongoDB aggregation pipeline
    const pipeline = [
      {
        $match: {
          UserID: userId,
          $or: [
            {
              "Network_Graph.nodes.id": result.IP,
            },
            {
              $or: [
                { "Network_Graph.edges.from": result.IP },
                { "Network_Graph.edges.to": result.IP },
              ],
            },
          ],
        },
      },
      {
        $project: {
          UserID: 1,
          Network_Graph: {
            nodes: {
              $filter: {
                input: "$Network_Graph.nodes",
                as: "node",
                cond: {
                  $eq: ["$$node.id", result.IP],
                },
              },
            },
            edges: {
              $filter: {
                input: "$Network_Graph.edges",
                as: "edge",
                cond: {
                  $or: [
                    { $eq: ["$$edge.from", result.IP] },
                    { $eq: ["$$edge.to", result.IP] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          UserID: 1,
          Network_Graph: {
            nodes: 1,
            edges: 1,
          },
        },
      },
      {
        $project: {
          UserID: 1,
          Network_Graph: {
            nodes: {
              $slice: ["$Network_Graph.nodes", pageSize * pageNumber, pageSize],
            },
            edges: {
              $slice: ["$Network_Graph.edges", pageSize * pageNumber, pageSize],
            },
          },
        },
      },
    ];

    // Execute the aggregation pipeline
    const documents = await Network.aggregate(pipeline);

    return res.status(200).json({ status: "success", data: documents });
  } else {
    return res.status(200).json({ status: "success", data: "no data found" });
  }
});
