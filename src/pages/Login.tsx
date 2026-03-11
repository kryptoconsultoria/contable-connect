import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    if (!email || !password) {
      setError("Por favor completa todos los campos.")
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.")
      setLoading(false)
    } else {
      navigate("/")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0F0F1A 0%, #1A0F2E 50%, #0F1A2E 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #F97316, transparent)" }} />
      </div>

      <div
        className="relative w-full max-w-md rounded-2xl p-8 space-y-7"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(124,58,237,0.3)",
          boxShadow: "0 0 60px rgba(124,58,237,0.15), 0 24px 48px rgba(0,0,0,0.5)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Logo */}
        <div className="text-center space-y-1">
          <h1
            className="text-5xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 40%, #F97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            IntegrIApp
          </h1>
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
            Plataforma de automatizaciones
          </p>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)" }} />

        {/* Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(124,58,237,0.8)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="correo@empresa.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(124,58,237,0.25)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.7)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.25)")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(124,58,237,0.8)" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder:text-gray-600 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(124,58,237,0.25)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.7)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.25)")}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            style={{
              background: loading
                ? "rgba(124,58,237,0.5)"
                : "linear-gradient(135deg, #7C3AED, #9333EA)",
              boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget.style.boxShadow = "0 4px 28px rgba(124,58,237,0.6)")
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.4)")
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </div>

        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          IntegrIA Solutions © 2025
        </p>
      </div>
    </div>
  )
}
