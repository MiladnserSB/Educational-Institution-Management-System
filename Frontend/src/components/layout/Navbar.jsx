import { useEffect, useRef, useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";
import { pageTitleFor } from "./navConfig";
import { roleLabel } from "../../utils";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

/**
 * Top bar: mobile menu trigger, current page title and the account menu
 * (profile summary + logout).
 */
const Navbar = ({ onOpenMenu }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  if (!user) return null;

  const pageTitle = pageTitleFor(location.pathname, user.role);

  const handleLogout = () => {
    logout();
    toast("info", "تم تسجيل الخروج.");
    navigate("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        className="rounded-lg p-2 text-ink transition hover:bg-border/60 lg:hidden"
        onClick={onOpenMenu}
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h2 className="hidden text-sm font-bold text-ink sm:block">{pageTitle}</h2>

      <div className="flex-1" />

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-border/50"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="قائمة الحساب"
        >
          <Avatar name={user.fullName} seed={user.id} size="sm" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-2 w-60 rounded-xl border border-border bg-white p-1.5 shadow-pop animate-slideUp">
              <div className="mb-1 border-b border-border px-3 py-2">
                <p className="truncate text-sm font-semibold text-ink">
                  {user.fullName}
                </p>
                <p className="ltr truncate text-xs text-muted">{user.email}</p>
              </div>
              <p className="px-3 py-1 text-[11px] font-semibold text-muted">
                {roleLabel[user.role] || user.role}
              </p>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error-600 transition hover:bg-error-50"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
