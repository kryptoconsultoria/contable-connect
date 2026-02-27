import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface LineaContable {
  id: string;
  cuentaPuc: string;
  descripcion: string;
  centroCosto: string;
  debito: number;
  credito: number;
  baseGravable: number;
  porcentajeIva: number;
  valorIva: number;
  porcentajeRetencion: number;
  valorRetencion: number;
}

const emptyLinea = (): LineaContable => ({
  id: crypto.randomUUID(),
  cuentaPuc: "",
  descripcion: "",
  centroCosto: "",
  debito: 0,
  credito: 0,
  baseGravable: 0,
  porcentajeIva: 0,
  valorIva: 0,
  porcentajeRetencion: 0,
  valorRetencion: 0,
});

export default function FacturaForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tipo, setTipo] = useState("compra");
  const [lineas, setLineas] = useState<LineaContable[]>([emptyLinea()]);

  const totalDebitos = lineas.reduce((s, l) => s + l.debito, 0);
  const totalCreditos = lineas.reduce((s, l) => s + l.credito, 0);
  const diferencia = Math.abs(totalDebitos - totalCreditos);
  const cuadrado = diferencia < 1;

  const addLinea = () => setLineas([...lineas, emptyLinea()]);
  const removeLinea = (id: string) => {
    if (lineas.length > 1) setLineas(lineas.filter((l) => l.id !== id));
  };

  const updateLinea = (id: string, field: keyof LineaContable, value: string | number) => {
    setLineas(lineas.map((l) => {
      if (l.id !== id) return l;
      const updated = { ...l, [field]: value };
      if (field === "baseGravable" || field === "porcentajeIva") {
        updated.valorIva = Math.round(updated.baseGravable * (updated.porcentajeIva / 100));
      }
      if (field === "baseGravable" || field === "porcentajeRetencion") {
        updated.valorRetencion = Math.round(updated.baseGravable * (updated.porcentajeRetencion / 100));
      }
      return updated;
    }));
  };

  const handleGuardar = (estado: "borrador" | "contabilizado") => {
    if (!cuadrado) {
      toast({ title: "Error de validación", description: "Los débitos y créditos no cuadran.", variant: "destructive" });
      return;
    }
    if (lineas.some(l => !l.cuentaPuc)) {
      toast({ title: "Error", description: "Todas las líneas deben tener cuenta PUC.", variant: "destructive" });
      return;
    }
    toast({ title: estado === "borrador" ? "Borrador guardado" : "Factura contabilizada", description: `Factura guardada como ${estado}.` });
    navigate("/facturas");
  };

  const fmt = (v: number) => new Intl.NumberFormat("es-CO").format(v);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/facturas")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="page-header">
          <h1 className="page-title">Nueva factura</h1>
          <p className="page-subtitle">Registro y causación contable</p>
        </div>
      </div>

      {/* Header Section */}
      <div className="form-section">
        <div className="form-section-title">Información general</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tipo de documento</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="compra">Factura de compra</SelectItem>
                <SelectItem value="venta">Factura de venta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Número de factura *</Label>
            <Input placeholder="FV-001235" />
          </div>
          <div className="space-y-2">
            <Label>Fecha de emisión *</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>Fecha de vencimiento *</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Input value="COP" disabled className="bg-muted" />
          </div>
        </div>
      </div>

      {/* Tercero */}
      <div className="form-section">
        <div className="form-section-title">Datos del tercero</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>NIT *</Label>
            <Input placeholder="900.123.456-7" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Razón social *</Label>
            <Input placeholder="Nombre del tercero" />
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
            <Label>Ciudad</Label>
            <Input placeholder="Bogotá" />
          </div>
          <div className="space-y-2">
            <Label>Correo</Label>
            <Input type="email" placeholder="correo@empresa.com" />
          </div>
        </div>
      </div>

      {/* Líneas contables */}
      <div className="form-section">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <span className="text-base font-semibold">Líneas contables</span>
          <Button variant="outline" size="sm" onClick={addLinea}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Añadir línea
          </Button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-left pb-2 font-medium">Cuenta PUC *</th>
                <th className="text-left pb-2 font-medium">Descripción</th>
                <th className="text-left pb-2 font-medium">C. Costo</th>
                <th className="text-right pb-2 font-medium">Débito</th>
                <th className="text-right pb-2 font-medium">Crédito</th>
                <th className="text-right pb-2 font-medium">Base grav.</th>
                <th className="text-right pb-2 font-medium">% IVA</th>
                <th className="text-right pb-2 font-medium">IVA</th>
                <th className="text-right pb-2 font-medium">% Ret.</th>
                <th className="text-right pb-2 font-medium">Ret.</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {lineas.map((l) => (
                <tr key={l.id} className="group">
                  <td className="py-2 pr-2">
                    <Input className="h-8 text-xs font-mono" placeholder="1105" value={l.cuentaPuc} onChange={(e) => updateLinea(l.id, "cuentaPuc", e.target.value)} />
                  </td>
                  <td className="py-2 pr-2">
                    <Input className="h-8 text-xs" placeholder="Descripción" value={l.descripcion} onChange={(e) => updateLinea(l.id, "descripcion", e.target.value)} />
                  </td>
                  <td className="py-2 pr-2">
                    <Input className="h-8 text-xs" placeholder="CC" value={l.centroCosto} onChange={(e) => updateLinea(l.id, "centroCosto", e.target.value)} />
                  </td>
                  <td className="py-2 pr-2">
                    <Input className="h-8 text-xs text-right" type="number" value={l.debito || ""} onChange={(e) => updateLinea(l.id, "debito", Number(e.target.value))} />
                  </td>
                  <td className="py-2 pr-2">
                    <Input className="h-8 text-xs text-right" type="number" value={l.credito || ""} onChange={(e) => updateLinea(l.id, "credito", Number(e.target.value))} />
                  </td>
                  <td className="py-2 pr-2">
                    <Input className="h-8 text-xs text-right" type="number" value={l.baseGravable || ""} onChange={(e) => updateLinea(l.id, "baseGravable", Number(e.target.value))} />
                  </td>
                  <td className="py-2 pr-2">
                    <Select value={String(l.porcentajeIva)} onValueChange={(v) => updateLinea(l.id, "porcentajeIva", Number(v))}>
                      <SelectTrigger className="h-8 text-xs w-20"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="19">19%</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-2 pr-2 text-right text-xs currency">{fmt(l.valorIva)}</td>
                  <td className="py-2 pr-2">
                    <Input className="h-8 text-xs text-right w-16" type="number" value={l.porcentajeRetencion || ""} onChange={(e) => updateLinea(l.id, "porcentajeRetencion", Number(e.target.value))} />
                  </td>
                  <td className="py-2 pr-2 text-right text-xs currency">{fmt(l.valorRetencion)}</td>
                  <td className="py-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => removeLinea(l.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-medium text-xs">
                <td colSpan={3} className="py-3 text-right pr-4">Totales:</td>
                <td className="py-3 text-right currency">{fmt(totalDebitos)}</td>
                <td className="py-3 text-right currency">{fmt(totalCreditos)}</td>
                <td colSpan={6}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Balance indicator */}
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${cuadrado ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
          {cuadrado ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {cuadrado ? "Débitos y créditos cuadrados" : `Diferencia: ${fmt(diferencia)} — Los débitos deben ser iguales a los créditos`}
        </div>
      </div>

      {/* Observaciones */}
      <div className="form-section">
        <div className="form-section-title">Observaciones</div>
        <Textarea placeholder="Notas adicionales sobre la factura..." rows={3} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <Button variant="outline" onClick={() => navigate("/facturas")}>Cancelar</Button>
        <Button variant="secondary" onClick={() => handleGuardar("borrador")}>Guardar borrador</Button>
        <Button onClick={() => handleGuardar("contabilizado")}>Contabilizar</Button>
      </div>
    </div>
  );
}
