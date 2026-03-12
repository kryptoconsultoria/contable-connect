import { useState } from "react"
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  BookCheck,
  Building2,
  Zap,
  Fuel,
  Users,
  Users2,
  ArrowLeftRight,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Shield,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"

/* ── Types ── */
interface NavItem {
  icon: React.ElementType
  label: string
  to: string
  badge?: { text: string; variant: "orange" | "violet" | "gray" }
}

/* ── Nav items ── */
const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard",          to: "/" },
  { icon: FileText,        label: "Facturas",           to: "/facturas",          badge: { text: "IA",    variant: "orange" } },
  { icon: BookCheck,       label: "Causación",          to: "/causacion",         badge: { text: "Auto",  variant: "violet" } },
  { icon: Building2,       label: "DIAN",               to: "/dian",              badge: { text: "RPA",   variant: "orange" } },
  { icon: Zap,             label: "Servicios Públicos", to: "/servicios-publicos" },
  { icon: Fuel,            label: "Combustible",        to: "/combustible" },
  { icon: Users,           label: "Leads",              to: "/leads",             badge: { text: "Auto",  variant: "orange" } },
  { icon: ArrowLeftRight,  label: "Conciliación",       to: "/conciliacion",      badge: { text: "Pronto", variant: "gray" } },
  { icon: Shield,          label: "Comparendos",        to: "/comparendos",       badge: { text: "IA",     variant: "orange" } },
  { icon: Settings,        label: "Configuración",      to: "/configuracion" },
]

/* ── Page titles ── */
const PAGE_TITLES: Record<string, string> = {
  "/":                   "Dashboard",
  "/facturas":           "Facturas",
  "/facturas/nueva":     "Nueva Factura",
  "/causacion":          "Causación",
  "/dian":               "DIAN",
  "/servicios-publicos": "Servicios Públicos",
  "/combustible":        "Combustible",
  "/leads":              "Leads",
  "/conciliacion":       "Conciliación",
  "/comparendos":        "Comparendos",
  "/configuracion":      "Configuración",
}

/* ── Badge styles ── */
const BADGE: Record<string, React.CSSProperties & { className: string }> = {
  orange: {
    className: "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
    background: "rgba(249,115,22,0.2)",
    color: "#F97316",
    border: "1px solid rgba(249,115,22,0.3)",
  },
  violet: {
    className: "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
    background: "rgba(124,58,237,0.2)",
    color: "#A78BFA",
    border: "1px solid rgba(124,58,237,0.3)",
  },
  gray: {
    className: "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.35)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
}

/* ── Role badge ── */
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    administrador: { bg: "#7C3AED", color: "#fff",     label: "Administrador" },
    operador:      { bg: "#F97316", color: "#fff",     label: "Operador"      },
    visualizador:  { bg: "#2563EB", color: "#fff",     label: "Visualizador"  },
    cliente:       { bg: "#16A34A", color: "#fff",     label: "Cliente"       },
  }
  const s = styles[role] ?? { bg: "#6B7280", color: "#fff", label: role }
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

/* ── Sidebar ── */
function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation()

  return (
    <aside
      className="flex flex-col h-full w-[260px] shrink-0"
      style={{ background: "#0F0F1A" }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex flex-col leading-tight">
          <span
            className="text-2xl font-bold"
            style={{ color: "#7C3AED" }}
          >
            IntegrIA
          </span>
          <span className="text-[11px] tracking-widest uppercase" style={{ color: "#6B7280" }}>
            Solutions
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, to, badge }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)
          const { className: badgeClass, ...badgeStyle } = badge ? BADGE[badge.variant] : { className: "" }

          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={({ isActive: navActive }) => ({
                background: (navActive && to !== "/") || isActive ? "#7C3AED" : "transparent",
                color: isActive ? "#FFFFFF" : "#9CA3AF",
                borderLeft: isActive ? "3px solid #F97316" : "3px solid transparent",
                paddingLeft: "calc(0.75rem - 3px)",
              })}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                  e.currentTarget.style.color = "#FFFFFF"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#9CA3AF"
                }
              }}
            >
              <Icon
                size={18}
                style={{ color: isActive ? "#FFFFFF" : "#6B7280", flexShrink: 0 }}
              />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span className={badgeClass} style={badgeStyle}>
                  {badge.text}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-6 py-4 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-[11px]" style={{ color: "#4B5563" }}>
          IntegrIApp v1.0
        </p>
      </div>
    </aside>
  )
}

/* ── Topbar ── */
function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Página"

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U"

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  return (
    <header
      className="h-16 shrink-0 flex items-center justify-between px-6"
      style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E7EB" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md transition-colors"
          style={{ color: "#FFFFFF", background: "#7C3AED" }}
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base font-bold" style={{ color: "#1A1A2E" }}>
          {pageTitle}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold text-white focus:outline-none transition-opacity hover:opacity-80"
              style={{ background: "#7C3AED" }}
            >
              {initials}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* User info */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold leading-none text-gray-900">
                  {profile?.full_name ?? "Usuario"}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {profile?.email ?? ""}
                </p>
                {profile?.role && (
                  <div className="pt-0.5">
                    <RoleBadge role={profile.role} />
                  </div>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/perfil")}>
              <User className="mr-2 h-4 w-4 text-gray-500" />
              Mi perfil
            </DropdownMenuItem>

            {profile?.role === "administrador" && (
              <DropdownMenuItem onClick={() => navigate("/usuarios")}>
                <Users2 className="mr-2 h-4 w-4 text-gray-500" />
                Gestión de usuarios
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

/* ── Layout ── */
export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
  )
}
