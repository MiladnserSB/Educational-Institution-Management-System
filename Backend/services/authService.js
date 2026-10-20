import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
};

const handleUser = (user) => {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};

export const registerUser = async (user) => {
  const existingUser = await User.findOne({ email: user.email });

  if (existingUser) {
    throw Object.assign(new Error("Email already registered"), {
      status: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(user.password, 12);

  const createUser = await User.create({ ...user, password: hashedPassword });

  return {
    user: handleUser(createUser),
    token: generateToken(createUser),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });
  }

  return {
    user: handleUser(user),
    token: generateToken(user),
  };
};

export const authenticateToken = async (token) => {
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw Object.assign(new Error("Invalid or expired token"), {
      status: 401,
    });
  }

  if (
    typeof payload !== "object" ||
    typeof payload.id !== "string"
  ) {
    throw Object.assign(new Error("Invalid token payload"), { status: 401 });
  }

  const user = await User.findById(payload.id);

  if (!user) {
    throw Object.assign(new Error("User not found"), {
      status: 404,
    });
  }

  return user;
}

export async function logoutUser(userId) {}
