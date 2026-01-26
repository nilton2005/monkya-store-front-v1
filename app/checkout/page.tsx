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
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="mb-4 text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="text-neutral-500">
            Agrega algunos productos antes de proceder al checkout.
          </p>
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
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="pb-20 pt-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Customer Information */}
            <div className="order-2 lg:order-1">
              <h2 className="mb-4 text-xl font-semibold">
                Información de Contacto
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Teléfono *
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
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-1 lg:order-2">
              <h2 className="mb-4 text-xl font-semibold">Resumen del Pedido</h2>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                {/* Products */}
                <div className="space-y-4">
                  {cart.lines.map((item) => (
                    <div
                      key={item.id || item.merchandise.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-300 bg-gray-300 dark:border-gray-600 dark:bg-gray-700">
                        <ProductImageFallback
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
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
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {item.customTitle || item.merchandise.product.title}
                        </h3>
                        {item.merchandise.title !== DEFAULT_OPTION && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.merchandise.title}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <Price
                          amount={item.cost.totalAmount.amount}
                          currencyCode={item.cost.totalAmount.currencyCode}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <Price
                      amount={cart.cost.subtotalAmount.amount}
                      currencyCode={cart.cost.subtotalAmount.currencyCode}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Envío
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Calculado al procesar
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold dark:border-gray-600">
                    <span>Total</span>
                    <Price
                      amount={cart.cost.totalAmount.amount}
                      currencyCode={cart.cost.totalAmount.currencyCode}
                    />
                  </div>
                </div>

                {/* WhatsApp Order Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={isUploading}
                  className={`mt-6 w-full rounded-md px-4 py-3 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors ${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      {/* Spinner animado mientras sube */}
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
                      {uploadProgress}
                    </span>
                  ) : (
                    " Enviar Pedido por WhatsApp"
                  )}
                </button>

                {/* Mensaje informativo sobre las imágenes */}
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {isUploading
                    ? "⏳ Guardando tus diseños en la nube..."
                    : "Al hacer clic, tus diseños personalizados se guardarán y recibirás el enlace por WhatsApp"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
