"use client";

import Footer from "components/layout/footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * Community gallery photos.
 * Add new entries here — each needs a src path (place images in /public/images/comunidad/),
 * an alt text, and optionally a name and product description.
 */
const COMMUNITY_PHOTOS: {
  src: string;
  alt: string;
  name?: string;
  product?: string;
}[] = [
  // Add your community photos here:
   { src: '/images/comunidad/deyson-dev.jpeg', alt: 'Cliente con polo Monkya', name: 'Deyson', product: 'Polo  - CodeHub' },
  { src: '/images/comunidad/nil-code-log.jpeg', alt: 'Cliente con polera Monkya', name: 'Nilton', product: 'Polo pima Code' },
  { src: '/images/comunidad/ton-wakandev.jpeg', alt: 'Cliente con polera Monkya', name: 'Grupo de programadores que confío en Monkya', product: 'Polera Wakandev' },
  { src: '/images/comunidad/jeefry.jpeg', alt: 'Cliente con polera Monkya', name: 'Jeefry', product: 'Polo - Kotlin' }
];

export default function ComunidadPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0d0c08] to-gray-900 text-white">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f2cd4e]/10 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#f2cd4e] transition-colors mb-8"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nuestra <span className="text-[#f2cd4e]">Comunidad</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Personas reales luciendo sus diseños Monkya. ¡Comparte el tuyo y
              aparece aquí!
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-[#f2cd4e]/10 border border-[#f2cd4e]/30 rounded-full px-5 py-2 text-sm text-[#f2cd4e]">
              <span>🐵</span>
              <span>
                Envía tu foto a nuestro WhatsApp para aparecer en la galería
              </span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mx-auto max-w-7xl px-4 pb-20">
          {COMMUNITY_PHOTOS.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {COMMUNITY_PHOTOS.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(index)}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-800 border border-gray-700/50 hover:border-[#f2cd4e]/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {(photo.name || photo.product) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {photo.name && (
                        <p className="text-sm font-semibold text-white">
                          {photo.name}
                        </p>
                      )}
                      {photo.product && (
                        <p className="text-xs text-[#f2cd4e]">
                          {photo.product}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            /* Empty state - placeholder grid */
            <div className="text-center py-16">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12 opacity-30">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-gray-800/50 border border-gray-700/30 flex items-center justify-center"
                  >
                    <span className="text-4xl">👕</span>
                  </div>
                ))}
              </div>
              <p className="text-2xl font-bold text-gray-500 mb-2">
                Próximamente
              </p>
              <p className="text-gray-600 max-w-md mx-auto">
                Estamos recopilando las fotos de nuestra comunidad. ¡Envía la
                tuya por WhatsApp y sé de los primeros en aparecer!
              </p>
              <a
                href="https://wa.me/51930913160?text=Hola%20Monkya%21%20Quiero%20compartir%20mi%20foto%20con%20mi%20polo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Comparte tu foto
              </a>
            </div>
          )}
        </div>

        {/* Lightbox modal */}
        {selectedPhoto !== null && COMMUNITY_PHOTOS[selectedPhoto] && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <div
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={COMMUNITY_PHOTOS[selectedPhoto]!.src}
                alt={COMMUNITY_PHOTOS[selectedPhoto]!.alt}
                width={1200}
                height={1200}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              {(COMMUNITY_PHOTOS[selectedPhoto]!.name ||
                COMMUNITY_PHOTOS[selectedPhoto]!.product) && (
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  {COMMUNITY_PHOTOS[selectedPhoto]!.name && (
                    <p className="text-sm font-semibold text-white">
                      {COMMUNITY_PHOTOS[selectedPhoto]!.name}
                    </p>
                  )}
                  {COMMUNITY_PHOTOS[selectedPhoto]!.product && (
                    <p className="text-xs text-[#f2cd4e]">
                      {COMMUNITY_PHOTOS[selectedPhoto]!.product}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* Navigation arrows */}
            {COMMUNITY_PHOTOS.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(
                      (selectedPhoto - 1 + COMMUNITY_PHOTOS.length) %
                        COMMUNITY_PHOTOS.length,
                    );
                  }}
                >
                  ‹
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(
                      (selectedPhoto + 1) % COMMUNITY_PHOTOS.length,
                    );
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
