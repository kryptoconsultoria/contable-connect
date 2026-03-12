import { useCallback, useRef, useState } from "react";
import {
  FileSearch,
  Upload,
  FileText,
  Image,
  Code,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Send,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

/* ── Constants ── */
const WEBHOOK_URL = (import.meta.env.VITE_WEBHOOK_FACTURAS as string) || "#";

const fmt = (v: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(v);

/* ── Types ── */
type UploadStatus = "idle" | "loading" | "success" | "error";
type FacturaEstado = "Pendiente" | "Aprobada" | "Enviada";

interface ExtractedData {
  numero: string;
  fechaEmision: string;
  nitEmisor: string;
  nombreEmisor: string;
  nitReceptor: string;
  nombreReceptor: string;
  subtotal: string;
  iva: string;
  total: string;
  descripcion: string;
}

interface FacturaHistorial {
  id: string;
  archivo: string;
  numero: string;
  emisor: string;
  nitEmisor: string;
  receptor: string;
  nitReceptor: string;
  subtotal: number;
  iva: number;
  total: number;
  fecha: string;
  estado: FacturaEstado;
  tipo: "pdf" | "image" | "xml";
}

/* ── Mock data ── */
const MOCK_HISTORIAL: FacturaHistorial[] = [
  {
    id: "1",
    archivo: "factura-techcorp-enero.pdf",
    numero: "FE-2026-001234",
    emisor: "TechCorp S.A.S.",
    nitEmisor: "900.123.456-7",
    receptor: "Mi Empresa S.A.S.",
    nitReceptor: "800.999.888-0",
    subtotal: 10504201,
    iva: 1995799,
    total: 12500000,
    fecha: "2026-01-15",
    estado: "Enviada",
    tipo: "pdf",
  },
  {
    id: "2",
    archivo: "factura-distribuciones.jpg",
    numero: "FE-2026-000891",
    emisor: "Distribuciones El Valle",
    nitEmisor: "800.234.567-1",
    receptor: "Mi Empresa S.A.S.",
    nitReceptor: "800.999.888-0",
    subtotal: 7008403,
    iva: 1331597,
    total: 8340000,
    fecha: "2026-01-18",
    estado: "Aprobada",
    tipo: "image",
  },
  {
    id: "3",
    archivo: "nota-credito-innovar.xml",
    numero: "NC-2026-000045",
    emisor: "Innovar Digital Ltda.",
    nitEmisor: "901.345.678-2",
    receptor: "Mi Empresa S.A.S.",
    nitReceptor: "800.999.888-0",
    subtotal: 420168,
    iva: 79832,
    total: 500000,
    fecha: "2026-01-20",
    estado: "Pendiente",
    tipo: "xml",
  },
  {
    id: "4",
    archivo: "factura-grupo-andino.pdf",
    numero: "FE-2026-001235",
    emisor: "Grupo Andino S.A.",
    nitEmisor: "900.567.890-4",
    receptor: "Mi Empresa S.A.S.",
    nitReceptor: "800.999.888-0",
    subtotal: 13277311,
    iva: 2522689,
    total: 15800000,
    fecha: "2026-01-22",
    estado: "Aprobada",
    tipo: "pdf",
  },
];

const ESTADO_STYLES: Record<FacturaEstado, string> = {
  Pendiente: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  Aprobada: "bg-blue-500/15 text-blue-600 border-blue-500/25",
  Enviada: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
};

/* ── File type helpers ── */
function getFileType(file: File): "pdf" | "image" | "xml" {
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) return "pdf";
  if (file.name.endsWith(".xml")) return "xml";
  return "image";
}

function FileTypeIcon({ tipo, size = 28 }: { tipo: "pdf" | "image" | "xml"; size?: number }) {
  if (tipo === "pdf") return <FileText size={size} className="text-red-400" />;
  if (tipo === "xml") return <Code size={size} className="text-blue-400" />;
  return <Image size={size} className="text-violet-400" />;
}

/* ── Excel download ── */
function descargarExcel(rows: FacturaHistorial[]) {
  const headers = [
    "Número",
    "Emisor",
    "NIT Emisor",
    "Receptor",
    "NIT Receptor",
    "Subtotal",
    "IVA",
    "Total",
    "Fecha",
    "Estado",
  ];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.numero,
        `"${r.emisor}"`,
        r.nitEmisor,
        `"${r.receptor}"`,
        r.nitReceptor,
        r.subtotal,
        r.iva,
        r.total,
        r.fecha,
        r.estado,
      ].join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const today = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `facturas-extraidas-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Detail panel (two-column view) ── */
function DetalleFactura({
  factura,
  archivo,
  objectUrl,
  datos,
  onDatosChange,
  onAprobar,
  onDescartar,
  onDescargarExcel,
}: {
  factura?: FacturaHistorial;
  archivo?: File | null;
  objectUrl?: string | null;
  datos: ExtractedData;
  onDatosChange: (d: ExtractedData) => void;
  onAprobar: () => void;
  onDescartar: () => void;
  onDescargarExcel?: () => void;
}) {
  const tipo = factura?.tipo ?? (archivo ? getFileType(archivo) : "pdf");
  const previewUrl = objectUrl ?? null;

  function field(
    label: string,
    key: keyof ExtractedData,
    mono = false
  ) {
    return (
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
        <input
          value={datos[key]}
          onChange={(e) => onDatosChange({ ...datos, [key]: e.target.value })}
          className={`w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition ${
            mono ? "font-mono" : ""
          }`}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: preview */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center p-6 min-h-[400px]">
        {tipo === "image" && previewUrl ? (
          <img
            src={previewUrl}
            alt="Vista previa de la factura"
            className="max-h-[480px] max-w-full object-contain rounded-lg shadow-sm"
          />
        ) : tipo === "pdf" && previewUrl ? (
          <iframe
            src={previewUrl}
            title="Vista previa PDF"
            className="w-full h-[480px] rounded-lg border border-gray-200"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <FileTypeIcon tipo={tipo} size={52} />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {factura?.archivo ?? archivo?.name ?? "Documento"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {tipo === "xml" ? "Archivo XML — vista previa no disponible" : "Vista previa no disponible"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right: fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {field("Número de factura", "numero", true)}
          {field("Fecha de emisión", "fechaEmision")}
          {field("NIT Emisor", "nitEmisor", true)}
          {field("Nombre Emisor", "nombreEmisor")}
          {field("NIT Receptor", "nitReceptor", true)}
          {field("Nombre Receptor", "nombreReceptor")}
          {field("Subtotal", "subtotal", true)}
          {field("IVA", "iva", true)}
          {field("Total", "total", true)}
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Descripción / Concepto
          </label>
          <textarea
            value={datos.descripcion}
            onChange={(e) => onDatosChange({ ...datos, descripcion: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition resize-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={onAprobar}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
          >
            <Send size={14} /> Aprobar y enviar a contabilidad
          </button>
          {onDescargarExcel && (
            <button
              onClick={onDescargarExcel}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Download size={14} /> Descargar Excel
            </button>
          )}
          <button
            onClick={onDescartar}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Trash2 size={14} /> Descartar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Empty extracted data ── */
function emptyData(): ExtractedData {
  return {
    numero: "",
    fechaEmision: "",
    nitEmisor: "",
    nombreEmisor: "",
    nitReceptor: "",
    nombreReceptor: "",
    subtotal: "",
    iva: "",
    total: "",
    descripcion: "",
  };
}

/* ── Main page ── */
export default function Facturas() {
  const { toast } = useToast();

  /* upload state */
  const [archivo, setArchivo] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  /* extracted form data */
  const [datos, setDatos] = useState<ExtractedData>(emptyData());

  /* historial */
  const [historial, setHistorial] = useState<FacturaHistorial[]>(MOCK_HISTORIAL);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  /* dialog for row detail */
  const [dialogFactura, setDialogFactura] = useState<FacturaHistorial | null>(null);
  const [dialogDatos, setDialogDatos] = useState<ExtractedData>(emptyData());

  /* ── File handling ── */
  const acceptFile = useCallback(
    (file: File) => {
      if (!file.name.match(/\.(pdf|jpg|jpeg|png|xml)$/i)) {
        toast({
          title: "Formato no válido",
          description: "Solo se aceptan archivos PDF, JPG, PNG o XML.",
          variant: "destructive",
        });
        return;
      }
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setArchivo(file);
      setObjectUrl(URL.createObjectURL(file));
      setUploadStatus("idle");
      setDatos(emptyData());
    },
    [toast, objectUrl]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files[0]) acceptFile(e.dataTransfer.files[0]);
    },
    [acceptFile]
  );

  /* ── Submit extraction ── */
  async function handleExtract() {
    if (!archivo) return;
    const fd = new FormData();
    fd.append("archivo", archivo);

    setUploadStatus("loading");
    try {
      const res = await fetch(WEBHOOK_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json().catch(() => ({}));
      const d = json.data ?? json;
      setDatos({
        numero:          d.numero          ?? "",
        fechaEmision:    d.fechaEmision    ?? "",
        nitEmisor:       d.nitEmisor       ?? "",
        nombreEmisor:    d.nombreEmisor    ?? "",
        nitReceptor:     d.nitReceptor     ?? "",
        nombreReceptor:  d.nombreReceptor  ?? "",
        subtotal:        d.subtotal        ?? "",
        iva:             d.iva             ?? "",
        total:           d.total           ?? "",
        descripcion:     d.descripcion     ?? "",
      });
      setUploadStatus("success");
      toast({
        title: "Extracción completada",
        description: "Revisa y valida los datos extraídos antes de enviar.",
      });
    } catch {
      setUploadStatus("error");
      toast({
        title: "Error al extraer",
        description: "No se pudo procesar el archivo. Verifica el archivo e intenta de nuevo.",
        variant: "destructive",
      });
    }
  }

  /* ── Approve extracted invoice ── */
  function handleAprobar() {
    if (!archivo) return;
    const nueva: FacturaHistorial = {
      id: String(Date.now()),
      archivo: archivo.name,
      numero: datos.numero || "—",
      emisor: datos.nombreEmisor || "—",
      nitEmisor: datos.nitEmisor || "—",
      receptor: datos.nombreReceptor || "—",
      nitReceptor: datos.nitReceptor || "—",
      subtotal: parseFloat(datos.subtotal.replace(/[^0-9.]/g, "")) || 0,
      iva: parseFloat(datos.iva.replace(/[^0-9.]/g, "")) || 0,
      total: parseFloat(datos.total.replace(/[^0-9.]/g, "")) || 0,
      fecha: datos.fechaEmision || new Date().toISOString().split("T")[0],
      estado: "Enviada",
      tipo: getFileType(archivo),
    };
    setHistorial((prev) => [nueva, ...prev]);
    handleReset();
    toast({ title: "¡Factura enviada!", description: "La factura fue registrada en contabilidad." });
  }

  function handleReset() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setArchivo(null);
    setObjectUrl(null);
    setUploadStatus("idle");
    setDatos(emptyData());
  }

  /* ── Selection ── */
  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === historial.length ? new Set() : new Set(historial.map((f) => f.id))
    );
  }

  function enviarSeleccionadas() {
    setHistorial((prev) =>
      prev.map((f) => (selected.has(f.id) ? { ...f, estado: "Enviada" as const } : f))
    );
    toast({ title: `${selected.size} factura(s) enviadas a contabilidad.` });
    setSelected(new Set());
  }

  /* ── Dialog open ── */
  function openDialog(f: FacturaHistorial) {
    setDialogFactura(f);
    setDialogDatos({
      numero: f.numero,
      fechaEmision: f.fecha,
      nitEmisor: f.nitEmisor,
      nombreEmisor: f.emisor,
      nitReceptor: f.nitReceptor,
      nombreReceptor: f.receptor,
      subtotal: String(f.subtotal),
      iva: String(f.iva),
      total: String(f.total),
      descripcion: "",
    });
  }

  const fileType = archivo ? getFileType(archivo) : null;

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
            Extracción de Facturas
          </h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-orange-500/15 text-orange-500 border-orange-500/25">
            IA
          </span>
          <FileSearch size={22} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">
          Carga facturas en PDF, imagen o XML para extraer información automáticamente.
        </p>
      </div>

      {/* ── Upload card ── */}
      {uploadStatus !== "success" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2
              className="font-semibold text-gray-700 text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Cargar factura
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Drop zone */}
            <div
              onClick={() => !archivo && fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`relative rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 py-12 ${
                archivo
                  ? "border-violet-300 bg-violet-50/30 cursor-default"
                  : dragging
                  ? "border-violet-400 bg-violet-50/60 cursor-copy"
                  : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/20 cursor-pointer"
              }`}
            >
              {archivo ? (
                <>
                  <FileTypeIcon tipo={fileType!} size={36} />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">{archivo.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(archivo.size / 1024).toFixed(1)} KB · {fileType?.toUpperCase()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <Upload size={36} className="text-gray-300" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Arrastra tu factura aquí
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF · Imagen (JPG, PNG) · XML</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                    className="mt-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Seleccionar archivo
                  </button>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.xml"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && acceptFile(e.target.files[0])}
              />
            </div>

            {/* Error banner */}
            {uploadStatus === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                <AlertTriangle size={16} className="shrink-0" />
                No se pudo procesar el archivo. Revisa el formato e intenta de nuevo.
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={handleExtract}
                disabled={!archivo || uploadStatus === "loading"}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
              >
                {uploadStatus === "loading" ? (
                  <><Loader2 size={15} className="animate-spin" /> Extrayendo información...</>
                ) : (
                  <><FileSearch size={15} /> Extraer información</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Result view ── */}
      {uploadStatus === "success" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <h2
              className="font-semibold text-gray-700 text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Datos extraídos — revisa y valida
            </h2>
            <button
              onClick={handleReset}
              className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw size={13} /> Cargar otra
            </button>
          </div>
          <div className="p-6">
            <DetalleFactura
              archivo={archivo}
              objectUrl={objectUrl}
              datos={datos}
              onDatosChange={setDatos}
              onAprobar={handleAprobar}
              onDescartar={handleReset}
              onDescargarExcel={() => {
                if (archivo)
                  descargarExcel([
                    {
                      id: "new",
                      archivo: archivo.name,
                      numero: datos.numero,
                      emisor: datos.nombreEmisor,
                      nitEmisor: datos.nitEmisor,
                      receptor: datos.nombreReceptor,
                      nitReceptor: datos.nitReceptor,
                      subtotal: parseFloat(datos.subtotal) || 0,
                      iva: parseFloat(datos.iva) || 0,
                      total: parseFloat(datos.total) || 0,
                      fecha: datos.fechaEmision,
                      estado: "Pendiente",
                      tipo: getFileType(archivo),
                    },
                  ]);
              }}
            />
          </div>
        </div>
      )}

      {/* ── Historial table ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-base font-semibold text-gray-700"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Facturas procesadas
          </h2>
          <button
            onClick={() => descargarExcel(historial)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download size={14} /> Descargar todas
          </button>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-violet-50 border border-violet-200 rounded-xl text-sm">
            <span className="font-medium text-violet-700">{selected.size} seleccionada(s)</span>
            <button
              onClick={enviarSeleccionadas}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
            >
              <Send size={13} /> Enviar a contabilidad
            </button>
            <button
              onClick={() => descargarExcel(historial.filter((f) => selected.has(f.id)))}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-violet-300 text-violet-700 text-sm hover:bg-violet-100 transition-colors"
            >
              <Download size={13} /> Descargar Excel
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  <th className="px-4 py-3 w-10">
                    <Checkbox
                      checked={selected.size === historial.length && historial.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  {["Archivo", "Número", "Emisor", "Total", "Fecha", "Estado", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historial.map((f) => (
                  <tr key={f.id} className="hover:bg-violet-50/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <Checkbox
                        checked={selected.has(f.id)}
                        onCheckedChange={() => toggleSelect(f.id)}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <FileTypeIcon tipo={f.tipo} size={15} />
                        <span className="text-xs text-gray-500 max-w-[140px] truncate">{f.archivo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-medium text-gray-700">{f.numero}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium text-gray-700">{f.emisor}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{f.nitEmisor}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-gray-700 tabular-nums">
                      {fmt(f.total)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{f.fecha}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                          ESTADO_STYLES[f.estado]
                        }`}
                      >
                        {f.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => openDialog(f)}
                        className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors"
                      >
                        <Eye size={13} /> Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            {historial.length} factura{historial.length !== 1 ? "s" : ""} procesada{historial.length !== 1 ? "s" : ""}
          </div>
        </div>
      </section>

      {/* ── Detail Dialog ── */}
      <Dialog open={!!dialogFactura} onOpenChange={(o) => !o && setDialogFactura(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle
              className="text-base"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Detalle — {dialogFactura?.numero}
            </DialogTitle>
          </DialogHeader>
          {dialogFactura && (
            <DetalleFactura
              factura={dialogFactura}
              datos={dialogDatos}
              onDatosChange={setDialogDatos}
              onAprobar={() => {
                setHistorial((prev) =>
                  prev.map((f) =>
                    f.id === dialogFactura.id ? { ...f, estado: "Enviada" as const } : f
                  )
                );
                setDialogFactura(null);
                toast({ title: "Factura enviada a contabilidad." });
              }}
              onDescartar={() => setDialogFactura(null)}
              onDescargarExcel={() => descargarExcel([dialogFactura])}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
