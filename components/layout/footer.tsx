"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "./navbar/navigation-links";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.25, 0, 1],
    },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full bg-gradient-to-b from-[#1a1810] to-[#0d0c08] text-slate-300"
    >
      {/* Decorative top border with Monkya yellow accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[--color-monkya-yellow] to-transparent opacity-60" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Monkya - Ir a inicio"
            >
              <div className="relative h-12 w-auto overflow-hidden rounded-lg bg-gradient-to-br from-[--color-monkya-yellow]/20 to-transparent p-2 transition-all duration-300 group-hover:from-[--color-monkya-yellow]/30">
                <Image
                  src="/bannerMonkya.webp"
                  alt="Monkya Logo"
                  width={120}
                  height={48}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Diseños únicos generados con Inteligencia Artificial. Viste tu
              creatividad.
            </p>
          </motion.div>

          {/* Navigation Links Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-semibold text-[--color-monkya-yellow] uppercase tracking-wider text-sm">
              Navegación
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-slate-400 transition-all duration-200 hover:text-[--color-monkya-yellow] hover:pl-2 inline-block"
                    aria-label={link.ariaLabel}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-semibold text-[--color-monkya-yellow] uppercase tracking-wider text-sm">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:nilton2005marzo@gmail.com"
                  className="flex items-center gap-2 text-sm text-slate-400 transition-all duration-200 hover:text-[--color-monkya-yellow]"
                >
                  <Mail size={16} />
                  nilton2005marzo@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-sm text-slate-400 transition-all duration-200 hover:text-[--color-monkya-yellow]"
                >
                  <Phone size={16} />
                  +51 930 913 160
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social Links Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-semibold text-[--color-monkya-yellow] uppercase tracking-wider text-sm">
              Síguenos
            </h3>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/MonkyaStore/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/50 text-slate-400 transition-all duration-200 hover:bg-[--color-monkya-yellow] hover:text-[--color-monkya-dark] hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/monkya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/50 text-slate-400 transition-all duration-200 hover:bg-[--color-monkya-yellow] hover:text-[--color-monkya-dark] hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com/monkya"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/50 text-slate-400 transition-all duration-200 hover:bg-[--color-monkya-yellow] hover:text-[--color-monkya-dark] hover:scale-110"
              >
                <Youtube size={18} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-12 border-t border-slate-800 pt-8"
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-500">
              &copy; {currentYear} Monkya. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link
                href="/privacy"
                className="transition-colors hover:text-[--color-monkya-yellow]"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-[--color-monkya-yellow]"
              >
                Términos
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
