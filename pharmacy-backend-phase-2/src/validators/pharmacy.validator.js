const { z } = require("zod");

const createPharmacySchema = z.object({
  name: z.string().trim().min(2).max(150),
  licenseNumber: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().email().max(150).optional(),
  address: z.string().trim().min(5),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).default("Nigeria"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
});

const createStaffSchema = z.object({
  userId: z.string().uuid(),
  staffRole: z.enum(["PHARMACIST", "MANAGER", "ASSISTANT"]),
  licenseNumber: z.string().trim().max(100).optional()
});

module.exports = { createPharmacySchema, createStaffSchema };
