import { useNavigate } from "react-router-dom";
import {
  FileSearch,
  BookCheck,
  Building2,
  Zap,
  Fuel,
  Users,
  ArrowRight,
  MoreHorizontal,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ── KPI Data ── */
const KPIS = [
  {
    label: "Procesos Activos",
    value: "6",
    badge: "+2 este mes",
    badgeStyle: { color: "#16A34A", background: "#F0FDF4" },
  },
  {
    label: "Ejecuciones Hoy",
    value: "23",
    badge: "+8%",
    badgeStyle: { color: "#16A34A", background: "#F0FDF4" },
  },
  {
    label: "Documentos Procesados",
    value: "147",
    badge: "+12%",
    badgeStyle: { color: "#16A34A", background: "#F0FDF4" },
  },
  {
    label: "Tiempo Promedio",
    value: "1.4s",
    badge: "−0.3s",
    badgeStyle: { color: "#6D28D9", background: "#F3EEFF" },
  },
];

/* ── Running Processes ── */
const PROCESSES = [
  {
    name: "Extracción de Facturas",
    dotColor: "#3B82F6",
    status: "Activo",
    statusStyle: { color: "#16A34A", background: "#F0FDF4" },
    lastActivity: "Hace 2 min",
    to: "/facturas",
  },
  {
    name: "Descarga DIAN",
    dotColor: "#6D28D9",
    status: "Activo",
    statusStyle: { color: "#16A34A", background: "#F0FDF4" },
    lastActivity: "Hace 5 min",
    to: "/dian",
  },
  {
    name: "Leads Comerciales",
    dotColor: "#F97316",
    status: "Activo",
    statusStyle: { color: "#16A34A", background: "#F0FDF4" },
    lastActivity: "Hace 12 min",
    to: "/leads",
  },
  {
    name: "Causación Contable",
    dotColor: "#AEAEB2",
    status: "En espera",
    statusStyle: { color: "#6E6E73", background: "#F5F5F7" },
    lastActivity: "Hace 1 hora",
    to: "/causacion",
  },
  {
    name: "Combustible & Rutas",
    dotColor: "#16A34A",
    status: "Activo",
    statusStyle: { color: "#16A34A", background: "#F0FDF4" },
    lastActivity: "Hace 30 min",
    to: "/combustible",
  },
  {
    name: "Servicios Públicos",
    dotColor: "#0EA5E9",
    status: "Activo",
    statusStyle: { color: "#16A34A", background: "#F0FDF4" },
    lastActivity: "Ayer, 18:30",
    to: "/servicios-publicos",
  },
];

/* ── Flow Cards ── */
const FLOWS = [
  {
    icon: FileSearch,
    iconBg: "#F5F5F7",
    iconColor: "#6D28D9",
    name: "Extracción de Facturas",
    tech: "IA",
    techStyle: { color: "#EA580C", background: "#FFF4EE" },
    to: "/facturas",
  },
  {
    icon: Building2,
    iconBg: "#F5F5F7",
    iconColor: "#6D28D9",
    name: "Descarga DIAN",
    tech: "RPA",
    techStyle: { color: "#16A34A", background: "#F0FDF4" },
    to: "/dian",
  },
  {
    icon: Users,
    iconBg: "#F5F5F7",
    iconColor: "#6D28D9",
    name: "Leads Comerciales",
    tech: "IA",
    techStyle: { color: "#EA580C", background: "#FFF4EE" },
    to: "/leads",
  },
  {
    icon: BookCheck,
    iconBg: "#F5F5F7",
    iconColor: "#6D28D9",
    name: "Causación Contable",
    tech: "Auto",
    techStyle: { color: "#6D28D9", background: "#F3EEFF" },
    to: "/causacion",
  },
  {
    icon: Fuel,
    iconBg: "#F5F5F7",
    iconColor: "#6D28D9",
    name: "Combustible & Rutas",
    tech: "RPA",
    techStyle: { color: "#16A34A", background: "#F0FDF4" },
    to: "/combustible",
  },
  {
    icon: Zap,
    iconBg: "#F5F5F7",
    iconColor: "#6D28D9",
    name: "Servicios Públicos",
    tech: "IA",
    techStyle: { color: "#EA580C", background: "#FFF4EE" },
    to: "/servicios-publicos",
  },
];

/* ── Component ── */
export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#1D1D1F" }}>
          Centro de Automatizaciones
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#6E6E73" }}>
          Monitorea y gestiona tus procesos activos
        </p>
      </div>

      {/* ── SECTION 1: KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(({ label, value, badge, badgeStyle }) => (
          <div
            key={label}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E8ED",
              borderRadius: "12px",
              padding: "20px 24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <p className="text-[13px] font-medium mb-2" style={{ color: "#6E6E73" }}>{label}</p>
            <p className="font-semibold mb-3" style={{ fontSize: "28px", color: "#1D1D1F", lineHeight: 1 }}>
              {value}
            </p>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={badgeStyle}
            >
              {badge}
            </span>
          </div>
        ))}
      </div>

      {/* ── SECTION 2: Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left: Procesos en Ejecución (2/3) */}
        <div
          className="lg:col-span-2 overflow-hidden"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E8ED",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #F0F0F5" }}
          >
            <h2 className="font-semibold text-[15px]" style={{ color: "#1D1D1F" }}>
              Procesos en Ejecución
            </h2>
            <button
              onClick={() => navigate("/configuracion")}
              className="text-sm font-medium transition-colors"
              style={{ color: "#6D28D9" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#5B21B6")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6D28D9")}
            >
              Ver todo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F0F0F5" }}>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#6E6E73" }}>Proceso</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#6E6E73" }}>Estado</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: "#6E6E73" }}>Última actividad</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-center" style={{ color: "#6E6E73" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {PROCESSES.map((proc, i) => (
                  <tr
                    key={proc.name}
                    style={{
                      borderBottom: i < PROCESSES.length - 1 ? "1px solid #F0F0F5" : "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: proc.dotColor }}
                        />
                        <span className="font-medium text-sm" style={{ color: "#1D1D1F" }}>
                          {proc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={proc.statusStyle}
                      >
                        {proc.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 hidden sm:table-cell text-xs" style={{ color: "#6E6E73" }}>
                      {proc.lastActivity}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: "#AEAEB2" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#F5F5F7"
                              e.currentTarget.style.color = "#6E6E73"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent"
                              e.currentTarget.style.color = "#AEAEB2"
                            }}
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-36"
                          style={{ border: "1px solid #E8E8ED", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                        >
                          <DropdownMenuItem onClick={() => navigate(proc.to)}>
                            Ver detalle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: two stacked cards (1/3) */}
        <div className="flex flex-col gap-4">

          {/* Card 1: Dark CTA */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "#1D1D1F" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#6E6E73" }}>
                Configuración
              </p>
              <h3 className="font-semibold text-base leading-snug" style={{ color: "#FFFFFF" }}>
                Nuevo proceso disponible
              </h3>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Conecta nuevos flujos de automatización desde el panel de configuración
              </p>
            </div>
            <button
              onClick={() => navigate("/configuracion")}
              className="self-start text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              style={{ background: "#6D28D9", color: "#FFFFFF" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#5B21B6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#6D28D9")}
            >
              Ir a configuración
            </button>
          </div>

          {/* Card 2: Activity */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E8ED",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center gap-2">
              <Activity size={15} style={{ color: "#AEAEB2" }} />
              <h3 className="font-semibold text-[15px]" style={{ color: "#1D1D1F" }}>
                Actividad del sistema
              </h3>
            </div>

            {/* Ejecuciones */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#6E6E73" }}>Ejecuciones del mes</span>
                <span className="text-sm font-semibold" style={{ color: "#1D1D1F" }}>147 / 200</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F0F5" }}>
                <div className="h-full rounded-full" style={{ width: "73.5%", background: "#6D28D9" }} />
              </div>
              <p className="text-[12px]" style={{ color: "#AEAEB2" }}>73% del límite mensual usado</p>
            </div>

            {/* Almacenamiento */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: "#6E6E73" }}>Almacenamiento</span>
                <span className="text-sm font-semibold" style={{ color: "#1D1D1F" }}>2.3 / 5 GB</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F0F5" }}>
                <div className="h-full rounded-full" style={{ width: "46%", background: "#EA580C" }} />
              </div>
              <p className="text-[12px]" style={{ color: "#AEAEB2" }}>46% del almacenamiento usado</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 3: Flow Grid ── */}
      <section>
        <h2 className="font-semibold text-[15px] mb-4" style={{ color: "#1D1D1F" }}>
          Flujos de Automatización
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {FLOWS.map(({ icon: Icon, iconBg, iconColor, name, tech, techStyle, to }) => (
            <div
              key={to}
              onClick={() => navigate(to)}
              className="flex items-center gap-4 cursor-pointer transition-all group"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E8ED",
                borderRadius: "12px",
                padding: "16px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6D28D9"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(109,40,217,0.08)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E8E8ED"
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"
              }}
            >
              <div
                className="p-2.5 rounded-xl flex-shrink-0"
                style={{ background: iconBg }}
              >
                <Icon size={18} style={{ color: iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "#1D1D1F" }}>{name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: "#16A34A", background: "#F0FDF4" }}
                  >
                    Activo
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={techStyle}
                  >
                    {tech}
                  </span>
                </div>
              </div>
              <ArrowRight size={15} style={{ color: "#AEAEB2", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
