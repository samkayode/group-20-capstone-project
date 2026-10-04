const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const controller = require("../controllers/inventory.controller");

const router = express.Router();

router.get("/", authenticate, authorize("SUPER_ADMIN", "PHARMACY_ADMIN", "PHARMACIST"), asyncHandler(controller.listInventory));
router.get("/low-stock", authenticate, authorize("SUPER_ADMIN", "PHARMACY_ADMIN", "PHARMACIST"), asyncHandler(controller.lowStock));
router.get("/expiring", authenticate, authorize("SUPER_ADMIN", "PHARMACY_ADMIN", "PHARMACIST"), asyncHandler(controller.expiring));
router.get("/:id", authenticate, authorize("SUPER_ADMIN", "PHARMACY_ADMIN", "PHARMACIST"), asyncHandler(controller.getInventory));
router.get("/:id/batches", authenticate, authorize("SUPER_ADMIN", "PHARMACY_ADMIN", "PHARMACIST"), asyncHandler(controller.listBatches));

router.post("/", authenticate, authorize("SUPER_ADMIN", "PHARMACY_ADMIN"), asyncHandler(controller.createInventory));
router.post("/:id/batches", authenticate, authorize("SUPER_ADMIN", "PHARMACY_ADMIN", "PHARMACIST"), asyncHandler(controller.createBatch));

module.exports = router;
