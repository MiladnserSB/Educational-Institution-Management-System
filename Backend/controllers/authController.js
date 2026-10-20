import * as authService from "../services/authService.js";

function handleError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already registered",
    });
  }

  const status = error.status || 500;

  return res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : error.message,
  });
}

export async function register(req, res) {
  try {
    const result = await authService.registerUser(req.body || {});

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: result.user,
        accessToken: result.token,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function login(req, res) {
  try {
    const result = await authService.loginUser(req.body || {});

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.token,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function me(req, res) {
  try {
    const user = await getAuthenticatedUser(req);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function logout(req, res) {
  try {
    const user = await getAuthenticatedUser(req);

    await authService.logoutUser(user._id);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getAuthenticatedUser(req) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw Object.assign(new Error("authorization token required"), {
      status: 401,
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    throw Object.assign(new Error("authorization token required"), {
      status: 401,
    });
  }

  return authService.authenticateToken(token);
}
