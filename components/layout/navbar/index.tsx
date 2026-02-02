"use client";

import { AIDesignButton } from "components/ai-design/ai-button";
import CartModal from "components/cart/modal";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { animate } from "animejs";
import bannerMonkya from "../../../assets/bannerMonkya2.webp";
import { cn } from "utils/cn";
import { LoginButton } from "./login-button";
import NavbarClient from "./navbar-client";
import { NavigationLinks } from "./navigation-links";
import { MobileMenu } from "./mobile-menu";

/**
 * Navbar Principal - Diseño actualizado
 *
 * Características:
 * - Logo con imagen
 * - Links de navegación centrados con hover animado
 * - Imagen animada dentro de cada link al hacer hover
 * - Navbar se expande automáticamente por flex al aparecer la imagen
 */
export function Navbar() {

  return (
    <NavbarClient>
      <nav
        className="relative flex flex-col justify-center px-6 lg:px-8 py-4 transition-all duration-400 ease-out"
      >
        <div className="flex items-center justify-between">
          {/* Logo - Izquierda */}
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center gap-2"
              aria-label="Monkya - Ir a inicio"
            >
              <div className="relative h-10 w-auto">
                <Image
                  src={bannerMonkya}
                  alt="Monkya Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
            </a>
          </div>

          {/* Links de Navegación - Centro */}
          <div className="hidden md:flex">
            <NavigationLinks />
          </div>

          {/* Acciones - Derecha */}
          <div className="flex items-center gap-3">
            <AIDesignButton />
            <LoginButton />
            <CartModal />
          </div>

          {/* Menú Móvil */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </nav>
    </NavbarClient>
  );
}
