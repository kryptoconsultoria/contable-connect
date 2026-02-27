import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const mockTerceros = [
  { id: "1", nit: "900.123.456-7", tipo: "Cliente", razonSocial: "TechCorp S.A.S.", ciudad: "Bogotá", regimen: "Común", email: "contacto@techcorp.co", telefono: "601-123-4567" },
  { id: "2", nit: "800.234.567-1", tipo: "Proveedor", razonSocial: "Distribuciones El Valle", ciudad: "Cali", regimen: "Común", email: "ventas@elvalle.co", telefono: "602-234-5678" },
  { id: "3", nit: "901.345.678-2", tipo: "Cliente", razonSocial: "Innovar Digital Ltda.", ciudad: "Medellín", regimen: "Simplificado", email: "info@innovar.co", telefono: "604-345-6789" },
  { id: "4", nit: "860.456.789-3", tipo: "Proveedor", razonSocial: "Papelería Nacional", ciudad: "Bogotá", regimen: "Gran contribuyente", email: "compras@papeleria.co", telefono: "601-456-7890" },
  { id: "5", nit: "900.567.890-4", tipo: "Cliente", razonSocial: "Grupo Andino S.A.", ciudad: "Barranquilla", regimen: "Común", email: "contabilidad@andino.co", telefono: "605-567-8901" },
  { id: "6", nit: "830.678.901-5", tipo: "Proveedor", razonSocial: "Suministros Bogotá", ciudad: "Bogotá", regimen: "Autoretenedor", email: "ventas@sumbogota.co", telefono: "601-678-9012" },
];

export default function Terceros() {
  const [search, setSearch] = useState("");
  const filtered = mockTerceros.filter(
    (t) =>
      t.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
      t.nit.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Terceros</h1>
          <p className="page-subtitle">Proveedores y clientes registrados</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nuevo tercero</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar tercero</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>NIT *</Label>
                <Input placeholder="900.123.456-7" />
              </div>
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="proveedor">Proveedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Razón social *</Label>
                <Input placeholder="Nombre de la empresa" />
              </div>
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Input placeholder="Bogotá" />
              </div>
              <div className="space-y-2">
                <Label>Régimen</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comun">Común</SelectItem>
                    <SelectItem value="simplificado">Simplificado</SelectItem>
                    <SelectItem value="gran_contribuyente">Gran contribuyente</SelectItem>
                    <SelectItem value="autoretenedor">Autoretenedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="correo@empresa.com" />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input placeholder="601-123-4567" />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button>Guardar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por NIT o razón social..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">NIT</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Razón social</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Tipo</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Ciudad</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Régimen</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-mono text-xs">{t.nit}</td>
                  <td className="p-3 font-medium">{t.razonSocial}</td>
                  <td className="p-3"><Badge variant={t.tipo === "Cliente" ? "default" : "secondary"} className="text-[10px]">{t.tipo}</Badge></td>
                  <td className="p-3">{t.ciudad}</td>
                  <td className="p-3 text-xs">{t.regimen}</td>
                  <td className="p-3 text-xs">{t.email}</td>
                  <td className="p-3 text-xs font-mono">{t.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
