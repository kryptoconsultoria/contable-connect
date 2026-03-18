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
      style={{ background: "#FAFAFA" }}
    >
      <div
        className="w-full max-w-sm"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E8ED",
          borderRadius: "16px",
          padding: "48px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <div className="mb-8">
          <h1
            className="font-bold"
            style={{ fontSize: "24px", color: "#1D1D1F", lineHeight: 1.1 }}
          >
            IntegrIApp
          </h1>
          <p className="mt-1.5" style={{ fontSize: "14px", color: "#6E6E73" }}>
            Plataforma de automatizaciones
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-4">

          {/* Email */}
          <div className="space-y-1.5">
            <label
              className="text-[13px] font-medium"
              style={{ color: "#1D1D1F" }}
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#AEAEB2" }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="correo@empresa.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: "#FAFAFA",
                  border: "1px solid #E8E8ED",
                  borderRadius: "8px",
                  color: "#1D1D1F",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6D28D9")}
                onBlur={(e) => (e.target.style.borderColor = "#E8E8ED")}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              className="text-[13px] font-medium"
              style={{ color: "#1D1D1F" }}
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#AEAEB2" }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  background: "#FAFAFA",
                  border: "1px solid #E8E8ED",
                  borderRadius: "8px",
                  color: "#1D1D1F",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6D28D9")}
                onBlur={(e) => (e.target.style.borderColor = "#E8E8ED")}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-xs text-center px-3 py-2 rounded-lg"
              style={{
                color: "#DC2626",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            style={{
              background: "#6D28D9",
              borderRadius: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#5B21B6"
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "#6D28D9"
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

        {/* Footer */}
        <p
          className="text-center text-[12px] mt-8"
          style={{ color: "#AEAEB2" }}
        >
          IntegrIA Solutions © 2026
        </p>
      </div>
    </div>
  )
}
