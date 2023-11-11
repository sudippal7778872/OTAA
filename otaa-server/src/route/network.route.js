const express = require("express");
const networkController = require("./../controller/network.controller");

const Router = express.Router();
const path = "/networks";

Router.post(`${path}`, networkController.getAllNetworkDetails);
Router.post(`${path}/graph`, networkController.getNetworkGraphDetailsById);
Router.post(
  `${path}/network-semmery-for-assets`,
  networkController.getNetworkForAssets
);
Router.post(
  `${path}/network-map-summery-for-assets`,
  networkController.getNetworkMapForAssets
);

Router.delete(`${path}`, networkController.deleteNetworkCollection);

module.exports = Router;
