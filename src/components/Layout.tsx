import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookCheck,
  Building2,
  Zap,
  Fuel,
  Users,
  ArrowLeftRight,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

/* ── Nav items ── */
interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: { text: string; color: "orange" | "violet" | "green" | "gray" };
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard",          to: "/" },
  { icon: FileText,        label: "Facturas",           to: "/facturas",           badge: { text: "IA",        color: "orange"  } },
  { icon: BookCheck,       label: "Causación",          to: "/causacion",          badge: { text: "n8n",       color: "violet"  } },
  { icon: Building2,       label: "DIAN",               to: "/dian",               badge: { text: "RPA",       color: "green"   } },
  { icon: Zap,             label: "Servicios Públicos", to: "/servicios-publicos" },
  { icon: Fuel,            label: "Combustible",        to: "/combustible" },
  { icon: Users,           label: "Leads",              to: "/leads",              badge: { text: "WhatsApp",  color: "green"   } },
  { icon: ArrowLeftRight,  label: "Conciliación",       to: "/conciliacion",       badge: { text: "Próximo",   color: "gray"    } },
  { icon: Settings,        label: "Configuración",      to: "/configuracion" },
];

/* ── Badge colors ── */
const BADGE_STYLES: Record<string, string> = {
  orange: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  violet: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  green:  "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  gray:   "bg-white/10 text-white/40 border border-white/15",
};

/* ── Breadcrumb map ── */
const BREADCRUMB: Record<string, string[]> = {
  "/":                    ["Dashboard"],
  "/facturas":            ["Facturas"],
  "/facturas/nueva":      ["Facturas", "Nueva"],
  "/causacion":           ["Causación"],
  "/dian":                ["DIAN"],
  "/servicios-publicos":  ["Servicios Públicos"],
  "/combustible":         ["Combustible"],
  "/leads":               ["Leads"],
  "/conciliacion":        ["Conciliación"],
  "/configuracion":       ["Configuración"],
};

/* ── Sidebar ── */
function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();

  return (
    <aside
      className="flex flex-col h-full w-[260px] shrink-0"
      style={{ background: "#0F0F1A" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
        <div className="flex flex-col leading-tight">
          <span
            className="text-2xl font-bold"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            IntegrIA
          </span>
          <span className="text-[11px] tracking-widest text-white/35 uppercase">
            Solutions
          </span>
        </div>

        {/* Mobile close */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, to, badge }) => {
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={[
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative",
                isActive
                  ? "bg-violet-600/20 text-white"
                  : "text-white/55 hover:text-white/90 hover:bg-white/6",
              ].join(" ")}
              style={
                isActive
                  ? { borderLeft: "3px solid #F97316", paddingLeft: "calc(0.75rem - 3px)" }
                  : { borderLeft: "3px solid transparent", paddingLeft: "calc(0.75rem - 3px)" }
              }
            >
              <Icon
                size={18}
                className={isActive ? "text-violet-400" : "text-white/40 group-hover:text-white/70"}
              />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${BADGE_STYLES[badge.color]}`}
                >
                  {badge.text}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/8">
        <p className="text-[11px] text-white/25 tracking-wide">
          v1.0.0 · Powered by n8n
        </p>
      </div>
    </aside>
  );
}

/* ── Topbar ── */
function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const crumbs = BREADCRUMB[location.pathname] ?? ["Página"];

  return (
    <header
      className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-black/6"
      style={{ background: "#FFFFFF" }}
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>

        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-gray-400 font-medium">IntegrIApp</span>
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-gray-300" />
              <span
                className={
                  i === crumbs.length - 1
                    ? "font-semibold text-gray-800"
                    : "text-gray-400"
                }
                style={
                  i === crumbs.length - 1
                    ? { fontFamily: "'Space Grotesk', sans-serif" }
                    : undefined
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: n8n status */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span
          className="relative flex h-2.5 w-2.5"
          title="n8n conectado"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-xs font-medium text-emerald-600 hidden sm:inline">
          n8n conectado
        </span>
      </div>
    </header>
  );
}

/* ── Layout ── */
export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main
          className="flex-1 overflow-auto"
          style={{ background: "#F8F7FF", padding: "32px" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
