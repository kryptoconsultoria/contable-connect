import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Configuracion() {
  const { toast } = useToast();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Parámetros globales del sistema contable</p>
      </div>

      <div className="form-section">
        <div className="form-section-title">Parámetros fiscales</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Porcentaje IVA por defecto</Label>
            <Select defaultValue="19">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="19">19%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Moneda base</Label>
            <Input value="COP - Peso colombiano" disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Regla de redondeo</Label>
            <Select defaultValue="peso">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="peso">Al peso más cercano</SelectItem>
                <SelectItem value="decena">A la decena más cercana</SelectItem>
                <SelectItem value="centena">A la centena más cercana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tolerancia conciliación (COP)</Label>
            <Input type="number" defaultValue="1000" className="font-mono" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Periodo contable</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Periodo activo</Label>
            <Select defaultValue="ene2026">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ene2026">Enero 2026</SelectItem>
                <SelectItem value="feb2026">Febrero 2026</SelectItem>
                <SelectItem value="dic2025">Diciembre 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Año fiscal</Label>
            <Input value="2026" disabled className="bg-muted" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Información de la empresa</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Razón social</Label>
            <Input defaultValue="Mi Empresa S.A.S." />
          </div>
          <div className="space-y-2">
            <Label>NIT</Label>
            <Input defaultValue="800.999.888-0" className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label>Ciudad</Label>
            <Input defaultValue="Bogotá D.C." />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Configuración guardada", description: "Los parámetros se actualizaron correctamente." })}>
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
