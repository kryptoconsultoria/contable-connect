import { useState } from "react"
import { Settings, CheckCircle2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

/* ── Automatizaciones ── */
const FLUJOS = [
  { nombre: "Leads Comerciales",  activo: true  },
  { nombre: "Descarga DIAN",      activo: true  },
  { nombre: "Extracción Facturas", activo: true  },
  { nombre: "Causación Contable", activo: false },
  { nombre: "Servicios Públicos", activo: false },
]

function FlujoBadge({ activo }: { activo: boolean }) {
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={
        activo
          ? { background: "rgba(22,163,74,0.1)", color: "#16A34A" }
          : { background: "rgba(107,114,128,0.1)", color: "#6B7280" }
      }
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  )
}

/* ── Toggle ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none"
      style={{ background: checked ? "#7C3AED" : "#D1D5DB" }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5"
        style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  )
}

export default function Configuracion() {
  const { toast } = useToast()
  const [notifEmail, setNotifEmail]   = useState(true)
  const [alertErrors, setAlertErrors] = useState(true)
  const [copied, setCopied]           = useState<string | null>(null)

  function handleCopy(nombre: string) {
    setCopied(nombre)
    setTimeout(() => setCopied(null), 1500)
    toast({ title: "Copiado al portapapeles" })
  }

  function handleSaveNotif() {
    toast({ title: "Preferencias guardadas", description: "Las notificaciones fueron actualizadas." })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(124,58,237,0.12)" }}
        >
          <Settings size={20} style={{ color: "#7C3AED" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1A1A2E" }}>Configuración</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>Parámetros del sistema y conexiones</p>
        </div>
      </div>

      {/* Card conexiones */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>
          Conexiones de automatización
        </h2>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          Flujos disponibles y su estado de conexión con el motor de automatizaciones.
        </p>

        <div className="space-y-2">
          {FLUJOS.map((f) => (
            <div
              key={f.nombre}
              className="flex items-center justify-between px-4 py-3 rounded-lg"
              style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
            >
              <div className="flex items-center gap-3">
                {f.activo
                  ? <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
                  : <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "#D1D5DB" }} />
                }
                <span className="text-sm font-medium text-gray-700">{f.nombre}</span>
              </div>

              <div className="flex items-center gap-2">
                {f.activo && (
                  <button
                    onClick={() => handleCopy(f.nombre)}
                    className="p-1.5 rounded-md transition-colors hover:bg-gray-200"
                    title="Copiar configuración"
                  >
                    <Copy size={13} style={{ color: copied === f.nombre ? "#7C3AED" : "#9CA3AF" }} />
                  </button>
                )}
                <span
                  className="text-xs font-medium"
                  style={{ color: f.activo ? "#16A34A" : "#9CA3AF" }}
                >
                  {f.activo ? "Configurado" : "Sin configurar"}
                </span>
                <FlujoBadge activo={f.activo} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card notificaciones */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>Notificaciones</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Notificaciones por email</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Recibe un resumen de los procesos ejecutados
              </p>
            </div>
            <Toggle checked={notifEmail} onChange={setNotifEmail} />
          </div>

          <div
            className="h-px"
            style={{ background: "#F3F4F6" }}
          />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Alertas de errores en procesos</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Notificación inmediata cuando un flujo falla
              </p>
            </div>
            <Toggle checked={alertErrors} onChange={setAlertErrors} />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSaveNotif}
            className="text-white"
            style={{ background: "#7C3AED" }}
          >
            Guardar preferencias
          </Button>
        </div>
      </div>

      {/* Card info del sistema */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>Información del sistema</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <span style={{ color: "#6B7280" }}>Versión</span>
            <span className="font-medium text-gray-800">IntegrIApp v1.0</span>
          </div>
          <div className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <span style={{ color: "#6B7280" }}>Entorno</span>
            <span className="font-medium text-gray-800">Producción</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span style={{ color: "#6B7280" }}>Base de datos</span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "#16A34A" }}
              />
              <span className="font-medium" style={{ color: "#16A34A" }}>Conectada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
