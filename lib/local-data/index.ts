import { Cart, Collection, Menu, Product } from '../shopify/types';
import { localCollections, localMenu, localProducts } from './auto-generator';


// car local storage KEY
const CART_STORAGE_KEY = 'monkya_cart';

// Cart local storage
let localCart: Cart | null = null;

function saveCartToStorage(cart: Cart){
  if(typeof window !== 'undefined'){
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)) ;
    } catch (error) {
      console.log('Erro guardando carrito: ', error)
    }
  }
}

// cargamos el carrito desde localStorage
function loadCartFromStorage(): Cart | null{
  if(typeof window !== 'undefined'){
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY); 
    } catch (error) {
      console.error('Error cargando carrito: ', error) 
    }
  }
  return null;
}

// limpiar el carrito de localstorage
function clearcartFromStorage(){
  if(typeof window !== 'undefined'){
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error limpiando carrito: ', error);
    }
  }
}



// Helper function to generate a random ID
function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}


// Create a new empty cart
export async function createLocalCart(): Promise<Cart> {
  const cart: Cart = {
    id: generateId(),
    checkoutUrl: '',
    cost: {
      subtotalAmount: { amount: '0.00', currencyCode: 'PEN' },
      totalAmount: { amount: '0.00', currencyCode: 'PEN' },
      totalTaxAmount: { amount: '0.00', currencyCode: 'PEN' }
    },
    lines: [],
    totalQuantity: 0
  };
  
  localCart = cart;
  saveCartToStorage(cart);
  return cart;
}

// Add item to cart
export async function addToLocalCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {

  if(!localCart){
    localCart = await createLocalCart();
  }

  if (!localCart) {
    localCart = await createLocalCart();
  }

  for (const line of lines) {
    const variant = findVariantById(line.merchandiseId);
    if (!variant) continue;

    const product = findProductByVariantId(line.merchandiseId);
    if (!product) continue;

    // Check if item already exists in cart
    const existingLineIndex = localCart.lines.findIndex(
      (cartLine) => cartLine.merchandise.id === line.merchandiseId
    );

    if (existingLineIndex >= 0) {
      // Update quantity
      const existingLine = localCart.lines[existingLineIndex];
      if (existingLine) {
        existingLine.quantity += line.quantity;
        existingLine.cost.totalAmount.amount = (
          parseFloat(existingLine.cost.totalAmount.amount) +
          parseFloat(variant.price.amount) * line.quantity
        ).toFixed(2);
      }
    } else {
      // Add new line
      const cartItem = {
        id: generateId(),
        quantity: line.quantity,
        cost: {
          totalAmount: {
            amount: (parseFloat(variant.price.amount) * line.quantity).toFixed(2),
            currencyCode: variant.price.currencyCode
          }
        },
        merchandise: {
          id: line.merchandiseId,
          title: variant.title,
          selectedOptions: variant.selectedOptions,
          product: {
            id: product.id,
            handle: product.handle,
            title: product.title,
            featuredImage: product.featuredImage
          }
        }
      };
      localCart.lines.push(cartItem);
    }
  }

  updateCartTotals();
  saveCartToStorage(localCart);
  return localCart;
}

// Remove item from cart
export async function removeFromLocalCart(lineIds: string[]): Promise<Cart> {
  if (!localCart) {
    localCart = await loadCartFromStorage();
  }
  if (!localCart) {
    localCart = await createLocalCart();
  }

  localCart.lines = localCart.lines.filter(line => !lineIds.includes(line.id || ''));
  updateCartTotals();
  saveCartToStorage(localCart);
  return localCart;
}

// limpiar el carrito despúes de hacer el pedido
export async function clearLocalCart(): Promise<Cart>{
  localCart = null;
  clearCartFromStorage();
  return createLocalCart();
}

// Update cart item quantity
export async function updateLocalCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  if (!localCart) {
    localCart = await loadCartFromStorage();
  }
  if (!localCart) {
    localCart = await createLocalCart();
  }

  for (const line of lines) {
    const lineIndex = localCart.lines.findIndex(cartLine => cartLine.id === line.id);
    if (lineIndex >= 0) {
      if (line.quantity <= 0) {
        localCart.lines.splice(lineIndex, 1);
      } else {
        const variant = findVariantById(line.merchandiseId);
        const cartLine = localCart.lines[lineIndex];
        if (variant && cartLine) {
          cartLine.quantity = line.quantity;
          cartLine.cost.totalAmount.amount = (
            parseFloat(variant.price.amount) * line.quantity
          ).toFixed(2);
        }
      }
    }
  }

  updateCartTotals();
  saveCartToStorage(localCart);
  return localCart;
}

