const Event = require("./../model/event.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllEventById = catchAsync(async (req, res, next) => {
  // console.log("req",req.body)
  const document = await Event.find({ UserID: req.body.userId }).limit(1);
  // console.log("doc is",document)
  if (!document) {
    return next(appError("No Document found", 404));
  }
  res.status(200).json({ status: "success", data: document });
});

exports.deleteAllEvents = catchAsync(async (req, res, next) => {
  const document = await Event.deleteMany();
  if (!document) {
    return next(appError("No Document found", 404));
  }
  res.status(200).json({ status: "success", data: document });
});
