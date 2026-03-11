import { Clock } from "lucide-react";

export default function Conciliacion() {
  return (
    <div className="space-y-8 max-w-[1100px]">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Conciliación Bancaria
          </h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-gray-100 text-gray-400 border-gray-200">
            Próximamente
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Módulo de conciliación automática entre extractos bancarios y registros contables.
        </p>
      </div>

      {/* Coming soon card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center gap-6">

        {/* Animated clock icon */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-28 h-28 rounded-3xl animate-ping opacity-20"
            style={{ background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)" }}
          />
          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(249,115,22,0.10) 100%)" }}
          >
            <Clock size={46} className="text-violet-400" />
          </div>
        </div>

        <div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: "linear-gradient(135deg, #7C3AED 0%, #F97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Módulo en desarrollo
          </h2>
          <p className="text-gray-500 text-sm max-w-md leading-relaxed">
            Estamos construyendo el módulo de conciliación bancaria automatizada. Pronto podrás
            cruzar extractos bancarios con tus registros contables sin esfuerzo manual.
          </p>
        </div>

        {/* Feature preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 w-full max-w-xl">
          {[
            { icon: "🏦", title: "Extractos bancarios",    desc: "Importa desde Bancolombia, Davivienda, BBVA y más" },
            { icon: "⚡", title: "Cruce automático",       desc: "n8n cruza movimientos con asientos contables"      },
            { icon: "✅", title: "Informe de diferencias", desc: "Reporte de partidas pendientes en segundos"         },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100"
            >
              <span className="text-2xl">{f.icon}</span>
              <p
                className="text-sm font-semibold text-gray-700 mt-2 mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {f.title}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400">
          ¿Tienes prioridad en el acceso?{" "}
          <a
            href="mailto:hola@appintegria.com"
            className="text-violet-500 hover:underline font-medium"
          >
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}
