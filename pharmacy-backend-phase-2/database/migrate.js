require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { pool } = require("../src/config/database");

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await client.query(schema);

    await client.query(
      `INSERT INTO schema_migrations (migration_name)
       VALUES ($1)
       ON CONFLICT (migration_name) DO NOTHING`,
      ["001_initial_schema"]
    );

    await client.query("COMMIT");
    console.log("Database migration completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
