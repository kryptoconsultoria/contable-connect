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
          <h1
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Causación Contable
          </h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-violet-500/15 text-violet-500 border-violet-500/25">
            n8n
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Extracción inteligente de datos contables desde facturas procesadas. El flujo genera
          asientos automáticos según el plan de cuentas PUC configurado.
        </p>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <BookCheck size={16} className="text-violet-500" />
          <h2
            className="font-semibold text-gray-700 text-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Flujo de causación
          </h2>
        </div>

        <div className="p-10 flex flex-col items-center text-center gap-5">
          {/* Icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-violet-50 flex items-center justify-center">
              <BookCheck size={36} className="text-violet-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center">
              <AlertCircle size={13} className="text-white" />
            </div>
          </div>

          <div className="max-w-md">
            <h3
              className="text-lg font-bold text-gray-800 mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Conecta el flujo de Facturas primero
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              La causación contable requiere que el flujo de{" "}
              <strong className="text-gray-700">Extracción de Facturas</strong> haya procesado al
              menos un documento. Ve al módulo de Facturas, carga tus documentos y regresa aquí
              para iniciar la causación automática.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <button
              onClick={() => navigate("/facturas")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
            >
              <FileText size={15} />
              Ir a Facturas
              <ArrowRight size={14} />
            </button>
            <button
              disabled
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-gray-400 border border-gray-200 cursor-not-allowed"
            >
              Iniciar causación
            </button>
          </div>

          {/* Steps hint */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-lg">
            {[
              { n: 1, text: "Sube facturas en el módulo Facturas" },
              { n: 2, text: "n8n extrae y valida los datos" },
              { n: 3, text: "Se generan asientos PUC automáticos" },
            ].map((s) => (
              <div key={s.n} className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-left">
                <span
                  className="inline-flex w-5 h-5 rounded-full text-[10px] font-bold text-white items-center justify-center mb-1.5"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #F97316)" }}
                >
                  {s.n}
                </span>
                <p className="text-xs text-gray-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty table */}
      <section>
        <h2
          className="text-base font-semibold text-gray-700 mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Registros causados
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  {COLUMNS.map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
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
                      <BookCheck size={28} className="text-gray-200" />
                      <p className="text-sm text-gray-400">
                        No hay registros causados aún.
                      </p>
                      <p className="text-xs text-gray-300">
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
