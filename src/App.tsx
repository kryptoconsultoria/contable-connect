import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Facturas from "./pages/Facturas";
import FacturaForm from "./pages/FacturaForm";
import Terceros from "./pages/Terceros";
import CuentasContables from "./pages/CuentasContables";
import Bancos from "./pages/Bancos";
import Conciliacion from "./pages/Conciliacion";
import DIANConsulta from "./pages/DIANConsulta";
import Configuracion from "./pages/Configuracion";
import Causacion from "./pages/Causacion";
import ServiciosPublicos from "./pages/ServiciosPublicos";
import Combustible from "./pages/Combustible";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/facturas" element={<Facturas />} />
                <Route path="/facturas/nueva" element={<FacturaForm />} />
                <Route path="/facturas/:id" element={<FacturaForm />} />
                <Route path="/terceros" element={<Terceros />} />
                <Route path="/cuentas" element={<CuentasContables />} />
                <Route path="/bancos" element={<Bancos />} />
                <Route path="/causacion" element={<Causacion />} />
                <Route path="/servicios-publicos" element={<ServiciosPublicos />} />
                <Route path="/combustible" element={<Combustible />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/conciliacion" element={<Conciliacion />} />
                <Route path="/dian" element={<DIANConsulta />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/perfil" element={<Perfil />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
