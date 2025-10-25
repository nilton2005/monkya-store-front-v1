'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScaleIn({ children, delay = 0, className = '' }: ScaleInProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.25, 0, 1]
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
