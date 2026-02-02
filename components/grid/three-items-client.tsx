'use client';

import { GridTileImage } from 'components/grid/tile';
import { motion } from 'framer-motion';
import LogoIcon from 'components/icons/logo';
import type { Product } from 'lib/shopify/types';
import Link from 'next/link';

function ThreeItemGridItem({
  item,
  size,
  priority,
  index
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.25, 0, 1]
      }}
      whileHover={{ scale: 1.02 }}
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </motion.div>
  );
}

export default function ThreeItemGridClient({
  firstProduct,
  secondProduct,
  thirdProduct
}: {
  firstProduct: Product;
  secondProduct: Product;
  thirdProduct: Product;
}) {
  return (
    <div className="w-full">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-8 px-4"
      >
        {/* Logo y título */}
        <div className="flex items-center gap-3 mb-2">
          <LogoIcon className="w-10 h-10 text-[--color-monkya-yellow]" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-200">
            Productos
          </h2>
        </div>

        {/* Subtítulo */}
        <p className="text-slate-400 text-sm md:text-base text-center max-w-md">
          Camisetas, Hoodies y accesorios exclusivos
        </p>
      </motion.header>

      {/* Grid de productos */}
      <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
        <ThreeItemGridItem size="full" item={firstProduct} priority={true} index={0} />
        <ThreeItemGridItem size="half" item={secondProduct} priority={true} index={1} />
        <ThreeItemGridItem size="half" item={thirdProduct} index={2} />
      </section>
    </div>
  );
}