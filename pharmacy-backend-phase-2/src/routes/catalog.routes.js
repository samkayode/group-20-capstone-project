const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const controller = require("../controllers/catalog.controller");

const router = express.Router();

router.get("/categories", asyncHandler(controller.listCategories));
router.get("/medicines", asyncHandler(controller.listMedicines));

router.post(
  "/categories",
  authenticate,
  authorize("SUPER_ADMIN"),
  asyncHandler(controller.createCategory)
);

router.post(
  "/medicines",
  authenticate,
  authorize("SUPER_ADMIN"),
  asyncHandler(controller.createMedicine)
);

module.exports = router;
