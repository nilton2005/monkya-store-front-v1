# 🚀 Sistema Automático de Productos

## ✨ ¡Ahora es súper fácil agregar productos!

Solo tienes que editar **UN archivo** y todo se organizará automáticamente:

📁 `lib/local-data/simple-products.ts`

## 🎯 Cómo agregar un producto nuevo

### 1. Abre el archivo `simple-products.ts`

### 2. Agrega tu producto al array `PRODUCTOS`:

```typescript
{
  title: 'Mi Nuevo Producto',
  description: 'Descripción detallada del producto...',
  basePrice: 25,                    // Precio base en PEN
  category: 'camiseta',             // Categoría (ver opciones abajo)
  colors: [
    { name: 'Rojo', code: '#FF0000' },
    { name: 'Azul', code: '#0000FF' }
  ]
}
```

### 3. ¡Listo! 🎉

**El sistema automáticamente:**
- ✅ Crea todas las variantes (tallas + colores)
- ✅ Calcula precios por talla
- ✅ Genera URLs e IDs únicos
- ✅ Agrega a las categorías correctas
- ✅ Actualiza el menú de navegación
- ✅ Crea imágenes placeholder
- ✅ Configura SEO automáticamente

## 📋 Categorías disponibles

```typescript
'camiseta'    // 👕 Se va a: /search/camiseta
'hoodie'      // 🧥 Se va a: /search/hoodie  
'pantalon'    // 👖 Se va a: /search/pantalon
'zapatos'     // 👟 Se va a: /search/zapatos
'accesorios'  // 🎒 Se va a: /search/accesorios
```

## 🎨 Ejemplo completo

```typescript
{
  title: 'Camiseta Deportiva Pro',
  description: 'Camiseta técnica para deportes con tecnología anti-sudor.',
  basePrice: 35,
  category: 'camiseta',
  colors: [
    { name: 'Negro', code: '#000000' },
    { name: 'Blanco', code: '#FFFFFF' },
    { name: 'Azul Real', code: '#0066CC' }
  ],
  sizes: ['S', 'M', 'L', 'XL'],      // Opcional: tallas personalizadas
  tags: ['deportivo', 'técnico'],     // Opcional: tags extra
  colorUpcharge: { 'Azul Real': 5 },  // Opcional: $5 extra por azul
  sizeUpcharge: 3                     // Opcional: $3 extra por tallas L+
}
```

## 🔧 Configuraciones avanzadas

### Precios por talla
```typescript
// En STORE_CONFIG
sizePricing: {
  'S': 0,    // Sin costo extra
  'M': 2,    // +$2
  'L': 5,    // +$5
  'XL': 8,   // +$8
  'XXL': 12  // +$12
}
```

### Agregar nueva categoría
```typescript
// En CATEGORY_CONFIG
nuevacategoria: {
  displayName: 'Nueva Categoría',
  description: 'Descripción de la categoría',
  defaultTags: ['tag1', 'tag2'],
  icon: '🆕'
}
```

## 📊 Ver estadísticas automáticas

Agrega esto en cualquier componente:

```typescript
import { getStoreStats } from 'lib/local-data/products';

const stats = getStoreStats();
console.log(stats);
// {
//   totalProducts: 4,
//   totalVariants: 24,
//   totalCategories: 2,
//   categories: [
//     { name: 'Camisetas', count: 2, icon: '👕' },
//     { name: 'Hoodies', count: 2, icon: '🧥' }
//   ],
//   priceRange: { min: 20, max: 68 }
// }
```

## 🎯 Ejemplos de productos que puedes agregar

### Pantalones
```typescript
{
  title: 'Jeans Clásicos',
  description: 'Jeans de corte clásico con tela premium.',
  basePrice: 60,
  category: 'pantalon',
  colors: [
    { name: 'Azul Oscuro', code: '#1a1a2e' },
    { name: 'Negro', code: '#000000' }
  ],
  sizes: ['28', '30', '32', '34', '36']
}
```

### Zapatos
```typescript
{
  title: 'Sneakers Urbanos',
  description: 'Zapatillas cómodas para uso diario.',
  basePrice: 80,
  category: 'zapatos',
  colors: [
    { name: 'Blanco', code: '#FFFFFF' },
    { name: 'Negro', code: '#000000' }
  ],
  sizes: ['38', '39', '40', '41', '42', '43']
}
```

### Accesorios
```typescript
{
  title: 'Gorra Snapback',
  description: 'Gorra ajustable con visera plana.',
  basePrice: 25,
  category: 'accesorios',
  colors: [
    { name: 'Negro', code: '#000000' },
    { name: 'Rojo', code: '#FF0000' }
  ],
  sizes: ['Única']  // Talla única
}
```

## 🔄 ¿Cómo funciona internamente?

1. **Lees tu producto simple** del archivo `simple-products.ts`
2. **El generador automático** (`auto-generator.ts`) convierte cada producto en:
   - ✅ Todas las variantes (talla x color)
   - ✅ Precios calculados automáticamente
   - ✅ IDs únicos generados
   - ✅ URLs de imágenes placeholder
   - ✅ SEO optimizado
3. **El sistema de colecciones** se actualiza automáticamente
4. **El menú de navegación** se regenera con las nuevas categorías

## 🎨 Personalizar imágenes

### Opción 1: Usar imágenes reales
```typescript
{
  title: 'Mi Producto',
  // ... otros campos
  images: {
    front: '/images/mi-producto-frente.jpg',
    back: '/images/mi-producto-atras.jpg'
  }
}
```

### Opción 2: Las placeholder se generan automáticamente
- `/placeholder-camiseta-rojo.jpg`
- `/placeholder-hoodie-negro.jpg` 
- `/placeholder-pantalon-azul.jpg`

## 🚀 ¡Resultado final!

**Antes:** Tenías que editar 5+ archivos para agregar un producto

**Ahora:** Solo editas 1 archivo y todo se organiza automáticamente:
- ✅ Producto aparece en la tienda
- ✅ Se agrega a la categoría correcta  
- ✅ Aparece en el menú de navegación
- ✅ Todas las variantes funcionan
- ✅ Precios calculados automáticamente
- ✅ SEO configurado
- ✅ URLs generadas

---

**¡Agrega tantos productos como quieras editando solo `simple-products.ts`! 🎉**