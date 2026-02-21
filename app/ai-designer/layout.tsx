import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Disenador IA",
  description:
    "Crea disenos de camisetas con inteligencia artificial y personaliza tus prendas en segundos.",
  alternates: {
    canonical: "/ai-designer",
  },
  openGraph: {
    type: "website",
    title: "Disenador IA | Monkya",
    description:
      "Genera y personaliza disenos de camisetas con IA en la herramienta de Monkya.",
  },
};

export default function AIDesignerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
