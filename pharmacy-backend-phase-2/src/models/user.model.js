const { query } = require("../config/database");

async function findUserByEmail(email) {
  const result = await query(
    `SELECT id, first_name, last_name, email, phone, password_hash, role, status, created_at
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()]
  );

  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await query(
    `SELECT id, first_name, last_name, email, phone, role, status, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function createUser({ firstName, lastName, email, phone, passwordHash, role = "CUSTOMER" }) {
  const result = await query(
    `INSERT INTO users
      (first_name, last_name, email, phone, password_hash, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, first_name, last_name, email, phone, role, status, created_at`,
    [
      firstName,
      lastName,
      email.toLowerCase(),
      phone || null,
      passwordHash,
      role
    ]
  );

  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
