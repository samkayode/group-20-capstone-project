const { query } = require("../config/database");

async function createPharmacy(data) {
  const result = await query(
    `INSERT INTO pharmacies
      (name, license_number, phone, email, address, city, state, country, latitude, longitude)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [
      data.name, data.licenseNumber || null, data.phone || null, data.email || null,
      data.address, data.city || null, data.state || null, data.country || "Nigeria",
      data.latitude ?? null, data.longitude ?? null
    ]
  );
  return result.rows[0];
}

async function listPharmacies() {
  const result = await query(
    `SELECT * FROM pharmacies ORDER BY created_at DESC`
  );
  return result.rows;
}

async function getPharmacyById(id) {
  const result = await query(
    `SELECT * FROM pharmacies WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function addStaff(pharmacyId, data) {
  const result = await query(
    `INSERT INTO pharmacy_staff (pharmacy_id, user_id, staff_role, license_number)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [pharmacyId, data.userId, data.staffRole, data.licenseNumber || null]
  );
  return result.rows[0];
}

async function listStaff(pharmacyId) {
  const result = await query(
    `SELECT ps.*, u.first_name, u.last_name, u.email, u.phone
     FROM pharmacy_staff ps
     JOIN users u ON u.id = ps.user_id
     WHERE ps.pharmacy_id = $1
     ORDER BY ps.created_at DESC`,
    [pharmacyId]
  );
  return result.rows;
}

module.exports = {
  createPharmacy,
  listPharmacies,
  getPharmacyById,
  addStaff,
  listStaff
};
