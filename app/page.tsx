import { Carousel } from "components/carousel";
import { FAQ } from "components/faq";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";
import { faqData } from "lib/faq-data";
import Link from "next/link";

export const metadata = {
  description:
    "Tienda de diseños personalizados con IA. Crea tu propio diseño o elige entre los favoritos de nuestra comunidad.",
  openGraph: {
    type: "website",
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
