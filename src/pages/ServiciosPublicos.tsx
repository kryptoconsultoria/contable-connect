import { useCallback, useRef, useState } from "react";
import { Zap, Upload, FileImage, X } from "lucide-react";

const COLUMNS = ["Empresa", "Período", "Valor", "Cuenta contable", "Estado"];

const ACCEPTED = ".pdf,.png,.jpg,.jpeg,.webp";

export default function ServiciosPublicos() {
  const [files, setFiles]     = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef              = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) =>
      /\.(pdf|png|jpg|jpeg|webp)$/i.test(f.name)
    );
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))];
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const remove = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  return (
    <div className="space-y-8 max-w-[1100px]">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Servicios Públicos
          </h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-orange-500/15 text-orange-500 border-orange-500/25">
            IA
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Carga facturas de servicios públicos en PDF o imagen. La IA extrae empresa, período,
          valor y cuenta contable de forma automática.
        </p>
      </div>

      {/* Drop zone */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
          <Zap size={16} className="text-orange-500" />
          <h2
            className="font-semibold text-gray-700 text-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Cargar facturas
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Drop area */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`cursor-pointer rounded-xl border-2 border-dashed transition-all px-6 py-12 flex flex-col items-center gap-3 ${
              dragging
                ? "border-orange-400 bg-orange-50/50"
                : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/20"
            }`}
          >
            <div className="bg-orange-500/10 p-4 rounded-full">
              <Upload size={28} className="text-orange-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                Arrastra tus facturas aquí o{" "}
                <span className="text-orange-500 underline">selecciónalas</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF, PNG, JPG, WEBP — puedes subir múltiples archivos
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileImage size={16} className="text-orange-400 shrink-0" />
                    <span className="text-xs font-medium text-gray-700 truncate">{f.name}</span>
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(f.name)}
                    className="text-gray-300 hover:text-red-400 transition-colors ml-3 shrink-0"
                  >
                    <X size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Process button */}
          <div className="flex justify-end pt-2">
            <button
              disabled={files.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#6D28D9] hover:bg-[#5B21B6] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={15} />
              Procesar con IA
              {files.length > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {files.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Empty table */}
      <section>
        <h2
          className="text-base font-semibold text-gray-700 mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Facturas procesadas
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
                      <Zap size={28} className="text-gray-200" />
                      <p className="text-sm text-gray-400">
                        Aún no hay facturas procesadas.
                      </p>
                      <p className="text-xs text-gray-300">
                        Sube archivos arriba para que la IA los analice.
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
