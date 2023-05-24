const User = require("../model/user.model");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const sendMail = require("../controller/email");
const crypto = require("crypto");

//generate token
const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};

//create and send token
const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  //SEND TOKEN THROUGH COOKIES
  /* here we are using all http not https so secure true will not work here. so in production we will use secure: true  */
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOption.secure = true;
  }

  res.cookie("jwt", token, cookieOption);

  // remove password field from response
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    data: user,
    token,
  });
};

//check user exists

//signup
exports.signup = catchAsync(async (req, res, next) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
  });
  //generate token. we will pass payload and secret. header will automatically created by jwt.
  // 1s,1m,1h,1d this way we can specify expires time.

  createSendToken(newUser, 200, res);
});

//login
exports.login = catchAsync(async (req, res, next) => {
  //1. check email and password exist or not
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("email or password is not exists", 400));
  }
  //2. check email and password match with any user or not.
  const userMatch = await User.findOne({ email: email }).select("+password");
  if (!userMatch) {
    return res
      .status(401)
      .json({ status: "failed", message: "User not Exists" });
  }
  if (
    !userMatch ||
    !(await userMatch.comparePassword(password, userMatch.password))
  ) {
    return res
      .status(401)
      .json({ status: "failed", message: "Incorrect email or password" });
  }

  //3. if everything is ok then create token and send to client
  userMatch.password = undefined;
  const token = generateToken(userMatch._id);
  res.status(200).json({
    status: "success",
    token,
    data: userMatch,
    message: "user match",
  });
});

/*
how to know the other route like getAllUser,or update, delete they are authorized or not
means they are login or not.
solution: create a fuction to check the autorization and add it as a middleware before route.
check the below code
*/

exports.protect = catchAsync(async (req, res, next) => {
  //1. check the token is there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new appError("you're not logged in.login to access", 401));
  }
  //2. verification of token
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decode);
  //3. check user still exist or not. suppose user deleted but token is still existing
  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(
      new appError("This is user is no more exist. Please signup again", 401)
    );
  }
  //4. user modified the password after token was issued.
  if (freshUser.changePasswordAfter(decode.iat)) {
    return next(new appError("Password has been changed. Please login Again"));
  }

  // Grant accesss to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You dont have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //1. check the user exists or not
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError("Email id does not exists", 404));
  }

  //2. generate random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3. send mail
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}}`;
  const message = `Forgot your password? Submit a PATCH request with your new Password and confirm password to ${resetUrl}. \nIf you didn't forgot your password, please ignore this email!`;
  try {
    await sendMail.sendMail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    return res.status(200).json({
      status: "success",
      message: "token sent to mail",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new appError("error in sending mail. try again later", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1. get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2. If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new appError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3. Update changedPassword property for the user

  //4. Log the user in, send JWT
  const token = generateToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    message: "user match",
  });
});

// before change password user have to confirm old password else anyone can change it.

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. get the user from collection
  const user = await User.findById(req.user.id).select("+password");

  //2. Check the POSTed current password is correct or not
  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new appError("current password is not match", 401));
  }
  //3. If so, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  //4. Log user in, send JWT
  createSendToken(user, 200, res);
});
