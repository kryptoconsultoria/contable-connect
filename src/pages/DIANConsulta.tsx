import { useCallback, useRef, useState } from "react";
import {
  Building2,
  Eye,
  EyeOff,
  Upload,
  FileSpreadsheet,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronRight,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Constants ── */
const WEBHOOK_URL =
  "https://n8n.appintegria.com/form/c8e76df8-13b6-4cf9-912e-fecd740ae700";

/* ── Mock data ── */
interface DianRow {
  id: string;
  numero: string;
  tipo: string;
  emisor: string;
  nit: string;
  fecha: string;
  valor: number;
  estado: "Aprobada" | "En proceso" | "Rechazada";
}

const MOCK_FACTURAS: DianRow[] = [
  { id: "1", numero: "FE-001234", tipo: "Factura electrónica", emisor: "TechCorp S.A.S.",          nit: "900.123.456-7", fecha: "2026-01-15", valor: 12500000, estado: "Aprobada"   },
  { id: "2", numero: "FE-000891", tipo: "Factura electrónica", emisor: "Distribuciones El Valle",  nit: "800.234.567-1", fecha: "2026-01-18", valor: 8340000,  estado: "En proceso" },
  { id: "3", numero: "NC-000045", tipo: "Nota crédito",        emisor: "Mi Empresa S.A.S.",        nit: "800.999.888-0", fecha: "2026-01-20", valor: 500000,   estado: "Aprobada"   },
  { id: "4", numero: "FE-001235", tipo: "Factura electrónica", emisor: "Grupo Andino S.A.",        nit: "900.567.890-4", fecha: "2026-01-22", valor: 15800000, estado: "Rechazada"  },
  { id: "5", numero: "FE-001098", tipo: "Factura electrónica", emisor: "Innovar Digital Ltda.",   nit: "901.345.678-2", fecha: "2026-02-01", valor: 3200000,  estado: "Aprobada"   },
];

const ESTADO_STYLES: Record<DianRow["estado"], string> = {
  Aprobada:    "bg-emerald-500/15 text-emerald-500 border-emerald-500/25",
  "En proceso":"bg-amber-500/15   text-amber-500   border-amber-500/25",
  Rechazada:   "bg-red-500/15     text-red-400     border-red-500/25",
};

const fmt = (v: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", minimumFractionDigits: 0,
  }).format(v);

/* ── Stepper ── */
const STEPS = [
  { n: 1, label: "Sube Excel con CUFEs",  desc: "Archivo .xlsx con lista de CUFEs a consultar" },
  { n: 2, label: "n8n consulta DIAN",     desc: "Robot RPA descarga documentos automáticamente" },
  { n: 3, label: "Facturas a Odoo",       desc: "Documentos validados se envían a contabilidad"  },
];

type Status = "idle" | "loading" | "success" | "error";

