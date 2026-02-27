import { useState } from "react";
import { Upload, Link2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const extractoLineas = [
  { id: "e1", fecha: "2026-01-05", descripcion: "Transferencia recibida TechCorp", referencia: "REF-001", debito: 0, credito: 12500000, saldo: 57730000, estado: "no_conciliado" },
  { id: "e2", fecha: "2026-01-08", descripcion: "Pago proveedor Papelería Nal", referencia: "REF-002", debito: 1450000, credito: 0, saldo: 56280000, estado: "no_conciliado" },
  { id: "e3", fecha: "2026-01-10", descripcion: "Consignación Grupo Andino", referencia: "REF-003", debito: 0, credito: 22100000, saldo: 78380000, estado: "conciliado_total" },
  { id: "e4", fecha: "2026-01-12", descripcion: "Comisión bancaria", referencia: "REF-004", debito: 15000, credito: 0, saldo: 78365000, estado: "no_conciliado" },
  { id: "e5", fecha: "2026-01-15", descripcion: "Transferencia Innovar Digital", referencia: "REF-005", debito: 0, credito: 3200000, saldo: 81565000, estado: "conciliado_parcial" },
];

const movimientosContables = [
  { id: "m1", fecha: "2026-01-05", tipo: "Recaudo", referencia: "FV-001234", valor: 12500000, factura: "FV-001234" },
  { id: "m2", fecha: "2026-01-08", tipo: "Pago", referencia: "FC-000890", valor: -1450000, factura: "FC-000890" },
  { id: "m3", fecha: "2026-01-10", tipo: "Recaudo", referencia: "FV-001232", valor: 22100000, factura: "FV-001232" },
  { id: "m4", fecha: "2026-01-15", tipo: "Recaudo", referencia: "FV-001233", valor: 3200000, factura: "FV-001233" },
  { id: "m5", fecha: "2026-01-18", tipo: "Pago", referencia: "FC-000891", valor: -8340000, factura: "FC-000891" },
];

const fmt = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(Math.abs(v));

const estadoLabel: Record<string, string> = {
  no_conciliado: "Sin conciliar",
  conciliado_parcial: "Parcial",
  conciliado_total: "Conciliado",
};
const estadoClass: Record<string, string> = {
  no_conciliado: "status-pendiente",
  conciliado_parcial: "status-borrador",
  conciliado_total: "status-conciliado",
};

export default function Conciliacion() {
  const [selectedExtracto, setSelectedExtracto] = useState<string[]>([]);
  const [selectedMov, setSelectedMov] = useState<string[]>([]);

  const toggleExtracto = (id: string) => {
    setSelectedExtracto((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleMov = (id: string) => {
    setSelectedMov((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Conciliación Bancaria</h1>
          <p className="page-subtitle">Emparejamiento de extractos con movimientos contables</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Cargar extracto
          </Button>
          <Button disabled={selectedExtracto.length === 0 || selectedMov.length === 0}>
            <Link2 className="mr-2 h-4 w-4" />
            Conciliar selección
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <Select defaultValue="bco1">
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Cuenta bancaria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bco1">Bancolombia - 1234-5678-9012</SelectItem>
            <SelectItem value="bco2">Davivienda - 5678-9012-3456</SelectItem>
            <SelectItem value="bco3">BBVA - 9012-3456-7890</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="ene2026">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ene2026">Enero 2026</SelectItem>
            <SelectItem value="dic2025">Diciembre 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="kpi-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Saldo según banco</p>
          <p className="text-xl font-bold mt-1 currency">$81.565.000</p>
        </Card>
        <Card className="kpi-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Saldo según libros</p>
          <p className="text-xl font-bold mt-1 currency">$81.315.000</p>
        </Card>
        <Card className="kpi-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Diferencia</p>
          <p className="text-xl font-bold mt-1 currency text-destructive">$250.000</p>
        </Card>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Extracto bancario */}
        <div className="table-container">
          <div className="p-4 border-b">
            <h2 className="text-sm font-semibold">Extracto bancario</h2>
            <p className="text-xs text-muted-foreground">Líneas importadas del extracto</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-3 w-8"></th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Fecha</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Descripción</th>
                  <th className="text-right p-3 font-medium text-muted-foreground text-xs">Valor</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs">Estado</th>
                </tr>
              </thead>
              <tbody>
                {extractoLineas.map((l) => (
                  <tr key={l.id} className={`border-b last:border-0 hover:bg-muted/20 transition-colors ${selectedExtracto.includes(l.id) ? "bg-primary/5" : ""}`}>
                    <td className="p-3">
                      <Checkbox checked={selectedExtracto.includes(l.id)} onCheckedChange={() => toggleExtracto(l.id)} />
                    </td>
                    <td className="p-3 text-xs">{l.fecha}</td>
                    <td className="p-3 text-xs">{l.descripcion}</td>
                    <td className={`p-3 currency text-xs ${l.credito > 0 ? "text-success" : "text-destructive"}`}>
                      {l.credito > 0 ? `+${fmt(l.credito)}` : `-${fmt(l.debito)}`}
                    </td>
                    <td className="p-3 text-center">
                      <span className={estadoClass[l.estado]}>{estadoLabel[l.estado]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movimientos contables */}
        <div className="table-container">
          <div className="p-4 border-b">
            <h2 className="text-sm font-semibold">Movimientos contables</h2>
            <p className="text-xs text-muted-foreground">Registros internos del sistema</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-3 w-8"></th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Fecha</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Tipo</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Ref.</th>
                  <th className="text-right p-3 font-medium text-muted-foreground text-xs">Valor</th>
                </tr>
              </thead>
              <tbody>
                {movimientosContables.map((m) => (
                  <tr key={m.id} className={`border-b last:border-0 hover:bg-muted/20 transition-colors ${selectedMov.includes(m.id) ? "bg-primary/5" : ""}`}>
                    <td className="p-3">
                      <Checkbox checked={selectedMov.includes(m.id)} onCheckedChange={() => toggleMov(m.id)} />
                    </td>
                    <td className="p-3 text-xs">{m.fecha}</td>
                    <td className="p-3 text-xs">{m.tipo}</td>
                    <td className="p-3 text-xs font-mono">{m.referencia}</td>
                    <td className={`p-3 currency text-xs ${m.valor > 0 ? "text-success" : "text-destructive"}`}>
                      {m.valor > 0 ? `+${fmt(m.valor)}` : `-${fmt(m.valor)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
