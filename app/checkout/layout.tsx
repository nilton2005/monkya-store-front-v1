import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finaliza tu compra de productos personalizados.",
  alternates: {
    canonical: "/checkout",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
