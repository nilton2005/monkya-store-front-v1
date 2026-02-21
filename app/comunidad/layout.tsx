import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Comunidad",
  description:
    "Galeria de clientes y comunidad Monkya usando camisetas y polos personalizados.",
  alternates: {
    canonical: "/comunidad",
  },
  openGraph: {
    type: "website",
    title: "Comunidad Monkya",
    description:
      "Descubre fotos reales de la comunidad Monkya usando disenos personalizados.",
  },
};

export default function ComunidadLayout({ children }: { children: ReactNode }) {
  return children;
}
