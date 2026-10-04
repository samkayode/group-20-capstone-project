# Pharmacy Backend — Phase 2

This project extends Phase 1 into the pharmacy, medicine catalogue and inventory domain.

## Added in Phase 2

- Pharmacies
- Pharmacy staff
- Pharmacist foundation
- Medicine categories
- Hierarchical categories
- Medicine master catalogue
- Suppliers
- Pharmacy inventory
- Inventory batches
- Batch numbers
- Expiry dates
- Expiry status calculation
- Low-stock detection
- Reorder levels
- Reorder quantities
- Inventory transactions
- Stock audit foundation
- Pharmacy/catalog/inventory APIs

## Important architecture

Medicine is the master product.

Inventory connects a medicine to a pharmacy.

Batches represent physical stock.

Example:

Pharmacy A
  |
  +-- Paracetamol 500mg
        |
        +-- Batch A: 100 units, expires 2027-03
        +-- Batch B: 200 units, expires 2027-08

## Setup

If you are continuing from Phase 1, replace your project with this Phase 2 folder.

Create/update `.env`:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/pharmacy_db
JWT_SECRET=your_long_random_secret
PORT=5000

Then:

npm install

Run:

npm run db:migrate

Then seed:

npm run db:seed

Start:

npm run dev

## Important

If you already have the Phase 1 database and it contains the old schema, this Phase 2 package is designed as a development-stage schema refresh. Back up important data before recreating or migrating an existing database.

## Initial API

Health:

GET /api/v1/health

Pharmacies:

GET /api/v1/pharmacies

Catalog:

GET /api/v1/catalog/categories
GET /api/v1/catalog/medicines

Inventory:

GET /api/v1/inventory
GET /api/v1/inventory/low-stock
GET /api/v1/inventory/expiring?days=90

Protected create operations require a JWT.
