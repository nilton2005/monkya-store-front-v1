'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function CarouselClient({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full overflow-x-auto pb-6 pt-1"
    >
      {children}
    </motion.div>
  );
}
