import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSearch,
  BookCheck,
  Building2,
  Zap,
  Fuel,
  Users,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Layers,
} from "lucide-react";

/* ── Types ── */
interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  iconBg: string;
  iconColor: string;
}

interface FlowCard {
  icon: React.ElementType;
  name: string;
  description: string;
  to: string;
  status: "activo" | "pausado";
  tech: string;
  techColor: string;
  executions: number;
}

interface ActivityRow {
  id: string;
  flujo: string;
  tipo: string;
  resultado: "Exitoso" | "Error" | "En proceso";
  timestamp: string;
  duracion: string;
}

/* ── Data ── */
const STATS: StatCard[] = [
  {
    label: "Flujos Activos",
    value: 5,
    icon: Layers,
    accent: "from-violet-500 to-violet-700",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
  },
  {
    label: "Ejecuciones Hoy",
    value: 23,
    icon: Activity,
    accent: "from-orange-400 to-orange-600",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-400",
  },
  {
    label: "Documentos Procesados",
    value: 147,
    icon: CheckCircle2,
    accent: "from-emerald-500 to-emerald-700",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    label: "Alertas",
    value: 1,
    icon: AlertTriangle,
    accent: "from-amber-400 to-amber-600",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
];

const FLOWS: FlowCard[] = [
  {
    icon: FileSearch,
    name: "Extracción de Facturas",
    description: "Lee PDFs y XMLs de facturas electrónicas, extrae datos y los valida con la DIAN.",
    to: "/facturas",
    status: "activo",
    tech: "IA",
    techColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    executions: 47,
  },
  {
    icon: BookCheck,
    name: "Causación Contable",
    description: "Genera asientos contables automáticos según el plan de cuentas PUC configurado.",
    to: "/causacion",
    status: "activo",
    tech: "n8n",
    techColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    executions: 31,
  },
  {
    icon: Building2,
    name: "Descarga DIAN",
    description: "Descarga automática de documentos electrónicos desde el portal DIAN.",
    to: "/dian",
    status: "activo",
    tech: "RPA",
    techColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    executions: 12,
  },
  {
    icon: Zap,
    name: "Servicios Públicos",
    description: "Captura y procesa facturas de servicios públicos con lectura OCR automática.",
    to: "/servicios-publicos",
    status: "activo",
    tech: "IA",
    techColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    executions: 8,
  },
  {
    icon: Fuel,
    name: "Combustible & Rutas",
    description: "Gestiona reportes de combustible, kilometraje y rutas de vehículos por WhatsApp.",
    to: "/combustible",
    status: "activo",
    tech: "WhatsApp",
    techColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    executions: 19,
  },
  {
    icon: Users,
    name: "Leads Comerciales",
    description: "Captura y califica leads desde WhatsApp, web y redes sociales con IA conversacional.",
    to: "/leads",
    status: "activo",
    tech: "WhatsApp",
    techColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    executions: 30,
  },
];

const ACTIVITY: ActivityRow[] = [
  { id: "EJ-0892", flujo: "Extracción de Facturas", tipo: "IA",       resultado: "Exitoso",    timestamp: "Hoy, 09:41",    duracion: "2.3s" },
  { id: "EJ-0891", flujo: "Descarga DIAN",          tipo: "RPA",      resultado: "Exitoso",    timestamp: "Hoy, 09:30",    duracion: "14.1s" },
  { id: "EJ-0890", flujo: "Causación Contable",     tipo: "n8n",      resultado: "En proceso", timestamp: "Hoy, 09:15",    duracion: "—" },
  { id: "EJ-0889", flujo: "Leads Comerciales",      tipo: "WhatsApp", resultado: "Exitoso",    timestamp: "Hoy, 08:55",    duracion: "0.8s" },
  { id: "EJ-0888", flujo: "Servicios Públicos",     tipo: "IA",       resultado: "Error",      timestamp: "Hoy, 08:42",    duracion: "5.2s" },
];

const RESULTADO_STYLES: Record<ActivityRow["resultado"], string> = {
  Exitoso:    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Error:      "bg-red-500/15 text-red-400 border border-red-500/30",
  "En proceso": "bg-amber-500/15 text-amber-400 border border-amber-500/30",
};

const RESULTADO_ICONS: Record<ActivityRow["resultado"], React.ElementType> = {
  Exitoso:    CheckCircle2,
  Error:      AlertTriangle,
  "En proceso": Clock,
};

/* ── Helpers ── */
function formatDate(d: Date) {
  return d.toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}
function formatTime(d: Date) {
  return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ── Component ── */
export default function Index() {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-8 max-w-[1400px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Centro de Automatizaciones
          </h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{formatDate(now)}</p>
        </div>
        <div className="text-right">
          <p
            className="text-2xl font-semibold tabular-nums text-gray-700"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {formatTime(now)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Hora local · Bogotá</p>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 card-hover"
          >
            <div className={`${iconBg} p-3 rounded-xl`}>
              <Icon size={22} className={iconColor} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-none mb-1">
                {label}
              </p>
              <p
                className="text-3xl font-bold text-gray-800 leading-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Flujos Grid ── */}
      <section>
        <h2
          className="text-base font-semibold text-gray-700 mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Flujos de Automatización
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {FLOWS.map(({ icon: Icon, name, description, to, status, tech, techColor, executions }) => (
            <div
              key={to}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 card-hover"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-violet-500/10 p-2.5 rounded-xl">
                    <Icon size={20} className="text-violet-500" />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-gray-800 text-sm leading-tight"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {executions} ejecuciones hoy
                    </p>
                  </div>
                </div>
                {/* Status dot */}
                <span className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${techColor}`}
                >
                  {tech}
                </span>
                <button
                  onClick={() => navigate(to)}
                  className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-orange-500 transition-colors"
                >
                  Ir al flujo
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Activity Table ── */}
      <section>
        <h2
          className="text-base font-semibold text-gray-700 mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Actividad Reciente
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Flujo</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Tipo</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Resultado</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Hora</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ACTIVITY.map((row) => {
                  const ResultIcon = RESULTADO_ICONS[row.resultado];
                  return (
                    <tr key={row.id} className="hover:bg-violet-50/30 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{row.id}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-700 text-xs">{row.flujo}</td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-[11px] font-medium text-gray-500">{row.tipo}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${RESULTADO_STYLES[row.resultado]}`}
                        >
                          <ResultIcon size={10} />
                          {row.resultado}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400 hidden md:table-cell">{row.timestamp}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-400 text-right font-mono hidden lg:table-cell">{row.duracion}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
