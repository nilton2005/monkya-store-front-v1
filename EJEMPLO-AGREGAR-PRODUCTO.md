# 🧪 Prueba: Agregar Producto Nuevo

## Vamos a agregar unos pantalones para demostrar el sistema automático

### 1. Abre `lib/local-data/simple-products.ts`

### 2. Agrega este producto al final del array `PRODUCTOS`:

```typescript
{
  title: 'Jeans Premium',
  description: 'Jeans de corte moderno con tela premium y acabados de alta calidad. Perfectos para cualquier ocasión.',
  basePrice: 65,
  category: 'pantalon',
  colors: [
    { name: 'Azul Oscuro', code: '#1a1a2e' },
    { name: 'Negro', code: '#000000' },
    { name: 'Gris Carbón', code: '#36454F' }
  ],
  sizes: ['28', '30', '32', '34', '36', '38'],
  tags: ['premium', 'moderno', 'versátil'],
  colorUpcharge: { 'Gris Carbón': 8 },
  sizeUpcharge: 5
}
```

### 3. Guarda el archivo

### 4. ¡Observa la magia! ✨

**Automáticamente se creará:**

- ✅ **18 variantes** (6 tallas × 3 colores)
- ✅ **Nueva categoría** "Pantalones" en el menú
- ✅ **Nueva URL** `/search/pantalon`
- ✅ **Precios calculados:**
  - Talla 28: $65 (base)
  - Talla 30: $67 (base + $2)
  - Talla 32: $70 (base + $5)
  - Y así sucesivamente...
  - Color Gris Carbón: +$8 extra
- ✅ **SEO optimizado** automáticamente
- ✅ **Imágenes placeholder** generadas

### 5. Navega a tu tienda

- Ve a: http://localhost:3000
- Verás "👖 Pantalones" en el menú
- Click en la categoría
- ¡Tu nuevo producto estará ahí!

### 6. Prueba agregar al carrito

- Selecciona talla y color
- Agrega al carrito
- Ve al checkout
- ¡El producto aparecerá en el mensaje de WhatsApp!

## 🎯 Resultado esperado

### En el menú verás:
```
🏠 Todos
👕 Camisetas  
🧥 Hoodies
👖 Pantalones  ← ¡NUEVO!
```

### En `/search/pantalon` verás:
- Jeans Premium
- Con todas las variantes de talla y color
- Precios desde $65 hasta $78 (talla 38 + color gris)

### En el carrito:
```
🛒 NUEVO PEDIDO

📦 Productos:
1. Jeans Premium
   Variante: 32 / Gris Carbón
   Cantidad: 1  
   Precio: $78.00
```

## 🚀 ¡Agrega más productos!

Prueba agregar estos también:

### Zapatos
```typescript
{
  title: 'Sneakers Deportivos',
  description: 'Zapatillas deportivas con tecnología de amortiguación avanzada.',
  basePrice: 85,
  category: 'zapatos',
  colors: [
    { name: 'Blanco', code: '#FFFFFF' },
    { name: 'Negro', code: '#000000' },
    { name: 'Azul Royal', code: '#4169E1' }
  ],
  sizes: ['38', '39', '40', '41', '42', '43', '44'],
  tags: ['deportivo', 'cómodo', 'tecnología'],
  colorUpcharge: { 'Azul Royal': 10 }
}
```

### Accesorios
```typescript
{
  title: 'Mochila Urbana',
  description: 'Mochila resistente con múltiples compartimentos y diseño moderno.',
  basePrice: 45,
  category: 'accesorios',
  colors: [
    { name: 'Negro', code: '#000000' },
    { name: 'Gris', code: '#808080' },
    { name: 'Azul Marino', code: '#000080' }
  ],
  sizes: ['Única'],
  tags: ['urbano', 'resistente', 'práctico']
}
```

## 📊 Ver estadísticas

Después de agregar productos, las estadísticas se actualizarán automáticamente:

```typescript
// En cualquier componente
import { getStoreStats } from 'lib/local-data/products';

const stats = getStoreStats();
console.log(stats);
// Mostrará: 7 productos, 5 categorías, etc.
```

---

**¡Con solo editar un archivo tienes una tienda completa! 🎉**