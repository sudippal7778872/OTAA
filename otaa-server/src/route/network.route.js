const express = require("express");
const networkController = require("./../controller/network.controller");

const Router = express.Router();
const path = "/networks";

Router.post(`${path}`, networkController.getAllNetworkDetails);
Router.post(`${path}/graph`, networkController.getNetworkGraphDetailsById);
Router.delete(`${path}`, networkController.deleteNetworkCollection);

module.exports = Router;
