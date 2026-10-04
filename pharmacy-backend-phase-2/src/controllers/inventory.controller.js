const model = require("../models/inventory.model");
const {
  createInventorySchema,
  createBatchSchema
} = require("../validators/catalog.validator");

async function createInventory(req, res) {
  const data = createInventorySchema.parse(req.body);
  const inventory = await model.createInventory(data);
  res.status(201).json({ success: true, data: { inventory } });
}

async function listInventory(req, res) {
  const inventory = await model.listInventory(req.query.pharmacyId);
  res.json({ success: true, data: { inventory } });
}

async function getInventory(req, res) {
  const inventory = await model.getInventoryById(req.params.id);

  if (!inventory) {
    return res.status(404).json({
      success: false,
      message: "Inventory record not found."
    });
  }

  res.json({ success: true, data: { inventory } });
}

async function createBatch(req, res) {
  const data = createBatchSchema.parse(req.body);
  const batch = await model.createBatch(data, req.user.sub);
  res.status(201).json({ success: true, data: { batch } });
}

async function listBatches(req, res) {
  const batches = await model.listBatches(req.params.id);
  res.json({ success: true, data: { batches } });
}

async function lowStock(req, res) {
  const items = await model.getLowStock(req.query.pharmacyId);
  res.json({
    success: true,
    data: {
      count: items.length,
      items
    }
  });
}

async function expiring(req, res) {
  const days = Math.min(Math.max(Number(req.query.days || 90), 1), 3650);
  const batches = await model.getExpiringBatches(days, req.query.pharmacyId);

  res.json({
    success: true,
    data: {
      days,
      count: batches.length,
      batches
    }
  });
}

module.exports = {
  createInventory,
  listInventory,
  getInventory,
  createBatch,
  listBatches,
  lowStock,
  expiring
};