// Get current cart
export async function getLocalCart(): Promise<Cart | undefined> {
  if (!localCart) {
    localCart = await loadCartFromStorage();
  }
  return localCart || undefined;
}

// limpiar carrito, es necesario despues de completar pedido
export async function clearCartFromStorage(): Promise<Cart> {
  localCart = null;
  clearCartFromStorage();
  return createLocalCart(); 
}

// Helper function to update cart totals
function updateCartTotals() {
  if (!localCart) return;

  let subtotal = 0;
  let totalQuantity = 0;

  for (const line of localCart.lines) {
    subtotal += parseFloat(line.cost.totalAmount.amount);
    totalQuantity += line.quantity;
  }

  localCart.cost.subtotalAmount.amount = subtotal.toFixed(2);
  localCart.cost.totalAmount.amount = subtotal.toFixed(2); // No taxes for now
  localCart.totalQuantity = totalQuantity;
}

// Helper function to find variant by ID
function findVariantById(variantId: string) {
  for (const product of localProducts) {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) return variant;
  }
  return null;
}

// Helper function to find product by variant ID
function findProductByVariantId(variantId: string) {
  for (const product of localProducts) {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) return product;
  }
  return null;
}

// Get all products
export async function getLocalProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
} = {}): Promise<Product[]> {
  let products = [...localProducts];

  // Filter by query
  if (query) {
    products = products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Sort products
  if (sortKey) {
    switch (sortKey) {
      case 'PRICE':
        products.sort((a, b) => {
          const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
          const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
          return reverse ? priceB - priceA : priceA - priceB;
        });
        break;
      case 'CREATED_AT':
        products.sort((a, b) => {
          const dateA = new Date(a.updatedAt);
          const dateB = new Date(b.updatedAt);
          return reverse ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        });
        break;
      case 'BEST_SELLING':
        // For now, just return in default order
        break;
      default:
        break;
    }
  }

  return products;
}

// Get single product
export async function getLocalProduct(handle: string): Promise<Product | undefined> {
  return localProducts.find(product => product.handle === handle);
}

// Get product recommendations
export async function getLocalProductRecommendations(productId: string): Promise<Product[]> {
  const currentProduct = localProducts.find(p => p.id === productId);
  if (!currentProduct) return [];

  // Return other products from same category (based on tags)
  return localProducts
    .filter(p => p.id !== productId)
    .filter(p => p.tags.some(tag => currentProduct.tags.includes(tag)))
    .slice(0, 4);
}

// Get collections
export async function getLocalCollections(): Promise<Collection[]> {
  return localCollections;
}

// Get single collection
export async function getLocalCollection(handle: string): Promise<Collection | undefined> {
  return localCollections.find(collection => collection.handle === handle);
}

// Get collection products - MEJORADO CON SISTEMA AUTOMÁTICO
export async function getLocalCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  console.log('🔍 Buscando colección:', collection);
  console.log('📦 Total productos disponibles:', localProducts.length);
  
  if (collection === '' || collection === 'all') {
    console.log('✅ Retornando todos los productos');
    return getLocalProducts({ reverse, sortKey });
  }

  // Filtrar productos por tags que incluyan el handle de la colección
  let products = localProducts.filter(product => {
    const hasTag = product.tags.some(tag => tag === collection);
    const inHandle = product.handle.includes(collection);
    
    console.log(`📌 Producto: ${product.title}`);
    console.log(`   Tags: ${product.tags.join(', ')}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   Match por tag: ${hasTag}, Match por handle: ${inHandle}`);
    
    return hasTag || inHandle;
  });
  
  console.log(`✨ Productos filtrados para "${collection}":`, products.length);

  // Apply sorting
  if (sortKey) {
    switch (sortKey) {
      case 'PRICE':
        products.sort((a, b) => {
          const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
          const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
          return reverse ? priceB - priceA : priceA - priceB;
        });
        break;
      case 'CREATED_AT':
        products.sort((a, b) => {
          const dateA = new Date(a.updatedAt);
          const dateB = new Date(b.updatedAt);
          return reverse ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        });
        break;
    }
  }

  return products;
}

// Get menu
export async function getLocalMenu(handle: string): Promise<Menu[]> {
  return localMenu;
}