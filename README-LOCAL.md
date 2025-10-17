# 🛒 T-Shirt Store Local

Un sistema de comercio electrónico local construido con Next.js App Router, completamente desconectado de servicios externos como Shopify.

## ✨ Características

- 🎯 **Sistema Local**: Sin dependencias de servicios externos
- 🛒 **Carrito de Compras**: Funcionalidad completa de carrito en memoria
- 📱 **Checkout por WhatsApp**: Los pedidos se envían directamente por WhatsApp
- 🎨 **Diseño Moderno**: Interfaz responsive con Tailwind CSS
- 🌙 **Modo Oscuro**: Soporte para tema claro y oscuro
- 📦 **Productos Locales**: Datos de productos gestionados localmente

## 🚀 Configuración Rápida

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Configurar WhatsApp:**
   Edita el archivo `.env` y cambia el número de WhatsApp:
   ```
   NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER="+tu_numero_de_whatsapp"
   ```

3. **Ejecutar el servidor:**
   ```bash
   pnpm dev
   ```

4. **¡Listo!** Ve a [http://localhost:3000](http://localhost:3000)

## 📱 Configuración de WhatsApp

Para recibir pedidos por WhatsApp:

1. Abre el archivo `.env`
2. Cambia `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER` por tu número real
3. Asegúrate de incluir el código de país (ej: `+52` para México)
4. Ejemplo: `NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER="+5215551234567"`

## 🛍️ Flujo de Compra

1. **Navegar productos**: Los usuarios pueden ver T-shirts y Hoodies
2. **Agregar al carrito**: Seleccionar talla y añadir productos
3. **Ver carrito**: Revisar productos y cantidades
4. **Checkout**: Llenar información de contacto
5. **Enviar por WhatsApp**: El pedido se envía automáticamente por WhatsApp

## 🎯 Estructura del Proyecto

```
├── lib/
│   ├── local-data/          # Datos locales de productos
│   │   ├── products.ts      # Catálogo de productos
│   │   └── index.ts         # Funciones del carrito local
│   └── local-shopify/       # Reemplazo del sistema Shopify
│       └── index.ts         # API local compatible
├── app/
│   ├── checkout/            # Página de checkout personalizada
│   │   └── page.tsx
│   └── ...                  # Otras páginas del sitio
└── components/              # Componentes reutilizables
```

## 🔧 Personalización

### Agregar Productos

Edita `lib/local-data/products.ts`:

```typescript
export const localProducts: Product[] = [
  {
    id: 'gid://product/nuevo',
    handle: 'producto-nuevo',
    title: 'Producto Nuevo',
    description: 'Descripción del producto...',
    // ... más propiedades
  }
];
```

### Personalizar Mensaje de WhatsApp

En `app/checkout/page.tsx`, modifica la función `generateWhatsAppMessage()`:

```typescript
const generateWhatsAppMessage = () => {
  let message = `🛒 *MI TIENDA PERSONALIZADA*\n\n`;
  // ... personalizar mensaje
  return encodeURIComponent(message);
};
```

### Cambiar Colecciones

Edita las colecciones en `lib/local-data/products.ts`:

```typescript
export const localCollections: Collection[] = [
  {
    handle: 'nueva-coleccion',
    title: 'Nueva Colección',
    description: 'Descripción...',
    // ...
  }
];
```

## 🌟 Características del Sistema Local

- **Sin API Externa**: Todo funciona sin conexión a internet (excepto WhatsApp)
- **Datos en Memoria**: Los productos y carrito se manejan en memoria del cliente
- **Imágenes Placeholder**: Imágenes SVG generadas automáticamente
- **Cache Inteligente**: Sistema de cache compatible con Next.js App Router

## 📞 Soporte

Para preguntas o soporte, contacta por WhatsApp al número configurado en el checkout.

## 🔄 Migración desde Shopify

Este proyecto originalmente usaba Shopify pero ahora es completamente local. Si quieres volver a usar Shopify, simplemente cambia las importaciones en los archivos de:

```typescript
import { ... } from 'lib/local-shopify';
```

a:

```typescript
import { ... } from 'lib/shopify';
```

## 🎨 Temas y Estilos

El proyecto usa Tailwind CSS con soporte para modo oscuro. Los estilos se adaptan automáticamente al tema del sistema del usuario.

---

**¡Disfruta vendiendo con tu nueva tienda local! 🎉**