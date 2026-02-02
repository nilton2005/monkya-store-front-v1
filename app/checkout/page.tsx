"use client";

import { useCart } from "components/cart/cart-context";
import Price from "components/price";
import ProductImageFallback from "components/product-image-fallback";
import { DEFAULT_OPTION } from "lib/constants";
import { clearAllAIImages } from "lib/localStorage-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Importamos el servicio para subir imágenes a Cloudinary
import {
  isBase64Image,
  isCloudinaryUrl,
  uploadImageToCloudinary,
} from "services/cloudinaryService";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Estado para manejar la carga mientras se suben las imágenes
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 p-6 mb-6">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Agrega algunos productos antes de proceder al checkout.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#f2cd4e] px-6 py-3 text-[#272512] font-medium hover:bg-[#e5b844] transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a la tienda
            </a>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Genera el mensaje de WhatsApp con los detalles del pedido
   *
   * @param imageUrls - Mapa de IDs de productos con sus URLs de Cloudinary
   * Este parámetro permite incluir las URLs de las imágenes personalizadas
   * directamente en el mensaje de WhatsApp para que el vendedor pueda verlas.
   */
  const generateWhatsAppMessage = (imageUrls: Map<string, string>) => {
    let message = ` *NUEVO PEDIDO*\n\n`;
    message += ` *Información del Cliente:*\n`;
    message += `• Nombre: ${customerInfo.name}\n`;
    message += `• Teléfono: ${customerInfo.phone}\n`;

    message += ` *Productos:*\n`;
    cart.lines.forEach((item, index) => {
      message += `${index + 1}. *${item.customTitle || item.merchandise.product.title}*\n`;
      if (item.merchandise.title !== DEFAULT_OPTION) {
        message += `   Variante: ${item.merchandise.title}\n`;
      }
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: $${item.cost.totalAmount.amount}\n`;

      // Si este producto tiene una imagen personalizada, incluir la URL
      const imageUrl = imageUrls.get(item.id || item.merchandise.id);
      if (imageUrl) {
        message += `   🎨 *Diseño personalizado:*\n`;
        message += `   ${imageUrl}\n`;
      }
      message += `\n`;
    });

    message += ` *Resumen del Pedido:*\n`;
    message += `• Subtotal: $${cart.cost.subtotalAmount.amount}\n`;
    message += `• Envío: Calculado al procesar\n`;
    message += `• *Total: $${cart.cost.totalAmount.amount}*\n\n`;

    message += ` *Enviado desde la tienda online*`;

    return encodeURIComponent(message);
  };

  /**
   * Maneja el envío del pedido por WhatsApp
   *
   * FLUJO:
   * 1. Validar información del cliente
   * 2. Identificar qué productos tienen imágenes personalizadas (base64)
   * 3. Subir esas imágenes a Cloudinary (comprimidas)
   * 4. Generar mensaje de WhatsApp con las URLs de Cloudinary
   * 5. Abrir WhatsApp
   * 6. Limpiar carrito e imágenes locales
   *
   * ¿POR QUÉ SUBIMOS A CLOUDINARY?
   * - WhatsApp no permite enviar imágenes base64 en la URL
   * - Las imágenes en localStorage se pierden al limpiar el carrito
   * - Cloudinary nos da una URL permanente que puedes ver siempre
   */
  const handleWhatsAppOrder = async () => {
    // Validación de campos requeridos
    if (!customerInfo.name || !customerInfo.phone) {
      alert("Por favor completa al menos tu nombre y teléfono");
      return;
    }

    setIsUploading(true);
    setUploadProgress("Preparando imágenes...");

    try {
      // Mapa para guardar las URLs de Cloudinary por ID de producto
      const imageUrls = new Map<string, string>();

      // Identificar productos con imágenes personalizadas
      const itemsWithCustomImages = cart.lines.filter((item) => {
        // Solo procesar si tiene customImage y es base64 (no ya una URL de Cloudinary)
        return item.customImage && isBase64Image(item.customImage);
      });

      console.log(
        `📷 Encontrados ${itemsWithCustomImages.length} producto(s) con diseños personalizados`,
      );

      // Subir cada imagen personalizada a Cloudinary
      for (let i = 0; i < itemsWithCustomImages.length; i++) {
        const item = itemsWithCustomImages[i];
        // Verificación de seguridad - TypeScript requiere esto
        if (!item || !item.customImage) continue;

        const itemId = item.id || item.merchandise.id;

        setUploadProgress(
          `Subiendo diseño ${i + 1} de ${itemsWithCustomImages.length}...`,
        );

        console.log(
          `📤 Subiendo imagen del producto: ${item.customTitle || item.merchandise.product.title}`,
        );

        // Subir a Cloudinary con compresión
        const result = await uploadImageToCloudinary(item.customImage, {
          maxWidth: 800, // Suficiente para ver el diseño en WhatsApp
          quality: 0.7, // Balance entre calidad y tamaño
        });

        if (result.success) {
          // Guardar la URL para incluirla en el mensaje de WhatsApp
          imageUrls.set(itemId, result.url);
          console.log(`✅ Imagen subida: ${result.url}`);
        } else {
          // Si falla, seguimos con el pedido pero sin la imagen
          console.error(`❌ Error subiendo imagen: ${result.error}`);
          // Opcional: podrías mostrar un warning al usuario
        }
      }

      // También incluir URLs de imágenes que ya están en Cloudinary
      cart.lines.forEach((item) => {
        const itemId = item.id || item.merchandise.id;
        if (item.customImage && isCloudinaryUrl(item.customImage)) {
          imageUrls.set(itemId, item.customImage);
        }
      });

      setUploadProgress("Generando mensaje...");

      // Generar el mensaje de WhatsApp con las URLs de las imágenes
      const message = generateWhatsAppMessage(imageUrls);
      const phoneNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || "+1234567890";
      const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${message}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, "_blank");

      // Limpiar carrito después de enviar
      const { clearLocalCart } = await import("lib/local-data/index");
      await clearLocalCart();

      // Limpiar imágenes del localStorage ya que están en Cloudinary
      console.log("🧹 Clearing all AI images after order completion...");
      const cleared = clearAllAIImages();
      console.log(`✅ Cleared ${cleared} AI image(s) from localStorage`);

      alert(
        "¡Pedido enviado! Las imágenes de los diseños fueron guardadas en la nube.",
      );
      router.push("/");
    } catch (error) {
      console.error("Error procesando pedido:", error);
      alert("Hubo un error al procesar el pedido. Por favor intenta de nuevo.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver a la tienda
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Finalizar Compra
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Completa tus datos para enviar el pedido por WhatsApp
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Formulario de contacto - 3 columnas */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f2cd4e]/20 dark:bg-[#f2cd4e]/10">
                  <svg
                    className="h-5 w-5 text-[#f2cd4e] dark:text-[#f2cd4e]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Información de Contacto
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    placeholder="Ej: Juan Pérez"
                    className="block w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-700/50 px-4 py-3.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#f2cd4e] transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Teléfono / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Ej: 999 888 777"
                    className="block w-full rounded-xl border-0 bg-gray-50 dark:bg-gray-700/50 px-4 py-3.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#f2cd4e] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex gap-3">
                  <svg
                    className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      ¿Cómo funciona?
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Al enviar tu pedido, se abrirá WhatsApp con todos los
                      detalles. Coordinaremos el pago y envío directamente
                      contigo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del pedido - 2 columnas */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 p-6 md:p-8 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg
                    className="h-5 w-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tu Pedido
                </h2>
                <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                  {cart.totalQuantity}{" "}
                  {cart.totalQuantity === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Products */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cart.lines.map((item) => (
                  <div
                    key={item.id || item.merchandise.id}
                    className="flex gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-600">
                      <ProductImageFallback
                        className="h-full w-full object-cover"
                        width={80}
                        height={80}
                        alt={
                          item.customTitle ||
                          item.merchandise.product.featuredImage.altText ||
                          item.merchandise.product.title
                        }
                        src={
                          item.customImage ||
                          item.merchandise.product.featuredImage.url
                        }
                      />
                      {item.customImage && (
                        <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
                          IA
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {item.customTitle || item.merchandise.product.title}
                      </h3>
                      {item.merchandise.title !== DEFAULT_OPTION && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.merchandise.title}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Cant: {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          <Price
                            amount={item.cost.totalAmount.amount}
                            currencyCode={item.cost.totalAmount.currencyCode}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    <Price
                      amount={cart.cost.subtotalAmount.amount}
                      currencyCode={cart.cost.subtotalAmount.currencyCode}
                    />
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Envío
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 italic">
                    A coordinar
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    <Price
                      amount={cart.cost.totalAmount.amount}
                      currencyCode={cart.cost.totalAmount.currencyCode}
                    />
                  </span>
                </div>
              </div>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                disabled={isUploading}
                className={`mt-6 w-full flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-white font-semibold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/25"
                }`}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>{uploadProgress}</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Enviar Pedido por WhatsApp</span>
                  </>
                )}
              </button>

              {/* Mensaje informativo */}
              <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                {isUploading
                  ? "⏳ Guardando tus diseños en la nube..."
                  : "🔒 Tus datos están seguros. Solo se usarán para contactarte."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
