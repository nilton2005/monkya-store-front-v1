'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import ProductImageFallback from 'components/product-image-fallback';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import { AnimatePresence, motion } from 'framer-motion';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {images[imageIndex] && (
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full"
            >
              <ProductImageFallback
                className="h-full w-full object-contain"
                width={550}
                height={550}
                alt={images[imageIndex]?.altText as string}
                src={images[imageIndex]?.src as string}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {images.length > 1 ? (
          <motion.div 
            className="absolute bottom-[15%] flex w-full justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80">
              <motion.button
                formAction={() => {
                  const newState = updateImage(previousImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Previous product image"
                className={buttonClassName}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeftIcon className="h-5" />
              </motion.button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <motion.button
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Next product image"
                className={buttonClassName}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowRightIcon className="h-5" />
              </motion.button>
            </div>
          </motion.div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <motion.ul 
          className="my-12 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <motion.li 
                key={image.src} 
                className="h-20 w-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
              >
                <motion.button
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateURL(newState);
                  }}
                  aria-label="Select product image"
                  className="h-full w-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>
      ) : null}
    </form>
  );
}
