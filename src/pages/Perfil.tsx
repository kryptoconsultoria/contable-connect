import { useState } from "react"
import { Shield } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const ROLE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  administrador: { bg: "#6D28D9", color: "#fff", label: "Administrador" },
  operador:      { bg: "#F97316", color: "#fff", label: "Operador"      },
  visualizador:  { bg: "#2563EB", color: "#fff", label: "Visualizador"  },
  cliente:       { bg: "#16A34A", color: "#fff", label: "Cliente"       },
}

export default function Perfil() {
  const { profile } = useAuth()
  const { toast } = useToast()

  const [fullName, setFullName]       = useState(profile?.full_name ?? "")
  const [savingName, setSavingName]   = useState(false)
  const [showPwd, setShowPwd]         = useState(false)
  const [newPwd, setNewPwd]           = useState("")
  const [confirmPwd, setConfirmPwd]   = useState("")
  const [savingPwd, setSavingPwd]     = useState(false)

  const role = profile?.role ?? "operador"
  const badge = ROLE_BADGE[role] ?? { bg: "#6B7280", color: "#fff", label: role }

  const initials = (profile?.full_name ?? "U")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()

  function formatDate(iso?: string) {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
  }

  async function handleSaveName() {
    if (!profile || !fullName.trim()) return
    setSavingName(true)
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id)
    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Perfil actualizado" })
    }
    setSavingName(false)
  }

  async function handleChangePassword() {
    if (newPwd.length < 8) {
      toast({ title: "Contraseña muy corta", description: "Mínimo 8 caracteres.", variant: "destructive" })
      return
    }
    if (newPwd !== confirmPwd) {
      toast({ title: "Las contraseñas no coinciden", variant: "destructive" })
      return
    }
    setSavingPwd(true)
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    if (error) {
      toast({ title: "Error al cambiar contraseña", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Contraseña actualizada correctamente" })
      setNewPwd(""); setConfirmPwd("")
      setShowPwd(false)
    }
    setSavingPwd(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#1A1A2E" }}>Mi Perfil</h1>
        <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>Información de tu cuenta</p>
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
            style={{ background: "#6D28D9" }}
          >
            {initials}
          </div>

          <div className="space-y-1.5">
            <p className="text-lg font-bold" style={{ color: "#1A1A2E" }}>
              {profile?.full_name ?? "—"}
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>{profile?.email ?? "—"}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                Miembro desde {formatDate(profile?.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de edición */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>Datos personales</h2>

        <div className="space-y-1.5">
          <Label>Nombre completo</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={profile?.email ?? ""} disabled className="opacity-50" />
          <p className="text-xs" style={{ color: "#9CA3AF" }}>El email no puede ser modificado.</p>
        </div>

        <div className="space-y-1.5">
          <Label>Rol</Label>
          <Input value={badge.label} disabled className="opacity-50" />
          <p className="text-xs" style={{ color: "#9CA3AF" }}>El rol lo asigna un administrador.</p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSaveName}
            disabled={savingName}
            className="text-white"
            style={{ background: "#6D28D9" }}
          >
            {savingName ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: "#6D28D9" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#1A1A2E" }}>Seguridad</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Contraseña</p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>Actualiza tu contraseña de acceso</p>
          </div>
          <Button variant="outline" onClick={() => setShowPwd(true)}>
            Cambiar contraseña
          </Button>
        </div>
      </div>

      {/* Modal cambiar contraseña */}
      <Dialog open={showPwd} onOpenChange={(v) => { if (!v) { setNewPwd(""); setConfirmPwd(""); setShowPwd(false) } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nueva contraseña *</Label>
              <Input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirmar contraseña *</Label>
              <Input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setNewPwd(""); setConfirmPwd(""); setShowPwd(false) }}
              disabled={savingPwd}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={savingPwd}
              className="text-white"
              style={{ background: "#6D28D9" }}
            >
              {savingPwd ? "Actualizando..." : "Actualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
