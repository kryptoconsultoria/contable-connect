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
  badge?: { text: string; variant: "ia" | "rpa" | "auto" | "soon" }
  adminOnly?: boolean
}

interface NavGroup {
  label?: string
  items: NavItem[]
}

/* ── Nav groups ── */
const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/" },
    ],
  },
  {
    label: "OPERACIONES",
    items: [
      { icon: Fuel,           label: "Combustible",        to: "/combustible",       badge: { text: "Auto", variant: "auto" } },
      { icon: Zap,            label: "Servicios Públicos", to: "/servicios-publicos" },
      { icon: Shield,         label: "Comparendos",        to: "/comparendos",       badge: { text: "IA",   variant: "ia"   } },
      { icon: Users,          label: "Leads Comerciales",  to: "/leads",             badge: { text: "Auto", variant: "auto" } },
    ],
  },
  {
    label: "ADMINISTRATIVO Y FINANCIERO",
    items: [
      { icon: BookCheck,      label: "Causación",    to: "/causacion",    badge: { text: "Auto",  variant: "auto" } },
      { icon: Building2,      label: "DIAN",         to: "/dian",         badge: { text: "RPA",   variant: "rpa"  } },
      { icon: FileText,       label: "Facturas",     to: "/facturas",     badge: { text: "IA",    variant: "ia"   } },
      { icon: ArrowLeftRight, label: "Conciliación", to: "/conciliacion", badge: { text: "Pronto", variant: "soon" } },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { icon: Settings, label: "Configuración", to: "/configuracion" },
      { icon: Users2,   label: "Usuarios",      to: "/usuarios",     adminOnly: true },
    ],
  },
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
type BadgeVariant = "ia" | "rpa" | "auto" | "soon"

const BADGE_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  ia: {
    color: "#EA580C",
    background: "#FFF4EE",
    border: "1px solid #FDDCCC",
  },
  rpa: {
    color: "#16A34A",
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
  },
  auto: {
    color: "#6D28D9",
    background: "#F3EEFF",
    border: "1px solid #DDD6FE",
  },
  soon: {
    color: "#AEAEB2",
    background: "#F5F5F7",
    border: "1px solid #E8E8ED",
  },
}

function NavBadge({ variant, text }: { variant: BadgeVariant; text: string }) {
  return (
    <span
      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full leading-none"
      style={BADGE_STYLES[variant]}
    >
      {text}
    </span>
  )
}

/* ── Role badge ── */
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    administrador: { bg: "#F3EEFF", color: "#6D28D9", label: "Administrador" },
    operador:      { bg: "#FFF4EE", color: "#EA580C", label: "Operador"      },
    visualizador:  { bg: "#EFF6FF", color: "#2563EB", label: "Visualizador"  },
    cliente:       { bg: "#F0FDF4", color: "#16A34A", label: "Cliente"       },
  }
  const s = styles[role] ?? { bg: "#F5F5F7", color: "#6E6E73", label: role }
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
  const { profile } = useAuth()

  return (
    <aside
      className="flex flex-col h-full shrink-0"
      style={{
        width: "240px",
        background: "#FFFFFF",
        borderRight: "1px solid #E8E8ED",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5"
        style={{ borderBottom: "1px solid #E8E8ED" }}
      >
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-bold" style={{ color: "#1D1D1F" }}>
            IntegrIA
          </span>
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "#AEAEB2" }}
          >
            Solutions
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md transition-colors"
            style={{ color: "#AEAEB2" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1D1D1F")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#AEAEB2")}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group, gi) => {
          const visibleItems = group.items.filter(
            (item) => !item.adminOnly || profile?.role === "administrador"
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={gi}>
              {group.label && (
                <div
                  className="px-3 pb-1"
                  style={{
                    marginTop: gi === 0 ? 0 : "20px",
                    borderTop: gi === 0 ? "none" : "1px solid #E8E8ED",
                    paddingTop: gi === 0 ? 0 : "16px",
                  }}
                >
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "#AEAEB2" }}
                  >
                    {group.label}
                  </span>
                </div>
              )}
              <div className="space-y-0.5 mt-1">
                {visibleItems.map(({ icon: Icon, label, to, badge }) => {
                  const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={onClose}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                      style={() => ({
                        background: isActive ? "#F3EEFF" : "transparent",
                        color: isActive ? "#6D28D9" : "#6E6E73",
                      })}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "#F5F5F7"
                          e.currentTarget.style.color = "#1D1D1F"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent"
                          e.currentTarget.style.color = "#6E6E73"
                        }
                      }}
                    >
                      <Icon
                        size={16}
                        style={{
                          color: isActive ? "#6D28D9" : "#AEAEB2",
                          flexShrink: 0,
                          transition: "color 0.15s",
                        }}
                      />
                      <span className="flex-1 truncate">{label}</span>
                      {badge && <NavBadge variant={badge.variant} text={badge.text} />}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid #E8E8ED" }}
      >
        <p className="text-[11px]" style={{ color: "#AEAEB2" }}>
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
      className="h-14 shrink-0 flex items-center justify-between px-6"
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E8E8ED",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md transition-colors"
          style={{ color: "#6E6E73" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F7")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <Menu size={18} />
        </button>

        <h1
          className="font-medium"
          style={{ fontSize: "15px", color: "#1D1D1F" }}
        >
          {pageTitle}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center rounded-full text-sm font-semibold text-white focus:outline-none transition-opacity hover:opacity-85"
              style={{
                width: "32px",
                height: "32px",
                background: "#6D28D9",
              }}
            >
              {initials}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
            style={{ border: "1px solid #E8E8ED", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold leading-none" style={{ color: "#1D1D1F" }}>
                  {profile?.full_name ?? "Usuario"}
                </p>
                <p className="text-xs leading-none" style={{ color: "#6E6E73" }}>
                  {profile?.email ?? ""}
                </p>
                {profile?.role && (
                  <div className="pt-0.5">
                    <RoleBadge role={profile.role} />
                  </div>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator style={{ background: "#E8E8ED" }} />

            <DropdownMenuItem onClick={() => navigate("/perfil")}>
              <User className="mr-2 h-4 w-4" style={{ color: "#AEAEB2" }} />
              Mi perfil
            </DropdownMenuItem>

            {profile?.role === "administrador" && (
              <DropdownMenuItem onClick={() => navigate("/usuarios")}>
                <Users2 className="mr-2 h-4 w-4" style={{ color: "#AEAEB2" }} />
                Gestión de usuarios
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator style={{ background: "#E8E8ED" }} />

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
    <div className="flex h-screen overflow-hidden" style={{ background: "#FAFAFA" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/30"
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
          style={{ background: "#FAFAFA", padding: "32px" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
