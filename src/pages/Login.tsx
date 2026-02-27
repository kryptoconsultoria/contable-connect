import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            IA
          </div>
          <h1 className="text-xl font-bold tracking-tight">IntegrIAPP</h1>
          <p className="text-sm text-muted-foreground">
            Causación y Conciliación Contable
          </p>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-base font-semibold text-center">
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </h2>

            {!isLogin && (
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input placeholder="Juan Díaz" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Correo electrónico</Label>
              <Input type="email" placeholder="correo@empresa.com" />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <Button type="submit" className="w-full">
              {isLogin ? "Ingresar" : "Registrarse"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground">
          Contabilidad colombiana · PUC · DIAN
        </p>
      </div>
    </div>
  );
}
