'use client';

import { useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { cn } from 'utils/cn';
import { animate } from 'animejs';

interface LoginButtonProps {
  className?: string;
}

/**
 * Botón de Login / Perfil de usuario
 * Placeholder para futura funcionalidad de autenticación
 * Con animaciones anime.js y colores de marca Monkya
 */
export function LoginButton({ className }: LoginButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animación de entrada inicial
    if (buttonRef.current) {
      animate(buttonRef.current, {
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        ease: 'easeOutQuad',
      });
    }
  }, []);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: 1.05,
        duration: 200,
        ease: 'easeOutQuad',
      });
    }
    if (iconRef.current) {
      animate(iconRef.current, {
        rotate: '10deg',
        duration: 300,
        ease: 'easeOutQuad',
      });
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: 1,
        duration: 200,
        ease: 'easeOutQuad',
      });
    }
    if (iconRef.current) {
      animate(iconRef.current, {
        rotate: '0deg',
        duration: 300,
        ease: 'easeOutQuad',
      });
    }
  };

  const handleMouseDown = () => {
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: 0.95,
        duration: 100,
        ease: 'easeOutQuad',
      });
    }
  };

  const handleMouseUp = () => {
    if (buttonRef.current) {
      animate(buttonRef.current, {
        scale: 1.05,
        duration: 100,
        ease: 'easeOutQuad',
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      aria-label="Iniciar sesión"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(
        "group relative flex items-center gap-2 overflow-hidden rounded-lg px-4 py-2 text-sm font-medium",
        "text-neutral-600",
        "hover:text-[#272512]",
        "dark:text-neutral-400 dark:hover:text-[#f2cd4e]",
        className
      )}
      style={{
        backgroundColor: 'transparent',
      }}
    >
      {/* Fondo animado con color Monkya */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          backgroundColor: '#f2cd4e',
          transition: 'opacity 200ms ease',
        }}
      />

      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center gap-2">
        <User
          ref={iconRef}
          className="h-4 w-4 transition-colors duration-200"
          style={{
            color: 'currentColor',
          }}
        />
        <span className="hidden sm:inline">Login</span>
      </span>
    </button>
  );
}
