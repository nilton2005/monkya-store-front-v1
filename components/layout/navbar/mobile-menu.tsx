'use client';

import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { navLinks, NavLink } from './navigation-links';

export function MobileMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  // Cerrar al resize a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Abrir menú móvil"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 flex h-full w-full flex-col bg-white dark:bg-black md:w-80">
              <div className="p-4">
                <button
                  className="mb-6 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                  onClick={closeMobileMenu}
                  aria-label="Cerrar menú móvil"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {navLinks.length > 0 && (
                  <ul className="flex w-full flex-col">
                    {navLinks.map((link: NavLink) => {
                      const isActive = pathname === link.path;
                      return (
                        <li
                          className="py-3 text-xl text-black transition-colors dark:text-white"
                          key={link.path}
                        >
                          <Link
                            href={link.path}
                            prefetch={true}
                            onClick={closeMobileMenu}
                            aria-label={link.ariaLabel}
                            className="flex items-center gap-3"
                            style={{
                              color: isActive ? '#f2cd4e' : undefined,
                            }}
                          >
                            {link.title}
                            {isActive && (
                              <Image
                                src="/animaMonkya.webp"
                                alt="Anima Monkya"
                                width={24}
                                height={24}
                                className="h-6 w-auto object-contain drop-shadow-md"
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
