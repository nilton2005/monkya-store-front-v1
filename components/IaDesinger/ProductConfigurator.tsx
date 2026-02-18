import React from "react";
import {
  HoodType,
  MaterialType,
  NeckType,
  ProductColor,
  ProductType,
  SleeveType,
  useAppStore,
} from "storeIA/useAppStore";
import { cn } from "../../utils/cn";

const PRODUCT_TYPES: { value: ProductType; label: string; icon: string }[] = [
  { value: "polo", label: "Polo", icon: "👕" },
  { value: "polera", label: "Polera", icon: "🧥" },
];

const COLORS: {
  value: ProductColor;
  label: string;
  hex: string;
  textColor: string;
}[] = [
  {
    value: "blanco",
    label: "Blanco",
    hex: "#FFFFFF",
    textColor: "text-gray-800",
  },
  { value: "negro", label: "Negro", hex: "#1a1a1a", textColor: "text-white" },
  {
    value: "verde-petroleo",
    label: "Verde Petróleo",
    hex: "#006D6F",
    textColor: "text-white",
  },
  { value: "rojo", label: "Rojo", hex: "#DC2626", textColor: "text-white" },
];

const NECK_TYPES: { value: NeckType; label: string; description: string }[] = [
  {
    value: "circular",
    label: "Circular",
    description: "Cuello redondo clásico",
  },
  { value: "v", label: "Cuello V", description: "Cuello en forma de V" },
];

const SLEEVE_TYPES: {
  value: SleeveType;
  label: string;
  description: string;
}[] = [
  {
    value: "manga-corta",
    label: "Manga Corta",
    description: "Clásica y fresca",
  },
  {
    value: "manga-larga",
    label: "Manga Larga",
    description: "Mayor cobertura",
  },
];

const HOOD_TYPES: { value: HoodType; label: string; description: string }[] = [
  { value: "sin-gorro", label: "Sin Gorro", description: "Polera simple" },
  { value: "con-gorro", label: "Con Gorro", description: "Estilo hoodie" },
];

const MATERIALS: { value: MaterialType; label: string; description: string }[] =
  [
    {
      value: "algodon-100",
      label: "Algodón 100%",
      description: "Suave y transpirable",
    },
    {
      value: "pima",
      label: "Algodón Pima",
      description: "Premium, extra suave",
    },
  ];

export const ProductConfigurator: React.FC = () => {
  const { productConfig, setProductConfig } = useAppStore();

  const isPolo = productConfig.type === "polo";
  const isPolera = productConfig.type === "polera";

  return (
    <div className="space-y-4">
      {/* Tipo de Producto */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Tipo de Prenda
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setProductConfig({ type: type.value })}
              className={cn(
                "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200",
                productConfig.type === type.value
                  ? "bg-yellow-400/10 border-yellow-400/50 text-yellow-400"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300",
              )}
            >
              <span className="text-xl">{type.icon}</span>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de Manga - solo para Polo */}
      {isPolo && (
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Tipo de Manga
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SLEEVE_TYPES.map((sleeve) => (
              <button
                key={sleeve.value}
                onClick={() => setProductConfig({ sleeveType: sleeve.value })}
                className={cn(
                  "flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left",
                  productConfig.sleeveType === sleeve.value
                    ? "bg-yellow-400/10 border-yellow-400/50"
                    : "bg-gray-900 border-gray-700 hover:bg-gray-800",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    productConfig.sleeveType === sleeve.value
                      ? "text-yellow-400"
                      : "text-gray-300",
                  )}
                >
                  {sleeve.label}
                </span>
                <span className="text-xs text-gray-500">
                  {sleeve.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Con/Sin Gorro - solo para Polera */}
      {isPolera && (
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Capucha
          </label>
          <div className="grid grid-cols-2 gap-2">
            {HOOD_TYPES.map((hood) => (
              <button
                key={hood.value}
                onClick={() => setProductConfig({ hoodType: hood.value })}
                className={cn(
                  "flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left",
                  productConfig.hoodType === hood.value
                    ? "bg-yellow-400/10 border-yellow-400/50"
                    : "bg-gray-900 border-gray-700 hover:bg-gray-800",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    productConfig.hoodType === hood.value
                      ? "text-yellow-400"
                      : "text-gray-300",
                  )}
                >
                  {hood.label}
                </span>
                <span className="text-xs text-gray-500">
                  {hood.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Color
        </label>
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setProductConfig({ color: color.value })}
              className={cn(
                "relative flex flex-col items-center p-2 rounded-lg border transition-all duration-200",
                productConfig.color === color.value
                  ? "border-yellow-400 ring-2 ring-yellow-400/30"
                  : "border-gray-700 hover:border-gray-500",
              )}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-600 mb-1"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-gray-400">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de Cuello */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Tipo de Cuello
        </label>
        <div className="grid grid-cols-2 gap-2">
          {NECK_TYPES.map((neck) => (
            <button
              key={neck.value}
              onClick={() => setProductConfig({ neckType: neck.value })}
              className={cn(
                "flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left",
                productConfig.neckType === neck.value
                  ? "bg-yellow-400/10 border-yellow-400/50"
                  : "bg-gray-900 border-gray-700 hover:bg-gray-800",
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  productConfig.neckType === neck.value
                    ? "text-yellow-400"
                    : "text-gray-300",
                )}
              >
                {neck.label}
              </span>
              <span className="text-xs text-gray-500">{neck.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Material - solo para Polo (pima solo disponible en polos) */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Material
        </label>
        {isPolera ? (
          <>
            <div className="p-3 rounded-lg border bg-gray-900 border-gray-700">
              <span className="text-sm font-medium text-yellow-400">
                Algodón 100%
              </span>
              <span className="text-xs text-gray-500 block">
                Suave y transpirable
              </span>
            </div>
            <p className="text-xs text-amber-400/80 mt-1.5 flex items-start gap-1.5">
              <span>ℹ️</span>
              <span>El algodón Pima solo está disponible para polos.</span>
            </p>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {MATERIALS.map((material) => (
              <button
                key={material.value}
                onClick={() => setProductConfig({ material: material.value })}
                className={cn(
                  "flex flex-col items-start p-3 rounded-lg border transition-all duration-200 text-left",
                  productConfig.material === material.value
                    ? "bg-yellow-400/10 border-yellow-400/50"
                    : "bg-gray-900 border-gray-700 hover:bg-gray-800",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    productConfig.material === material.value
                      ? "text-yellow-400"
                      : "text-gray-300",
                  )}
                >
                  {material.label}
                </span>
                <span className="text-xs text-gray-500">
                  {material.description}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logo Monkya notice */}
      <div className="p-3 rounded-lg border border-yellow-400/30 bg-yellow-400/5">
        <div className="flex items-start gap-2">
          <span className="text-lg">🐵</span>
          <div>
            <p className="text-xs font-medium text-yellow-400">
              Logo Monkya incluido
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Todas las prendas incluyen el logo de Monkya en el diseño final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
