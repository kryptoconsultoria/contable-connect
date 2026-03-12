/*
 * ══════════════════════════════════════════════════════════════════════════
 * SQL — Ejecutar en Supabase SQL Editor antes de usar esta página
 * ══════════════════════════════════════════════════════════════════════════
 *
 * create table if not exists public.comparendos (
 *   id                     uuid primary key default gen_random_uuid(),
 *   numero                 text not null,
 *   numero_identificacion  text default '',
 *   nombre_infractor       text default '',
 *   fecha_nacimiento       text default '',
 *   nacionalidad           text default '',
 *   direccion              text default '',
 *   placa                  text default '',
 *   marca_vehiculo         text default '',
 *   modelo_vehiculo        text default '',
 *   anio_vehiculo          text default '',
 *   color_vehiculo         text default '',
 *   tipo_contravencion     text default '',
 *   clase_contravencion    text default '',
 *   descripcion_infraccion text default '',
 *   lugar_infraccion       text default '',
 *   valor_multa            text default '',
 *   puntos_descontados     text default '',
 *   fecha_hora             text default '',
 *   nombre_agente          text default '',
 *   credencial_agente      text default '',
 *   transcripcion          text default '',
 *   estado                 text not null default 'Borrador',
 *   created_at             timestamptz default now()
 * );
 *
 * alter table public.comparendos enable row level security;
 *
 * create policy "Allow all for authenticated" on public.comparendos
 *   for all using (auth.role() = 'authenticated');
 *
 * ══════════════════════════════════════════════════════════════════════════
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Shield,
  Mic,
  MicOff,
  ChevronDown,
  ChevronUp,
  Printer,
  ArrowLeft,
  Plus,
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Car,
  MapPin,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ── Env ── */
const ANTHROPIC_KEY = (import.meta.env.VITE_ANTHROPIC_API_KEY as string) || "";

/* ── Types ── */
type Vista = "lista" | "captura" | "detalle";
type EstadoGrab = "idle" | "grabando" | "procesando";
type EstadoIA = "idle" | "analizando" | "done" | "error";
type EstadoComp = "Borrador" | "Emitido" | "Pagado" | "Impugnado";

interface FormData {
  numeroIdentificacion: string;
  nombreInfractor: string;
  fechaNacimiento: string;
  nacionalidad: string;
  direccion: string;
  placa: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  anioVehiculo: string;
  colorVehiculo: string;
  tipoContravencion: string;
  claseContravencion: string;
  descripcionInfraccion: string;
  lugarInfraccion: string;
  valorMulta: string;
  puntosDescontados: string;
  fechaHora: string;
  nombreAgente: string;
  credencialAgente: string;
}

interface Comparendo extends FormData {
  id: string;
  numero: string;
  estado: EstadoComp;
  transcripcion: string;
  created_at: string;
}

/* ── Contravenciones COIP Ecuador ── */
interface ContravencionOpt {
  value: string;
  label: string;
  multa: string;
  puntos: string;
  clase: string;
}
const CONTRAVENCION_OPTS: ContravencionOpt[] = [
  { value: "primera",  label: "Primera clase — 10% SBU (~$48) — 1.5 puntos",   multa: "48",  puntos: "1.5", clase: "Primera"  },
  { value: "segunda",  label: "Segunda clase — 15% SBU (~$72) — 3 puntos",     multa: "72",  puntos: "3",   clase: "Segunda"  },
  { value: "tercera",  label: "Tercera clase — 30% SBU (~$145) — 4.5 puntos",  multa: "145", puntos: "4.5", clase: "Tercera"  },
  { value: "cuarta",   label: "Cuarta clase — 45% SBU (~$217) — 7.5 puntos",   multa: "217", puntos: "7.5", clase: "Cuarta"   },
  { value: "delito",   label: "Delito de tránsito — Según juez",                multa: "",    puntos: "",    clase: "Delito"   },
];

