import { createContext, useEffect, useState, ReactNode } from "react"
import { User } from "@supabase/supabase-js"
import { supabase, Profile } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  hasAccess: (ruta: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    console.log("Fetching profile for:", userId)

    // Timeout de seguridad: si tarda más de 5s, liberar el loading
    const timeout = setTimeout(() => {
      console.warn("fetchProfile timeout — forcing setLoading(false)")
      setLoading(false)
    }, 5000)

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      console.log("Profile result:", data, error)

      if (error) {
        console.error("Error fetching profile:", error)
        setProfile(null)
      } else {
        setProfile(data ?? null)
      }
    } catch (err) {
      console.error("Unexpected error in fetchProfile:", err)
      setProfile(null)
    } finally {
      clearTimeout(timeout)
      console.log("Loading set to false")
      setLoading(false)
    }
  }

  useEffect(() => {
    // Recuperar sesión activa al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.email)
      setUser(session?.user ?? null)
      if (session?.user) {
        setLoading(true)
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function hasAccess(ruta: string): Promise<boolean> {
    if (!profile) return false
    if (profile.role === "administrador") return true
    if (profile.role === "operador") return true

    if (profile.role === "cliente") {
      const { data } = await supabase
        .from("usuario_flujos")
        .select("ruta")
        .eq("user_id", profile.id)
        .eq("ruta", ruta)
        .maybeSingle()
      return !!data
    }

    // visualizador
    const { data } = await supabase
      .from("rol_flujos")
      .select("ruta")
      .eq("role", profile.role)
      .eq("ruta", ruta)
      .maybeSingle()
    return !!data
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, hasAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

