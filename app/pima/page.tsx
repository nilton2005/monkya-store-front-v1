"use client";

import Footer from "components/layout/footer";
import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Inicio" },
  { id: "beneficios", label: "Beneficios" },
  { id: "comparacion", label: "Comparativa" },
  { id: "calidad", label: "Calidad" },
  { id: "sustentabilidad", label: "Sustentabilidad" }
];

export default function PimaPage() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 } // Se activa cuando al menos 30% de la sección es visible
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-[#0d0c08] text-white selection:bg-[#f2cd4e]/30">
        
        {/* Efectos atmosféricos de fondo */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#f2cd4e]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f2cd4e]/5 blur-[150px] rounded-full" />
        </div>

        {/* --- ÍNDICE LATERAL (Visible solo en Desktop >= lg) --- */}
        <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-6 z-50">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="group flex items-center gap-4 text-sm font-medium transition-all"
              aria-label={`Ir a ${section.label}`}
            >
              <span
                className={`block transition-all duration-300 ease-out ${
                  activeSection === section.id
                    ? "w-8 h-1 bg-[#f2cd4e] shadow-[0_0_12px_rgba(242,205,78,0.6)]"
                    : "w-2 h-2 rounded-full bg-gray-600 group-hover:bg-[#f2cd4e]/50 group-hover:scale-125"
                }`}
              />
              <span
                className={`transition-all duration-300 ${
                  activeSection === section.id
                    ? "text-[#f2cd4e] translate-x-2 opacity-100"
                    : "text-gray-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {section.label}
              </span>
            </button>
          ))}
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        {/* Usamos lg:pl-32 para dejar espacio al índice en desktop */}
        <div className="relative z-10 lg:pl-[120px] max-w-[100vw] overflow-x-hidden">
          
          {/* 1. HERO SECTION */}
          <section id="hero" className="relative pb-16 pt-24 md:py-32 scroll-mt-24">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#f2cd4e] transition-colors mb-12 group"
              >
                <svg
                  className="h-5 w-5 transform transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </Link>

              <div className="max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f2cd4e] to-amber-200">
                  Nuestro Algodón <br /> Pima Peruano
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
                  Descubre por qué el algodón Pima es la elección premium para prendas que duran, respiran y se sienten como una caricia en tu piel.
                </p>
              </div>
            </div>
          </section>

          {/* 2. FEATURES GRID */}
          <section id="beneficios" className="py-20 scroll-mt-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-16 flex items-center gap-4">
                <span className="w-12 h-1 bg-[#f2cd4e] rounded-full inline-block" />
                6 Razones para Elegir Pima
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { 
                    icon: <svg className="w-10 h-10 text-[#f2cd4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>, 
                    title: "Suavidad Incomparable", desc: "35% más suave que el convencional. Fibras más largas para un tacto sedoso." 
                  },
                  { 
                    icon: <svg className="w-10 h-10 text-[#f2cd4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, 
                    title: "Durabilidad Extrema", desc: "30% más resistente. Aguanta más lavadas sin perder forma." 
                  },
                  { 
                    icon: <svg className="w-10 h-10 text-[#f2cd4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15h12.5a2.5 2.5 0 000-5H12M3 9h14.5a2.5 2.5 0 010 5H18M7 19h10" /></svg>, 
                    title: "Transpirabilidad", desc: "25% más absorbente. Mantiene tu cuerpo fresco y seco siempre." 
                  },
                  { 
                    icon: <svg className="w-10 h-10 text-[#f2cd4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>, 
                    title: "Pieles Sensibles", desc: "100% hipoalergénico. Ideal para piel reactiva sin químicos." 
                  },
                  { 
                    icon: <svg className="w-10 h-10 text-[#f2cd4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>, 
                    title: "Retención de Color", desc: "Colores 5x más duraderos. Vibrante tras 50+ lavadas." 
                  },
                  { 
                    icon: <svg className="w-10 h-10 text-[#f2cd4e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>, 
                    title: "Sustentabilidad", desc: "Requiere 60% menos pesticidas. Mejor para el planeta." 
                  }
                ].map((feature, i) => (
                  <div key={i} className="group p-8 rounded-2xl bg-[#1a1810]/60 backdrop-blur-md border border-white/5 hover:border-[#f2cd4e]/40 hover:bg-[#1a1810]/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(242,205,78,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#f2cd4e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="mb-6 relative z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-300 origin-bottom-left">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-[#f2cd4e] relative z-10">{feature.title}</h3>
                    <p className="text-gray-400 relative z-10 leading-relaxed text-sm">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. COMPARISON TABLE */}
          <section id="comparacion" className="py-20 scroll-mt-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-16 flex items-center gap-4">
                <span className="w-12 h-1 bg-[#f2cd4e] rounded-full inline-block" />
                Pima vs. Convencional
              </h2>
              
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1810]/40 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1a1810]">
                        <th className="px-6 py-6 text-[#f2cd4e] font-bold w-1/3">Propiedad</th>
                        <th className="px-6 py-6 text-green-400 font-bold w-1/3 border-l border-white/5">
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#f2cd4e]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            Algodón Pima
                          </span>
                        </th>
                        <th className="px-6 py-6 text-gray-500 font-bold w-1/3 border-l border-white/5">Algodón Convencional</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        ["Resistencia a la tracción", "Muy alta", "Moderada"],
                        ["Absorbencia", "25% superior", "Base"],
                        ["Resistencia al encogimiento", "Excelente", "Buena"],
                        ["Longevidad (lavadas)", "150+ lavadas", "50-75 lavadas"],
                        ["Sostenibilidad", "60% menos agua y pesticidas", "Estándar"]
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-5 text-gray-300 font-medium">{row[0]}</td>
                          <td className="px-6 py-5 text-green-400/90 font-medium border-l border-white/5">{row[1]}</td>
                          <td className="px-6 py-5 text-gray-500 border-l border-white/5">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* 4. PROOF SECTION (Calidad) */}
          <section id="calidad" className="py-20 scroll-mt-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="relative p-10 md:p-14 rounded-3xl overflow-hidden border border-[#f2cd4e]/20 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f2cd4e]/10 via-[#1a1810] to-[#1a1810]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#f2cd4e]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2cd4e]/10 border border-[#f2cd4e]/20 text-[#f2cd4e] font-semibold text-sm mb-8">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    Certificado Martindale Test
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                    Calidad que supera los estándares globales.
                  </h3>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    El algodón Pima supera el estándar Martindale de durabilidad textil. Nuestras prendas pasan <strong className="text-white font-semibold">100,000+ ciclos de fricción</strong> sin degradación visible. Tu prenda Monkya durará años conservando su forma, color y suavidad intacta.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. SUSTAINABILITY LIST */}
          <section id="sustentabilidad" className="py-20 scroll-mt-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-4">
                    <span className="w-12 h-1 bg-green-500 rounded-full inline-block" />
                    Nuestro Compromiso Sostenible
                  </h2>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    La moda responsable no es una opción, es una obligación. Al elegir Pima, apoyas prácticas agrícolas más amigables con el ecosistema.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {[
                    "60% menos uso de agua en cultivo",
                    "Reducción crítica en el uso pesticidas",
                    "Extrema longevidad = menor huella de carbono",
                    "100% biodegradable al fin de su vida útil",
                    "Impulso a comunidades agrícolas con prácticas éticas"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <p className="text-gray-300 font-medium">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA & FOOTER SOURCES */}
          <section className="pt-20 pb-12">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                Ver la colección completa
              </h2>
              <Link
                href="/store"
                className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-[#1a1810] transition-all bg-[#f2cd4e] rounded-full overflow-hidden hover:scale-105 hover:shadow-[0_0_40px_rgba(242,205,78,0.4)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-3">
                  Explorar Catálogo
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>
            
            <div className="mx-auto max-w-6xl mt-32 px-6 border-t border-white/10 pt-8">
              <p className="text-center text-gray-600 text-sm">
                * Información basada en estándares de la industria textil, pruebas Martindale y documentación de organismos certificadores de algodón en Perú.
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}