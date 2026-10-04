require("dotenv").config();

const app = require("./src/app");
const { pool } = require("./src/config/database");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Pharmacy API running on http://localhost:${PORT}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
