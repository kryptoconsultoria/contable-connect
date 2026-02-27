import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockCuentas = [
  { id: "1", codigo: "1105", nombre: "Caja", naturaleza: "Débito", nivel: 4, activa: true },
  { id: "2", codigo: "1110", nombre: "Bancos", naturaleza: "Débito", nivel: 4, activa: true },
  { id: "3", codigo: "1305", nombre: "Clientes", naturaleza: "Débito", nivel: 4, activa: true },
  { id: "4", codigo: "2205", nombre: "Proveedores nacionales", naturaleza: "Crédito", nivel: 4, activa: true },
  { id: "5", codigo: "2365", nombre: "Retención en la fuente", naturaleza: "Crédito", nivel: 4, activa: true },
  { id: "6", codigo: "2408", nombre: "IVA por pagar", naturaleza: "Crédito", nivel: 4, activa: true },
  { id: "7", codigo: "4135", nombre: "Comercio al por mayor y al por menor", naturaleza: "Crédito", nivel: 4, activa: true },
  { id: "8", codigo: "5105", nombre: "Gastos de personal", naturaleza: "Débito", nivel: 4, activa: true },
  { id: "9", codigo: "5195", nombre: "Diversos", naturaleza: "Débito", nivel: 4, activa: true },
  { id: "10", codigo: "6135", nombre: "Comercio al por mayor y al por menor", naturaleza: "Débito", nivel: 4, activa: true },
];

export default function CuentasContables() {
  const [search, setSearch] = useState("");
  const filtered = mockCuentas.filter(
    (c) => c.codigo.includes(search) || c.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Plan de Cuentas (PUC)</h1>
          <p className="page-subtitle">Catálogo de cuentas contables colombiano</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nueva cuenta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Agregar cuenta contable</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Código PUC *</Label>
                <Input placeholder="1105" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Nivel</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Nivel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Clase</SelectItem>
                    <SelectItem value="2">2 - Grupo</SelectItem>
                    <SelectItem value="3">3 - Cuenta</SelectItem>
                    <SelectItem value="4">4 - Subcuenta</SelectItem>
                    <SelectItem value="5">5 - Auxiliar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Nombre *</Label>
                <Input placeholder="Nombre de la cuenta" />
              </div>
              <div className="space-y-2">
                <Label>Naturaleza *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debito">Débito</SelectItem>
                    <SelectItem value="credito">Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex justify-end mt-2">
                <Button>Guardar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por código o nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Código</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Nombre</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Naturaleza</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs">Nivel</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium">{c.codigo}</td>
                  <td className="p-3">{c.nombre}</td>
                  <td className="p-3"><Badge variant={c.naturaleza === "Débito" ? "default" : "secondary"} className="text-[10px]">{c.naturaleza}</Badge></td>
                  <td className="p-3 text-center text-xs">{c.nivel}</td>
                  <td className="p-3 text-center"><span className="status-conciliado">Activa</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
