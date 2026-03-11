import { useEffect, useState } from "react"
import { Users2, UserPlus, Pencil, UserX } from "lucide-react"
import { supabase, Profile } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ── Role badge ── */
const ROLE_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  administrador: { bg: "#7C3AED", color: "#fff", label: "Administrador" },
  operador:      { bg: "#F97316", color: "#fff", label: "Operador"      },
  visualizador:  { bg: "#2563EB", color: "#fff", label: "Visualizador"  },
  cliente:       { bg: "#16A34A", color: "#fff", label: "Cliente"       },
}

function RoleBadge({ role }: { role: string }) {
  const s = ROLE_BADGE[role] ?? { bg: "#6B7280", color: "#fff", label: role }
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

function Initials({ name }: { name: string }) {
  const ini = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: "#7C3AED" }}
    >
      {ini || "?"}
    </div>
  )
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="py-16 text-center text-sm text-gray-400">
        No hay usuarios registrados.
      </td>
    </tr>
  )
}

/* ── Nuevo Usuario Modal ── */
interface NuevoModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

function NuevoUsuarioModal({ open, onClose, onCreated }: NuevoModalProps) {
  const { toast } = useToast()
  const [fullName, setFullName] = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole]         = useState("operador")
  const [loading, setLoading]   = useState(false)

  function reset() {
    setFullName(""); setEmail(""); setPassword(""); setRole("operador")
  }

  async function handleCreate() {
    if (!fullName.trim() || !email.trim() || password.length < 8) {
      toast({ title: "Datos incompletos", description: "Completa todos los campos. La contraseña debe tener al menos 8 caracteres.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      })
      if (signUpError) throw signUpError

      const userId = signUpData.user?.id
      if (userId) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: userId,
          full_name: fullName,
          email,
          role,
          active: true,
        })
        if (profileError) throw profileError
      }

      toast({ title: "Usuario creado", description: `${fullName} fue registrado correctamente.` })
      reset()
      onCreated()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear usuario"
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre completo *</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Pérez" />
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="juan@empresa.com" />
          </div>
          <div className="space-y-1.5">
            <Label>Contraseña * (mínimo 8 caracteres)</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label>Rol</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
                <SelectItem value="visualizador">Visualizador</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose() }} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={loading} style={{ background: "#7C3AED" }}>
            {loading ? "Creando..." : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ── Editar Usuario Modal ── */
interface EditarModalProps {
  user: Profile | null
  onClose: () => void
  onUpdated: () => void
}

function EditarUsuarioModal({ user, onClose, onUpdated }: EditarModalProps) {
  const { toast } = useToast()
  const [fullName, setFullName] = useState(user?.full_name ?? "")
  const [role, setRole]         = useState(user?.role ?? "operador")
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (user) { setFullName(user.full_name); setRole(user.role) }
  }, [user])

  async function handleSave() {
    if (!user) return
    if (!fullName.trim()) {
      toast({ title: "Nombre requerido", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, role })
        .eq("id", user.id)
      if (error) throw error
      toast({ title: "Usuario actualizado", description: `${fullName} fue actualizado.` })
      onUpdated()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar"
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre completo *</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled className="opacity-50" />
          </div>
          <div className="space-y-1.5">
            <Label>Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Profile["role"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
                <SelectItem value="visualizador">Visualizador</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading} style={{ background: "#7C3AED" }}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ── Main page ── */
export default function Usuarios() {
  const { toast } = useToast()
  const [users, setUsers]           = useState<Profile[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [showNuevo, setShowNuevo]   = useState(false)
  const [editing, setEditing]       = useState<Profile | null>(null)

  async function fetchUsers() {
    setLoadingData(true)
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) {
      toast({ title: "Error al cargar usuarios", description: error.message, variant: "destructive" })
    } else {
      setUsers(data ?? [])
    }
    setLoadingData(false)
  }

  useEffect(() => { fetchUsers() }, [])

  async function handleDeactivate(user: Profile) {
    const { error } = await supabase
      .from("profiles")
      .update({ active: !user.active })
      .eq("id", user.id)
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } else {
      toast({ title: user.active ? "Usuario desactivado" : "Usuario activado" })
      fetchUsers()
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(124,58,237,0.12)" }}
          >
            <Users2 size={20} style={{ color: "#7C3AED" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#1A1A2E" }}>
              Gestión de Usuarios
            </h1>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Administra usuarios y sus roles de acceso
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowNuevo(true)}
          className="flex items-center gap-2 text-white shrink-0"
          style={{ background: "#7C3AED" }}
        >
          <UserPlus size={16} />
          Nuevo Usuario
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Usuario</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Rol</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Creación</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-7 h-7 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                      <span className="text-sm text-gray-400">Cargando usuarios...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <EmptyState />
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-gray-50"
                    style={{ borderBottom: "1px solid #F3F4F6" }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Initials name={u.full_name} />
                        <span className="font-medium text-gray-900">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={
                          u.active
                            ? { background: "rgba(22,163,74,0.1)", color: "#16A34A" }
                            : { background: "rgba(107,114,128,0.1)", color: "#6B7280" }
                        }
                      >
                        {u.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(u)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-violet-50"
                          title="Editar usuario"
                        >
                          <Pencil size={15} style={{ color: "#7C3AED" }} />
                        </button>
                        <button
                          onClick={() => handleDeactivate(u)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                          title={u.active ? "Desactivar usuario" : "Activar usuario"}
                        >
                          <UserX size={15} style={{ color: u.active ? "#EF4444" : "#6B7280" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <NuevoUsuarioModal
        open={showNuevo}
        onClose={() => setShowNuevo(false)}
        onCreated={fetchUsers}
      />
      <EditarUsuarioModal
        user={editing}
        onClose={() => setEditing(null)}
        onUpdated={fetchUsers}
      />
    </div>
  )
}
