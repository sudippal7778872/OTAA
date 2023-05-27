const express = require("express");
const controller = require("./../controller/asset.controller");

const Router = express.Router();
const path = "/assets";

Router.get(`${path}`, controller.getAllAssets);
Router.post(`${path}`, controller.createAsset);

module.exports = Router;
