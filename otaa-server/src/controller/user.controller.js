const User = require("../model/user.model");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError")

exports.getAllUser = catchAsync(async (req, res, next) => {
  const result = await User.find();
  if (!result) {
    return next(new appError("There is no document with is id", 404));
  }
  res.status(200).json({ status: "success", data: result });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const result = await User.find({ _id: req.params.id });
  if (!result) {
    return next(new appError("There is no document with is id", 404));
  }
  res.status(200).json({ status: "success", data: result });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const result = await User.create(req.body);
  res.status(200).json({ status: "success", data: result });
});

exports.updateOneUser = catchAsync(async (req, res, next) => {
  const result = await User.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!result) {
    return next(new appError("There is no document with is id", 404));
  }
  res.status(200).json({ status: "success", data: result });
});

// completely delete any user by admin
exports.deleteOneUser = catchAsync(async (req, res, next) => {
  const result = await User.findByIdAndDelete(req.params.id);
  if (!result) {
    return next(new appError("There is no document with is id", 404));
  }
  res.status(200).json({ status: "success", data: result });
});

const filterObj = (obj, ...filterField) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (filterField.includes(el)) {
      newObj[el] = obj[el]
    }
  })
  return newObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. check POST data contain passord or confirm password.
  if (req.body.password || req.body.confirmPassword) {
    return next(new appError("This route is not for update password. use Update password", 400));
  }
  // 2. filtered out unwanted field or exclude like role and other.
  // so for that we have to filter the req.body object.
  const filterObject = filterObj(req.body, 'name', 'email')

  // 3. update user
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterObject, {
    runValidators: true,
    new: true,
  })
  return res.status(200).json({
    status: "success",
    data: {
      updateUser
    }
  })
})

// user want to delete his account. we will inactive his account wont delete
exports.deleteMe = catchAsync(async (req, res, next) => {
  const deleteUser = await User.findByIdAndUpdate(req.user.id, { active: false })

  return res.status(200).json({
    status: "success",
    data: {
      deleteUser
    }
  })
})