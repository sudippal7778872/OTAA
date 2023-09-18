const express = require("express");
const controller = require("./../controller/event.controller");

const Router = express.Router();
const path = "/events";

Router.post(`${path}`, controller.getAllEventById);
Router.delete(`${path}`, controller.deleteAllEvents);

module.exports = Router;
