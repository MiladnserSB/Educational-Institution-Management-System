/**
 * API layer for EDUMS.
 *
 * Mirrors the backend structure (server -> routes -> controllers -> services -> models)
 * and the response envelope used by the existing user controller:
 *   success: { success: true, data: <payload> }
 *   error:   { message: "..." }
 *
 * Expected REST resources (plural, matching the mongoose models):
 *   /api/auth            -> login / current session
 *   /api/users           -> User
 *   /api/courses         -> Course
 *   /api/levels          -> Level
 *   /api/cohorts         -> Cohort
 *   /api/sessions        -> Session
 *   /api/enrollments     -> Enrollment
 *   /api/enrollment-results -> EnrollmentResult
 *   /api/attendances     -> Attendance
 *   /api/student-notes   -> StudentNote
 */

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const TOKEN_KEY = "edums.token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token
    ? localStorage.setItem(TOKEN_KEY, token)
    : localStorage.removeItem(TOKEN_KEY);

/** Mongoose documents use `_id`; normalize to `id` for the UI layer. */
const normalizeRecord = (record) => {
  if (record == null || typeof record !== "object") return record;
  if (Array.isArray(record)) return record.map(normalizeRecord);

  const { _id, ...rest } = record;
  const normalized = { ...rest };
  if (_id !== undefined) normalized.id = _id;

  // Recurse so nested documents are normalized too — notably the login
  // payload `{ token, user: { _id } }`, where `user.id` must exist for
  // every user-scoped page (cohorts by teacher, enrollments by student).
  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];
    if (value && typeof value === "object") {
      normalized[key] = normalizeRecord(value);
    }
  });

  return normalized;
};

const unwrap = (payload) => {
  if (payload == null) return payload;
  if (Array.isArray(payload)) return payload.map(normalizeRecord);
  if (typeof payload === "object" && "data" in payload) {
    const data = payload.data;
    return Array.isArray(data)
      ? data.map(normalizeRecord)
      : normalizeRecord(data);
  }
  return normalizeRecord(payload);
};

async function request(path, { method = "GET", body, signal } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new Error("تعذّر الاتصال بالخادم، تحقّق من الشبكة.");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      (payload && payload.message) || `تعذّر تنفيذ الطلب (${response.status}).`,
    );
  }

  return unwrap(payload);
}

const api = {
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) =>
    request(path, { ...options, method: "POST", body }),
  put: (path, body, options = {}) =>
    request(path, { ...options, method: "PUT", body }),
  remove: (path, options = {}) =>
    request(path, { ...options, method: "DELETE" }),
};

/** Standard CRUD factory for a REST resource. */
const resource = (name) => ({
  list: (options) => api.get(`/${name}`, options),
  get: (id, options) => api.get(`/${name}/${id}`, options),
  create: (data, options) => api.post(`/${name}`, data, options),
  update: (id, data, options) => api.put(`/${name}/${id}`, data, options),
  remove: (id, options) => api.remove(`/${name}/${id}`, options),
});

export const authApi = {
  /** -> { token, user } */
  login: (email, password) => api.post("/auth/login", { email, password }),
  me: () => api.get("/auth/me"),
};

export const usersApi = resource("users");
export const coursesApi = resource("courses");
export const levelsApi = resource("levels");
export const cohortsApi = resource("cohorts");
export const sessionsApi = resource("sessions");
export const enrollmentsApi = resource("enrollments");
export const resultsApi = resource("enrollment-results");
export const attendancesApi = resource("attendances");
export const notesApi = resource("student-notes");

export default api;
