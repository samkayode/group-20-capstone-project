# Pharmacy Platform Architecture

## High-level flow

Customer
  |
  v
Express API
  |
  +--> Authentication
  +--> Pharmacy
  +--> Medicine
  +--> Inventory
  +--> Cart
  +--> Orders
  +--> Prescription
  +--> Payment
  +--> Delivery
  +--> Notifications
  |
  v
PostgreSQL

AI will be integrated as a separate layer:

Application
  |
  v
AI Service
  |
  +--> AI Pharmacy Assistant
  +--> Semantic Search / RAG
  +--> Prescription OCR / Extraction
  +--> Recommendations
  +--> Inventory Forecasting
  +--> Sales Intelligence

## Important design rule

The core pharmacy ordering system must not depend on the AI service being available.

AI enhances the platform; it does not control critical pharmacy transactions.

## Planned database domains

- Identity
- Pharmacy
- Catalog
- Inventory
- Orders
- Prescriptions
- Payments
- Delivery
- Notifications
- Reviews
- AI
- Audit
