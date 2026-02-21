import { Carousel } from "components/carousel";
import { FAQ } from "components/faq";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";
import { faqData } from "lib/faq-data";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Tienda de diseños personalizados con IA. Crea tu propio diseño o elige entre los favoritos de nuestra comunidad.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Monkya | Camisetas personalizadas con IA",
    description:
      "Crea diseños con IA, explora estilos de la comunidad y compra camisetas personalizadas online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monkya | Camisetas personalizadas con IA",
    description:
      "Crea diseños con IA, explora estilos de la comunidad y compra camisetas personalizadas online.",
  },
};

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-12">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[--color-monkya-yellow] text-[--color-monkya-dark] font-semibold text-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          Ver toda la tienda &gt;&gt;
        </Link>
        <Link
          href="/comunidad"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border-2 border-[--color-monkya-yellow] text-[--color-monkya-yellow] font-semibold text-lg transition-all duration-200 hover:bg-[--color-monkya-yellow]/10 hover:scale-105 active:scale-95"
        >
          Nuestra Comunidad
        </Link>
      </div>
      <FAQ data={faqData} />
      <Footer />
    </>
  );
}