/* ── Mock data ── */
const MOCK: Comparendo[] = [
  {
    id: "1", numero: "COMP-EC-2026-100234", estado: "Emitido",
    numeroIdentificacion: "1712345678", nombreInfractor: "Carlos Andrés Pérez Rodríguez",
    fechaNacimiento: "1985-04-12", nacionalidad: "Ecuatoriana",
    direccion: "Av. 10 de Agosto N24-152, Quito",
    placa: "PBA-1234", marcaVehiculo: "Toyota", modeloVehiculo: "Corolla", anioVehiculo: "2020", colorVehiculo: "Blanco",
    tipoContravencion: "segunda", claseContravencion: "Segunda",
    descripcionInfraccion: "Exceso de velocidad en zona urbana, detectado a 80 km/h en zona de 50 km/h.",
    lugarInfraccion: "Av. Amazonas y Naciones Unidas, Quito",
    valorMulta: "72", puntosDescontados: "3",
    fechaHora: "2026-03-10T09:30", nombreAgente: "Sgt. Luis Mora", credencialAgente: "AGT-2341",
    transcripcion: "", created_at: "2026-03-10T09:30:00Z",
  },
  {
    id: "2", numero: "COMP-EC-2026-100235", estado: "Pagado",
    numeroIdentificacion: "0923456789", nombreInfractor: "María Elena Gutiérrez Vásquez",
    fechaNacimiento: "1992-08-21", nacionalidad: "Ecuatoriana",
    direccion: "Calle Bolívar 345, Guayaquil",
    placa: "GYE-5678", marcaVehiculo: "Chevrolet", modeloVehiculo: "Aveo", anioVehiculo: "2019", colorVehiculo: "Rojo",
    tipoContravencion: "primera", claseContravencion: "Primera",
    descripcionInfraccion: "Uso de celular mientras conducía.",
    lugarInfraccion: "Av. 9 de Octubre y Malecón, Guayaquil",
    valorMulta: "48", puntosDescontados: "1.5",
    fechaHora: "2026-03-09T14:15", nombreAgente: "Sgt. Ana Torres", credencialAgente: "AGT-1892",
    transcripcion: "", created_at: "2026-03-09T14:15:00Z",
  },
  {
    id: "3", numero: "COMP-EC-2026-100236", estado: "Borrador",
    numeroIdentificacion: "1801234567", nombreInfractor: "Jorge Luis Ramírez Cañar",
    fechaNacimiento: "1978-11-03", nacionalidad: "Ecuatoriana",
    direccion: "Av. Colón 123, Ambato",
    placa: "AMB-9012", marcaVehiculo: "Kia", modeloVehiculo: "Rio", anioVehiculo: "2022", colorVehiculo: "Gris",
    tipoContravencion: "tercera", claseContravencion: "Tercera",
    descripcionInfraccion: "Conducción en estado de embriaguez, grado leve.",
    lugarInfraccion: "Redondel de La Ficoa, Ambato",
    valorMulta: "145", puntosDescontados: "4.5",
    fechaHora: "2026-03-11T22:45", nombreAgente: "Sgt. Pedro Salinas", credencialAgente: "AGT-3012",
    transcripcion: "", created_at: "2026-03-11T22:45:00Z",
  },
  {
    id: "4", numero: "COMP-EC-2026-100237", estado: "Impugnado",
    numeroIdentificacion: "0512345678", nombreInfractor: "Rosa Cecilia Montero Espín",
    fechaNacimiento: "1990-05-17", nacionalidad: "Ecuatoriana",
    direccion: "Calle Sucre 789, Cuenca",
    placa: "AZG-3456", marcaVehiculo: "Nissan", modeloVehiculo: "Sentra", anioVehiculo: "2018", colorVehiculo: "Azul",
    tipoContravencion: "cuarta", claseContravencion: "Cuarta",
    descripcionInfraccion: "Conducción temeraria, poniendo en riesgo la vida de peatones.",
    lugarInfraccion: "Av. Huayna Cápac y Av. Loja, Cuenca",
    valorMulta: "217", puntosDescontados: "7.5",
    fechaHora: "2026-03-08T11:00", nombreAgente: "Sgt. Carmen Vélez", credencialAgente: "AGT-4501",
    transcripcion: "", created_at: "2026-03-08T11:00:00Z",
  },
];

/* ── Helpers ── */
function generarNumero() {
  const y = new Date().getFullYear();
  const n = Math.floor(Math.random() * 900000) + 100000;
  return `COMP-EC-${y}-${n}`;
}

