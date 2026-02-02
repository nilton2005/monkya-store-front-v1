import { HeroData } from "types";

export const heroData: HeroData = {
  title: "Play With Electric",
  subtitle: "Diseños Monkya con IA",
  btntext: "Explorar Productos",
  btnHref: "/products",
  img: "/bannerMonkya.webp",
  videos: [
    {
      imgsrc: "/bannerMonkya.webp",
      clip: "/video-1.mp4",
    },
    {
      imgsrc: "/bannerMonkya2.webp",
      clip: "/video-2.mp4",
    },
    {
      imgsrc: "/animaMonkya.webp",
      clip: "/video-3.mp4",
    },
  ],
  sociallinks: [
    { icon: "facebook", href: "https://facebook.com" },
    { icon: "instagram", href: "https://instagram.com" },
    { icon: "twitter", href: "https://twitter.com" },
    { icon: "youtube", href: "https://youtube.com" },
    { icon: "linkedin", href: "https://linkedin.com" },
  ],
};

// Datos alternativos para diferentes páginas o variaciones
export const heroDataAlternative: HeroData = {
  title: "Crea tu Diseño",
  subtitle: "Con Inteligencia Artificial",
  btntext: "Comenzar Ahora",
  btnHref: "/ai-designer",
  img: "/animaMonkya.webp",
  videos: [],
  sociallinks: [
    { icon: "instagram", href: "https://instagram.com" },
    { icon: "tiktok", href: "https://tiktok.com" },
  ],
};
