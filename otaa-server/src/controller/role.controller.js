const Role = require("../model/role.model");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllRoles = catchAsync(async (req, res, next) => {
  const result = await Role.find();
  if (!result) {
    return next(appError("No Document fount", 404));
  }
  res.status(200).json({ status: "success", data: result });
});
