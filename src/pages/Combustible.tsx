import { useRef, useState } from "react";
import { Fuel, MapPin, Navigation, Car, Gauge, Upload, FileText, X, Zap } from "lucide-react";

const VEHICLE_TYPES = [
  "Automóvil",
  "Camioneta 4×4",
  "Furgón",
  "Camión 2 ejes",
  "Camión 3 ejes",
  "Motocicleta",
];

export default function Combustible() {
  const [origen, setOrigen]     = useState("");
  const [destino, setDestino]   = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [consumo, setConsumo]   = useState("");
  const [factura, setFactura]   = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef                 = useRef<HTMLInputElement>(null);

  const acceptFile = (file: File) => {
    if (!/\.(pdf|png|jpg|jpeg)$/i.test(file.name)) return;
    setFactura(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files[0]) acceptFile(e.dataTransfer.files[0]);
  };

  const canCalculate = origen && destino && vehiculo && consumo;

  return (
    <div className="space-y-8 max-w-[1100px]">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Combustible &amp; Rutas
          </h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-500 border-emerald-500/25">
            WhatsApp
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Gestiona reportes de combustible, kilometraje y rutas de vehículos. Los conductores
          reportan por WhatsApp y el sistema registra automáticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Calculadora de ruta ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Navigation size={16} style={{ color: "#6D28D9" }} />
            <h2
              className="font-semibold text-gray-700 text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Calculadora de ruta
            </h2>
          </div>

          <div className="p-6 space-y-4">

            {/* Origen */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin size={12} style={{ color: "#6D28D9" }} /> Origen
              </label>
              <input
                type="text"
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                placeholder="Ciudad o dirección de salida"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition"
              />
            </div>

            {/* Destino */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin size={12} className="text-orange-400" /> Destino
              </label>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="Ciudad o dirección de llegada"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition"
              />
            </div>

            {/* Tipo de vehículo */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                <Car size={12} className="text-gray-400" /> Tipo de vehículo
              </label>
              <select
                value={vehiculo}
                onChange={(e) => setVehiculo(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] bg-white transition"
              >
                <option value="">Seleccionar tipo...</option>
                {VEHICLE_TYPES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Consumo */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                <Gauge size={12} className="text-gray-400" /> Consumo (km/galón)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={consumo}
                onChange={(e) => setConsumo(e.target.value)}
                placeholder="Ej: 35"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition"
              />
            </div>

            {/* Result placeholder */}
            {canCalculate && (
              <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: "#F3EEFF", border: "1px solid #DDD6FE" }}>
                <div>
                  <p className="text-xs font-medium" style={{ color: "#6D28D9" }}>Estimado de combustible</p>
                  <p className="text-lg font-bold" style={{ color: "#6D28D9", fontFamily: "'Space Grotesk', sans-serif" }}>
                    — gal
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium" style={{ color: "#6D28D9" }}>Distancia estimada</p>
                  <p className="text-lg font-bold" style={{ color: "#6D28D9", fontFamily: "'Space Grotesk', sans-serif" }}>
                    — km
                  </p>
                </div>
              </div>
            )}

            <button
              disabled={!canCalculate}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#6D28D9] hover:bg-[#5B21B6] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={15} />
              Calcular Ruta
            </button>
          </div>
        </div>

        {/* ── Adjuntar factura combustible ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <Fuel size={16} className="text-orange-500" />
            <h2
              className="font-semibold text-gray-700 text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Adjuntar factura de combustible
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-gray-500">
              Sube la factura de la estación de servicio. El sistema extrae automáticamente el
              valor, la fecha y el tipo de combustible para registrarlo en contabilidad.
            </p>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`cursor-pointer rounded-xl border-2 border-dashed transition-all px-6 py-10 flex flex-col items-center gap-3 ${
                dragging
                  ? "border-orange-400 bg-orange-50/50"
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/20"
              }`}
            >
              {factura ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <FileText size={28} className="text-orange-400" />
                  <p className="text-sm font-medium text-gray-700">{factura.name}</p>
                  <p className="text-xs text-gray-400">{(factura.size / 1024).toFixed(1)} KB</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFactura(null); }}
                    className="mt-1 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <X size={12} /> Quitar archivo
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-orange-500/10 p-4 rounded-full">
                    <Upload size={24} className="text-orange-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Arrastra la factura o{" "}
                      <span className="text-orange-500 underline">selecciónala</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG</p>
                  </div>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && acceptFile(e.target.files[0])}
              />
            </div>

            {/* WhatsApp hint */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-start gap-3">
              <div className="bg-emerald-500 rounded-full p-1 mt-0.5 shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <p className="text-xs text-emerald-700">
                Los conductores también pueden enviar la foto de la factura directo por
                WhatsApp al número del bot para registrarla automáticamente.
              </p>
            </div>

            <button
              disabled={!factura}
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#6D28D9] hover:bg-[#5B21B6] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Fuel size={15} />
              Registrar factura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
