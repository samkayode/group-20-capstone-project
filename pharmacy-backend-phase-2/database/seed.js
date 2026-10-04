require("dotenv").config();

const { pool } = require("../src/config/database");
const { hashPassword } = require("../src/utils/password");

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const passwordHash = await hashPassword("Admin@12345");

    await client.query(
      `INSERT INTO users
        (first_name, last_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      ["System", "Administrator", "admin@pharmacy.local", passwordHash, "SUPER_ADMIN"]
    );

    const categories = [
      ["Pain Relief", "pain-relief", "Medicines commonly used for pain management."],
      ["Antibiotics", "antibiotics", "Antibacterial medicines that require appropriate professional guidance."],
      ["Vitamins", "vitamins", "Vitamin and nutritional supplement products."],
      ["Antimalarials", "antimalarials", "Medicines used in the management of malaria."],
      ["Skincare", "skincare", "Pharmacy skincare and dermatological products."]
    ];

    for (const [name, slug, description] of categories) {
      await client.query(
        `INSERT INTO medicine_categories (name, slug, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO NOTHING`,
        [name, slug, description]
      );
    }

    await client.query("COMMIT");

    console.log("Phase 2 seed completed.");
    console.log("Admin email: admin@pharmacy.local");
    console.log("Admin password: Admin@12345");
    console.log("Change this password before production use.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
