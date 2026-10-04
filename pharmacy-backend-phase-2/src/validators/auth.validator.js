const { z } = require("zod");

const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(7).max(30).optional(),
  password: z.string().min(8).max(100)
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

module.exports = { registerSchema, loginSchema };
