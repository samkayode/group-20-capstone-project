const { query } = require("../config/database");

async function health(req, res) {
  let database = "disconnected";

  try {
    await query("SELECT 1");
    database = "connected";
  } catch {}

  res.json({
    success: true,
    service: "pharmacy-api",
    database,
    timestamp: new Date().toISOString()
  });
}

module.exports = { health };
