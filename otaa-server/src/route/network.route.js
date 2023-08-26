const express = require("express");
const networkController = require("./../controller/network.controller");

const Router = express.Router();
const path = "/networks";

Router.get(`${path}`, networkController.getAllNetworkDetails);

module.exports = Router;