function emptyForm(): FormData {
  const now = new Date().toISOString().slice(0, 16);
  return {
    numeroIdentificacion: "", nombreInfractor: "", fechaNacimiento: "",
    nacionalidad: "", direccion: "",
    placa: "", marcaVehiculo: "", modeloVehiculo: "", anioVehiculo: "", colorVehiculo: "",
    tipoContravencion: "", claseContravencion: "", descripcionInfraccion: "",
    lugarInfraccion: "", valorMulta: "", puntosDescontados: "",
    fechaHora: now, nombreAgente: "", credencialAgente: "",
  };
}

const ESTADO_STYLE: Record<EstadoComp, string> = {
  Borrador:   "bg-gray-500/15    text-gray-500    border-gray-500/25",
  Emitido:    "bg-blue-500/15    text-blue-600    border-blue-500/25",
  Pagado:     "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
  Impugnado:  "bg-red-500/15     text-red-500     border-red-500/25",
};

/* ── Input component ── */
function Field({
  label, value, onChange, type = "text", placeholder = "", mono = false, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; mono?: boolean; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none
          focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition min-h-[48px]
          ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════ */
export default function Comparendos() {
  const { toast } = useToast();

  /* ── Navigation state ── */
  const [vista, setVista] = useState<Vista>("lista");
  const [comparendos, setComparendos] = useState<Comparendo[]>(MOCK);
  const [detalle, setDetalle] = useState<Comparendo | null>(null);

  /* ── Capture state ── */
  const [transcripcion, setTranscripcion] = useState("");
  const [interimText, setInterimText] = useState("");
  const [estadoGrab, setEstadoGrab] = useState<EstadoGrab>("idle");
  const [estadoIA, setEstadoIA] = useState<EstadoIA>("idle");
  const [transcColapsado, setTranscColapsado] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [guardando, setGuardando] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcRef = useRef<HTMLDivElement>(null);

  /* ── Load from Supabase ── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("comparendos")
          .select("*")
          .order("created_at", { ascending: false });
        if (data && data.length > 0) {
          setComparendos(
            data.map((r: any) => ({
              id: r.id,
              numero: r.numero,
              estado: r.estado as EstadoComp,
              transcripcion: r.transcripcion ?? "",
              created_at: r.created_at,
              numeroIdentificacion: r.numero_identificacion ?? "",
              nombreInfractor:      r.nombre_infractor      ?? "",
              fechaNacimiento:      r.fecha_nacimiento       ?? "",
              nacionalidad:         r.nacionalidad           ?? "",
              direccion:            r.direccion              ?? "",
              placa:                r.placa                  ?? "",
              marcaVehiculo:        r.marca_vehiculo         ?? "",
              modeloVehiculo:       r.modelo_vehiculo        ?? "",
              anioVehiculo:         r.anio_vehiculo          ?? "",
              colorVehiculo:        r.color_vehiculo         ?? "",
              tipoContravencion:    r.tipo_contravencion     ?? "",
              claseContravencion:   r.clase_contravencion    ?? "",
              descripcionInfraccion:r.descripcion_infraccion ?? "",
              lugarInfraccion:      r.lugar_infraccion       ?? "",
              valorMulta:           r.valor_multa            ?? "",
              puntosDescontados:    r.puntos_descontados     ?? "",
              fechaHora:            r.fecha_hora             ?? "",
              nombreAgente:         r.nombre_agente          ?? "",
              credencialAgente:     r.credencial_agente      ?? "",
            }))
          );
        }
      } catch {
        /* Supabase no configurado — se usa mock data */
      }
    })();
  }, []);

  /* ── Speech recognition ── */
  const iniciarGrabacion = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast({ title: "Micrófono no compatible", description: "Tu navegador no soporta reconocimiento de voz.", variant: "destructive" });
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "es-EC";

    rec.onresult = (event: any) => {
      let finalText = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t + " ";
        else interim += t;
      }
      if (finalText) setTranscripcion((prev) => prev + finalText);
      setInterimText(interim);
      setTimeout(() => {
        if (transcRef.current) transcRef.current.scrollTop = transcRef.current.scrollHeight;
      }, 50);
    };

    rec.onerror = () => {
      setEstadoGrab("idle");
      toast({ title: "Error de micrófono", description: "No se pudo acceder al micrófono.", variant: "destructive" });
    };

    rec.onend = () => {
      setInterimText("");
      setEstadoGrab("idle");
    };

    recognitionRef.current = rec;
    rec.start();
    setEstadoGrab("grabando");
  }, [toast]);

  const detenerGrabacion = useCallback(() => {
    recognitionRef.current?.stop();
    setEstadoGrab("idle");
    setInterimText("");
  }, []);

  /* ── AI analysis ── */
  async function analizarConIA() {
    const texto = transcripcion.trim();
    if (!texto) {
      toast({ title: "Sin transcripción", description: "Graba o escribe un diálogo primero.", variant: "destructive" });
      return;
    }
    if (!ANTHROPIC_KEY) {
      toast({ title: "API no configurada", description: "Agrega VITE_ANTHROPIC_API_KEY al archivo .env", variant: "destructive" });
      return;
    }

    setEstadoIA("analizando");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: `Eres un asistente para agentes de tránsito de Ecuador. Extrae del siguiente diálogo los datos del comparendo y devuelve SOLO un JSON con estos campos exactos: { "numeroIdentificacion", "nombreInfractor", "fechaNacimiento", "nacionalidad", "direccion", "placa", "marcaVehiculo", "modeloVehiculo", "anioVehiculo", "colorVehiculo", "tipoContravención", "claseContravención", "descripcionInfraccion", "lugarInfraccion", "valorMulta", "puntosDescontados" }. Si un campo no se menciona, déjalo como string vacío. Responde ÚNICAMENTE con el JSON, sin explicaciones.`,
          messages: [{ role: "user", content: "Diálogo: " + texto }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const raw = json.content?.[0]?.text ?? "{}";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON no encontrado");
      const d = JSON.parse(jsonMatch[0]);

      // Map tipoContravención → option value
      const tipoRaw = (d.tipoContravención ?? d.tipoContravencion ?? "").toLowerCase();
      let tipoVal = "";
      if (tipoRaw.includes("primera"))  tipoVal = "primera";
      else if (tipoRaw.includes("segunda")) tipoVal = "segunda";
      else if (tipoRaw.includes("tercera")) tipoVal = "tercera";
      else if (tipoRaw.includes("cuarta"))  tipoVal = "cuarta";
      else if (tipoRaw.includes("delito"))  tipoVal = "delito";

      const opt = CONTRAVENCION_OPTS.find((o) => o.value === tipoVal);

      setForm((prev) => ({
        ...prev,
        numeroIdentificacion:  d.numeroIdentificacion  || prev.numeroIdentificacion,
        nombreInfractor:       d.nombreInfractor       || prev.nombreInfractor,
        fechaNacimiento:       d.fechaNacimiento       || prev.fechaNacimiento,
        nacionalidad:          d.nacionalidad          || prev.nacionalidad,
        direccion:             d.direccion             || prev.direccion,
        placa:                (d.placa || prev.placa).toUpperCase(),
        marcaVehiculo:         d.marcaVehiculo         || prev.marcaVehiculo,
        modeloVehiculo:        d.modeloVehiculo        || prev.modeloVehiculo,
        anioVehiculo:          d.anioVehiculo          || prev.anioVehiculo,
        colorVehiculo:         d.colorVehiculo         || prev.colorVehiculo,
        tipoContravencion:     tipoVal                 || prev.tipoContravencion,
        claseContravencion:    opt?.clase              || d.claseContravención || prev.claseContravencion,
        descripcionInfraccion: d.descripcionInfraccion || prev.descripcionInfraccion,
        lugarInfraccion:       d.lugarInfraccion       || prev.lugarInfraccion,
        valorMulta:            opt?.multa              || d.valorMulta         || prev.valorMulta,
        puntosDescontados:     opt?.puntos             || d.puntosDescontados  || prev.puntosDescontados,
      }));

      setEstadoIA("done");
      toast({ title: "¡Formulario completado!", description: "Revisa y ajusta los datos antes de emitir." });
    } catch (err) {
      setEstadoIA("error");
      toast({ title: "Error de análisis", description: "No se pudo procesar el diálogo.", variant: "destructive" });
    }
  }

  /* ── Contravencion change ── */
  function handleTipoChange(val: string) {
    const opt = CONTRAVENCION_OPTS.find((o) => o.value === val);
    setForm((prev) => ({
      ...prev,
      tipoContravencion:  val,
      claseContravencion: opt?.clase  ?? prev.claseContravencion,
      valorMulta:         opt?.multa  ?? prev.valorMulta,
      puntosDescontados:  opt?.puntos ?? prev.puntosDescontados,
    }));
  }

  /* ── Save to Supabase ── */
  async function guardar(estado: EstadoComp) {
    setGuardando(true);
    const numero = generarNumero();
    const payload = {
      numero,
      numero_identificacion:  form.numeroIdentificacion,
      nombre_infractor:       form.nombreInfractor,
      fecha_nacimiento:       form.fechaNacimiento,
      nacionalidad:           form.nacionalidad,
      direccion:              form.direccion,
      placa:                  form.placa,
      marca_vehiculo:         form.marcaVehiculo,
      modelo_vehiculo:        form.modeloVehiculo,
      anio_vehiculo:          form.anioVehiculo,
      color_vehiculo:         form.colorVehiculo,
      tipo_contravencion:     form.tipoContravencion,
      clase_contravencion:    form.claseContravencion,
      descripcion_infraccion: form.descripcionInfraccion,
      lugar_infraccion:       form.lugarInfraccion,
      valor_multa:            form.valorMulta,
      puntos_descontados:     form.puntosDescontados,
      fecha_hora:             form.fechaHora,
      nombre_agente:          form.nombreAgente,
      credencial_agente:      form.credencialAgente,
      transcripcion,
      estado,
    };

    const nuevo: Comparendo = {
      id: String(Date.now()),
      numero,
      estado,
      transcripcion,
      created_at: new Date().toISOString(),
      ...form,
    };

    try {
      const { data, error } = await supabase.from("comparendos").insert(payload).select().single();
      if (!error && data) nuevo.id = data.id;
    } catch { /* local only */ }

    setComparendos((prev) => [nuevo, ...prev]);
    setGuardando(false);

    if (estado === "Borrador") {
      toast({ title: "Borrador guardado", description: `Comparendo ${numero} guardado como borrador.` });
      setVista("lista");
    } else {
      setDetalle(nuevo);
      setVista("detalle");
    }
  }

  /* ── Stats ── */
  const hoy = new Date().toISOString().split("T")[0];
  const totalHoy = comparendos.filter((c) => c.created_at.startsWith(hoy)).length;
  const pendientes = comparendos.filter((c) => c.estado === "Emitido").length;
  const pagados = comparendos.filter((c) => c.estado === "Pagado").length;
  const valorTotal = comparendos.reduce((s, c) => s + (parseFloat(c.valorMulta) || 0), 0);

  /* ════════════════════════════════════════════════════════ */
  /* VISTA 1: LISTA                                          */
  /* ════════════════════════════════════════════════════════ */
  if (vista === "lista") return (
    <div className="space-y-6 max-w-[900px]">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Comparendos
          </h1>
          <Shield size={22} className="text-violet-500" />
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-orange-500/15 text-orange-500 border-orange-500/25">
            IA
          </span>
        </div>
        <p className="text-sm text-gray-500">Gestión de infracciones de tránsito — Ecuador</p>
      </div>

      {/* Nuevo comparendo */}
      <button
        onClick={() => { setForm(emptyForm()); setTranscripcion(""); setEstadoIA("idle"); setVista("captura"); }}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-semibold text-white shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)", minHeight: 56 }}
      >
        <Plus size={20} />
        Nuevo Comparendo
        <Mic size={18} className="ml-1 opacity-80" />
      </button>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total hoy"             value={totalHoy}                           color="#7C3AED" />
        <StatCard label="Pendientes de firma"   value={pendientes}                         color="#F97316" />
        <StatCard label="Pagados"               value={pagados}                            color="#10B981" />
        <StatCard label="Valor recaudado"       value={`$${valorTotal.toFixed(0)}`}  sub="USD" color="#3B82F6" />
      </div>

      {/* List */}
      <div className="space-y-2">
        {comparendos.map((c) => (
          <button
            key={c.id}
            onClick={() => { setDetalle(c); setVista("detalle"); }}
            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 hover:border-violet-300 hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-mono text-xs font-semibold text-violet-600">{c.numero}</span>
              <span className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full border ${ESTADO_STYLE[c.estado]}`}>
                {c.estado}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-800">{c.nombreInfractor || "—"}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
              <span className="text-xs text-gray-400">{c.placa || "Sin placa"}</span>
              <span className="text-xs text-gray-400">{c.claseContravencion ? `Contrav. ${c.claseContravencion}` : "—"}</span>
              <span className="text-xs font-semibold text-gray-600">{c.valorMulta ? `$${c.valorMulta}` : ""}</span>
              <span className="text-xs text-gray-400">{c.fechaHora?.slice(0, 10) || ""}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════ */
  /* VISTA 2: CAPTURA                                        */
  /* ════════════════════════════════════════════════════════ */
  if (vista === "captura") return (
    <div className="space-y-4 max-w-[720px]">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setVista("lista")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Nuevo Comparendo
        </h2>
      </div>

      {/* ── Transcription panel ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setTranscColapsado((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <div className="flex items-center gap-2">
            <Mic size={16} className="text-violet-500" />
            <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Transcripción por voz
            </span>
            {estadoGrab === "grabando" && (
              <span className="inline-flex items-center gap-1 text-[10px] text-red-500 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> En vivo
              </span>
            )}
          </div>
          {transcColapsado ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
        </button>

        {!transcColapsado && (
          <div className="px-5 pb-5 space-y-4">
            {/* Record button */}
            <div className="flex flex-col items-center gap-3 py-2">
              <button
                onClick={estadoGrab === "grabando" ? detenerGrabacion : iniciarGrabacion}
                className="relative flex items-center justify-center rounded-full text-white font-bold transition-all active:scale-95"
                style={{
                  width: 80, height: 80, minWidth: 80,
                  background: estadoGrab === "grabando" ? "#EF4444" : "#7C3AED",
                  boxShadow: estadoGrab === "grabando"
                    ? "0 0 0 8px rgba(239,68,68,0.2), 0 0 0 16px rgba(239,68,68,0.08)"
                    : "0 4px 20px rgba(124,58,237,0.35)",
                }}
              >
                {estadoGrab === "grabando"
                  ? <MicOff size={30} />
                  : <Mic size={30} />}
                {estadoGrab === "grabando" && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30" />
                )}
              </button>
              <p className="text-xs font-medium text-gray-500">
                {estadoGrab === "idle"     && "Presiona para iniciar"}
                {estadoGrab === "grabando" && "Escuchando... (presiona para detener)"}
                {estadoGrab === "procesando" && "Procesando..."}
              </p>
            </div>

            {/* Terminal area */}
            <div
              ref={transcRef}
              className="rounded-xl border-2 border-violet-400/40 px-4 py-3 text-sm font-mono overflow-y-auto"
              style={{ background: "#1a1a2e", color: "#22c55e", minHeight: 120, maxHeight: 200 }}
            >
              {transcripcion || interimText ? (
                <>
                  <span>{transcripcion}</span>
                  <span style={{ color: "#86efac", opacity: 0.7 }}>{interimText}</span>
                </>
              ) : (
                <span style={{ color: "rgba(34,197,94,0.35)" }}>
                  {estadoGrab === "grabando" ? "Hablando..." : "Área de transcripción..."}
                </span>
              )}
            </div>

            {/* Manual edit */}
            <textarea
              value={transcripcion}
              onChange={(e) => setTranscripcion(e.target.value)}
              placeholder="O escribe / edita el diálogo manualmente aquí..."
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition resize-none"
            />

            {/* Analyze button */}
            <div className="flex justify-end">
              <button
                onClick={analizarConIA}
                disabled={estadoIA === "analizando" || !transcripcion.trim()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
              >
                {estadoIA === "analizando"
                  ? <><Loader2 size={15} className="animate-spin" /> Analizando diálogo...</>
                  : <><Sparkles size={15} /> Analizar con IA</>}
              </button>
            </div>

            {estadoIA === "done" && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <CheckCircle2 size={15} /> Formulario completado automáticamente — revisa los datos
              </div>
            )}
            {estadoIA === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                <AlertTriangle size={15} /> No se pudo analizar — completa el formulario manualmente
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Accordion Form ── */}
      <Accordion type="multiple" defaultValue={["infractor", "vehiculo", "infraccion"]} className="space-y-3">

        {/* Datos del infractor */}
        <AccordionItem value="infractor" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <User size={16} className="text-violet-500" />
              <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Datos del infractor
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Cédula / Pasaporte <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.numeroIdentificacion}
                    onChange={(e) => setForm((p) => ({ ...p, numeroIdentificacion: e.target.value }))}
                    placeholder="0912345678"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono text-gray-800 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition min-h-[48px]"
                  />
                  <button className="px-4 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors font-medium">
                    Buscar
                  </button>
                </div>
              </div>
              <Field label="Nombre completo"   value={form.nombreInfractor} onChange={(v) => setForm((p) => ({ ...p, nombreInfractor: v }))} required />
              <Field label="Fecha de nacimiento" value={form.fechaNacimiento} onChange={(v) => setForm((p) => ({ ...p, fechaNacimiento: v }))} type="date" />
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Nacionalidad</label>
                <select
                  value={form.nacionalidad}
                  onChange={(e) => setForm((p) => ({ ...p, nacionalidad: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition bg-white min-h-[48px]"
                >
                  <option value="">Seleccionar</option>
                  <option value="Ecuatoriana">Ecuatoriana</option>
                  <option value="Extranjera">Extranjera</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Field label="Dirección" value={form.direccion} onChange={(v) => setForm((p) => ({ ...p, direccion: v }))} placeholder="Av. Principal y Calle Secundaria, Ciudad" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Datos del vehículo */}
        <AccordionItem value="vehiculo" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Car size={16} className="text-orange-500" />
              <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Datos del vehículo
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Placa <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.placa}
                  onChange={(e) => setForm((p) => ({ ...p, placa: e.target.value.toUpperCase() }))}
                  placeholder="ABC-1234"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono font-bold text-gray-800 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition uppercase min-h-[48px]"
                />
              </div>
              <Field label="Marca"   value={form.marcaVehiculo}  onChange={(v) => setForm((p) => ({ ...p, marcaVehiculo:  v }))} placeholder="Toyota" />
              <Field label="Modelo"  value={form.modeloVehiculo} onChange={(v) => setForm((p) => ({ ...p, modeloVehiculo: v }))} placeholder="Corolla" />
              <Field label="Año"     value={form.anioVehiculo}   onChange={(v) => setForm((p) => ({ ...p, anioVehiculo:   v }))} type="number" placeholder="2022" />
              <Field label="Color"   value={form.colorVehiculo}  onChange={(v) => setForm((p) => ({ ...p, colorVehiculo:  v }))} placeholder="Blanco" />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Infracción */}
        <AccordionItem value="infraccion" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-red-400" />
              <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Infracción
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tipo contravención */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo de contravención <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.tipoContravencion}
                  onChange={(e) => handleTipoChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition bg-white min-h-[48px]"
                >
                  <option value="">Seleccionar tipo</option>
                  {CONTRAVENCION_OPTS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <Field label="Valor multa (USD)" value={form.valorMulta}        onChange={(v) => setForm((p) => ({ ...p, valorMulta:        v }))} type="number" mono />
              <Field label="Puntos descontados" value={form.puntosDescontados} onChange={(v) => setForm((p) => ({ ...p, puntosDescontados: v }))} type="number" mono />

              {/* Descripción */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  Descripción de la infracción <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.descripcionInfraccion}
                  onChange={(e) => setForm((p) => ({ ...p, descripcionInfraccion: e.target.value }))}
                  rows={3}
                  placeholder="Describe detalladamente la infracción observada..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition resize-none"
                />
              </div>

              <Field label="Lugar de la infracción" value={form.lugarInfraccion} onChange={(v) => setForm((p) => ({ ...p, lugarInfraccion: v }))} placeholder="Calle / Avenida, Ciudad" />
              <Field label="Fecha y hora"           value={form.fechaHora}       onChange={(v) => setForm((p) => ({ ...p, fechaHora:       v }))} type="datetime-local" />
              <Field label="Nombre del agente"      value={form.nombreAgente}    onChange={(v) => setForm((p) => ({ ...p, nombreAgente:    v }))} />
              <Field label="N° credencial agente"   value={form.credencialAgente} onChange={(v) => setForm((p) => ({ ...p, credencialAgente: v }))} mono />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-8">
        <button
          onClick={() => guardar("Borrador")}
          disabled={guardando}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[56px]"
        >
          {guardando ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
          Guardar borrador
        </button>
        <button
          onClick={() => guardar("Emitido")}
          disabled={guardando}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 min-h-[56px]"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
        >
          {guardando ? <Loader2 size={15} className="animate-spin" /> : <Shield size={15} />}
          Emitir comparendo
        </button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════ */
  /* VISTA 3: DETALLE / IMPRESIÓN                            */
  /* ════════════════════════════════════════════════════════ */
  const c = detalle;
  if (vista === "detalle" && c) return (
    <div className="max-w-[720px] space-y-4">

      {/* Navigation buttons */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => setVista("lista")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={14} /> Volver a lista
        </button>
        <button
          onClick={() => { setForm(emptyForm()); setTranscripcion(""); setEstadoIA("idle"); setVista("captura"); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Plus size={14} /> Nuevo comparendo
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 ml-auto"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
        >
          <Printer size={14} /> Imprimir
        </button>
      </div>

      {/* Document */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Document header */}
        <div
          className="px-6 py-6 text-center text-white"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield size={20} />
            <span className="text-xs font-semibold tracking-widest uppercase opacity-90">República del Ecuador</span>
          </div>
          <h1 className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            COMPARENDO DE TRÁNSITO
          </h1>
          <p className="text-sm opacity-80 mt-1">Agencia Nacional de Tránsito</p>
        </div>

        {/* Número y estado */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/60">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Número de comparendo</p>
            <p className="font-mono font-bold text-gray-800">{c.numero}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Estado</p>
            <span className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full border ${ESTADO_STYLE[c.estado]}`}>
              {c.estado}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Infractor */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
              <User size={13} className="text-violet-500" /> Datos del infractor
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ["Cédula / Pasaporte",  c.numeroIdentificacion],
                ["Nombre completo",     c.nombreInfractor],
                ["Fecha de nacimiento", c.fechaNacimiento],
                ["Nacionalidad",        c.nacionalidad],
                ["Dirección",           c.direccion],
              ].map(([label, val]) => val ? (
                <div key={label} className={label === "Nombre completo" || label === "Dirección" ? "col-span-2" : ""}>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-gray-800 font-medium">{val}</p>
                </div>
              ) : null)}
            </div>
          </section>

          {/* Vehículo */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
              <Car size={13} className="text-orange-500" /> Datos del vehículo
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              {[
                ["Placa",   c.placa,         true ],
                ["Marca",   c.marcaVehiculo,  false],
                ["Modelo",  c.modeloVehiculo, false],
                ["Año",     c.anioVehiculo,   false],
                ["Color",   c.colorVehiculo,  false],
              ].map(([label, val, mono]) => val ? (
                <div key={String(label)}>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{String(label)}</p>
                  <p className={`text-sm text-gray-800 font-medium ${mono ? "font-mono font-bold" : ""}`}>{String(val)}</p>
                </div>
              ) : null)}
            </div>
          </section>

          {/* Infracción */}
          <section>
            <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
              <MapPin size={13} className="text-red-400" /> Datos de la infracción
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tipo de contravención</p>
                <p className="text-sm text-gray-800 font-medium">{c.claseContravencion || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fecha y hora</p>
                <p className="text-sm text-gray-800 font-medium">{c.fechaHora || "—"}</p>
              </div>
              {c.descripcionInfraccion && (
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Descripción</p>
                  <p className="text-sm text-gray-800">{c.descripcionInfraccion}</p>
                </div>
              )}
              {c.lugarInfraccion && (
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Lugar</p>
                  <p className="text-sm text-gray-800">{c.lugarInfraccion}</p>
                </div>
              )}
              {c.nombreAgente && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Agente</p>
                  <p className="text-sm text-gray-800">{c.nombreAgente}</p>
                </div>
              )}
              {c.credencialAgente && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">N° Credencial</p>
                  <p className="text-sm font-mono text-gray-800">{c.credencialAgente}</p>
                </div>
              )}
            </div>
          </section>

          {/* Multa destacada */}
          <div
            className="flex items-center justify-between rounded-2xl px-5 py-4 text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
          >
            <div>
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">Valor de la multa</p>
              <p className="text-3xl font-bold">${c.valorMulta || "0"} <span className="text-lg font-medium opacity-80">USD</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">Puntos descontados</p>
              <p className="text-3xl font-bold">{c.puntosDescontados || "0"}</p>
            </div>
          </div>

          {/* Transcripción colapsable */}
          {c.transcripcion && (
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100 list-none">
                <Mic size={13} className="text-violet-400" />
                Transcripción del diálogo
                <ChevronDown size={13} className="ml-auto group-open:rotate-180 transition-transform" />
              </summary>
              <div
                className="mt-3 rounded-xl px-4 py-3 text-sm font-mono"
                style={{ background: "#1a1a2e", color: "#22c55e" }}
              >
                {c.transcripcion}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );

  return null;
}
