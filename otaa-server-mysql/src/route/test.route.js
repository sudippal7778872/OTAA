const controller = require("../controller/test.controller");
const express = require("express");
const router = express.Router();
const path = "/tests";

router.get(`${path}`, controller.getAllTests);

module.exports = router;
