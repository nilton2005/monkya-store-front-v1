'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

export default function NavbarClient({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(8px)']
  );
  
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ['0 0 0 0 rgba(0,0,0,0)', '0 4px 6px -1px rgba(0,0,0,0.1)']
  );

  return (
    <motion.div
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        boxShadow
      }}
      className="sticky top-0 z-50 transition-colors dark:bg-black/95"
    >
      {children}
    </motion.div>
  );
}
