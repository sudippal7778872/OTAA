const controller = require("../controller/role.controller");
const express = require("express");

const Router = express();
const path = "/roles";

Router.get(`${path}`, controller.getAllRoles);

module.exports = Router;
