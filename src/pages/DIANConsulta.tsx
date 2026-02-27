import { useState } from "react";
import { Search, ExternalLink, FileText } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const mockDianFacturas = [
  { id: "1", tipoDocumento: "Factura electrónica", numero: "FE-001234", fechaEmision: "2026-01-15", nitEmisor: "900.123.456-7", nombreEmisor: "TechCorp S.A.S.", nitReceptor: "800.999.888-0", nombreReceptor: "Mi Empresa S.A.S.", cufe: "a1b2c3d4e5f6789012345678901234567890abcdef", valorTotal: 12500000, moneda: "COP", estadoDian: "Aprobada", tipo: "Venta" },
  { id: "2", tipoDocumento: "Factura electrónica", numero: "FE-000891", fechaEmision: "2026-01-18", nitEmisor: "800.234.567-1", nombreEmisor: "Distribuciones El Valle", nitReceptor: "800.999.888-0", nombreReceptor: "Mi Empresa S.A.S.", cufe: "b2c3d4e5f6789012345678901234567890abcdef01", valorTotal: 8340000, moneda: "COP", estadoDian: "En proceso", tipo: "Compra" },
  { id: "3", tipoDocumento: "Nota crédito", numero: "NC-000045", fechaEmision: "2026-01-20", nitEmisor: "800.999.888-0", nombreEmisor: "Mi Empresa S.A.S.", nitReceptor: "901.345.678-2", nombreReceptor: "Innovar Digital Ltda.", cufe: "c3d4e5f6789012345678901234567890abcdef0123", valorTotal: 500000, moneda: "COP", estadoDian: "Aprobada", tipo: "Venta" },
  { id: "4", tipoDocumento: "Factura electrónica", numero: "FE-001235", fechaEmision: "2026-01-22", nitEmisor: "800.999.888-0", nombreEmisor: "Mi Empresa S.A.S.", nitReceptor: "900.567.890-4", nombreReceptor: "Grupo Andino S.A.", cufe: "d4e5f6789012345678901234567890abcdef012345", valorTotal: 15800000, moneda: "COP", estadoDian: "Rechazada", tipo: "Venta" },
];

const estadoClass: Record<string, string> = {
  "Aprobada": "status-conciliado",
  "En proceso": "status-pendiente",
  "Rechazada": "status-rechazado",
};

const fmt = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v);

export default function DIANConsulta() {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [selected, setSelected] = useState<typeof mockDianFacturas[0] | null>(null);

  const filtered = mockDianFacturas.filter((f) => {
    const matchSearch = f.numero.toLowerCase().includes(search.toLowerCase()) || f.nitEmisor.includes(search) || f.nitReceptor.includes(search);
    const matchEstado = estadoFilter === "todos" || f.estadoDian.toLowerCase() === estadoFilter.toLowerCase();
    return matchSearch && matchEstado;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="page-header">
          <h1 className="page-title">Facturación Electrónica — DIAN</h1>
          <p className="page-subtitle">Consulta y registro de documentos electrónicos</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Registrar documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Registrar documento electrónico</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Tipo de documento</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="factura">Factura electrónica</SelectItem>
                    <SelectItem value="nota_credito">Nota crédito</SelectItem>
                    <SelectItem value="nota_debito">Nota débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input placeholder="FE-001236" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>NIT Emisor</Label>
                <Input placeholder="900.123.456-7" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>NIT Receptor</Label>
                <Input placeholder="800.999.888-0" className="font-mono" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>CUFE / CUDE</Label>
                <Input placeholder="Hash del documento" className="font-mono text-xs" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>XML (pegar contenido o URL)</Label>
                <Textarea placeholder="Pegar XML o URL del documento..." rows={3} className="font-mono text-xs" />
              </div>
              <div className="col-span-2 flex justify-end mt-2">
                <Button>Guardar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info banner */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-sm">
        <p className="font-medium text-accent">🔗 Integración DIAN preparada</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Endpoint preparado: <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">/api/dian/consultar-factura</code> — 
          Acepta parámetros: NIT, número de factura, CUFE. Listo para conectar con la API real de la DIAN.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por número o NIT..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Estado DIAN" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="aprobada">Aprobada</SelectItem>
            <SelectItem value="en proceso">En proceso</SelectItem>
            <SelectItem value="rechazada">Rechazada</SelectItem>
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
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Emisor</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Receptor</th>
                <th className="text-left p-3 font-medium text-muted-foreground text-xs">Fecha</th>
                <th className="text-right p-3 font-medium text-muted-foreground text-xs">Valor</th>
                <th className="text-center p-3 font-medium text-muted-foreground text-xs">Estado DIAN</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium">{f.numero}</td>
                  <td className="p-3 text-xs">{f.tipoDocumento}</td>
                  <td className="p-3">
                    <div className="text-xs">{f.nombreEmisor}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{f.nitEmisor}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-xs">{f.nombreReceptor}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{f.nitReceptor}</div>
                  </td>
                  <td className="p-3 text-xs">{f.fechaEmision}</td>
                  <td className="p-3 currency text-xs font-medium">{fmt(f.valorTotal)}</td>
                  <td className="p-3 text-center">
                    <span className={estadoClass[f.estadoDian]}>{f.estadoDian}</span>
                  </td>
                  <td className="p-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelected(f)}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>Detalle — {f.numero}</DialogTitle></DialogHeader>
                        <div className="space-y-3 mt-4 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div><span className="text-muted-foreground text-xs">Tipo:</span><p>{f.tipoDocumento}</p></div>
                            <div><span className="text-muted-foreground text-xs">Estado:</span><p><span className={estadoClass[f.estadoDian]}>{f.estadoDian}</span></p></div>
                            <div><span className="text-muted-foreground text-xs">Emisor:</span><p>{f.nombreEmisor} ({f.nitEmisor})</p></div>
                            <div><span className="text-muted-foreground text-xs">Receptor:</span><p>{f.nombreReceptor} ({f.nitReceptor})</p></div>
                            <div><span className="text-muted-foreground text-xs">Valor:</span><p className="font-medium">{fmt(f.valorTotal)}</p></div>
                            <div><span className="text-muted-foreground text-xs">Fecha:</span><p>{f.fechaEmision}</p></div>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">CUFE:</span>
                            <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">{f.cufe}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">XML:</span>
                            <p className="text-xs text-muted-foreground italic mt-1">No hay XML asociado aún</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
