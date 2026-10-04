const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const healthRoutes = require("./routes/health.routes");
const pharmacyRoutes = require("./routes/pharmacy.routes");
const catalogRoutes = require("./routes/catalog.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false
}));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pharmacy API is running",
    version: "v1",
    phase: 2
  });
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/pharmacies", pharmacyRoutes);
app.use("/api/v1/catalog", catalogRoutes);
app.use("/api/v1/inventory", inventoryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
