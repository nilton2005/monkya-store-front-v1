'use client';

import { useEffect, useRef } from 'react';
import { animate, AnimationParams, JSAnimation, stagger } from 'animejs';

/**
 * Hook personalizado para animaciones con anime.js v4
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useAnime(ref, {
 *   opacity: [0, 1],
 *   translateY: [20, 0],
 *   duration: 800,
 *   ease: 'easeOutQuad'
 * });
 * ```
 */
export function useAnime<T extends HTMLElement>(
  ref: React.RefObject<T>,
  animationParams: AnimationParams | (() => AnimationParams),
  deps: React.DependencyList = []
) {
  const animationRef = useRef<JSAnimation | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Limpiar animación previa si existe
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    // Obtener parámetros de animación
    const params = typeof animationParams === 'function' ? animationParams() : animationParams;

    // Crear nueva animación (anime.js v4 API: targets va como primer parámetro)
    animationRef.current = animate(ref.current, params);

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, deps);

  return { ref };
}

/**
 * Hook para animación de entrada (fade in + slide up)
 */
export function useFadeInUp<T extends HTMLElement>(
  ref: React.RefObject<T>,
  delay = 0,
  duration = 800
) {
  return useAnime(
    ref,
    {
      opacity: [0, 1],
      translateY: [20, 0],
      delay,
      duration,
      ease: 'easeOutQuad',
    },
    []
  );
}

/**
 * Hook para animación de hover con escala
 */
export function useHoverScale<T extends HTMLElement>(
  ref: React.RefObject<T>,
  scale = 1.05,
  duration = 300
) {
  const handleMouseEnter = () => {
    if (ref.current) {
      animate(ref.current, {
        scale,
        duration,
        ease: 'easeOutQuad',
      });
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      animate(ref.current, {
        scale: 1,
        duration,
        ease: 'easeOutQuad',
      });
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return { ref };
}

/**
 * Hook para animación de underline en hover
 */
export function useUnderlineHover<T extends HTMLElement>(
  ref: React.RefObject<T>,
  color = '#f2cd4e',
  duration = 300
) {
  const handleMouseEnter = () => {
    if (ref.current) {
      animate(ref.current, {
        width: '100%',
        duration,
        ease: 'easeOutQuad',
      });
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      animate(ref.current, {
        width: '0%',
        duration,
        ease: 'easeOutQuad',
      });
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return { ref };
}

/**
 * Hook para animación de entrada escalonada (stagger)
 */
export function useStaggerIn<T extends HTMLElement>(
  ref: React.RefObject<T>,
  itemSelector = '> *',
  staggerDelay = 100,
  duration = 600
) {
  useEffect(() => {
    if (!ref.current) return;

    const targets = ref.current.querySelectorAll(itemSelector);
    if (targets.length > 0) {
      animate(targets, {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(staggerDelay),
        duration,
        ease: 'easeOutQuad',
      });
    }
  }, []);

  return { ref };
}
