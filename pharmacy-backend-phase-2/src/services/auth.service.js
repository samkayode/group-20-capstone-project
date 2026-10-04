const userModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateAccessToken } = require("../utils/jwt");

async function register(data) {
  const existing = await userModel.findUserByEmail(data.email);

  if (existing) {
    const error = new Error("Email is already registered.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(data.password);

  const user = await userModel.createUser({
    ...data,
    passwordHash
  });

  const token = generateAccessToken(user);

  return { user, token };
}

async function login({ email, password }) {
  const user = await userModel.findUserByEmail(email);

  if (!user || !(await comparePassword(password, user.password_hash))) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "ACTIVE") {
    const error = new Error("This account is not active.");
    error.statusCode = 403;
    throw error;
  }

  const token = generateAccessToken(user);

  const { password_hash, ...safeUser } = user;

  return {
    user: safeUser,
    token
  };
}

async function getProfile(userId) {
  const user = await userModel.findUserById(userId);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

module.exports = {
  register,
  login,
  getProfile
};
