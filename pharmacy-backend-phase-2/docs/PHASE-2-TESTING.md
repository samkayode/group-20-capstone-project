# Phase 2 manual testing sequence

1. Start PostgreSQL.
2. Create `pharmacy_db`.
3. Run `npm install`.
4. Run `npm run db:migrate`.
5. Run `npm run db:seed`.
6. Start `npm run dev`.
7. Login as the seeded admin to obtain a JWT.
8. Create a pharmacy.
9. Create a medicine category.
10. Create a medicine.
11. Create an inventory record connecting the pharmacy and medicine.
12. Add one or more batches.
13. Check inventory.
14. Check batches.
15. Check low stock.
16. Check expiring batches.

Example category:

POST /api/v1/catalog/categories

{
  "name": "Pain Relief",
  "slug": "pain-relief",
  "description": "Pain relief products"
}

Example medicine:

POST /api/v1/catalog/medicines

{
  "categoryId": "CATEGORY_UUID",
  "genericName": "Paracetamol",
  "brandName": "Panadol",
  "strength": "500mg",
  "dosageForm": "Tablet",
  "manufacturer": "Example Manufacturer",
  "prescriptionRequired": false,
  "controlledDrug": false
}

Example pharmacy:

POST /api/v1/pharmacies

{
  "name": "HealthPlus Pharmacy",
  "licenseNumber": "PHARM-001",
  "phone": "+2348000000000",
  "address": "Lagos, Nigeria",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria"
}

Example inventory:

POST /api/v1/inventory

{
  "pharmacyId": "PHARMACY_UUID",
  "medicineId": "MEDICINE_UUID",
  "sellingPrice": 2500,
  "reorderLevel": 50,
  "reorderQuantity": 200
}

Example batch:

POST /api/v1/inventory/INVENTORY_UUID/batches

{
  "inventoryId": "INVENTORY_UUID",
  "batchNumber": "PCM-2026-001",
  "quantityReceived": 100,
  "unitCost": 1800,
  "sellingPrice": 2500,
  "manufacturedAt": "2026-01-01",
  "expiryDate": "2027-08-15"
}
