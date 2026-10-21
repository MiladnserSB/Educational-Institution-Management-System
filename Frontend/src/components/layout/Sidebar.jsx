import { NavLink, useLocation } from "react-router-dom";
import { navByRole } from "./navConfig";
import Logo from "../common/Logo";
import Avatar from "../common/Avatar";
import { roleLabel } from "../../utils";
import { useAuth } from "../../context/AuthContext";

/**
 * Dark sidebar with grouped navigation. Used both as the desktop rail and
 * inside the mobile drawer (see Layout).
 */
const Sidebar = ({ onNavigate }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;
  const groups = navByRole[user.role] || [];

  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Logo variant="full" onLight />
      </div>

      <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  location.pathname === item.to ||
                  (item.to !== `/${user.role}` &&
                    location.pathname.startsWith(`${item.to}/`));
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-brand-blue text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar name={user.fullName} seed={user.id} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user.fullName}
            </p>
            <p className="truncate text-xs text-white/50">
              {roleLabel[user.role] || user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
