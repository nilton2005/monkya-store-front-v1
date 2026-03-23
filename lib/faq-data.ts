export interface FAQData {
  title: string;
  subtitle: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export const faqData: FAQData = {
  title: "Preguntas Frecuentes",
  subtitle: "Todo lo que necesitas saber sobre Monkya",
  items: [
    {
      question: "¿Cómo funciona el diseño con IA?",
      answer: "Nuestro editor de inteligencia artificial te permite crear diseños únicos mediante descripciones textuales. Simplemente describe tu idea, estilo, emociones o referencia, y la IA generará un diseño original que podrás aplicar a cualquier prenda de nuestra colección. También puedes ajustar detalles como colores, composición y elementos específicos.",
    },
    {
      question: "¿Qué técnica de impresión utilizan?",
      answer: "Usamos sublimado textil de alta calidad, una técnica que permite imprimir diseños con colores vibrantes y detalles nítidos que no se desvanecen con el lavado. El proceso incorpora la tinta directamente en las fibras de la tela, garantizando una durabilidad excepcional y una textura suave que no siente la impresión al tacto.",
    },
    {
      question: "¿Cuánto tiempo tarda mi pedido en llegar?",
      answer: "Una vez confirmado tu pedido, el proceso de producción toma entre 3 a 5 días hábiles. El envío varía según tu ubicación: 2-3 días hábiles para ciudades principales y 5-7 días para otras regiones. Cada pedido es creado especialmente para ti, por lo que agradecemos tu paciencia.",
    },
    {
      question: "¿Puedo devolver o cambiar mi producto?",
      answer: "Sí, ofrecemos una garantía de satisfacción. Si tu producto llega con defectos de impresión o problemas de calidad, contáctanos dentro de los 15 días posteriores a la recepción para coordinar un reemplazo o reembolso. Ten en cuenta que cada pieza es personalizada, por lo que solo aceptamos devoluciones por defectos de fabricación.",
    },
    {
      question: "¿Qué tipos de prendas ofrecen?",
      answer: "Contamos con una amplia variedad de prendas: camisetas de diferentes cortes (classic, fit, oversized), hoodies, sweatshirts, tazas y accesorios. Todas nuestras prendas son de calidad premium, seleccionadas para garantizar la mejor durabilidad y confort para el sublimado textil.",
    },
    {
      question: "¿Cómo conservo mi prenda impresa?",
      answer: "Para mantener tu diseño en perfectas condiciones, recomendamos lavar la prenda del revés con agua fría o tibia, usar detergentes suaves sin blanqueadores, y evitar la secadora directa. Planchar del revés a temperatura media. Estos cuidados simples asegurarán que tu diseño se mantenga vibrante por mucho tiempo.",
    },
    {
      question: "¿Ofrecen diseños para grupos o eventos?",
      answer: "¡Absolutamente! Puedes crear diseños personalizados para equipos, empresas, eventos especiales o grupos de amigos. Contáctanos directamente para pedidos por volumen y te ofreceremos opciones especiales y descuentos por cantidad.",
    },
    {
      question: "¿Qué hacen con mi diseño original?",
      answer: "Tus diseños son tuyos. Respetamos tu propiedad intelectual y creatividad. No usamos tus diseños para otros productos ni los compartimos. Sin embargo, si deseas compartir tu creación con la comunidad Monkya, tenemos una opción para publicar en nuestra galería y otros usuarios podrán inspirarse en tu arte.",
    },
    {
      question: "¿Están disponibles en todo el Perú?",
      answer: "Por ahora, operamos exclusivamente en Arequipa, Estamos creciendo con cuidado para mantener la calidad que nos define. Si quieres que Monkya llegue a tu ciudad, escríbenos a monkya-store@monkya.com y te avisamos antes que nadie."
    },
  ],
};
