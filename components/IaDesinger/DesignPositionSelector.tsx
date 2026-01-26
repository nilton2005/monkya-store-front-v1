import { Check, Info } from "lucide-react";
import React from "react";
import { DesignPosition, useAppStore } from "storeIA/useAppStore";
import { cn } from "../../utils/cn";

interface PositionOption {
  id: DesignPosition;
  label: string;
  zone: "frente" | "espalda" | "hombros";
}

const POSITIONS: PositionOption[] = [
  // Frente
  { id: "frente-superior", label: "Superior", zone: "frente" },
  { id: "frente-centro", label: "Centro", zone: "frente" },
  { id: "frente-inferior", label: "Inferior", zone: "frente" },
  { id: "frente-completo", label: "Completo", zone: "frente" },
  // Espalda
  { id: "espalda-superior", label: "Superior", zone: "espalda" },
  { id: "espalda-centro", label: "Centro", zone: "espalda" },
  { id: "espalda-inferior", label: "Inferior", zone: "espalda" },
  { id: "espalda-completo", label: "Completo", zone: "espalda" },
  // Hombros
  { id: "hombro-izquierdo", label: "Izquierdo", zone: "hombros" },
  { id: "hombro-derecho", label: "Derecho", zone: "hombros" },
];

const ZONE_LABELS: Record<string, string> = {
  frente: "👕 Frente",
  espalda: "🔙 Espalda",
  hombros: "💪 Hombros",
};

export const DesignPositionSelector: React.FC = () => {
  const { designConfig, toggleDesignPosition, setDesignConfig } = useAppStore();
  const { positions, sameDesignForAll } = designConfig;

  const zones = ["frente", "espalda", "hombros"] as const;

  const getPositionsByZone = (zone: string) =>
    POSITIONS.filter((p) => p.zone === zone);

  const isPositionSelected = (id: DesignPosition) => positions.includes(id);

  const handlePositionToggle = (id: DesignPosition) => {
    // Si es "completo", deseleccionar las demás de esa zona
    if (id.includes("completo")) {
      const zone = id.split("-")[0]; // 'frente' o 'espalda'
      const otherPositionsInZone = POSITIONS.filter(
        (p) => p.zone === zone && p.id !== id,
      ).map((p) => p.id);

      // Remover las otras posiciones de la misma zona
      const filteredPositions = positions.filter(
        (p) => !otherPositionsInZone.includes(p) && p !== id,
      );

      if (!isPositionSelected(id)) {
        setDesignConfig({ positions: [...filteredPositions, id] });
      } else {
        setDesignConfig({ positions: filteredPositions });
      }
      return;
    }

    // Si no es completo, deseleccionar "completo" de esa zona si está
    const zone = id.split("-")[0];
    const completoId = `${zone}-completo` as DesignPosition;

    if (isPositionSelected(completoId)) {
      const withoutCompleto = positions.filter((p) => p !== completoId);
      setDesignConfig({ positions: [...withoutCompleto, id] });
      return;
    }

    toggleDesignPosition(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">
          Ubicación del Diseño
        </label>
        <span className="text-xs text-gray-500">
          {positions.length}/3 seleccionadas
        </span>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-2 p-2 bg-blue-900/20 border border-blue-700/30 rounded-lg text-xs text-blue-300">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <span>
          Puedes seleccionar hasta 3 ubicaciones. Con múltiples ubicaciones
          puedes usar el mismo diseño o crear uno diferente para cada una.
        </span>
      </div>

      {/* Zonas */}
      <div className="space-y-3">
        {zones.map((zone) => (
          <div key={zone}>
            <span className="text-xs font-medium text-gray-400 mb-2 block">
              {ZONE_LABELS[zone]}
            </span>
            <div
              className={cn(
                "grid gap-2",
                zone === "hombros" ? "grid-cols-2" : "grid-cols-4",
              )}
            >
              {getPositionsByZone(zone).map((pos) => {
                const isSelected = isPositionSelected(pos.id);
                return (
                  <button
                    key={pos.id}
                    onClick={() => handlePositionToggle(pos.id)}
                    disabled={!isSelected && positions.length >= 3}
                    className={cn(
                      "relative flex items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all duration-200",
                      isSelected
                        ? "bg-yellow-400/10 border-yellow-400/50 text-yellow-400"
                        : positions.length >= 3
                          ? "bg-gray-900/50 border-gray-800 text-gray-600 cursor-not-allowed"
                          : "bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 mr-1" />}
                    {pos.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Opción: mismo diseño para todas */}
      {positions.length > 1 && (
        <div className="pt-2 border-t border-gray-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sameDesignForAll}
              onChange={(e) =>
                setDesignConfig({ sameDesignForAll: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-gray-900"
            />
            <span className="text-sm text-gray-300">
              Usar el mismo diseño en todas las ubicaciones
            </span>
          </label>
          {!sameDesignForAll && (
            <p className="text-xs text-gray-500 mt-1 ml-6">
              La IA generará diseños diferentes para cada ubicación
            </p>
          )}
        </div>
      )}

      {/* Preview visual de posiciones */}
      {positions.length > 0 && (
        <div className="pt-2">
          <span className="text-xs text-gray-500">Seleccionadas: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {positions.map((pos) => {
              const posInfo = POSITIONS.find((p) => p.id === pos);
              return (
                <span
                  key={pos}
                  className="inline-flex items-center px-2 py-1 bg-yellow-400/10 border border-yellow-400/30 rounded text-xs text-yellow-400"
                >
                  {posInfo?.zone === "frente" && "👕"}
                  {posInfo?.zone === "espalda" && "🔙"}
                  {posInfo?.zone === "hombros" && "💪"}
                  {posInfo?.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
