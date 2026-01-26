
import { compressBase64Image } from "lib/image-compression";

/**
 * Resultado de una subida exitosa
 */
export interface CloudinaryUploadResult {
  success: true;
  url: string;
  publicId: string;
  originalSize: number;
  compressedSize: number;
  cloudinarySize: number;
}

/**
 * Resultado de una subida fallida
 */
export interface CloudinaryUploadError {
  success: false;
  error: string;
}

export type UploadResult = CloudinaryUploadResult | CloudinaryUploadError;

/**
 * Opciones de compresión para optimizar antes de subir
 */
interface CompressionOptions {
  /** Ancho máximo en píxeles (default: 800 para WhatsApp) */
  maxWidth?: number;
  /** Calidad de 0 a 1 (default: 0.7 para balance calidad/tamaño) */
  quality?: number;
}

/**
 * Sube una imagen a Cloudinary con compresión previa
 *
 * @param base64Image - Imagen en formato base64 (data:image/...)
 * @param options - Opciones de compresión
 * @returns Resultado con la URL de Cloudinary o error
 *
 * @example
 * const result = await uploadImageToCloudinary(imageBase64, { maxWidth: 800 });
 * if (result.success) {
 *   console.log('URL:', result.url);
 * }
 */
export async function uploadImageToCloudinary(
  base64Image: string,
  options: CompressionOptions = {},
): Promise<UploadResult> {
  const {
    maxWidth = 800, // 800px es suficiente para WhatsApp
    quality = 0.7, // 70% de calidad es un buen balance
  } = options;

  try {
    // Guardar tamaño original para métricas
    const originalSize = base64Image.length;

    console.log("🖼️ Iniciando proceso de subida a Cloudinary...");
    console.log(`   Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`);

    // 1. COMPRIMIR LA IMAGEN
    // Esto reduce significativamente el tamaño antes de enviar al servidor
    // Por ejemplo: una imagen de 2MB se reduce a ~150KB
    console.log("🗜️ Comprimiendo imagen...");
    const compressedImage = await compressBase64Image(
      base64Image,
      maxWidth,
      quality,
    );
    const compressedSize = compressedImage.length;

    const reductionPercent = (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1);
    console.log(
      `   Tamaño comprimido: ${(compressedSize / 1024).toFixed(2)} KB`,
    );
    console.log(`   Reducción: ${reductionPercent}%`);

    // 2. ENVIAR A NUESTRA API ROUTE
    // La API route maneja la subida a Cloudinary de forma seguna
    console.log("📤 Enviando a servidor...");
    const response = await fetch("/api/cloudinary/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: compressedImage,
        folder: "monkya-orders", // Carpeta específica para pedidos
      }),
    });

    // 3. PROCESAR RESPUESTA
    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("❌ Error del servidor:", result.error);
      return {
        success: false,
        error: result.error || "Error al subir imagen",
      };
    }

    console.log("✅ Imagen subida exitosamente a Cloudinary!");
    console.log(`   URL: ${result.url}`);
    console.log(
      `   Tamaño final en Cloudinary: ${(result.bytes / 1024).toFixed(2)} KB`,
    );

    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
      originalSize,
      compressedSize,
      cloudinarySize: result.bytes,
    };
  } catch (error) {
    console.error("❌ Error en uploadImageToCloudinary:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Sube múltiples imágenes a Cloudinary en paralelo
 * Útil cuando el carrito tiene varios productos personalizados
 *
 * @param images - Array de imágenes base64
 * @returns Array de resultados (éxito o error para cada una)
 */
export async function uploadMultipleImages(
  images: string[],
): Promise<UploadResult[]> {
  console.log(`📤 Subiendo ${images.length} imagen(es) a Cloudinary...`);

  // Subir todas en paralelo para mayor velocidad
  const results = await Promise.all(
    images.map((image) => uploadImageToCloudinary(image)),
  );

  // Contar éxitos y errores
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(
    `✅ Subidas completadas: ${successful} exitosas, ${failed} fallidas`,
  );

  return results;
}

/**
 * Verifica si una imagen es una URL de Cloudinary
 * Útil para no volver a subir imágenes que ya están en la nube
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes("cloudinary.com") || url.includes("res.cloudinary.com");
}

/**
 * Verifica si una string es una imagen base64
 */
export function isBase64Image(str: string): boolean {
  return str.startsWith("data:image/");
}
