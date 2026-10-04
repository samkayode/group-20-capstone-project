const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const controller = require("../controllers/health.controller");

const router = express.Router();

router.get("/", asyncHandler(controller.health));

module.exports = router;
