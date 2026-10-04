const model = require("../models/catalog.model");
const {
  createCategorySchema,
  createMedicineSchema
} = require("../validators/catalog.validator");

async function createCategory(req, res) {
  const data = createCategorySchema.parse(req.body);
  const category = await model.createCategory(data);
  res.status(201).json({ success: true, data: { category } });
}

async function listCategories(req, res) {
  const categories = await model.listCategories();
  res.json({ success: true, data: { categories } });
}

async function createMedicine(req, res) {
  const data = createMedicineSchema.parse(req.body);
  const medicine = await model.createMedicine(data);
  res.status(201).json({ success: true, data: { medicine } });
}

async function listMedicines(req, res) {
  const medicines = await model.listMedicines({
    search: req.query.search,
    categoryId: req.query.categoryId
  });

  res.json({ success: true, data: { medicines } });
}

module.exports = {
  createCategory,
  listCategories,
  createMedicine,
  listMedicines
};
