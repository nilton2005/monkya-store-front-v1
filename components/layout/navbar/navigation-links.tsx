'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "utils/cn";
import { useRef, useEffect, useState } from "react";
import { animate, stagger } from "animejs";

export interface NavLink {
  title: string;
  path: string;
  ariaLabel?: string;
}

/**
 * Links de navegación principales del sitio
 */
export const navLinks: NavLink[] = [
  { title: "Home", path: "/", ariaLabel: "Ir a inicio" },
  { title: "Shop", path: "/store", ariaLabel: "Ir a tienda" },
  { title: "About Us", path: "/about", ariaLabel: "Sobre nosotros" },
  { title: "Blog", path: "/blog", ariaLabel: "Blog" },
  { title: "Contact Us", path: "/contact", ariaLabel: "Contacto" },
];

interface NavigationLinksProps {
  className?: string;
  linkClassName?: string;
}

/**
 * Componente individual de link con animación anime.js
 */
function AnimatedNavLink({
  link,
  className,
  isActive,
}: {
  link: NavLink;
  className?: string;
  isActive: boolean;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const animaRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(isActive);

  // Sincronizar visibilidad con isActive e isHovered
  useEffect(() => {
    setIsVisible(isActive || isHovered);
  }, [isActive, isHovered]);

  // Resetear isHovered cuando cambia la ruta (isActive cambia a false)
  useEffect(() => {
    if (!isActive && isHovered) {
      setIsHovered(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  }, [isActive]);

  useEffect(() => {
    // Animación de entrada inicial del link
    if (linkRef.current) {
      animate(linkRef.current, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 600,
        ease: 'easeOutQuad',
      });
    }
  }, []);

  // Animación de la imagen basada en visibilidad
  useEffect(() => {
    if (!animaRef.current) return;

    if (isVisible) {
      // Animación de entrada
      animate(animaRef.current, {
        opacity: [0, 1],
        translateX: [15, 0],
        scale: [0.5, 1],
        rotate: [0, 360],
        duration: 600,
        easing: "easeOutElastic(1, .6)",
      });
    } else {
      // Animación de salida
      animate(animaRef.current, {
        opacity: 0,
        translateX: 15,
        scale: 0.5,
        duration: 250,
        easing: "easeInQuad",
      });
    }
  }, [isVisible]);

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isActive) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 150);
    }
  };

  const shouldHighlight = isActive || isHovered;

  return (
    <li
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        ref={linkRef}
        href={link.path}
        prefetch={true}
        aria-label={link.ariaLabel}
        className={cn(
          "relative text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-colors duration-200",
          className
        )}
        style={{
          color: shouldHighlight ? '#f2cd4e' : undefined,
        }}
      >
        {link.title}
        <span
          className="absolute left-0 -bottom-1 h-px bg-[#f2cd4e] transition-all duration-300 ease-out"
          style={{
            width: shouldHighlight ? '100%' : '0%',
          }}
        />
      </Link>

      {/* Imagen animada dentro del flujo del li - aparece al hover o cuando está activo */}
      <div
        ref={animaRef}
        className="ml-2 flex items-center justify-center"
        style={{
          opacity: isVisible ? 1 : 0,
          height: isVisible ? 'auto' : 0,
          width: isVisible ? 'auto' : 0,
          overflow: 'hidden',
        }}
      >
        <Image
          src="/animaMonkya.webp"
          alt="Anima Monkya"
          width={32}
          height={32}
          className="h-8 w-auto object-contain drop-shadow-md"
        />
      </div>
    </li>
  );
}

/**
 * Componente de links de navegación con hover animado
 * Reutilizable en diferentes partes de la aplicación
 */
export function NavigationLinks({ className, linkClassName }: NavigationLinksProps) {
  const containerRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Animación de entrada escalonada para todos los links
    if (containerRef.current && containerRef.current.children) {
      animate(containerRef.current.children, {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(50),
        duration: 500,
        ease: 'easeOutQuad',
      });
    }
  }, []);

  return (
    <ul ref={containerRef} className={cn("flex items-center gap-6 text-sm font-medium", className)}>
      {navLinks.map((link) => (
        <AnimatedNavLink
          key={link.path}
          link={link}
          className={linkClassName}
          isActive={pathname === link.path}
        />
      ))}
    </ul>
  );
}
