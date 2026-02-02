import { Hero } from "components/hero";
import { heroData } from "lib/hero-data";
import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import { Stories } from "components/stories";
import { storiesData } from "lib/stories-data";
import { FAQ } from "components/faq";
import { faqData } from "lib/faq-data";
import Footer from "components/layout/footer";
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
      <Hero data={heroData} />
      <ThreeItemGrid />
      <Carousel />
      <div className="flex justify-center py-12">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[--color-monkya-yellow] text-[--color-monkya-dark] font-semibold text-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          Ver toda la tienda >>
        </Link>
      </div>
      <Stories data={storiesData} />
      <FAQ data={faqData} />
      <Footer />
    </>
  );
}
