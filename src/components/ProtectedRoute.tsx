import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children?: React.ReactNode
}

function Spinner() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "#0F0F1A" }}
    >
      <span className="text-2xl font-bold" style={{ color: "#7C3AED" }}>
        IntegrIApp
      </span>
      <div className="w-8 h-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
    </div>
  )
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading, hasAccess } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    // Esperar a que termine la carga inicial y a que profile esté disponible
    if (loading) return
    if (!user) {
      setChecking(false)
      return
    }
    // Si user existe pero profile aún no llegó, seguir esperando
    if (!profile) return

    setChecking(true)
    hasAccess(location.pathname).then((ok) => {
      setAllowed(ok)
      setChecking(false)
    })
  }, [user, profile, loading, location.pathname])

  // Mostrar spinner mientras: carga inicial, o user existe pero profile aún no cargó, o verificando acceso
  if (loading || (user && !profile) || checking) {
    return <Spinner />
  }

  // Sin sesión → login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Sin acceso → página de aviso con botón
  if (!allowed) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: "#0F0F1A" }}
      >
        <span className="text-3xl font-bold" style={{ color: "#7C3AED" }}>
          IntegrIApp
        </span>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white">Sin acceso</h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            No tienes permisos para ver esta sección.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: "#7C3AED" }}
        >
          Volver al Dashboard
        </button>
      </div>
    )
  }

  return children ? <>{children}</> : <Outlet />
}
