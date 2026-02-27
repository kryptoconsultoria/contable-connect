import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockFacturas = [
  { id: "1", numero: "FV-001234", tipo: "Venta", tercero: "TechCorp S.A.S.", nit: "900.123.456-7", fechaEmision: "2026-01-15", fechaVencimiento: "2026-02-14", subtotal: 10504201, impuestos: 1995798, retenciones: 0, total: 12500000, estado: "Contabilizado", conciliada: true },
  { id: "2", numero: "FC-000891", tipo: "Compra", tercero: "Distribuciones El Valle", nit: "800.234.567-1", fechaEmision: "2026-01-18", fechaVencimiento: "2026-02-17", subtotal: 7008403, impuestos: 1331597, retenciones: 0, total: 8340000, estado: "Borrador", conciliada: false },
  { id: "3", numero: "FV-001233", tipo: "Venta", tercero: "Innovar Digital Ltda.", nit: "901.345.678-2", fechaEmision: "2026-01-12", fechaVencimiento: "2026-02-11", subtotal: 2689075, impuestos: 510925, retenciones: 0, total: 3200000, estado: "Contabilizado", conciliada: true },
  { id: "4", numero: "FC-000890", tipo: "Compra", tercero: "Papelería Nacional", nit: "860.456.789-3", fechaEmision: "2026-01-10", fechaVencimiento: "2026-02-09", subtotal: 1218487, impuestos: 231513, retenciones: 0, total: 1450000, estado: "Borrador", conciliada: false },
  { id: "5", numero: "FV-001232", tipo: "Venta", tercero: "Grupo Andino S.A.", nit: "900.567.890-4", fechaEmision: "2026-01-08", fechaVencimiento: "2026-02-07", subtotal: 18571428, impuestos: 3528572, retenciones: 0, total: 22100000, estado: "Contabilizado", conciliada: false },
  { id: "6", numero: "FC-000889", tipo: "Compra", tercero: "Suministros Bogotá", nit: "830.678.901-5", fechaEmision: "2026-01-05", fechaVencimiento: "2026-02-04", subtotal: 4200000, impuestos: 798000, retenciones: 126000, total: 4872000, estado: "Contabilizado", conciliada: true },
];

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(value);
}

export default function Facturas() {
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [estadoFilter, setEstadoFilter] = useState("todos");

  const filtered = mockFacturas.filter((f) => {
    const matchSearch = f.numero.toLowerCase().includes(search.toLowerCase()) || f.tercero.toLowerCase().includes(search.toLowerCase());
    const matchTipo = tipoFilter === "todos" || f.tipo.toLowerCase() === tipoFilter;
    const matchEstado = estadoFilter === "todos" || f.estado.toLowerCase() === estadoFilter;
    return matchSearch && matchTipo && matchEstado;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Facturas</h1>
          <p className="page-subtitle">Gestión de facturas de compra y venta</p>
        </div>
        <Link to="/facturas/nueva">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva factura
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o tercero..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-[140px]">
            <Filter className="mr-2 h-3.5 w-3.5" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="compra">Compra</SelectItem>
            <SelectItem value="venta">Venta</SelectItem>
          </SelectContent>
        </Select>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="borrador">Borrador</SelectItem>
            <SelectItem value="contabilizado">Contabilizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Número</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Tipo</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Tercero</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">NIT</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Emisión</th>
                <th className="text-right p-3 font-medium text-muted-foreground text-xs">Subtotal</th>
                <th className="text-right p-3 font-medium text-muted-foreground text-xs">Impuestos</th>
                <th className="text-right p-3 font-medium text-muted-foreground text-xs">Total</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs">Estado</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs">Conciliada</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer">
                  <td className="p-3 font-mono text-xs font-medium">
                    <Link to={`/facturas/${f.id}`} className="text-primary hover:underline">{f.numero}</Link>
                  </td>
                  <td className="p-3">
                    <Badge variant={f.tipo === "Venta" ? "default" : "secondary"} className="text-[10px]">
                      {f.tipo}
                    </Badge>
                  </td>
                  <td className="p-3">{f.tercero}</td>
                  <td className="p-3 font-mono text-xs">{f.nit}</td>
                  <td className="p-3 text-xs">{f.fechaEmision}</td>
                  <td className="p-3 currency text-xs">{formatCOP(f.subtotal)}</td>
                  <td className="p-3 currency text-xs">{formatCOP(f.impuestos)}</td>
                  <td className="p-3 currency text-xs font-medium">{formatCOP(f.total)}</td>
                  <td className="p-3 text-center">
                    <span className={f.estado === "Contabilizado" ? "status-contabilizado" : "status-borrador"}>
                      {f.estado}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={f.conciliada ? "status-conciliado" : "status-pendiente"}>
                      {f.conciliada ? "Sí" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No se encontraron facturas con los filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}
