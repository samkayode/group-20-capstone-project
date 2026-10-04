# Phase 2 — Pharmacy, Catalog & Inventory

## Domain relationship

Pharmacy
  |
  +-- Pharmacy Staff --> User
  |
  +-- Inventory --> Medicine --> Category
                 |
                 +-- Inventory Batches --> Supplier
                 |
                 +-- Inventory Transactions --> User

## Important distinction

`medicines` is the master product catalogue.

`inventory` connects a medicine to a particular pharmacy.

`inventory_batches` represents the physical stock received in batches.

Stock quantity is therefore not stored on `medicines`.

## Expiry

Batch expiry is calculated from `expiry_date`.

- EXPIRED: expiry_date < today
- CRITICAL: <= 30 days
- WARNING: <= 90 days
- NORMAL: > 90 days

## Low stock

Current stock is calculated from active, non-expired batches.

An item is low stock when:

current_stock <= reorder_level

## FEFO

When sales are implemented in the Orders phase, stock should be consumed using:

First Expired, First Out.

That means batches with the nearest expiry date are consumed first.

## Inventory transactions

Every stock movement should eventually create a transaction:

- PURCHASE
- SALE
- RETURN
- ADJUSTMENT
- DAMAGED
- EXPIRED
- TRANSFER_IN
- TRANSFER_OUT

This provides an auditable inventory history.

## Endpoints

### Pharmacies

GET /api/v1/pharmacies
GET /api/v1/pharmacies/:id
POST /api/v1/pharmacies
GET /api/v1/pharmacies/:id/staff
POST /api/v1/pharmacies/:id/staff

### Catalog

GET /api/v1/catalog/categories
POST /api/v1/catalog/categories

GET /api/v1/catalog/medicines
POST /api/v1/catalog/medicines

Search example:

GET /api/v1/catalog/medicines?search=paracetamol

Category filter:

GET /api/v1/catalog/medicines?categoryId=UUID

### Inventory

GET /api/v1/inventory
GET /api/v1/inventory/:id
POST /api/v1/inventory

GET /api/v1/inventory/:id/batches
POST /api/v1/inventory/:id/batches

GET /api/v1/inventory/low-stock
GET /api/v1/inventory/expiring?days=90

## Next phase

Orders will consume inventory through FEFO batch selection.

Then prescription workflows, payments, delivery and notifications can be added without redesigning the inventory foundation.
