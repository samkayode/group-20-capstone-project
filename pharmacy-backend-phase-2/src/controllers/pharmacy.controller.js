const service = require("../services/pharmacy.service");
const { createPharmacySchema, createStaffSchema } = require("../validators/pharmacy.validator");

async function create(req, res) {
  const data = createPharmacySchema.parse(req.body);
  const pharmacy = await service.createPharmacy(data);
  res.status(201).json({ success: true, data: { pharmacy } });
}

async function list(req, res) {
  const pharmacies = await service.listPharmacies();
  res.json({ success: true, data: { pharmacies } });
}

async function get(req, res) {
  const pharmacy = await service.getPharmacy(req.params.id);
  res.json({ success: true, data: { pharmacy } });
}

async function addStaff(req, res) {
  const data = createStaffSchema.parse(req.body);
  const staff = await service.addStaff(req.params.id, data);
  res.status(201).json({ success: true, data: { staff } });
}

async function staff(req, res) {
  const staff = await service.listStaff(req.params.id);
  res.json({ success: true, data: { staff } });
}

module.exports = { create, list, get, addStaff, staff };
