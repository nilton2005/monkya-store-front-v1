import {
    DesignConfig,
    DesignPosition,
    ProductConfig,
} from "storeIA/useAppStore";
import { DESIGN_STYLES } from "./StyleSelector";

// Mapeo de colores a fondos contrastantes
const COLOR_TO_BACKGROUND: Record<string, string> = {
  blanco: "black background",
  negro: "white background",
  "verde-petroleo": "white background",
  rojo: "white background",
};

const COLOR_LABELS: Record<string, string> = {
  blanco: "white",
  negro: "black",
  "verde-petroleo": "teal/petroleum green",
  rojo: "red",
};

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  polo: "t-shirt",
  polera: "sweatshirt/hoodie",
};

const NECK_LABELS: Record<string, string> = {
  v: "V-neck",
  circular: "crew neck/round neck",
};

const POSITION_LABELS: Record<DesignPosition, string> = {
  "frente-superior": "front upper chest",
  "frente-centro": "front center",
  "frente-inferior": "front lower/hem area",
  "frente-completo": "full front coverage",
  "espalda-superior": "back upper/shoulder blades",
  "espalda-centro": "back center",
  "espalda-inferior": "back lower",
  "espalda-completo": "full back coverage",
  "hombro-izquierdo": "left shoulder/sleeve",
  "hombro-derecho": "right shoulder/sleeve",
};

interface BuildPromptOptions {
  productConfig: ProductConfig;
  designConfig: DesignConfig;
  userPrompt: string;
  hasReferenceImage: boolean;
}

/**
 * Construye el prompt final para la API de generación de imágenes
 * Asegura que solo se generen diseños apropiados para estampar en ropa
 */
export function buildDesignPrompt(options: BuildPromptOptions): string {
  const { productConfig, designConfig, userPrompt, hasReferenceImage } =
    options;

  // Obtener información del estilo seleccionado
  const selectedStyle = DESIGN_STYLES.find((s) => s.id === designConfig.style);
  const styleKeywords = selectedStyle?.promptKeywords || "";

  // Determinar el fondo basado en el color de la prenda
  const background =
    COLOR_TO_BACKGROUND[productConfig.color] || "white background";
  const productColor = COLOR_LABELS[productConfig.color] || "white";
  const productType = PRODUCT_TYPE_LABELS[productConfig.type] || "t-shirt";

  // Construir descripción de ubicaciones
  const positionDescriptions = designConfig.positions
    .map((pos) => POSITION_LABELS[pos])
    .join(", ");

  // Número de ubicaciones para el layout
  const positionCount = designConfig.positions.length;

  // Determinar si mostrar múltiples vistas
  let layoutInstruction = "";
  if (positionCount === 1) {
    layoutInstruction = `Single design view showing the ${positionDescriptions} placement.`;
  } else if (positionCount === 2) {
    layoutInstruction = `Show 2 views side by side: designs for ${positionDescriptions}. Each design clearly labeled.`;
  } else if (positionCount === 3) {
    layoutInstruction = `Show 3 views: designs for ${positionDescriptions}. Arrange in a clear grid layout.`;
  }

  // Instrucción sobre diseños iguales o diferentes
  const designVariation = designConfig.sameDesignForAll
    ? "Use the SAME design concept for all positions, adapted to each placement size."
    : "Create UNIQUE but thematically related designs for each position.";

  // Instrucción para imágenes de referencia
  const referenceInstruction = hasReferenceImage
    ? "IMPORTANT: Extract ONLY the design/pattern from the reference image. Ignore the original colors and textures - use only the shape/silhouette/concept. Apply the style specified below."
    : "";

  // Construir el prompt final
  const finalPrompt = `
Create a professional print-ready design for a ${productColor} ${productType}.

DESIGN SPECIFICATIONS:
- Style: ${selectedStyle?.name || "Custom"} (${styleKeywords})
- Placement: ${positionDescriptions}
- Background: Solid ${background} (contrasting with ${productColor} fabric)

${layoutInstruction}
${positionCount > 1 ? designVariation : ""}

USER DESIGN REQUEST:
"${userPrompt}"

${referenceInstruction}

CRITICAL REQUIREMENTS:
1. This is a PRINT DESIGN for fabric/textile printing - must be print-ready
2. Clean edges, suitable for screen printing or DTG
3. ${background} - NO gradients to the edges
4. High contrast colors that will be visible on ${productColor} fabric
5. Design should fit the specified placement area proportionally
6. NO realistic photographs - only stylized/artistic designs
7. Vector-style or illustration-style output preferred

OUTPUT: Single image showing the design(s) on ${background}, ready for direct print transfer.
`.trim();

  return finalPrompt;
}

/**
 * Genera un título descriptivo para el producto basado en la configuración
 */
export function generateProductTitle(options: BuildPromptOptions): string {
  const { productConfig, designConfig, userPrompt } = options;

  const productType = productConfig.type === "polo" ? "Polo" : "Polera";
  const style = DESIGN_STYLES.find((s) => s.id === designConfig.style);

  // Tomar las primeras palabras del prompt del usuario (máx 3)
  const userWords = userPrompt.split(" ").slice(0, 3).join(" ");

  return `${productType} ${style?.name || "Diseño"} - ${userWords}`;
}

/**
 * Valida si el prompt del usuario es apropiado para diseños de ropa
 */
export function validateDesignPrompt(userPrompt: string): {
  valid: boolean;
  reason?: string;
} {
  const lowercasePrompt = userPrompt.toLowerCase();

  // Palabras prohibidas que indicarían contenido inapropiado
  const prohibitedTerms = [
    "desnudo",
    "nude",
    "naked",
    "porn",
    "xxx",
    "violencia",
    "violence",
    "blood",
    "gore",
    "drogas",
    "drugs",
    "cocaine",
    "marijuana",
    "armas",
    "weapons",
    "gun",
    "rifle",
    "hate",
    "nazi",
    "racial",
    "discrimin",
  ];

  for (const term of prohibitedTerms) {
    if (lowercasePrompt.includes(term)) {
      return {
        valid: false,
        reason: "El contenido solicitado no es apropiado para diseños de ropa.",
      };
    }
  }

  // Advertencias sobre contenido que podría no funcionar bien
  const warningTerms = [
    "foto real",
    "fotografía",
    "retrato realista",
    "realistic photo",
  ];
  for (const term of warningTerms) {
    if (lowercasePrompt.includes(term)) {
      return {
        valid: true,
        reason:
          "Los retratos fotográficos pueden no traducirse bien a estampados. Considera un estilo más artístico.",
      };
    }
  }

  return { valid: true };
}
