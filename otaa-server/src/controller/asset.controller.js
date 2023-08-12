const Asset = require("./../model/asset.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { exec } = require("child_process");
// const { spawn } = require('child_process');
const { PythonShell } = require("python-shell");

exports.getAllAssets = catchAsync(async (req, res, next) => {
  const document = await Asset.find();
  if (!document) {
    return next(appError("No Document found", 404));
  }
  res.status(200).json({ status: "success", data: document });
});

const executeScript = async (userId, fileNamePath) => {
  try {
    let options = {
      mode: "json",
      pythonPath: "/bin/python3",
      pythonOptions: ["-u"], // get print results in real-time
      scriptPath: "./src/scripts/",
      args: [fileNamePath, userId],
    };

    const result = await PythonShell.run("read_pk.py", options);
    // results is an array consisting of messages collected during execution
    // console.log("results: %j", result);
    return result;
  } catch (err) {
    console.log("error occured");
  }
};

exports.createAsset = catchAsync(async (req, res, next) => {
  // console.log("response", req.body);
  const { userId, fileNamePath } = req.body;
  const result = await executeScript(userId, fileNamePath);
  // console.log("here result is",result)
  const document = await Asset.insertMany(result[0]);
  return res.status(200).json({
    status: "success",
    data: document,
  });
});

exports.getAssetsForDashboard = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  if (Object.keys(req.query).length !== 0) {
    if (req.query.pageSize != undefined && req.query.pageSize != "") {
      pageSize = parseInt(req.query.pageSize) || 25;
    }
    if (req.query.pageNumber != undefined && req.query.pageNumber != "") {
      pageNumber = parseInt(req.query.pageNumber) || 1;
    }
  }
  let skip = (pageNumber - 1) * pageSize;
  const allAssets = await Asset.find({ userId: userId });
  const document = await Asset.find({ userId: userId })
    .skip(skip)
    .limit(pageSize);
  if (!document) {
    return next(appError("No Document found", 404));
  }
  return res
    .status(200)
    .json({ status: "success", data: document, total: allAssets.length });
});
