import { useRef, useState, useCallback } from "react";
import {
  Users,
  Upload,
  FileSpreadsheet,
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Constants ── */
const WEBHOOK_URL = "https://n8n.appintegria.com/webhook/uihome";
const MAX_MSG_CHARS = 1000;
const ALLOWED_EXT = [".xlsx", ".xls", ".csv"];

/* ── Mock history ── */
interface CampaignRow {
  id: string;
  nombre: string;
  fecha: string;
  contactos: number;
  enviados: number;
  estado: "Completado" | "En proceso" | "Error" | "Programado";
}

const HISTORY: CampaignRow[] = [
  { id: "C-004", nombre: "Renovación Q1 2026",    fecha: "10 mar 2026", contactos: 320, enviados: 318, estado: "Completado"  },
  { id: "C-003", nombre: "Promo Febrero",          fecha: "28 feb 2026", contactos: 145, enviados: 145, estado: "Completado"  },
  { id: "C-002", nombre: "Seguimiento Diciembre",  fecha: "15 dic 2025", contactos: 89,  enviados: 72,  estado: "Error"       },
  { id: "C-001", nombre: "Lanzamiento IntegrIA",   fecha: "01 dic 2025", contactos: 210, enviados: 210, estado: "Completado"  },
];

const ESTADO_STYLES: Record<CampaignRow["estado"], string> = {
  Completado:  "bg-emerald-500/15 text-emerald-500 border-emerald-500/25",
  "En proceso":"bg-amber-500/15   text-amber-500   border-amber-500/25",
  Error:       "bg-red-500/15     text-red-500     border-red-500/25",
  Programado:  "bg-violet-500/15  text-violet-500  border-violet-500/25",
};

const ESTADO_ICONS: Record<CampaignRow["estado"], React.ElementType> = {
  Completado:  CheckCircle2,
  "En proceso": Clock,
  Error:       AlertTriangle,
  Programado:  Calendar,
};

/* ── Validation ── */
function isAllowedFile(file: File) {
  return ALLOWED_EXT.some((ext) => file.name.toLowerCase().endsWith(ext));
}

/* ── Component ── */
export default function Leads() {
  const { toast } = useToast();

  /* form state */
  const [campana, setCampana]         = useState("");
  const [archivo, setArchivo]         = useState<File | null>(null);
  const [mensaje, setMensaje]         = useState("");
  const [enviarAhora, setEnviarAhora] = useState(true);
  const [fecha, setFecha]             = useState("");
  const [dragging, setDragging]       = useState(false);

  /* ui state */
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Drag & drop handlers ── */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!isAllowedFile(file)) {
      toast({ title: "Formato no válido", description: "Solo se aceptan archivos .xlsx, .xls o .csv", variant: "destructive" });
      return;
    }
    setArchivo(file);
    setErrors((prev) => ({ ...prev, archivo: "" }));
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAllowedFile(file)) {
      toast({ title: "Formato no válido", description: "Solo se aceptan archivos .xlsx, .xls o .csv", variant: "destructive" });
      return;
    }
    setArchivo(file);
    setErrors((prev) => ({ ...prev, archivo: "" }));
  };

  /* ── Validation ── */
  function validate() {
    const next: Record<string, string> = {};
    if (!campana.trim())       next.campana  = "El nombre de campaña es requerido.";
    if (!archivo)              next.archivo  = "Debes adjuntar un archivo de contactos.";
    if (!mensaje.trim())       next.mensaje  = "El mensaje no puede estar vacío.";
    if (mensaje.length > MAX_MSG_CHARS) next.mensaje = `Máximo ${MAX_MSG_CHARS} caracteres.`;
    if (!enviarAhora && !fecha) next.fecha   = "Selecciona una fecha de envío.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("campana",      campana.trim());
    fd.append("archivo",      archivo!);
    fd.append("mensaje",      mensaje.trim());
    fd.append("programacion", enviarAhora ? "ahora" : fecha);

    setLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSuccess(true);
      toast({ title: "¡Campaña lanzada!", description: `"${campana}" fue enviada correctamente.` });
    } catch (err) {
      toast({
        title: "Error al enviar",
        description: "No se pudo conectar con el webhook. Verifica la conexión e intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCampana(""); setArchivo(null); setMensaje("");
    setEnviarAhora(true); setFecha(""); setErrors({});
    setSuccess(false);
  }

  /* ────────────────────────────── render ────────────────────────────── */
  return (
    <div className="space-y-8 max-w-[1100px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1
              className="text-2xl font-bold text-gray-800"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Leads Comerciales
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-500 border-emerald-500/25">
              WhatsApp
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Lanza campañas masivas por WhatsApp con mensajes personalizados para cada contacto.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          n8n conectado
        </div>
      </div>

      {/* ── Form card ── */}
      {success ? (
        /* ── Success view ── */
        <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center text-center gap-5 shadow-sm">
          <div className="bg-emerald-500/10 p-5 rounded-full">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <div>
            <h2
              className="text-xl font-bold text-gray-800 mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ¡Campaña lanzada exitosamente!
            </h2>
            <p className="text-sm text-gray-500">
              <strong>"{campana}"</strong> fue enviada al webhook de n8n y está siendo procesada.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
          >
            Nueva campaña
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <MessageSquare size={16} className="text-violet-500" />
              <h2
                className="font-semibold text-gray-700 text-sm"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Nueva Campaña
              </h2>
            </div>

            <div className="p-6 space-y-6">

              {/* Nombre campaña */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Nombre de campaña <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={campana}
                  onChange={(e) => { setCampana(e.target.value); setErrors((p) => ({ ...p, campana: "" })); }}
                  placeholder="Ej: Renovación Clientes Q2 2026"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition focus:ring-2 focus:ring-violet-400/40 ${
                    errors.campana ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-violet-400"
                  }`}
                />
                {errors.campana && <p className="text-xs text-red-400">{errors.campana}</p>}
              </div>

              {/* Drag & drop */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Base de datos de contactos <span className="text-red-400">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
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
                        <p className="text-xs text-gray-400 mt-0.5">
                          {(archivo.size / 1024).toFixed(1)} KB
                        </p>
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
                          Arrastra tu archivo aquí o <span className="text-violet-500 underline">selecciónalo</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Formatos aceptados: .xlsx, .xls, .csv
                        </p>
                      </div>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
                {errors.archivo && <p className="text-xs text-red-400">{errors.archivo}</p>}
              </div>

              {/* Mensaje */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Mensaje personalizado <span className="text-red-400">*</span>
                  </label>
                  <span className={`text-xs tabular-nums ${mensaje.length > MAX_MSG_CHARS ? "text-red-400" : "text-gray-400"}`}>
                    {mensaje.length}/{MAX_MSG_CHARS}
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={mensaje}
                  onChange={(e) => { setMensaje(e.target.value); setErrors((p) => ({ ...p, mensaje: "" })); }}
                  placeholder="Hola {nombre}, te contactamos de IntegrIA Solutions..."
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none resize-none transition focus:ring-2 focus:ring-violet-400/40 ${
                    errors.mensaje ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-violet-400"
                  }`}
                />
                <p className="text-xs text-gray-400">
                  Usa <code className="bg-gray-100 px-1 py-0.5 rounded text-violet-600 text-[11px]">{"{nombre}"}</code> para personalizar con el nombre del contacto.
                </p>
                {errors.mensaje && <p className="text-xs text-red-400">{errors.mensaje}</p>}
              </div>

              {/* Programación */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Programación de envío
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      enviarAhora ? "border-violet-400 bg-violet-50/40" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="programacion"
                      checked={enviarAhora}
                      onChange={() => setEnviarAhora(true)}
                      className="accent-violet-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Enviar ahora</p>
                      <p className="text-xs text-gray-400">Se lanza inmediatamente</p>
                    </div>
                  </label>
                  <label
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      !enviarAhora ? "border-violet-400 bg-violet-50/40" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="programacion"
                      checked={!enviarAhora}
                      onChange={() => setEnviarAhora(false)}
                      className="accent-violet-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Programar envío</p>
                      <p className="text-xs text-gray-400">Elige fecha y hora</p>
                    </div>
                  </label>
                </div>

                {!enviarAhora && (
                  <div className="space-y-1">
                    <input
                      type="datetime-local"
                      value={fecha}
                      onChange={(e) => { setFecha(e.target.value); setErrors((p) => ({ ...p, fecha: "" })); }}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-violet-400/40 ${
                        errors.fecha ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-violet-400"
                      }`}
                    />
                    {errors.fecha && <p className="text-xs text-red-400">{errors.fecha}</p>}
                  </div>
                )}
              </div>
            </div>

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
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Lanzar Campaña
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── History table ── */}
      <section>
        <h2
          className="text-base font-semibold text-gray-700 mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Historial de Campañas
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  {["ID", "Campaña", "Fecha", "Contactos", "Enviados", "Estado"].map((h) => (
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
                {HISTORY.map((row) => {
                  const Icon = ESTADO_ICONS[row.estado];
                  const pct = row.contactos > 0 ? Math.round((row.enviados / row.contactos) * 100) : 0;
                  return (
                    <tr key={row.id} className="hover:bg-violet-50/20 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{row.id}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-700">{row.nombre}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{row.fecha}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-600 tabular-nums">{row.contactos.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 tabular-nums w-8">{row.enviados}</span>
                          <div className="flex-1 min-w-[60px] h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: row.estado === "Error"
                                  ? "#EF4444"
                                  : "linear-gradient(90deg, #7C3AED, #F97316)",
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${ESTADO_STYLES[row.estado]}`}
                        >
                          <Icon size={10} />
                          {row.estado}
                        </span>
                      </td>
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
