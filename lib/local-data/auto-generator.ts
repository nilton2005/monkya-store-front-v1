import { Collection, Menu, Product, ProductVariant } from "../shopify/types";
import {
    CATEGORY_CONFIG,
    PRODUCTOS,
    STORE_CONFIG,
    SimpleProduct,
} from "./simple-products";

// 🔄 GENERADORES AUTOMÁTICOS
// ==========================

// Genera un handle único desde el título
function generateHandle(title: string, category: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remover caracteres especiales
      .replace(/\s+/g, "-") // Espacios a guiones
      .replace(/-+/g, "-") // Múltiples guiones a uno
      .trim() + `-${category}`
  );
}

// Genera ID único
function generateId(index: number): string {
  return `gid://product/${index + 1}`;
}

// Genera variante ID
function generateVariantId(
  productIndex: number,
  sizeIndex: number,
  colorIndex: number,
): string {
  return `gid://variant/${productIndex + 1}-${sizeIndex}-${colorIndex}`;
}

// Calcula precio de variante
function calculateVariantPrice(
  basePrice: number,
  size: string,
  color: string,
  product: SimpleProduct,
): number {
  let price = basePrice;

  // Agregar costo por talla
  const sizeUpcharge =
    (STORE_CONFIG.sizePricing as Record<string, number>)[size] || 0;
  price += sizeUpcharge;

  // Agregar costo por color especial
  if (product.colorUpcharge && product.colorUpcharge[color]) {
    price += product.colorUpcharge[color];
  }

  return price;
}

// Genera URLs de imágenes (reales o placeholders)
function getImageUrls(
  product: SimpleProduct,
  colorName: string,
): {
  front: string;
  back: string;
  detail?: string;
  lifestyle?: string;
} {
  // Buscar el color específico
  const colorData = product.colors.find((c) => c.name === colorName);

  if (colorData?.images) {
    // Usar imágenes reales si están disponibles
    return {
      front: colorData.images.front,
      back: colorData.images.back || colorData.images.front,
      detail: colorData.images.detail,
      lifestyle: colorData.images.lifestyle,
    };
  }

  // Fallback a placeholders si no hay imágenes reales
  const category = product.category;
  const colorSlug = colorName.toLowerCase().replace(/\s+/g, "-");

  return {
    front: `/placeholder-${category}-${colorSlug}.jpg`,
    back: `/placeholder-${category}-${colorSlug}-back.jpg`,
  };
}

// Genera todas las imágenes del producto incluyendo variantes de color
function generateProductImages(product: SimpleProduct): any[] {
  const images: any[] = [];

  // Agregar imagen hero si existe
  if (product.generalImages?.hero) {
    images.push({
      url: product.generalImages.hero,
      altText: `${product.title} - Imagen principal`,
      width: 800,
      height: 800,
    });
  }

  // Agregar imágenes de cada color
  product.colors.forEach((color, index) => {
    const colorImages = getImageUrls(product, color.name);

    // Imagen frontal (siempre)
    images.push({
      url: colorImages.front,
      altText: `${product.title} - ${color.name} (Frontal)`,
      width: 600,
      height: 600,
    });

    // Imagen trasera
    if (colorImages.back !== colorImages.front) {
      images.push({
        url: colorImages.back,
        altText: `${product.title} - ${color.name} (Trasera)`,
        width: 600,
        height: 600,
      });
    }

    // Imagen de detalle
    if (colorImages.detail) {
      images.push({
        url: colorImages.detail,
        altText: `${product.title} - ${color.name} (Detalle)`,
        width: 600,
        height: 600,
      });
    }

    // Imagen lifestyle
    if (colorImages.lifestyle) {
      images.push({
        url: colorImages.lifestyle,
        altText: `${product.title} - ${color.name} (Lifestyle)`,
        width: 600,
        height: 600,
      });
    }
  });

  // Agregar galería general si existe
  if (product.generalImages?.gallery) {
    product.generalImages.gallery.forEach((imageUrl, index) => {
      images.push({
        url: imageUrl,
        altText: `${product.title} - Galería ${index + 1}`,
        width: 600,
        height: 600,
      });
    });
  }

  return images;
}

