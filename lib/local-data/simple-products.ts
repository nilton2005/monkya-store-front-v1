export interface SimpleProduct {
  title: string; // "Camiseta Básica"
  description: string; // "Camiseta de algodón..."
  basePrice: number; // 20 (precio base en PEN)

  category: "camiseta" | "hoodie" | "pantalon" | "zapatos" | "accesorios";

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
// Solo agrega productos aquí ⬇️
export const PRODUCTOS: SimpleProduct[] = [
  // 🎨 CAMISETAS
  {
    title: "T-Shirt Anthropic",
    description:
      "Camiseta exclusiva con diseño Anthropic. Disponible en estilos para hombre y mujer. Algodón premium de alta calidad.",
    basePrice: 28,
    category: "camiseta",
    colors: [
      {
        name: "Negro",
        code: "#000000",
        images: {
          front: "/images-products/t-shirt/t-shirt_anthopic/man_style.png",
          back: "/images-products/t-shirt/t-shirt_anthopic/Women_style.png",
        },
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    tags: ["tech", "anthropic", "exclusivo", "premium"],
    //generalImages: {
    //  hero: '/images-products/t-shirt/t-shirt_anthopic/man_style.png'
    // }
  },

  {
    title: "T-Shirt Free WiFi",
    description:
      'Camiseta divertida con mensaje "Free WiFi". Perfecta para desarrolladores y tech lovers. Diseño moderno y cómodo.',
    basePrice: 25,
    category: "camiseta",
    colors: [
      {
        name: "Negro",
        code: "#000000",
        images: {
          front:
            "/images-products/t-shirt/t-shirt-free_wifi/tshirt-free-wifi-man.png",
          back: "/images-products/t-shirt/t-shirt-free_wifi/thsir-free-wifi-woman.png",
        },
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    tags: ["tech", "wifi", "divertido", "geek", "desarrollador"],
  },

  // 🧥 HOODIES
  {
    title: "Hoodie Void",
    description:
      "Sudadera con capucha estilo Void. Diseño minimalista y elegante. Perfecta para el frío y estilo urbano.",
    basePrice: 48,
    category: "hoodie",
    colors: [
      {
        name: "Verde petroleo",
        code: "#000000",
        images: {
          front: "/images-products/Hoodie/hoodies-void/hoodies-void-man.png",
          back: "/images-products/Hoodie/hoodies-void/hoodies-void-woman.png",
        },
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tags: ["void", "urbano", "minimalista", "premium"],
    generalImages: {
      //hero: '/images-products/Hoodie/hoodies-void/hoodies-void-man.png'
    },
  },

  {
    title: "Hoodie Wakanda",
    description:
      "Sudadera con capucha inspirada en Wakanda. Diseño único y llamativo. Calidad excepcional y estilo distintivo.",
    basePrice: 52,
    category: "hoodie",
    colors: [
      {
        name: "Negro",
        code: "#000000",
        images: {
          front:
            "/images-products/Hoodie/hoodies-wakanda/hoodies-wakanda-man.png",
          back: "/images-products/Hoodie/hoodies-wakanda/hoodies-wakanda-woman.png",
        },
      },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tags: ["wakanda", "marvel", "exclusivo", "colección", "premium"],
    sizeUpcharge: 3,
    generalImages: {
      //hero: '/images-products/Hoodie/hoodies-wakanda/hoodies-wakanda-man.png'
    },
  },

  // 🤖 IA GENERATED TEMPLATE
  {
    title: "IA Generated",
    description:
      "Tu diseño único generado con Inteligencia Artificial. Impreso en nuestra camiseta premium de algodón.",
    basePrice: 35,
    category: "camiseta",
    colors: [
      {
        name: "Negro",
        code: "#000000",
        images: {
          front: "/images-products/t-shirt/t-shirt_anthopic/man_style.png", // Placeholder base
        },
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    tags: ["ia", "custom", "generated", "unique"],
  },
];

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
