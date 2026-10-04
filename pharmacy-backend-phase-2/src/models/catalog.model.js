const { query } = require("../config/database");

async function createCategory(data) {
  const result = await query(
    `INSERT INTO medicine_categories (name, slug, description, parent_id)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [data.name, data.slug, data.description || null, data.parentId || null]
  );
  return result.rows[0];
}

async function listCategories() {
  const result = await query(
    `SELECT * FROM medicine_categories
     WHERE status = 'ACTIVE'
     ORDER BY name ASC`
  );
  return result.rows;
}

async function createMedicine(data) {
  const result = await query(
    `INSERT INTO medicines
      (category_id, generic_name, brand_name, strength, dosage_form, manufacturer,
       description, active_ingredients, prescription_required, controlled_drug)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      data.categoryId || null, data.genericName, data.brandName || null,
      data.strength || null, data.dosageForm || null, data.manufacturer || null,
      data.description || null, data.activeIngredients || null,
      data.prescriptionRequired ?? false, data.controlledDrug ?? false
    ]
  );
  return result.rows[0];
}

async function listMedicines({ search, categoryId } = {}) {
  const values = [];
  const conditions = [`m.status = 'ACTIVE'`];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(m.generic_name ILIKE $${values.length} OR m.brand_name ILIKE $${values.length})`);
  }

  if (categoryId) {
    values.push(categoryId);
    conditions.push(`m.category_id = $${values.length}`);
  }

  const result = await query(
    `SELECT m.*, c.name AS category_name
     FROM medicines m
     LEFT JOIN medicine_categories c ON c.id = m.category_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY m.generic_name ASC`,
    values
  );

  return result.rows;
}

module.exports = {
  createCategory,
  listCategories,
  createMedicine,
  listMedicines
};