// 🏭 FUNCIONES DE GENERACIÓN AUTOMÁTICA
// =====================================

// Convierte producto simple a producto completo
function generateFullProduct(
  simpleProduct: SimpleProduct,
  index: number,
): Product {
  const {
    title,
    description,
    basePrice,
    originalPrice,
    category,
    colors,
    sizes = STORE_CONFIG.defaultSizes,
    tags = [],
    available = true,
  } = simpleProduct;

  const handle = generateHandle(title, category);
  const id = generateId(index);

  // Combinar tags automáticos con tags personalizados
  const categoryConfig = CATEGORY_CONFIG[category];
  const allTags = [...(categoryConfig?.defaultTags || []), ...tags];

  // Generar todas las variantes
  const variants: ProductVariant[] = [];
  const options = [
    { id: "gid://option/size", name: "Size", values: sizes },
    {
      id: "gid://option/color",
      name: "Color",
      values: colors.map((c) => c.name),
    },
  ];

  let minPrice = Infinity;
  let maxPrice = 0;
  let minCompareAtPrice = Infinity;
  let maxCompareAtPrice = 0;
  const compareAtDelta =
    typeof originalPrice === "number" && originalPrice > basePrice
      ? originalPrice - basePrice
      : undefined;

  // Generar variantes para cada combinación talla-color
  sizes.forEach((size, sizeIndex) => {
    colors.forEach((color, colorIndex) => {
      const variantPrice = calculateVariantPrice(
        basePrice,
        size,
        color.name,
        simpleProduct,
      );
      const variantCompareAtPrice =
        compareAtDelta !== undefined ? variantPrice + compareAtDelta : undefined;
      const variantId = generateVariantId(index, sizeIndex, colorIndex);

      minPrice = Math.min(minPrice, variantPrice);
      maxPrice = Math.max(maxPrice, variantPrice);
      if (variantCompareAtPrice !== undefined) {
        minCompareAtPrice = Math.min(minCompareAtPrice, variantCompareAtPrice);
        maxCompareAtPrice = Math.max(maxCompareAtPrice, variantCompareAtPrice);
      }

      variants.push({
        id: variantId,
        title: `${size} / ${color.name}`,
        availableForSale: available,
        selectedOptions: [
          { name: "Size", value: size },
          { name: "Color", value: color.name },
        ],
        price: {
          amount: variantPrice.toFixed(2),
          currencyCode: STORE_CONFIG.currency,
        },
        ...(variantCompareAtPrice !== undefined
          ? {
              compareAtPrice: {
                amount: variantCompareAtPrice.toFixed(2),
                currencyCode: STORE_CONFIG.currency,
              },
            }
          : {}),
      });
    });
  });

  // Generar todas las imágenes del producto
  const allImages = generateProductImages(simpleProduct);
  const mainColor = colors[0];
  if (!mainColor) {
    throw new Error(`Product "${title}" must have at least one color`);
  }

  // Usar hero image o la primera imagen del primer color como principal
  const mainImageUrls = getImageUrls(simpleProduct, mainColor.name);
  const featuredImageUrl =
    simpleProduct.generalImages?.hero || mainImageUrls.front;

  const product: Product = {
    id,
    handle,
    title,
    description,
    descriptionHtml: `<p>${description}</p>`,
    availableForSale: available,
    updatedAt: new Date().toISOString(),
    tags: allTags,
    featuredImage: {
      url: featuredImageUrl,
      altText: title,
      width: 800,
      height: 800,
    },
    images:
      allImages.length > 0
        ? allImages
        : [
            {
              url: featuredImageUrl,
              altText: `${title} - Vista principal`,
              width: 600,
              height: 600,
            },
          ],
    priceRange: {
      maxVariantPrice: {
        amount: maxPrice.toFixed(2),
        currencyCode: STORE_CONFIG.currency,
      },
      minVariantPrice: {
        amount: minPrice.toFixed(2),
        currencyCode: STORE_CONFIG.currency,
      },
      ...(compareAtDelta !== undefined
        ? {
            compareAtMaxVariantPrice: {
              amount: maxCompareAtPrice.toFixed(2),
              currencyCode: STORE_CONFIG.currency,
            },
            compareAtMinVariantPrice: {
              amount: minCompareAtPrice.toFixed(2),
              currencyCode: STORE_CONFIG.currency,
            },
          }
        : {}),
    },
    variants,
    options,
    seo: {
      title: `${title} - ${categoryConfig?.displayName || category}`,
      description: `Compra ${title.toLowerCase()}. ${description}`,
    },
  };

  return product;
}