/* ─────────────────────────────────────────────────────── */
export default function DIANConsulta() {
  const { toast } = useToast();

  /* form */
  const [token, setToken]         = useState("");
  const [showToken, setShowToken] = useState(false);
  const [cliente, setCliente]     = useState("");
  const [archivo, setArchivo]     = useState<File | null>(null);
  const [dragging, setDragging]   = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const fileRef                   = useRef<HTMLInputElement>(null);

  /* ui */
  const [status, setStatus] = useState<Status>("idle");

  /* table filters */
  const [search, setSearch]           = useState("");
  const [estadoFilter, setEstadoFilter] = useState<"todos" | DianRow["estado"]>("todos");

  /* ── File handling ── */
  const acceptFile = useCallback((file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast({ title: "Formato no válido", description: "Solo .xlsx, .xls o .csv", variant: "destructive" });
      return;
    }
    setArchivo(file);
    setErrors((p) => ({ ...p, archivo: "" }));
  }, [toast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files[0]) acceptFile(e.dataTransfer.files[0]);
  }, [acceptFile]);

  /* ── Validation ── */
  function validate() {
    const next: Record<string, string> = {};
    if (!token.trim())   next.token   = "El Token DIAN es requerido.";
    if (!cliente.trim()) next.cliente  = "El nombre del cliente es requerido.";
    if (!archivo)        next.archivo  = "Debes adjuntar el archivo Excel de CUFEs.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("Token DIAN",            token.trim());
    fd.append("Cliente",               cliente.trim());
    fd.append("Reporte de Documentos", archivo!);

    setStatus("loading");
    try {
      const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      toast({ title: "¡Proceso iniciado!", description: "n8n está consultando la DIAN. Los documentos se procesarán en breve." });
    } catch {
      setStatus("error");
      toast({ title: "Error de conexión", description: "No se pudo conectar con n8n. Verifica el token y vuelve a intentar.", variant: "destructive" });
    }
  }

  function handleReset() {
    setToken(""); setCliente(""); setArchivo(null);
    setErrors({}); setStatus("idle");
  }

  /* ── Filtered rows ── */
  const filtered = MOCK_FACTURAS.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.numero.toLowerCase().includes(q) || f.emisor.toLowerCase().includes(q) || f.nit.includes(q);
    const matchEstado = estadoFilter === "todos" || f.estado === estadoFilter;
    return matchSearch && matchEstado;
  });

  /* ─── render ─── */
  return (
    <div className="space-y-8 max-w-[1100px]">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Descarga DIAN
          </h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-500 border-emerald-500/25">
            RPA
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Automatiza la descarga de facturas electrónicas desde el portal DIAN usando n8n.
        </p>
      </div>

      {/* ── Stepper ── */}
      <div className="bg-white rounded-2xl border border-gray-100 px-6 py-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Flujo del proceso
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-center gap-3 flex-1 min-w-0">
              {/* Step pill */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
                >
                  {step.n}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate"
                     style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">{step.desc}</p>
                </div>
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <ChevronRight size={16} className="shrink-0 text-gray-300 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Form card ── */}
      {status === "success" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center gap-5">
          <div className="bg-emerald-500/10 p-5 rounded-full">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <div>
            <h2
              className="text-xl font-bold text-gray-800 mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ¡Proceso RPA iniciado!
            </h2>
            <p className="text-sm text-gray-500 max-w-sm">
              n8n está consultando la DIAN y descargando los documentos. Recibirás una notificación al finalizar.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={14} /> Nuevo proceso
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <Building2 size={16} className="text-violet-500" />
              <h2
                className="font-semibold text-gray-700 text-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Iniciar proceso RPA
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Token DIAN */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Token DIAN <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => { setToken(e.target.value); setErrors((p) => ({ ...p, token: "" })); }}
                    placeholder="Token de autenticación DIAN"
                    className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-gray-800 font-mono placeholder-gray-300 outline-none transition focus:ring-2 focus:ring-violet-400/40 ${
                      errors.token ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-violet-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.token && <p className="text-xs text-red-400">{errors.token}</p>}
              </div>

              {/* Cliente */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Cliente <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => { setCliente(e.target.value); setErrors((p) => ({ ...p, cliente: "" })); }}
                  placeholder="Nombre o NIT del cliente"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition focus:ring-2 focus:ring-violet-400/40 ${
                    errors.cliente ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-violet-400"
                  }`}
                />
                {errors.cliente && <p className="text-xs text-red-400">{errors.cliente}</p>}
              </div>

              {/* Drag & drop Excel — full width */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Reporte de Documentos (Excel con CUFEs) <span className="text-red-400">*</span>
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all px-6 py-8 flex flex-col items-center gap-3 ${
                    dragging
                      ? "border-violet-400 bg-violet-50/60"
                      : errors.archivo
                      ? "border-red-300 bg-red-50/20"
                      : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/30"
                  }`}
                >
                  {archivo ? (
                    <>
                      <FileSpreadsheet size={28} className="text-emerald-500" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">{archivo.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{(archivo.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setArchivo(null); }}
                        className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload size={28} className="text-gray-300" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">
                          Arrastra tu archivo o{" "}
                          <span className="text-violet-500 underline">selecciónalo</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">.xlsx · .xls · .csv</p>
                      </div>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && acceptFile(e.target.files[0])}
                  />
                </div>
                {errors.archivo && <p className="text-xs text-red-400">{errors.archivo}</p>}
              </div>
            </div>

            {/* Error banner */}
            {status === "error" && (
              <div className="mx-6 mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                <AlertTriangle size={16} className="shrink-0" />
                No se pudo conectar con el webhook. Revisa el token e intenta de nuevo.
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
              >
                {status === "loading" ? (
                  <><Loader2 size={15} className="animate-spin" /> Procesando...</>
                ) : (
                  <><ArrowRight size={15} /> Iniciar proceso RPA</>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Facturas table ── */}
      <section>
        <h2
          className="text-base font-semibold text-gray-700 mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Documentos descargados
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por número, emisor o NIT..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition"
            />
          </div>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value as typeof estadoFilter)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 bg-white transition"
          >
            <option value="todos">Todos los estados</option>
            <option value="Aprobada">Aprobada</option>
            <option value="En proceso">En proceso</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  {["Número", "Tipo", "Emisor / NIT", "Fecha", "Valor", "Estado DIAN"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                      No se encontraron documentos con ese criterio.
                    </td>
                  </tr>
                ) : filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-violet-50/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-gray-700">{f.numero}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{f.tipo}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-700">{f.emisor}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{f.nit}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{f.fecha}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-gray-700 tabular-nums text-right">
                      {fmt(f.valor)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full border ${ESTADO_STYLES[f.estado]}`}
                      >
                        {f.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            {filtered.length} documento{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>
    </div>
  );
}
