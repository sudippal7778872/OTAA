const mongoose = require("mongoose");
const validator = require("validator");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, `First name can't be blank`],
  },
  lastname: {
    type: String,
    required: [true, `Last Name cant be blank`],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid Email"],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    // enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "password must contain 8 or above letter or number"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "password is required"],
    validate: {
      //this is only work with save(). not on update or find
      validator: function (element) {
        return element === this.password;
      },
      message: "password is not matching",
    },
  },
  passwordChnageAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});

//confirm password double check
userSchema.pre("save", function (next) {
  if (this.password !== this.confirmPassword) {
    return next(new appError("confirm password does not match", 404));
  }
  next();
});

/*
we are going to hash only in case of save and update. in case if we update some other field
the we dont send password to backend. that's why we use isModified()
*/
//hasing password.
userSchema.pre("save", async function (next) {
  // this function will call only if password is modified
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; // deleting because no more require
});

// if password reset then change the  passwordChnageAt field
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  // adding 1 sec sometime token genereate early so login issue occure thats why we added sec.
  this.passwordChnageAt = Date.now() - 1000;
  next();
});

//show only those user which active. using query middleware.
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

//comapre password using bcrypt.compare() and creating instance method of userSchema.
userSchema.methods.comparePassword = async function (
  candidateEnterPassword,
  actualPassword
) {
  return await bcrypt.compare(candidateEnterPassword, actualPassword);
};

//check password is changeed or not after JWT token issues
userSchema.methods.changePasswordAfter = function (jwtTimeStamp) {
  //this refer current document. date in in different format we need to convert it into second format
  if (this.passwordChnageAt) {
    //convert the time into milisecond and then /1000 to make it second then parseInt base 10.
    const lastChangePasswordTime = parseInt(
      this.passwordChnageAt.getTime() / 1000,
      10
    );
    // console.log(jwtTimeStamp, lastChangePasswordTime);
    return jwtTimeStamp < lastChangePasswordTime;
  }
  // false mean password didn't change
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log("password reset token", resetToken, this.passwordResetToken);
  // 10 minutes to token expires
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

//create model
const userPlaylist = new mongoose.model("user", userSchema);

module.exports = userPlaylist;
