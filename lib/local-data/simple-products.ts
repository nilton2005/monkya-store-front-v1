// 🛒 SISTEMA AUTOMÁTICO DE PRODUCTOS
// =====================================
// Solo agrega productos aquí y todo se organizará automáticamente:
// - Categorías se crean automáticamente
// - Menús se generan automáticamente  
// - Handles y URLs se crean automáticamente
// - Variantes se generan automáticamente

export interface SimpleProduct {
  // ✨ INFORMACIÓN BÁSICA (obligatorio)
  title: string;                    // "Camiseta Básica"
  description: string;              // "Camiseta de algodón..."
  basePrice: number;                // 20 (precio base en USD)
  
  // 🎨 CATEGORÍA (obligatorio)
  category: 'camiseta' | 'hoodie' | 'pantalon' | 'zapatos' | 'accesorios';
  
  // 🌈 COLORES DISPONIBLES (obligatorio)
  colors: {
    name: string;                   // "Blanco", "Negro", "Azul"
    code?: string;                  // "#FFFFFF" (opcional)
  }[];
  
  // 📏 CONFIGURACIÓN OPCIONAL
  sizes?: string[];                 // ['XS', 'S', 'M', 'L', 'XL'] - por defecto: ['S', 'M', 'L']
  tags?: string[];                  // ['básico', 'algodón'] - se agregan automáticamente según categoría
  sizeUpcharge?: number;            // 2 - costo extra por talla L+ (por defecto: 2)
  colorUpcharge?: Record<string, number>; // { "Premium": 5 } - costo extra por color especial
  available?: boolean;              // true (por defecto: true)
  
  // 🖼️ IMÁGENES (opcional - se generan automáticamente si no se especifican)
  images?: {
    front?: string;                 // URL de imagen frontal
    back?: string;                  // URL de imagen trasera
  };
}

// 🎯 CATÁLOGO DE PRODUCTOS
// ========================
// Solo agrega productos aquí ⬇️
export const PRODUCTOS: SimpleProduct[] = [
  {
    title: 'Camiseta Básica',
    description: 'Camiseta de algodón 100% perfecta para uso diario. Cómoda y duradera.',
    basePrice: 20,
    category: 'camiseta',
    colors: [
      { name: 'Blanco', code: '#FFFFFF' },
      { name: 'Negro', code: '#000000' }
    ],
    tags: ['básico', 'algodón', 'unisex']
  },
  
  {
    title: 'Camiseta Premium',
    description: 'Camiseta premium de algodón orgánico con acabados de alta calidad.',
    basePrice: 30,
    category: 'camiseta',
    colors: [
      { name: 'Negro', code: '#000000' },
      { name: 'Gris', code: '#6B7280' },
      { name: 'Azul Marino', code: '#1E40AF' }
    ],
    tags: ['premium', 'algodón orgánico', 'eco-friendly'],
    colorUpcharge: { 'Azul Marino': 3 }
  },
  
  {
    title: 'Hoodie Clásica',
    description: 'Sudadera con capucha clásica perfecta para clima frío. Interior con felpa suave.',
    basePrice: 45,
    category: 'hoodie',
    colors: [
      { name: 'Gris', code: '#6B7280' },
      { name: 'Negro', code: '#000000' },
      { name: 'Blanco', code: '#FFFFFF' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['clásico', 'cómodo', 'unisex']
  },
  
  {
    title: 'Hoodie Street',
    description: 'Sudadera urbana con diseño moderno y corte oversized. Perfecta para el estilo street.',
    basePrice: 55,
    category: 'hoodie',
    colors: [
      { name: 'Negro', code: '#000000' },
      { name: 'Gris Oscuro', code: '#374151' }
    ],
    sizes: ['M', 'L', 'XL'],
    tags: ['street', 'urbano', 'oversized', 'moderno'],
    sizeUpcharge: 5
  }
];

// 🏷️ CONFIGURACIÓN DE CATEGORÍAS
// ==============================
export const CATEGORY_CONFIG = {
  camiseta: {
    displayName: 'Camisetas',
    description: 'Camisetas cómodas y versátiles para cualquier ocasión',
    defaultTags: ['camiseta', 'algodón'],
    icon: '👕'
  },
  hoodie: {
    displayName: 'Hoodies',
    description: 'Sudaderas con capucha perfectas para clima frío',
    defaultTags: ['hoodie', 'sudadera', 'capucha'],
    icon: '🧥'
  },
  pantalon: {
    displayName: 'Pantalones',
    description: 'Pantalones cómodos para cualquier estilo',
    defaultTags: ['pantalón', 'moda'],
    icon: '👖'
  },
  zapatos: {
    displayName: 'Zapatos',
    description: 'Calzado cómodo y con estilo',
    defaultTags: ['zapatos', 'calzado'],
    icon: '👟'
  },
  accesorios: {
    displayName: 'Accesorios',
    description: 'Complementos perfectos para tu outfit',
    defaultTags: ['accesorios', 'complementos'],
    icon: '🎒'
  }
};

// 📐 CONFIGURACIÓN GLOBAL
// =======================
export const STORE_CONFIG = {
  defaultSizes: ['S', 'M', 'L'],
  defaultSizeUpcharge: 2,           // $2 extra por tallas L+
  currency: 'USD',
  
  // Precios por tallas (se suma al precio base)
  sizePricing: {
    'XS': 0,
    'S': 0,
    'M': 2,
    'L': 5,
    'XL': 8,
    'XXL': 12
  }
};