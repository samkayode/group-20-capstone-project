const authService = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

async function register(req, res) {
  const data = registerSchema.parse(req.body);
  const result = await authService.register(data);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: result
  });
}

async function login(req, res) {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data);

  res.json({
    success: true,
    message: "Login successful.",
    data: result
  });
}

async function profile(req, res) {
  const user = await authService.getProfile(req.user.sub);

  res.json({
    success: true,
    data: { user }
  });
}

module.exports = {
  register,
  login,
  profile
};
