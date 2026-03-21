import catalogData from "./catalog.json";

export interface SimpleProduct {
  title: string; // "Camiseta Básica"
  description: string; // "Camiseta de algodón..."
  basePrice: number; // 20 (precio base en PEN)

  category: "camiseta" | "hoodie" | "pantalon" | "zapatos" | "accesorios";
  subcategory?: "security / hacking" | "3D / realidad virtual";

  colors: {
    name: string; // "Blanco", "Negro", "Azul"
    code: string; // "#FFFFFF" (OBLIGATORIO)
    images?: {
      front: string; // "/images/producto/color-front.png"
      back?: string; // "/images/producto/color-back.png"
      detail?: string; // "/images/producto/color-detail.png"
      lifestyle?: string; // "/images/producto/color-lifestyle.png"
    };
  }[];

  // 📏 CONFIGURACIÓN OPCIONAL
  sizes?: string[]; // ['XS', 'S', 'M', 'L', 'XL'] - por defecto: ['S', 'M', 'L']
  tags?: string[]; // ['básico', 'algodón'] - se agregan automáticamente según categoría
  sizeUpcharge?: number; // 2 - costo extra por talla L+ (por defecto: 2)
  colorUpcharge?: Record<string, number>; // { "Premium": 5 } - costo extra por color especial
  available?: boolean; // true (por defecto: true)

  // 🖼️ IMÁGENES GENERALES (opcional)
  generalImages?: {
    hero?: string; // Imagen principal del producto
    gallery?: string[]; // Galería adicional
    sizeGuide?: string; // Guía de tallas
  };
}

// 🎯 CATÁLOGO DE PRODUCTOS
// ========================
// El portal local administra este catálogo y guarda cambios en catalog.json.
export const PRODUCTOS: SimpleProduct[] = catalogData.products as SimpleProduct[];

// 🏷️ CONFIGURACIÓN DE CATEGORÍAS
// ==============================
export const CATEGORY_CONFIG: Record<
  string,
  {
    displayName: string;
    description: string;
    defaultTags: string[];
    icon: string;
  }
> = {
  camiseta: {
    displayName: "Camisetas",
    description: "Camisetas cómodas y versátiles para cualquier ocasión",
    defaultTags: ["camiseta", "algodón"],
    icon: "",
  },
  hoodie: {
    displayName: "Hoodies",
    description: "Sudaderas con capucha perfectas para clima frío",
    defaultTags: ["hoodie", "sudadera", "capucha"],
    icon: "",
  },
  pantalon: {
    displayName: "Pantalones",
    description: "Pantalones cómodos",
    defaultTags: ["pantalon"],
    icon: "",
  },
  zapatos: {
    displayName: "Zapatos",
    description: "Zapatos cómodos",
    defaultTags: ["zapatos"],
    icon: "",
  },
  accesorios: {
    displayName: "Accesorios",
    description: "Accesorios varios",
    defaultTags: ["accesorios"],
    icon: "",
  },
};

// 📐 CONFIGURACIÓN GLOBAL
// =======================
export const STORE_CONFIG = {
  defaultSizes: ["S", "M", "L"],
  defaultSizeUpcharge: 0, // $2 extra por tallas L+
  currency: "PEN",

  // Precios por tallas (se suma al precio base)
  sizePricing: {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  },
};
