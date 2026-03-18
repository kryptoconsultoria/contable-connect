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
  Settings,
  Activity,
  CheckCircle2,
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
    badgeColor: "text-emerald-700 bg-emerald-100",
  },
  {
    label: "Ejecuciones Hoy",
    value: "23",
    badge: "+8%",
    badgeColor: "text-emerald-700 bg-emerald-100",
  },
  {
    label: "Documentos Procesados",
    value: "147",
    badge: "+12%",
    badgeColor: "text-emerald-700 bg-emerald-100",
  },
  {
    label: "Tiempo Promedio",
    value: "1.4s",
    badge: "-0.3s",
    badgeColor: "text-violet-700 bg-violet-100",
  },
];

/* ── Running Processes ── */
const PROCESSES = [
  {
    name: "Extracción de Facturas",
    dotColor: "bg-blue-500",
    status: "Activo",
    statusColor: "text-emerald-700 bg-emerald-100",
    lastActivity: "Hace 2 min",
    to: "/facturas",
  },
  {
    name: "Descarga DIAN",
    dotColor: "bg-violet-500",
    status: "Activo",
    statusColor: "text-emerald-700 bg-emerald-100",
    lastActivity: "Hace 5 min",
    to: "/dian",
  },
  {
    name: "Leads Comerciales",
    dotColor: "bg-orange-400",
    status: "Activo",
    statusColor: "text-emerald-700 bg-emerald-100",
    lastActivity: "Hace 12 min",
    to: "/leads",
  },
  {
    name: "Causación Contable",
    dotColor: "bg-gray-400",
    status: "En espera",
    statusColor: "text-gray-600 bg-gray-100",
    lastActivity: "Hace 1 hora",
    to: "/causacion",
  },
  {
    name: "Combustible & Rutas",
    dotColor: "bg-emerald-500",
    status: "Activo",
    statusColor: "text-emerald-700 bg-emerald-100",
    lastActivity: "Hace 30 min",
    to: "/combustible",
  },
  {
    name: "Servicios Públicos",
    dotColor: "bg-sky-400",
    status: "Activo",
    statusColor: "text-emerald-700 bg-emerald-100",
    lastActivity: "Ayer, 18:30",
    to: "/servicios-publicos",
  },
];

/* ── Flow Cards ── */
const FLOWS = [
  {
    icon: FileSearch,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    name: "Extracción de Facturas",
    tech: "IA",
    techColor: "text-orange-700 bg-orange-100",
    to: "/facturas",
  },
  {
    icon: Building2,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    name: "Descarga DIAN",
    tech: "RPA",
    techColor: "text-emerald-700 bg-emerald-100",
    to: "/dian",
  },
  {
    icon: Users,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    name: "Leads Comerciales",
    tech: "IA",
    techColor: "text-orange-700 bg-orange-100",
    to: "/leads",
  },
  {
    icon: BookCheck,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    name: "Causación Contable",
    tech: "Auto",
    techColor: "text-blue-700 bg-blue-100",
    to: "/causacion",
  },
  {
    icon: Fuel,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    name: "Combustible & Rutas",
    tech: "RPA",
    techColor: "text-emerald-700 bg-emerald-100",
    to: "/combustible",
  },
  {
    icon: Zap,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    name: "Servicios Públicos",
    tech: "IA",
    techColor: "text-orange-700 bg-orange-100",
    to: "/servicios-publicos",
  },
];

/* ── Component ── */
export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6 max-w-[1400px]">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de Automatizaciones</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitorea y gestiona tus procesos activos</p>
      </div>

      {/* ── SECTION 1: KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(({ label, value, badge, badgeColor }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
            <p className="text-3xl font-bold text-gray-900 leading-none mb-3">{value}</p>
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          </div>
        ))}
      </div>

      {/* ── SECTION 2: Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left: Procesos en Ejecución (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 text-base">Procesos en Ejecución</h2>
            <button
              onClick={() => navigate("/configuracion")}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
            >
              Ver todo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-50">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Proceso</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Última actividad</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PROCESSES.map((proc) => (
                  <tr key={proc.name} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${proc.dotColor}`} />
                        <span className="font-medium text-gray-800 text-sm">{proc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${proc.statusColor}`}>
                        {proc.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 hidden sm:table-cell text-xs text-gray-500">
                      {proc.lastActivity}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
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

        {/* Right: Two stacked cards (1/3) */}
        <div className="flex flex-col gap-4">

          {/* Card 1: Gradient CTA */}
          <div
            className="rounded-3xl p-6 text-white flex flex-col gap-4"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)" }}
          >
            <div className="flex items-center gap-2 opacity-80">
              <Settings size={16} />
              <span className="text-xs font-semibold uppercase tracking-wider">Configuración</span>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">Nuevo proceso disponible</h3>
              <p className="text-sm text-white/75 mt-1 leading-relaxed">
                Conecta nuevos flujos de automatización desde el panel de configuración
              </p>
            </div>
            <button
              onClick={() => navigate("/configuracion")}
              className="self-start bg-white text-violet-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Ir a configuración
            </button>
          </div>

          {/* Card 2: Activity */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-gray-400" />
              <h3 className="font-bold text-gray-900 text-base">Actividad del sistema</h3>
            </div>

            {/* Progress: Ejecuciones */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Ejecuciones del mes</span>
                <span className="text-sm font-bold text-gray-900">147 / 200</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: "73.5%" }} />
              </div>
              <p className="text-xs text-gray-400">73% del límite mensual usado</p>
            </div>

            {/* Progress: Almacenamiento */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Almacenamiento</span>
                <span className="text-sm font-bold text-gray-900">2.3 GB / 5 GB</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: "46%" }} />
              </div>
              <p className="text-xs text-gray-400">46% del almacenamiento usado</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 3: Flow Grid ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={16} className="text-gray-400" />
          <h2 className="font-bold text-gray-900 text-base">Flujos de Automatización</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {FLOWS.map(({ icon: Icon, iconBg, iconColor, name, tech, techColor, to }) => (
            <div
              key={to}
              onClick={() => navigate(to)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 cursor-pointer hover:shadow-violet-100 hover:shadow-md hover:border-violet-100 transition-all group"
            >
              <div className={`${iconBg} p-3 rounded-xl flex-shrink-0`}>
                <Icon size={20} className={iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-emerald-700 bg-emerald-100">
                    Activo
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${techColor}`}>
                    {tech}
                  </span>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-gray-300 group-hover:text-violet-500 transition-colors flex-shrink-0"
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
