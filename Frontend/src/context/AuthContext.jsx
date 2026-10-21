import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getToken, setToken } from "../services/api";

const USER_KEY = "edums.user";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Session state for the real backend:
 * - login({ token, user }) from POST /api/auth/login
 * - the session is persisted in localStorage and restored on load
 * - logout() clears the session
 * - updateUser(patch) keeps the local profile in sync after the
 *   role-scoped profile update (PUT /api/student/me, /api/admin/users/:id …)
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    getToken() ? readStoredUser() : null,
  );

  useEffect(() => {
    // If the token disappeared (e.g. cleared elsewhere), drop the profile too.
    if (!getToken()) setUser(null);
  }, []);

  const login = useCallback((session) => {
    if (session?.token) setToken(session.token);
    const raw = session?.user ?? session;
    // Defensive: guarantee an `id` even if the session arrived un-normalized.
    const profile =
      raw && typeof raw === "object" && raw._id && !raw.id
        ? { ...raw, id: raw._id }
        : raw;
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout, updateUser }),
    [user, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthContext;
