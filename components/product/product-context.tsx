"use client";

import { Product } from "lib/shopify/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useMemo, useState } from "react";

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
  product: Product;
  isAIProduct?: boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({
  children,
  product,
  isAIProduct,
}: {
  children: React.ReactNode;
  product: Product;
  isAIProduct?: boolean;
}) {
  const searchParams = useSearchParams();

  // Encuentra la primera variante disponible que coincida con las opciones o el default.
  // Para productos de IA, busca específicamente la variante "blanco" disponible.
  const defaultVariant = useMemo(() => {
    if (isAIProduct) {
      // Para productos de IA, el color es fijo. Buscamos la primera variante "blanco" disponible.
      return product.variants.find(
        (variant) =>
          variant.availableForSale &&
          variant.selectedOptions.some(
            (opt) =>
              opt.name.toLowerCase() === "color" &&
              opt.value.toLowerCase() === "blanco",
          ),
      );
    }
    // Lógica original para productos normales
    return product.variants.find((variant) =>
      variant.selectedOptions.every((option) => {
        const urlValue = searchParams.get(option.name.toLowerCase());
        return urlValue ? urlValue === option.value : true;
      }),
    );
  }, [product.variants, searchParams, isAIProduct]);

  const [state, setState] = useState<ProductState>(() => {
    const initialState: ProductState = {};
    product.options.forEach((option) => {
      initialState[option.name.toLowerCase()] =
        defaultVariant?.selectedOptions.find(
          (o) => o.name.toLowerCase() === option.name.toLowerCase(),
        )?.value ||
        searchParams.get(option.name.toLowerCase()) ||
        option.values[0]!;
    });
    return initialState;
  });

  const updateOption = (name: string, value: string) => {
    const newState = { ...state, [name]: value };
    setState(newState);
    return newState;
  };

  const updateImage = (index: string) => {
    const newState = { image: index };
    setState(newState);
    return { ...state, ...newState };
  };

  const contextValue = useMemo(() => {
    return {
      state,
      updateOption,
      updateImage,
      product,
      isAIProduct,
    };
  }, [state, product, isAIProduct]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();
  const { state } = useProduct();
  const pathname = usePathname();

  return (newState: { [key: string]: string }) => {
    const newParams = new URLSearchParams();
    Object.entries(newState).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };
}
