const { query, pool } = require("../config/database");

async function createInventory(data) {
  const result = await query(
    `INSERT INTO inventory
      (pharmacy_id, medicine_id, selling_price, reorder_level, reorder_quantity)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [
      data.pharmacyId, data.medicineId, data.sellingPrice,
      data.reorderLevel, data.reorderQuantity
    ]
  );
  return result.rows[0];
}

async function getInventoryById(id) {
  const result = await query(
    `SELECT
       i.*,
       p.name AS pharmacy_name,
       m.generic_name,
       m.brand_name,
       COALESCE(SUM(
         CASE
           WHEN b.status = 'ACTIVE' AND b.expiry_date >= CURRENT_DATE
           THEN b.quantity_available
           ELSE 0
         END
       ), 0)::INTEGER AS total_available
     FROM inventory i
     JOIN pharmacies p ON p.id = i.pharmacy_id
     JOIN medicines m ON m.id = i.medicine_id
     LEFT JOIN inventory_batches b ON b.inventory_id = i.id
     WHERE i.id = $1
     GROUP BY i.id, p.name, m.generic_name, m.brand_name`,
    [id]
  );

  return result.rows[0] || null;
}

async function listInventory(pharmacyId) {
  const values = [];
  const where = [];

  if (pharmacyId) {
    values.push(pharmacyId);
    where.push(`i.pharmacy_id = $${values.length}`);
  }

  const result = await query(
    `SELECT
       i.*,
       p.name AS pharmacy_name,
       m.generic_name,
       m.brand_name,
       COALESCE(SUM(
         CASE
           WHEN b.status = 'ACTIVE' AND b.expiry_date >= CURRENT_DATE
           THEN b.quantity_available
           ELSE 0
         END
       ), 0)::INTEGER AS total_available
     FROM inventory i
     JOIN pharmacies p ON p.id = i.pharmacy_id
     JOIN medicines m ON m.id = i.medicine_id
     LEFT JOIN inventory_batches b ON b.inventory_id = i.id
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     GROUP BY i.id, p.name, m.generic_name, m.brand_name
     ORDER BY m.generic_name ASC`,
    values
  );

  return result.rows;
}

async function createBatch(data, performedBy) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const inventoryResult = await client.query(
      `SELECT id FROM inventory WHERE id = $1 FOR UPDATE`,
      [data.inventoryId]
    );

    if (!inventoryResult.rows[0]) {
      const error = new Error("Inventory record not found.");
      error.statusCode = 404;
      throw error;
    }

    const batchResult = await client.query(
      `INSERT INTO inventory_batches
        (inventory_id, supplier_id, batch_number, quantity_received,
         quantity_available, unit_cost, selling_price, manufactured_at, expiry_date)
       VALUES ($1,$2,$3,$4,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        data.inventoryId, data.supplierId || null, data.batchNumber,
        data.quantityReceived, data.unitCost, data.sellingPrice ?? null,
        data.manufacturedAt || null, data.expiryDate
      ]
    );

    await client.query(
      `INSERT INTO inventory_transactions
        (inventory_id, batch_id, transaction_type, quantity, reference_type, notes, performed_by)
       VALUES ($1,$2,'PURCHASE',$3,'BATCH_RECEIPT',$4,$5)`,
      [
        data.inventoryId,
        batchResult.rows[0].id,
        data.quantityReceived,
        `Received batch ${data.batchNumber}`,
        performedBy
      ]
    );

    await client.query("COMMIT");
    return batchResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function listBatches(inventoryId) {
  const result = await query(
    `SELECT
       b.*,
       s.name AS supplier_name,
       CASE
         WHEN b.expiry_date < CURRENT_DATE THEN 'EXPIRED'
         WHEN b.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'CRITICAL'
         WHEN b.expiry_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'WARNING'
         ELSE 'NORMAL'
       END AS expiry_status,
       (b.expiry_date - CURRENT_DATE)::INTEGER AS days_to_expiry
     FROM inventory_batches b
     LEFT JOIN suppliers s ON s.id = b.supplier_id
     WHERE b.inventory_id = $1
     ORDER BY b.expiry_date ASC`,
    [inventoryId]
  );

  return result.rows;
}

async function getLowStock(pharmacyId) {
  const values = [];
  const conditions = [`i.status = 'ACTIVE'`];

  if (pharmacyId) {
    values.push(pharmacyId);
    conditions.push(`i.pharmacy_id = $${values.length}`);
  }

  const result = await query(
    `SELECT
       i.id,
       i.pharmacy_id,
       p.name AS pharmacy_name,
       i.medicine_id,
       m.generic_name,
       m.brand_name,
       i.reorder_level,
       i.reorder_quantity,
       COALESCE(SUM(
         CASE
           WHEN b.status = 'ACTIVE' AND b.expiry_date >= CURRENT_DATE
           THEN b.quantity_available
           ELSE 0
         END
       ), 0)::INTEGER AS current_stock
     FROM inventory i
     JOIN pharmacies p ON p.id = i.pharmacy_id
     JOIN medicines m ON m.id = i.medicine_id
     LEFT JOIN inventory_batches b ON b.inventory_id = i.id
     WHERE ${conditions.join(" AND ")}
     GROUP BY i.id, p.name, m.generic_name, m.brand_name
     HAVING COALESCE(SUM(
       CASE
         WHEN b.status = 'ACTIVE' AND b.expiry_date >= CURRENT_DATE
         THEN b.quantity_available
         ELSE 0
       END
     ), 0) <= i.reorder_level
     ORDER BY current_stock ASC`,
    values
  );

  return result.rows;
}

async function getExpiringBatches(days = 90, pharmacyId) {
  const values = [days];
  const conditions = [
    `b.status = 'ACTIVE'`,
    `b.expiry_date >= CURRENT_DATE`,
    `b.expiry_date <= CURRENT_DATE + ($1 * INTERVAL '1 day')`
  ];

  if (pharmacyId) {
    values.push(pharmacyId);
    conditions.push(`i.pharmacy_id = $${values.length}`);
  }

  const result = await query(
    `SELECT
       b.*,
       i.pharmacy_id,
       p.name AS pharmacy_name,
       m.generic_name,
       m.brand_name,
       (b.expiry_date - CURRENT_DATE)::INTEGER AS days_to_expiry
     FROM inventory_batches b
     JOIN inventory i ON i.id = b.inventory_id
     JOIN pharmacies p ON p.id = i.pharmacy_id
     JOIN medicines m ON m.id = i.medicine_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY b.expiry_date ASC`,
    values
  );

  return result.rows;
}

module.exports = {
  createInventory,
  getInventoryById,
  listInventory,
  createBatch,
  listBatches,
  getLowStock,
  getExpiringBatches
};
