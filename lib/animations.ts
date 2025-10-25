// Configuración global de animaciones
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.25, 0, 1] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 }
};

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.4, ease: [0.25, 0.25, 0, 1] }
};

export const slideInLeft = {
  initial: { x: -50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

export const slideInRight = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.25, 0, 1]
    }
  }
};

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const tapScale = {
  scale: 0.95
};

export const springTransition = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 25
};
