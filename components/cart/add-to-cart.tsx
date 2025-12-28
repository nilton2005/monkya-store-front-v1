'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { motion } from 'framer-motion';
import { Product, ProductVariant } from 'lib/shopify/types';
import { useActionState } from 'react';
import { useAppStore } from 'storeIA/useAppStore';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <motion.button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
      })}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </motion.button>
  );
}

export function AddToCart({ product, isAIProduct }: { product: Product; isAIProduct?: boolean }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const { finalProductImage, finalProductTitle } = useAppStore();
  const [message, formAction] = useActionState(addItem, null);

  // 🔍 DEBUG: Ver qué hay en el store
  console.log('🎨 AddToCart Debug:', {
    isAIProduct,
    hasFinalImage: !!finalProductImage,
    finalImageLength: finalProductImage?.length || 0,
    finalTitle: finalProductTitle
  });

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  
  // Bind custom data ONLY if it's the AI product
  const imageToSave = isAIProduct ? finalProductImage : undefined;
  const titleToSave = isAIProduct ? finalProductTitle : undefined;

  // If it's an AI product but we don't have the image (e.g. page refresh without persistence),
  // we shouldn't allow adding to cart as it would add the base product.
  const isMissingAIData = isAIProduct && !imageToSave;

  console.log('🛒 Cart Data:', {
    selectedVariantId,
    imageToSave: imageToSave ? 'YES (length: ' + imageToSave.length + ')' : 'NO',
    titleToSave,
    isMissingAIData
  });
  
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!;

  return (
    <form
      action={async (formData) => {
        if (isMissingAIData) {
          console.error('❌ Missing AI data - cannot add to cart');
          return;
        }
        
        // Add custom data to FormData
        formData.set('variantId', selectedVariantId || '');
        if (imageToSave) formData.set('customImage', imageToSave);
        if (titleToSave) formData.set('customTitle', titleToSave);
        
        console.log('✅ Adding to cart with:', {
          variantId: selectedVariantId,
          hasImage: !!imageToSave,
          imageLength: imageToSave?.length,
          hasTitle: !!titleToSave,
          formDataKeys: Array.from(formData.keys())
        });
        
        // First update optimistically without transition (form actions handle this automatically)
        addCartItem(finalVariant, product, imageToSave || undefined, titleToSave || undefined);
        
        // Then call server action
        await formAction(formData);
      }}
    >
      <SubmitButton
        availableForSale={availableForSale && !isMissingAIData}
        selectedVariantId={selectedVariantId}
      />
      {isMissingAIData && (
        <p className="mt-2 text-sm text-red-500">
          Please regenerate your design in the AI Editor.
        </p>
      )}
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
