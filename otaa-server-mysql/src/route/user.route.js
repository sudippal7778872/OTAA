const controller = require("../controller/user.controller");
const express = require("express");

const router = express.Router();
const path = `/users`;

router.get(`${path}`, controller.getAllUsers);

module.exports = router;
