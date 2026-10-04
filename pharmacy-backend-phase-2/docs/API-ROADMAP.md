# API Roadmap

## Authentication

POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me

## Pharmacies

POST /api/v1/pharmacies
GET  /api/v1/pharmacies
GET  /api/v1/pharmacies/:id
PATCH /api/v1/pharmacies/:id

## Medicines

POST /api/v1/medicines
GET /api/v1/medicines
GET /api/v1/medicines/:id
PATCH /api/v1/medicines/:id
DELETE /api/v1/medicines/:id

## Inventory

GET /api/v1/inventory
POST /api/v1/inventory
PATCH /api/v1/inventory/:id
GET /api/v1/inventory/low-stock

## Cart

GET /api/v1/cart
POST /api/v1/cart/items
PATCH /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id

## Orders

POST /api/v1/orders
GET /api/v1/orders
GET /api/v1/orders/:id
PATCH /api/v1/orders/:id/status

## Prescriptions

POST /api/v1/prescriptions
GET /api/v1/prescriptions
GET /api/v1/prescriptions/:id
PATCH /api/v1/prescriptions/:id/review

## Payments

POST /api/v1/payments/initialize
GET /api/v1/payments/:id
POST /api/v1/payments/webhook

## Delivery

GET /api/v1/deliveries
PATCH /api/v1/deliveries/:id/status

## AI

POST /api/v1/ai/chat
POST /api/v1/ai/search
POST /api/v1/ai/prescription/analyze
GET /api/v1/ai/recommendations
GET /api/v1/ai/inventory-insights
