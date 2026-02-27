import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockBancos = [
  { id: "1", nombre: "Bancolombia", codigo: "BCO" },
  { id: "2", nombre: "Davivienda", codigo: "DAV" },
  { id: "3", nombre: "BBVA Colombia", codigo: "BBVA" },
  { id: "4", nombre: "Banco de Bogotá", codigo: "BBO" },
];

const mockCuentasBancarias = [
  { id: "1", banco: "Bancolombia", numeroCuenta: "1234-5678-9012", tipoCuenta: "Corriente", moneda: "COP", activa: true },
  { id: "2", banco: "Davivienda", numeroCuenta: "5678-9012-3456", tipoCuenta: "Ahorros", moneda: "COP", activa: true },
  { id: "3", banco: "BBVA Colombia", numeroCuenta: "9012-3456-7890", tipoCuenta: "Corriente", moneda: "COP", activa: true },
  { id: "4", banco: "Banco de Bogotá", numeroCuenta: "3456-7890-1234", tipoCuenta: "Corriente", moneda: "COP", activa: false },
];

export default function Bancos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Bancos y Cuentas Bancarias</h1>
          <p className="page-subtitle">Gestión de entidades bancarias y cuentas</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nueva cuenta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Agregar cuenta bancaria</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Banco *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {mockBancos.map(b => <SelectItem key={b.id} value={b.id}>{b.nombre}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Número de cuenta *</Label>
                <Input placeholder="1234-5678-9012" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Tipo de cuenta</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corriente">Corriente</SelectItem>
                    <SelectItem value="ahorros">Ahorros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Moneda</Label>
                <Input value="COP" disabled className="bg-muted" />
              </div>
              <div className="col-span-2 flex justify-end mt-2">
                <Button>Guardar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bancos */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Entidades bancarias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockBancos.map((b) => (
            <div key={b.id} className="kpi-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{b.codigo}</div>
              <div>
                <p className="text-sm font-medium">{b.nombre}</p>
                <p className="text-xs text-muted-foreground">Código: {b.codigo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cuentas */}
      <div className="table-container">
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold">Cuentas bancarias</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Banco</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Número de cuenta</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Tipo</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Moneda</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockCuentasBancarias.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-medium">{c.banco}</td>
                  <td className="p-3 font-mono text-xs">{c.numeroCuenta}</td>
                  <td className="p-3">{c.tipoCuenta}</td>
                  <td className="p-3">{c.moneda}</td>
                  <td className="p-3 text-center">
                    <span className={c.activa ? "status-conciliado" : "status-borrador"}>{c.activa ? "Activa" : "Inactiva"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
