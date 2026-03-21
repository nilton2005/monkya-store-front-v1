
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";

// Configurar Cloudinary con las credenciales del servidor
// Estas variables NUNCA se exponen al cliente (no tienen NEXT_PUBLIC_)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Interface para la respuesta de subida exitosa
 */
interface UploadSuccessResponse {
  success: true;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Interface para la respuesta de error
 */
interface UploadErrorResponse {
  success: false;
  error: string;
}

type UploadResponse = UploadSuccessResponse | UploadErrorResponse;

export async function POST(
  request: Request,
): Promise<NextResponse<UploadResponse>> {
  try {
    const contentType = request.headers.get("content-type") || "";
    let image = "";
    let folder = "monkya-orders";
    let customName: string | undefined;

    // Soportamos JSON (data URL) y multipart/form-data (archivo binario).
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      folder = String(formData.get("folder") || folder);
      customName = String(formData.get("customName") || "").trim() || undefined;

      if (!(file instanceof File)) {
        return NextResponse.json(
          { success: false, error: "No se proporcionó archivo" },
          { status: 400 },
        );
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { success: false, error: "El archivo debe ser una imagen válida" },
          { status: 400 },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      image = `data:${file.type};base64,${base64}`;
    } else {
      // 1. Parsear el body JSON de la request
      const body = await request.json();
      image = body.image;
      folder = body.folder || folder;
      customName = body.customName;
    }

    // 2. Validar que se recibió una imagen
    if (!image) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó imagen" },
        { status: 400 },
      );
    }

    // 3. Validar que es un base64 válido
    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Formato de imagen inválido. Debe ser base64 con data URL.",
        },
        { status: 400 },
      );
    }

    // 4. Generar un nombre único para la imagen
    // Usamos timestamp + random para evitar colisiones
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const publicId = customName
      ? `${customName}-${timestamp}`
      : `design-${timestamp}-${randomId}`;

    console.log("📤 Subiendo imagen a Cloudinary...", { folder, publicId });

    // 5. Subir a Cloudinary
    // upload() acepta base64 data URLs directamente
    const result = await cloudinary.uploader.upload(image, {
      folder: folder, // Carpeta en Cloudinary para organizar
      public_id: publicId, // ID único de la imagen
      resource_type: "image", // Tipo de recurso
      overwrite: false, // No sobrescribir si existe

      // Optimizaciones automáticas de Cloudinary
      // Esto ayuda a reducir aún más el tamaño de la imagen
      transformation: [
        {
          quality: "auto:good", // Calidad automática óptima
          fetch_format: "auto", // Formato óptimo (webp si el browser soporta)
        },
      ],

      // Metadata útil para rastrear
      tags: ["customer-design", "order"],
      context: {
        uploaded_at: new Date().toISOString(),
        source: "checkout",
      },
    });

    console.log("✅ Imagen subida exitosamente:", {
      url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
    });

    // 6. Retornar la respuesta exitosa
    return NextResponse.json({
      success: true,
      url: result.secure_url, // URL HTTPS de la imagen
      publicId: result.public_id, // ID para referencia futura
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes, // Tamaño final en bytes
    });
  } catch (error) {
    // 7. Manejo de errores
    console.error("❌ Error subiendo a Cloudinary:", error);

    // Determinar el mensaje de error apropiado
    let errorMessage = "Error desconocido al subir imagen";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String((error as { message: unknown }).message);
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
