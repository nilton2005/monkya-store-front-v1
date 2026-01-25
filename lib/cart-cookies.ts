'use server';

import { cookies } from 'next/headers';
import { Cart, CartItem } from './shopify/types';

const CART_COOKIE_NAME = 'cart';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Tipo simplificado para la cookie (sin imágenes grandes)
interface CookieCartItem {
  id?: string;
  merchandiseId: string;
  quantity: number;
  customImageRef?: string; // Solo referencia, no la imagen completa
  customTitle?: string;
}

interface CookieCart {
  items: CookieCartItem[];
}

// Generar ID único para items
function generateId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Leer carrito de la cookie
export async function getCartFromCookie(): Promise<CookieCart> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);
  
  if (!cartCookie?.value) {
    return { items: [] };
  }

  try {
    return JSON.parse(cartCookie.value);
  } catch (e) {
    console.error('Error parsing cart cookie:', e);
    return { items: [] };
  }
}

// Guardar carrito en la cookie
export async function saveCartToCookie(cart: CookieCart): Promise<void> {
  const cookieStore = await cookies();
  
  try {
    const cartJson = JSON.stringify(cart);
    
    // Verificar tamaño (las cookies tienen límite de ~4KB)
    if (cartJson.length > 4000) {
      console.warn('Cart cookie too large, trimming...');
      // En caso de exceder, podríamos limitar items o simplificar
    }
    
    cookieStore.set(CART_COOKIE_NAME, cartJson, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  } catch (e) {
    console.error('Error saving cart cookie:', e);
  }
}

// Agregar item al carrito
export async function addItemToCookie(
  merchandiseId: string,
  quantity: number,
  customImageRef?: string,
  customTitle?: string
): Promise<void> {
  const cart = await getCartFromCookie();
  
  // Buscar si el item ya existe (solo si no tiene customImageRef, porque productos IA son únicos)
  const existingIndex = customImageRef 
    ? -1 
    : cart.items.findIndex(item => item.merchandiseId === merchandiseId && !item.customImageRef);

  if (existingIndex >= 0) {
    // Incrementar cantidad
    cart.items[existingIndex]!.quantity += quantity;
  } else {
    // Agregar nuevo item
    cart.items.push({
      id: generateId(),
      merchandiseId,
      quantity,
      customImageRef,
      customTitle
    });
  }

  await saveCartToCookie(cart);
}

// Eliminar item del carrito
export async function removeItemFromCookie(itemId: string): Promise<void> {
  const cart = await getCartFromCookie();
  cart.items = cart.items.filter(item => item.id !== itemId);
  await saveCartToCookie(cart);
}

// Actualizar cantidad de item
export async function updateItemQuantityInCookie(
  itemId: string,
  quantity: number
): Promise<void> {
  const cart = await getCartFromCookie();
  
  if (quantity <= 0) {
    cart.items = cart.items.filter(item => item.id !== itemId);
  } else {
    const item = cart.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
    }
  }

  await saveCartToCookie(cart);
}

// Limpiar carrito
export async function clearCartCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}
