import {
  FileText,
  TrendingUp,
  ArrowLeftRight,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const kpis = [
  {
    label: "Facturas del periodo",
    value: "142",
    change: "+12 vs mes anterior",
    icon: FileText,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Valor total facturado",
    value: "$284.560.000",
    change: "+8.3%",
    icon: TrendingUp,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Pendientes conciliación",
    value: "23",
    change: "3 cuentas bancarias",
    icon: ArrowLeftRight,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Diferencia conciliación",
    value: "$1.250.340",
    change: "Revisar urgente",
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const recentInvoices = [
  { id: "FV-001234", tercero: "TechCorp S.A.S.", valor: "$12.500.000", tipo: "Venta", estado: "Contabilizado" },
  { id: "FC-000891", tercero: "Distribuciones El Valle", valor: "$8.340.000", tipo: "Compra", estado: "Borrador" },
  { id: "FV-001233", tercero: "Innovar Digital Ltda.", valor: "$3.200.000", tipo: "Venta", estado: "Contabilizado" },
  { id: "FC-000890", tercero: "Papelería Nacional", valor: "$1.450.000", tipo: "Compra", estado: "Borrador" },
  { id: "FV-001232", tercero: "Grupo Andino S.A.", valor: "$22.100.000", tipo: "Venta", estado: "Contabilizado" },
];

const reconciliationSummary = [
  { banco: "Bancolombia - Cta 1234", saldoBanco: "$45.230.000", saldoLibros: "$44.980.000", diferencia: "$250.000" },
  { banco: "Davivienda - Cta 5678", saldoBanco: "$12.100.000", saldoLibros: "$12.100.000", diferencia: "$0" },
  { banco: "BBVA - Cta 9012", saldoBanco: "$8.750.000", saldoLibros: "$7.749.660", diferencia: "$1.000.340" },
];

export default function Index() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Resumen contable del periodo actual</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </p>
                <p className="text-2xl font-bold mt-1 tracking-tight">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
              </div>
              <div className={`${kpi.bg} ${kpi.color} p-2.5 rounded-lg`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 table-container">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-sm font-semibold">Últimas facturas</h2>
            <Link to="/facturas" className="text-xs text-accent hover:underline font-medium">
              Ver todas →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Nº</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Tercero</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-xs">Tipo</th>
                  <th className="text-right p-3 font-medium text-muted-foreground text-xs">Valor</th>
                  <th className="text-center p-3 font-medium text-muted-foreground text-xs">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono text-xs">{inv.id}</td>
                    <td className="p-3">{inv.tercero}</td>
                    <td className="p-3">
                      <Badge variant={inv.tipo === "Venta" ? "default" : "secondary"} className="text-[10px]">
                        {inv.tipo}
                      </Badge>
                    </td>
                    <td className="p-3 currency">{inv.valor}</td>
                    <td className="p-3 text-center">
                      <span className={inv.estado === "Contabilizado" ? "status-contabilizado" : "status-borrador"}>
                        {inv.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reconciliation Summary */}
        <div className="table-container">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-sm font-semibold">Conciliación</h2>
            <Link to="/conciliacion" className="text-xs text-accent hover:underline font-medium">
              Ir →
            </Link>
          </div>
          <div className="divide-y">
            {reconciliationSummary.map((item) => (
              <div key={item.banco} className="p-4 space-y-2">
                <p className="text-xs font-medium truncate">{item.banco}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Banco</span>
                  <span className="currency">{item.saldoBanco}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Libros</span>
                  <span className="currency">{item.saldoLibros}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span>Diferencia</span>
                  <span className={`currency ${item.diferencia === "$0" ? "text-success" : "text-destructive"}`}>
                    {item.diferencia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
