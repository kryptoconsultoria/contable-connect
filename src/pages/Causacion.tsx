import { useNavigate } from "react-router-dom";
import { BookCheck, FileText, ArrowRight, AlertCircle } from "lucide-react";

const COLUMNS = ["Factura", "Proveedor", "Valor", "Estado", "Acciones"];

export default function Causacion() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-[1100px]">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-semibold" style={{ color: "#1D1D1F" }}>
            Causación Contable
          </h1>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "#6D28D9", background: "#F3EEFF", border: "1px solid #DDD6FE" }}>
            Auto
          </span>
        </div>
        <p className="text-sm" style={{ color: "#6E6E73" }}>
          Extracción inteligente de datos contables desde facturas procesadas. El flujo genera
          asientos automáticos según el plan de cuentas PUC configurado.
        </p>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E8E8ED", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #F0F0F5" }}>
          <BookCheck size={16} style={{ color: "#6D28D9" }} />
          <h2 className="font-semibold text-sm" style={{ color: "#1D1D1F" }}>
            Flujo de causación
          </h2>
        </div>

        <div className="p-10 flex flex-col items-center text-center gap-5">
          {/* Icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "#F3EEFF" }}>
              <BookCheck size={36} style={{ color: "#6D28D9" }} />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center">
              <AlertCircle size={13} className="text-white" />
            </div>
          </div>

          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#1D1D1F" }}>
              Conecta el flujo de Facturas primero
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6E6E73" }}>
              La causación contable requiere que el flujo de{" "}
              <strong style={{ color: "#1D1D1F" }}>Extracción de Facturas</strong> haya procesado al
              menos un documento. Ve al módulo de Facturas, carga tus documentos y regresa aquí
              para iniciar la causación automática.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <button
              onClick={() => navigate("/facturas")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors bg-[#6D28D9] hover:bg-[#5B21B6]"
            >
              <FileText size={15} />
              Ir a Facturas
              <ArrowRight size={14} />
            </button>
            <button
              disabled
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed"
              style={{ color: "#AEAEB2", border: "1px solid #E8E8ED", background: "#FAFAFA" }}
            >
              Iniciar causación
            </button>
          </div>

          {/* Steps hint */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-lg">
            {[
              { n: 1, text: "Sube facturas en el módulo Facturas" },
              { n: 2, text: "El flujo extrae y valida los datos" },
              { n: 3, text: "Se generan asientos PUC automáticos" },
            ].map((s) => (
              <div key={s.n} className="flex-1 rounded-xl px-4 py-3 text-left" style={{ background: "#F5F5F7" }}>
                <span
                  className="inline-flex w-5 h-5 rounded-full text-[10px] font-bold text-white items-center justify-center mb-1.5"
                  style={{ background: "#6D28D9" }}
                >
                  {s.n}
                </span>
                <p className="text-xs" style={{ color: "#6E6E73" }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty table */}
      <section>
        <h2 className="text-[15px] font-semibold mb-4" style={{ color: "#1D1D1F" }}>
          Registros causados
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E8E8ED", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #F0F0F5", background: "#FAFAFA" }}>
                  {COLUMNS.map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: "#6E6E73" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={COLUMNS.length} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <BookCheck size={28} style={{ color: "#E8E8ED" }} />
                      <p className="text-sm" style={{ color: "#AEAEB2" }}>
                        No hay registros causados aún.
                      </p>
                      <p className="text-xs" style={{ color: "#AEAEB2" }}>
                        Procesa facturas primero para ver los asientos aquí.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
