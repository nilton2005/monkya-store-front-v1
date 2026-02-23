"use client";

import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "lib/shopify/types";
import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic,
} from "react";

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { lineId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: {
        variant: ProductVariant;
        product: Product;
        customImage?: string;
        customTitle?: string;
      };
    };

type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to safely get item from localStorage
function safeGetLocalStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage?.getItem?.(key) ?? null;
  } catch {
    return null;
  }
}

// Helper function to enrich cart items with images from localStorage
function enrichCartWithLocalImages(cart: Cart | undefined): Cart | undefined {
  if (!cart || typeof window === "undefined") return cart;

  const enrichedLines = cart.lines.map((line) => {
    if (line.customImageRef) {
      try {
        const storedImage = safeGetLocalStorageItem(line.customImageRef);
        if (storedImage) {
          return { ...line, customImage: storedImage };
        }
      } catch (error) {
        console.error("Failed to retrieve image from localStorage:", error);
      }
    }
    return line;
  });

  return { ...cart, lines: enrichedLines };
}

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
  customImage?: string,
  customTitle?: string,
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
    customImage,
    customTitle,
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "PEN";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "PEN" },
      totalAmount: { amount: "0", currencyCode: "PEN" },
      totalTaxAmount: { amount: "0", currencyCode: "PEN" },
    },
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { lineId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.id === lineId ? updateCartItem(item, updateType) : item,
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product, customImage, customTitle } = action.payload;
      // Only merge if no custom image is present. Custom items are unique.
      const existingItem = currentCart.lines.find(
        (item) =>
          item.merchandise.id === variant.id &&
          !item.customImage &&
          !customImage,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
        customImage,
        customTitle,
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id && !item.customImage
              ? updatedItem
              : item,
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  return (
    <CartContext.Provider value={{ cartPromise }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const serverCart = use(context.cartPromise);

  // Enrich cart with localStorage images using useMemo to prevent infinite loops
  const enrichedCart = useMemo(() => {
    return enrichCartWithLocalImages(serverCart);
  }, [serverCart]);

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    enrichedCart,
    cartReducer,
  );

  const updateCartItem = (lineId: string, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { lineId, updateType },
    });
  };

  const addCartItem = (
    variant: ProductVariant,
    product: Product,
    customImage?: string,
    customTitle?: string,
  ) => {
    updateOptimisticCart({
      type: "ADD_ITEM",
      payload: { variant, product, customImage, customTitle },
    });
  };

  return useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart],
  );
}
