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
  const isCustomStyle = designConfig.style === "custom" || !selectedStyle?.promptKeywords;
  const styleKeywords = selectedStyle?.promptKeywords || "";

  // Determinar el fondo basado en el color de la prenda
  const productColor = COLOR_LABELS[productConfig.color] || "white";
  const productType = PRODUCT_TYPE_LABELS[productConfig.type] || "t-shirt";
  const neckStyle = NECK_LABELS[productConfig.neckType] || "crew neck";

  // Construir descripción de ubicaciones
  const positionDescriptions = designConfig.positions
    .map((pos) => POSITION_LABELS[pos])
    .join(", ");

  // Número de ubicaciones para el layout
  const positionCount = designConfig.positions.length;

  // Determinar si mostrar múltiples vistas
  let layoutInstruction = "";
  if (positionCount === 1) {
    layoutInstruction = `Single view showing the ${positionDescriptions} placement on the garment.`;
  } else if (positionCount === 2) {
    layoutInstruction = `Show 2 views side by side: designs for ${positionDescriptions}. Each design clearly labeled.`;
  } else if (positionCount === 3) {
    layoutInstruction = `Show 3 views: designs for ${positionDescriptions}. Arrange in a clear grid layout.`;
  }

  // Instrucción sobre diseños iguales o diferentes
  const designVariation = designConfig.sameDesignForAll
    ? "Use the SAME design concept for all positions, adapted to each placement size."
    : "Create UNIQUE but thematically related designs for each position.";

  // Instrucción para imágenes de referencia - diferente según el estilo
  let referenceInstruction = "";
  if (hasReferenceImage) {
    if (isCustomStyle) {
      // Para estilo personalizado, usar la imagen tal cual en la prenda
      referenceInstruction = `IMPORTANT: Take the design from the reference image and place it EXACTLY as provided (maintaining its original appearance, colors, and style) on the ${positionDescriptions} of the ${productType}. The reference image IS the design to be printed.`;
    } else {
      // Para otros estilos, extraer el concepto y aplicar el estilo
      referenceInstruction = "IMPORTANT: Extract ONLY the design/pattern from the reference image. Ignore the original colors and textures - use only the shape/silhouette/concept. Apply the style specified below.";
    }
  }

  // Construir el prompt final - diferente para custom vs styled
  let finalPrompt: string;

  if (isCustomStyle && hasReferenceImage) {
    // Prompt especial para diseño personalizado con imagen de referencia
    finalPrompt = `
Create a realistic product mockup of a ${productColor} ${productType} with ${neckStyle}.

PRODUCT MOCKUP REQUIREMENTS:
1. Show a realistic ${productColor} ${productType} garment (${neckStyle})
2. The garment should be displayed flat or on an invisible mannequin
3. Clean studio photography style with neutral/white background
4. Professional e-commerce product photo aesthetic

DESIGN PLACEMENT:
- Take the design from the reference image
- Place it on the ${positionDescriptions} of the ${productType}
- Maintain the original design appearance, colors, and proportions
- Make the design look naturally printed/embedded on the fabric
- The design should follow the fabric contours realistically

${layoutInstruction}

USER REQUEST:
"${userPrompt}"

${referenceInstruction}

OUTPUT: A realistic product mockup photo showing the ${productColor} ${productType} WITH the design properly placed on it.
`.trim();
  } else {
    // Prompt para diseño con estilo artístico
    const background = COLOR_TO_BACKGROUND[productConfig.color] || "white background";
    
    finalPrompt = `
Create a realistic product mockup of a ${productColor} ${productType} with ${neckStyle} featuring a custom design.

PRODUCT:
- ${productColor} ${productType} with ${neckStyle}
- Clean studio photography style mockup
- Professional e-commerce aesthetic

DESIGN SPECIFICATIONS:
- Style: ${selectedStyle?.name || "Custom"} ${styleKeywords ? `(${styleKeywords})` : ""}
- Placement: ${positionDescriptions}

${layoutInstruction}
${positionCount > 1 ? designVariation : ""}

USER DESIGN REQUEST:
"${userPrompt}"

${referenceInstruction}

CRITICAL REQUIREMENTS:
1. Show the ACTUAL ${productType} garment with the design ON it
2. The design should look printed/embedded on the fabric naturally
3. High contrast design visible on ${productColor} fabric
4. Professional product mockup photo style output
5. Design should fit the specified placement area proportionally

OUTPUT: Realistic product mockup showing the ${productColor} ${productType} with the design properly placed on the garment.
`.trim();
  }

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
