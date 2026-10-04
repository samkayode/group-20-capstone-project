const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const controller = require("../controllers/pharmacy.controller");

const router = express.Router();

router.get("/", asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.get));

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  asyncHandler(controller.create)
);

router.post(
  "/:id/staff",
  authenticate,
  authorize("SUPER_ADMIN", "PHARMACY_ADMIN"),
  asyncHandler(controller.addStaff)
);

router.get(
  "/:id/staff",
  authenticate,
  authorize("SUPER_ADMIN", "PHARMACY_ADMIN", "PHARMACIST"),
  asyncHandler(controller.staff)
);

module.exports = router;