// Genera colecciones automáticamente basadas en categorías
function generateCollections(): Collection[] {
  const collections: Collection[] = [
    {
      handle: "",
      title: "Todos",
      description: "Todos los productos disponibles",
      seo: {
        title: "Todos los Productos",
        description: "Explora todo nuestro catálogo de productos",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
  ];

  // Obtener categorías únicas de los productos
  const categoriesInUse = [...new Set(PRODUCTOS.map((p) => p.category))];

  categoriesInUse.forEach((category) => {
    const config = CATEGORY_CONFIG[category];
    if (config) {
      collections.push({
        handle: category,
        title: config.displayName,
        description: config.description,
        seo: {
          title: `${config.displayName} - Tienda`,
          description: config.description,
        },
        path: `/search/${category}`,
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return collections;
}

// Genera menú automáticamente
function generateMenu(): Menu[] {
  const menu: Menu[] = [{ title: "Todos", path: "/search" }];

  const categoriesInUse = [...new Set(PRODUCTOS.map((p) => p.category))];

  categoriesInUse.forEach((category) => {
    const config = CATEGORY_CONFIG[category];
    if (config) {
      menu.push({
        title: `${config.icon} ${config.displayName}`,
        path: `/search/${category}`,
      });
    }
  });

  return menu;
}

// 📤 EXPORTS AUTOMÁTICOS
// ======================

// Generar todos los productos automáticamente
export const localProducts: Product[] = PRODUCTOS.map((product, index) =>
  generateFullProduct(product, index),
);

// Generar colecciones automáticamente
export const localCollections: Collection[] = generateCollections();

// Generar menú automáticamente
export const localMenu: Menu[] = generateMenu();

// 🔍 FUNCIONES DE BÚSQUEDA MEJORADAS
// ==================================

// Buscar productos por categoría automáticamente
export function getProductsByCategory(category: string): Product[] {
  if (!category || category === "") {
    return localProducts;
  }

  return localProducts.filter(
    (product) =>
      product.tags.includes(category) || product.handle.includes(category),
  );
}

// Buscar productos por tags
export function getProductsByTags(tags: string[]): Product[] {
  return localProducts.filter((product) =>
    tags.some((tag) => product.tags.includes(tag)),
  );
}

// Estadísticas automáticas
export function getStoreStats() {
  const categories = [...new Set(PRODUCTOS.map((p) => p.category))];
  const totalVariants = localProducts.reduce(
    (total, product) => total + product.variants.length,
    0,
  );

  return {
    totalProducts: localProducts.length,
    totalVariants,
    totalCategories: categories.length,
    categories: categories.map((cat) => ({
      name: CATEGORY_CONFIG[cat]?.displayName || cat,
      count: PRODUCTOS.filter((p) => p.category === cat).length,
      icon: CATEGORY_CONFIG[cat]?.icon || "📦",
    })),
    priceRange: {
      min: Math.min(
        ...localProducts.map((p) =>
          parseFloat(p.priceRange.minVariantPrice.amount),
        ),
      ),
      max: Math.max(
        ...localProducts.map((p) =>
          parseFloat(p.priceRange.maxVariantPrice.amount),
        ),
      ),
    },
  };
}
