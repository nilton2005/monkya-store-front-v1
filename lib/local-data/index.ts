import { Cart, Collection, Menu, Product } from '../shopify/types';
import { localCollections, localMenu, localProducts } from './products';

// Cart local storage
let localCart: Cart | null = null;

// Helper function to generate a random ID
function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create a new empty cart
export async function createLocalCart(): Promise<Cart> {
  const cart: Cart = {
    id: generateId(),
    checkoutUrl: '',
    cost: {
      subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
      totalAmount: { amount: '0.00', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0.00', currencyCode: 'USD' }
    },
    lines: [],
    totalQuantity: 0
  };
  
  localCart = cart;
  return cart;
}

// Add item to cart
export async function addToLocalCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
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
  return localCart;
}

// Remove item from cart
export async function removeFromLocalCart(lineIds: string[]): Promise<Cart> {
  if (!localCart) {
    localCart = await createLocalCart();
  }

  localCart.lines = localCart.lines.filter(line => !lineIds.includes(line.id || ''));
  updateCartTotals();
  return localCart;
}

// Update cart item quantity
export async function updateLocalCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
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
  return localCart;
}

// Get current cart
export async function getLocalCart(): Promise<Cart | undefined> {
  return localCart || undefined;
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

// Get collection products
export async function getLocalCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  if (collection === '' || collection === 'all') {
    return getLocalProducts({ reverse, sortKey });
  }

  let products = localProducts.filter(product => {
    if (collection === 't-shirts') {
      return product.tags.includes('camiseta');
    }
    if (collection === 'hoodies') {
      return product.tags.includes('hoodie');
    }
    return false;
  });

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