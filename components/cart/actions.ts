'use server';

import { TAGS } from 'lib/constants';
import {
    addToCart,
    createCart,
    getCart,
    removeFromCart,
    updateCart
} from 'lib/local-shopify';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  formData: FormData
) {
  const selectedVariantId = formData.get('variantId') as string | null;
  const customImage = formData.get('customImage') as string | null;
  const customTitle = formData.get('customTitle') as string | null;

  console.log('🔥 Server Action addItem received:', {
    selectedVariantId,
    hasCustomImage: !!customImage,
    customImageLength: customImage?.length || 0,
    customTitle
  });

  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  // Validate image size (Next.js has a 4MB limit for Server Actions by default)
  if (customImage && customImage.length > 4 * 1024 * 1024) {
    console.error('❌ Image too large:', customImage.length, 'bytes');
    return 'Image is too large. Please use a smaller image.';
  }

  try {
    await addToCart([{ 
      merchandiseId: selectedVariantId, 
      quantity: 1,
      customImage: customImage || undefined,
      customTitle: customTitle || undefined
    }]);
    revalidateTag(TAGS.cart);
    console.log('✅ Item added to cart successfully');
  } catch (e) {
    console.error('❌ Error in addItem:', e);
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.id === lineId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    merchandiseId: string;
    quantity: number;
  }
) {
  const { lineId, merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.id === lineId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      // Note: This fallback might lose custom attributes if we are just re-adding by merchandiseId
      // But updateItemQuantity is usually called on existing items.
      await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  // Redirect to our custom checkout page instead of external service
  redirect('/checkout');
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  // For local system, we don't need to set a cookie since we use in-memory storage
}
