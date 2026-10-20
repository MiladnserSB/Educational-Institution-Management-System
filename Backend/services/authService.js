import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      tokenVersion: user.tokenVersion,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    },
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

export async function registerUser({ name, email, password }) {
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw Object.assign(new Error("Invalid input data"), { status: 400 });
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  if (!name || name.length < 2 || name.length > 100) {
    throw Object.assign(new Error("Name must be 2-100 characters"), {
      status: 400,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw Object.assign(new Error("Invalid email address"), { status: 400 });
  }

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    throw Object.assign(
      new Error("Password must be at least 8 characters and at most 72 bytes"),
      { status: 400 },
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw Object.assign(new Error("Email already registered"), {
      status: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    user: publicUser(user),
    token: generateToken(user),
  };
}

export async function loginUser({ email, password }) {
  if (typeof email !== "string" || typeof password !== "string") {
    throw Object.assign(new Error("Email and password are required"), {
      status: 400,
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });
  }

  return {
    user: publicUser(user),
    token: generateToken(user),
  };
}

export async function authenticateToken(token) {
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
    typeof payload.id !== "string" ||
    !Number.isInteger(payload.tokenVersion)
  ) {
    throw Object.assign(new Error("Invalid token payload"), { status: 401 });
  }

  const user = await User.findById(payload.id);

  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw Object.assign(new Error("Session expired or logged out"), {
      status: 401,
    });
  }

  return user;
}

export async function logoutUser(userId) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { tokenVersion: 1 } },
    { new: true },
  );

  if (!user) {
    throw Object.assign(new Error("User not found"), { status: 401 });
  }

  return true;
}
