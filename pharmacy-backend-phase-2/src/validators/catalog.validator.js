const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(1000).optional(),
  parentId: z.string().uuid().nullable().optional()
});

const createMedicineSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  genericName: z.string().trim().min(2).max(200),
  brandName: z.string().trim().max(200).optional(),
  strength: z.string().trim().max(100).optional(),
  dosageForm: z.string().trim().max(100).optional(),
  manufacturer: z.string().trim().max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  activeIngredients: z.string().trim().max(2000).optional(),
  prescriptionRequired: z.boolean().default(false),
  controlledDrug: z.boolean().default(false)
});

const createInventorySchema = z.object({
  pharmacyId: z.string().uuid(),
  medicineId: z.string().uuid(),
  sellingPrice: z.number().min(0),
  reorderLevel: z.number().int().min(0).default(10),
  reorderQuantity: z.number().int().positive().default(50)
});

const createBatchSchema = z.object({
  inventoryId: z.string().uuid(),
  supplierId: z.string().uuid().nullable().optional(),
  batchNumber: z.string().trim().min(1).max(120),
  quantityReceived: z.number().int().positive(),
  unitCost: z.number().min(0),
  sellingPrice: z.number().min(0).optional(),
  manufacturedAt: z.string().date().optional(),
  expiryDate: z.string().date()
});

module.exports = {
  createCategorySchema,
  createMedicineSchema,
  createInventorySchema,
  createBatchSchema
};
