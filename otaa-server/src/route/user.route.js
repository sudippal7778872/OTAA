const express = require("express");
const controller = require("../controller/user.controller");
const authController = require("./../controller/auth.controller");
const mailsend = require("../controller/email");

const Router = express();
const path = `/users`;

// before getting all user we are check user is login or not
/* 
before delete any user we will check user has authorise or not. admin and lead-guide has 
access to delete any tour.
*/
Router.get(`${path}`, controller.getAllUser);
Router.get(`${path}/:id`, controller.getUser);
Router.post(`${path}`, controller.createUser);
Router.post(`${path}/signup`, authController.signup);
Router.post(`${path}/login`, authController.login);
Router.put(`${path}/:id`, controller.updateOneUser);
Router.delete(
  `${path}/:id`,
  authController.protect,
  authController.restrictTo("admin", "lead-guide"),
  controller.deleteOneUser
);
Router.post(`${path}/forgetpassword`, authController.forgetPassword);
Router.patch(`${path}/resetpassword/:token`, authController.resetPassword);
Router.patch(
  `${path}/updatepassword`,
  authController.protect,
  authController.updatePassword
);
Router.patch(`${path}/updateme`, authController.protect, controller.updateMe);
// Router.get(`${path}/sendmail/h`, mailsend.mail)
// user want to delete his account. we will inactive his account wont delete
Router.delete(
  `${path}/deleteme/inactive`,
  authController.protect,
  controller.deleteMe
);

module.exports = Router;
