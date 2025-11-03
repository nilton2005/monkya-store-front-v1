'use client';

import { useCart } from 'components/cart/cart-context';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import ProductImageFallback from 'components/product-image-fallback';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="mb-4 text-2xl font-bold">Tu carrito está vacío</h1>
          <p className="text-neutral-500">Agrega algunos productos antes de proceder al checkout.</p>
        </div>
      </div>
    );
  }

  const generateWhatsAppMessage = () => {
    let message = ` *NUEVO PEDIDO*\n\n`;
    message += ` *Información del Cliente:*\n`;
    message += `• Nombre: ${customerInfo.name}\n`;
    message += `• Teléfono: ${customerInfo.phone}\n`;
    message += `• Email: ${customerInfo.email}\n`;
    message += `• Dirección: ${customerInfo.address}\n\n`;
    
    message += ` *Productos:*\n`;
    cart.lines.forEach((item, index) => {
      message += `${index + 1}. *${item.merchandise.product.title}*\n`;
      if (item.merchandise.title !== DEFAULT_OPTION) {
        message += `   Variante: ${item.merchandise.title}\n`;
      }
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: $${item.cost.totalAmount.amount}\n\n`;
    });

    message += ` *Resumen del Pedido:*\n`;
    message += `• Subtotal: $${cart.cost.subtotalAmount.amount}\n`;
    message += `• Envío: Calculado al procesar\n`;
    message += `• *Total: $${cart.cost.totalAmount.amount}*\n\n`;
    
    message += ` *Enviado desde la tienda online*`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Por favor completa al menos tu nombre y teléfono');
      return;
    }

    const message = generateWhatsAppMessage();
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '+1234567890';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="pb-20 pt-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Customer Information */}
            <div className="order-2 lg:order-1">
              <h2 className="mb-4 text-xl font-semibold">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dirección de entrega
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
                  {cart.lines.map((item, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-300 bg-gray-300 dark:border-gray-600 dark:bg-gray-700">
                        <ProductImageFallback
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                          alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title}
                          src={item.merchandise.product.featuredImage.url}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.merchandise.product.title}</h3>
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
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <Price
                      amount={cart.cost.subtotalAmount.amount}
                      currencyCode={cart.cost.subtotalAmount.currencyCode}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Envío</span>
                    <span className="text-gray-600 dark:text-gray-400">Calculado al procesar</span>
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
                  className="mt-6 w-full rounded-md bg-green-600 px-4 py-3 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  🛒 Enviar Pedido por WhatsApp
                </button>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Al hacer clic, se abrirá WhatsApp con los detalles de tu pedido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}