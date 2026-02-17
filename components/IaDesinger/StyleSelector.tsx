import * as Dialog from "@radix-ui/react-dialog";
import { ChevronRight, X } from "lucide-react";
import React, { useState } from "react";
import { useAppStore } from "storeIA/useAppStore";
import { cn } from "../../utils/cn";
import { Button } from "./ui/Button";

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  category:
    | "basico"
    | "artistico"
    | "tematico"
    | "moderno"
    | "profesional"
    | "deportivo"
    | "cultural";
  emoji: string;
  promptKeywords: string;
}

export const DESIGN_STYLES: DesignStyle[] = [
  // Opción para diseño personalizado/subido
  {
    id: "custom",
    name: "Sin estilo / Personalizado",
    description: "Usa tu diseño subido tal cual",
    category: "basico",
    emoji: "📤",
    promptKeywords: "",
  },
  // Básicos
  {
    id: "minimalista",
    name: "Minimalista",
    description: "Diseño limpio y simple",
    category: "basico",
    emoji: "⚪",
    promptKeywords: "minimalist, clean lines, simple, elegant",
  },
  {
    id: "geometrico",
    name: "Geométrico",
    description: "Formas y patrones geométricos",
    category: "basico",
    emoji: "🔷",
    promptKeywords: "geometric shapes, patterns, angular, symmetric",
  },
  {
    id: "tipografico",
    name: "Tipográfico",
    description: "Enfocado en letras y texto",
    category: "basico",
    emoji: "🔤",
    promptKeywords: "typography, lettering, text-based, fonts",
  },
  {
    id: "lineal",
    name: "Lineal",
    description: "Arte de líneas finas",
    category: "basico",
    emoji: "✏️",
    promptKeywords: "line art, thin lines, sketch style, outline",
  },
  {
    id: "silueta",
    name: "Silueta",
    description: "Formas sólidas sin detalles",
    category: "basico",
    emoji: "👤",
    promptKeywords: "silhouette, solid shape, shadow, bold",
  },

  // Artísticos
  {
    id: "acuarela",
    name: "Acuarela",
    description: "Efecto de pintura acuarela",
    category: "artistico",
    emoji: "🎨",
    promptKeywords: "watercolor, paint splash, artistic, flowing colors",
  },
  {
    id: "graffiti",
    name: "Graffiti",
    description: "Estilo urbano y callejero",
    category: "artistico",
    emoji: "🎭",
    promptKeywords: "graffiti, street art, spray paint, urban",
  },
  {
    id: "ilustracion",
    name: "Ilustración",
    description: "Dibujo artístico detallado",
    category: "artistico",
    emoji: "🖼️",
    promptKeywords: "illustration, detailed drawing, artistic, hand-drawn",
  },
  {
    id: "pop-art",
    name: "Pop Art",
    description: "Colores vibrantes estilo Warhol",
    category: "artistico",
    emoji: "🎪",
    promptKeywords: "pop art, bold colors, halftone, comic style",
  },
  {
    id: "abstracto",
    name: "Abstracto",
    description: "Arte abstracto y expresivo",
    category: "artistico",
    emoji: "🌀",
    promptKeywords: "abstract, expressive, non-representational, artistic",
  },
  {
    id: "mandala",
    name: "Mandala",
    description: "Patrones circulares intrincados",
    category: "artistico",
    emoji: "☸️",
    promptKeywords: "mandala, intricate patterns, circular, zen",
  },

  // Temáticos
  {
    id: "anime",
    name: "Anime/Manga",
    description: "Estilo japonés animado",
    category: "tematico",
    emoji: "🌸",
    promptKeywords: "anime style, manga, japanese animation, kawaii",
  },
  {
    id: "vintage",
    name: "Vintage/Retro",
    description: "Estética de décadas pasadas",
    category: "tematico",
    emoji: "📻",
    promptKeywords: "vintage, retro, old school, classic, worn texture",
  },
  {
    id: "tribal",
    name: "Tribal",
    description: "Patrones tribales y étnicos",
    category: "tematico",
    emoji: "🏺",
    promptKeywords: "tribal, ethnic patterns, indigenous, tattoo style",
  },
  {
    id: "japones",
    name: "Japonés",
    description: "Arte tradicional japonés",
    category: "tematico",
    emoji: "🎎",
    promptKeywords: "japanese traditional, ukiyo-e, zen, kanji",
  },
  {
    id: "naturaleza",
    name: "Naturaleza",
    description: "Flora, fauna y paisajes",
    category: "tematico",
    emoji: "🌿",
    promptKeywords: "nature, botanical, wildlife, natural elements",
  },
  {
    id: "space",
    name: "Espacial",
    description: "Galaxias, planetas y cosmos",
    category: "tematico",
    emoji: "🚀",
    promptKeywords: "space, galaxy, cosmic, astronaut, planets",
  },

  // Modernos
  {
    id: "streetwear",
    name: "Streetwear",
    description: "Moda urbana contemporánea",
    category: "moderno",
    emoji: "🔥",
    promptKeywords: "streetwear, urban fashion, hypebeast, trendy",
  },
  {
    id: "y2k",
    name: "Y2K",
    description: "Estética año 2000",
    category: "moderno",
    emoji: "💿",
    promptKeywords: "y2k aesthetic, 2000s, chrome, futuristic retro",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futurista y tecnológico",
    category: "moderno",
    emoji: "🤖",
    promptKeywords: "cyberpunk, neon, futuristic, tech, dystopian",
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    description: "Estética digital nostálgica",
    category: "moderno",
    emoji: "🌴",
    promptKeywords: "vaporwave, synthwave, 80s aesthetic, pastel neon",
  },
  {
    id: "neon",
    name: "Neón/Glow",
    description: "Brillos y luces neón",
    category: "moderno",
    emoji: "✨",
    promptKeywords: "neon glow, bright lights, glowing, luminous",
  },
  {
    id: "glitch",
    name: "Glitch Art",
    description: "Efecto de error digital",
    category: "moderno",
    emoji: "📺",
    promptKeywords: "glitch art, digital error, corrupted, pixel",
  },

  // Profesionales
  {
    id: "corporativo",
    name: "Corporativo",
    description: "Elegante y profesional",
    category: "profesional",
    emoji: "💼",
    promptKeywords: "corporate, professional, elegant, business",
  },
  {
    id: "medico",
    name: "Médico/Salud",
    description: "Símbolos de salud",
    category: "profesional",
    emoji: "⚕️",
    promptKeywords: "medical, healthcare, hospital, doctor symbols",
  },
  {
    id: "tech",
    name: "Tecnología",
    description: "Código y circuitos",
    category: "profesional",
    emoji: "💻",
    promptKeywords: "technology, code, circuit, programming, developer",
  },
  {
    id: "musica",
    name: "Música",
    description: "Notas e instrumentos",
    category: "profesional",
    emoji: "🎵",
    promptKeywords: "music, musical notes, instruments, sound waves",
  },
  {
    id: "gastronomia",
    name: "Gastronomía",
    description: "Chef y cocina",
    category: "profesional",
    emoji: "👨‍🍳",
    promptKeywords: "culinary, chef, cooking, gastronomy, food art",
  },
  {
    id: "educacion",
    name: "Educación",
    description: "Académico y educativo",
    category: "profesional",
    emoji: "📚",
    promptKeywords: "education, academic, school, learning, books",
  },
  {
    id: "ingenieria",
    name: "Ingeniería",
    description: "Planos y herramientas",
    category: "profesional",
    emoji: "⚙️",
    promptKeywords: "engineering, blueprints, technical, mechanical",
  },
  {
    id: "arquitectura",
    name: "Arquitectura",
    description: "Edificios y estructuras",
    category: "profesional",
    emoji: "🏛️",
    promptKeywords: "architecture, buildings, structures, design",
  },

  // Deportivos
  {
    id: "fitness",
    name: "Fitness",
    description: "Gym y ejercicio",
    category: "deportivo",
    emoji: "💪",
    promptKeywords: "fitness, gym, workout, exercise, muscle",
  },
  {
    id: "futbol",
    name: "Fútbol",
    description: "Pasión por el fútbol",
    category: "deportivo",
    emoji: "⚽",
    promptKeywords: "soccer, football, sports, ball, stadium",
  },
  {
    id: "extreme",
    name: "Deportes Extremos",
    description: "Adrenalina y acción",
    category: "deportivo",
    emoji: "🏂",
    promptKeywords: "extreme sports, action, adrenaline, adventure",
  },
  {
    id: "running",
    name: "Running",
    description: "Correr y maratón",
    category: "deportivo",
    emoji: "🏃",
    promptKeywords: "running, marathon, jogging, athletic",
  },

  // Cultural
  {
    id: "peruano",
    name: "Peruano",
    description: "Arte y cultura peruana",
    category: "cultural",
    emoji: "🦙",
    promptKeywords: "peruvian, inca, andean, machu picchu, alpaca",
  },
  {
    id: "latinoamericano",
    name: "Latinoamericano",
    description: "Colores y cultura latina",
    category: "cultural",
    emoji: "🌺",
    promptKeywords: "latin american, colorful, vibrant, cultural",
  },
  {
    id: "mexicano",
    name: "Mexicano",
    description: "Día de muertos y tradición",
    category: "cultural",
    emoji: "💀",
    promptKeywords: "mexican, dia de muertos, sugar skull, aztec",
  },
  {
    id: "africano",
    name: "Africano",
    description: "Patrones africanos",
    category: "cultural",
    emoji: "🌍",
    promptKeywords: "african patterns, tribal, ethnic, kente",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  basico: "Básicos",
  artistico: "Artísticos",
  tematico: "Temáticos",
  moderno: "Modernos",
  profesional: "Profesionales",
  deportivo: "Deportivos",
  cultural: "Culturales",
};

const VISIBLE_STYLES_COUNT = 4;

export const StyleSelector: React.FC = () => {
  const { designConfig, setDesignConfig } = useAppStore();
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const visibleStyles = DESIGN_STYLES.slice(0, VISIBLE_STYLES_COUNT);
  const selectedStyle = DESIGN_STYLES.find((s) => s.id === designConfig.style);

  const filteredStyles = selectedCategory
    ? DESIGN_STYLES.filter((s) => s.category === selectedCategory)
    : DESIGN_STYLES;

  const categories = [...new Set(DESIGN_STYLES.map((s) => s.category))];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-300">
          Estilo de Diseño
        </label>
        {selectedStyle && (
          <span className="text-xs text-yellow-400">
            {selectedStyle.emoji} {selectedStyle.name}
          </span>
        )}
      </div>

      {/* Grid de estilos visibles */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {visibleStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => setDesignConfig({ style: style.id })}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-left",
              designConfig.style === style.id
                ? "bg-yellow-400/10 border-yellow-400/50"
                : "bg-gray-900 border-gray-700 hover:bg-gray-800",
            )}
          >
            <span className="text-lg">{style.emoji}</span>
            <div className="min-w-0">
              <span
                className={cn(
                  "text-xs font-medium block truncate",
                  designConfig.style === style.id
                    ? "text-yellow-400"
                    : "text-gray-300",
                )}
              >
                {style.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Botón Ver más estilos */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAllStyles(true)}
        className="w-full text-xs"
      >
        Ver más estilos
        <ChevronRight className="h-3 w-3 ml-1" />
      </Button>

      {/* Dialog con todos los estilos */}
      <Dialog.Root open={showAllStyles} onOpenChange={setShowAllStyles}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-3xl max-h-[85vh] bg-gray-900 rounded-lg shadow-2xl border border-gray-800 overflow-hidden flex flex-col z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div>
                <Dialog.Title className="text-lg font-bold text-white">
                  Estilos de Diseño
                </Dialog.Title>
                <Dialog.Description className="text-xs text-gray-400 mt-1">
                  Selecciona el estilo artístico para tu diseño
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Filtro por categoría */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all",
                    !selectedCategory
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                  )}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-all",
                      selectedCategory === cat
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                    )}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de estilos */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setDesignConfig({ style: style.id });
                      setShowAllStyles(false);
                    }}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-lg border transition-all duration-200 text-center",
                      designConfig.style === style.id
                        ? "bg-yellow-400/10 border-yellow-400/50 ring-2 ring-yellow-400/30"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600",
                    )}
                  >
                    <span className="text-2xl mb-2">{style.emoji}</span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        designConfig.style === style.id
                          ? "text-yellow-400"
                          : "text-gray-200",
                      )}
                    >
                      {style.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {style.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800">
              <Button
                onClick={() => setShowAllStyles(false)}
                className="w-full"
              >
                Confirmar Selección
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
