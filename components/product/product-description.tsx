'use client';

import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { motion } from 'framer-motion';
import { Product } from 'lib/shopify/types';
import { useAppStore } from 'storeIA/useAppStore';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product, isAIProduct }: { product: Product; isAIProduct?: boolean }) {
  const { finalProductTitle } = useAppStore();
  // Si tenemos un título personalizado (IA), lo usamos. Si no, usamos el del producto.
  // Pero SOLO si estamos en el producto "IA Generated" (para evitar cambiar títulos de otros productos si el store quedó sucio)
  const displayTitle = (isAIProduct && finalProductTitle) ? finalProductTitle : product.title;

  return (
    <>
      <motion.div 
        className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h1 
          className="mb-2 text-5xl font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {displayTitle}
        </motion.h1>
        <motion.div 
          className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <VariantSelector options={product.options} variants={product.variants} />
      </motion.div>
      {product.descriptionHtml ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Prose
            className="mb-6 text-sm leading-tight dark:text-white/[60%]"
            html={product.descriptionHtml}
          />
        </motion.div>
      ) : null}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <AddToCart product={product} isAIProduct={isAIProduct} />
      </motion.div>
    </>
  );
}
