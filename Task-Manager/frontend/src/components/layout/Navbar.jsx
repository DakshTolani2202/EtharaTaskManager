import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/profile", label: "Profile", icon: User },
];

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-600/15 text-brand-300 ring-1 ring-brand-500/30"
      : "text-gray-400 hover:bg-surface-muted hover:text-gray-100"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-surface-border bg-surface-base/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Task<span className="text-brand-400">Manager</span>
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-100">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          <Badge variant={user?.role}>{user?.role}</Badge>
          <button
            onClick={logout}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-surface-muted hover:text-gray-100"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-gray-300 hover:bg-surface-muted md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-surface-border bg-surface-base md:hidden">
          <div className="space-y-1 px-3 py-3">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-3">
              <div>
                <div className="text-sm font-medium text-gray-100">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-2 text-gray-400 hover:bg-surface-muted hover:text-gray-100"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
