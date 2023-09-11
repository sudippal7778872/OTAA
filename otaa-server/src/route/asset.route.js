const express = require("express");
const controller = require("./../controller/asset.controller");

const Router = express.Router();
const path = "/assets";

Router.get(`${path}`, controller.getAllAssets);
Router.get(`${path}/dashboard/:id`, controller.getAssetsForDashboard);
Router.post(`${path}`, controller.parsePCAPFile);
Router.delete(`${path}`, controller.deleteAssetsCollection);
// Router.post(`${path}`, controller.createAsset);
// Router.get(`${path}`, controller.executeScriptTest);
// Router.get(`${path}`, controller.executeScriptTestWithArgument);

module.exports = Router;
