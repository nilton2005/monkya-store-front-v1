import { Collection, Product } from '../shopify/types';

export const localProducts: Product[] = [
  {
    id: 'gid://product/1',
    handle: 't-shirt-basic-white',
    title: 'T-Shirt Básica Blanca',
    description: 'Camiseta básica de algodón 100% en color blanco. Perfecta para uso diario.',
    descriptionHtml: '<p>Camiseta básica de algodón 100% en color blanco. Perfecta para uso diario.</p>',
    availableForSale: true,
    updatedAt: '2024-01-01T00:00:00Z',
    tags: ['camiseta', 'blanco', 'básico', 'algodón'],
    featuredImage: {
      url: '/placeholder-tshirt-white.jpg',
      altText: 'T-Shirt Básica Blanca',
      width: 600,
      height: 600
    },
    images: [
      {
        url: '/placeholder-tshirt-white.jpg',
        altText: 'T-Shirt Básica Blanca - Vista frontal',
        width: 600,
        height: 600
      },
      {
        url: '/placeholder-tshirt-white-back.jpg',
        altText: 'T-Shirt Básica Blanca - Vista trasera',
        width: 600,
        height: 600
      }
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD'
      },
      minVariantPrice: {
        amount: '20.00',
        currencyCode: 'USD'
      }
    },
    variants: [
      {
        id: 'gid://variant/1-s',
        title: 'S / Blanco',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Color', value: 'Blanco' }
        ],
        price: {
          amount: '20.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/1-m',
        title: 'M / Blanco',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Blanco' }
        ],
        price: {
          amount: '22.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/1-l',
        title: 'L / Blanco',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Blanco' }
        ],
        price: {
          amount: '25.00',
          currencyCode: 'USD'
        }
      }
    ],
    options: [
      {
        id: 'gid://option/size',
        name: 'Size',
        values: ['S', 'M', 'L']
      },
      {
        id: 'gid://option/color',
        name: 'Color',
        values: ['Blanco']
      }
    ],
    seo: {
      title: 'T-Shirt Básica Blanca - Camiseta de Algodón',
      description: 'Compra la mejor t-shirt básica blanca de algodón 100%. Perfecta para uso diario.'
    }
  },
  {
    id: 'gid://product/2',
    handle: 't-shirt-black-premium',
    title: 'T-Shirt Premium Negra',
    description: 'Camiseta premium de algodón orgánico en color negro. Diseño moderno y cómodo.',
    descriptionHtml: '<p>Camiseta premium de algodón orgánico en color negro. Diseño moderno y cómodo.</p>',
    availableForSale: true,
    updatedAt: '2024-01-02T00:00:00Z',
    tags: ['camiseta', 'negro', 'premium', 'algodón orgánico'],
    featuredImage: {
      url: '/placeholder-tshirt-black.jpg',
      altText: 'T-Shirt Premium Negra',
      width: 600,
      height: 600
    },
    images: [
      {
        url: '/placeholder-tshirt-black.jpg',
        altText: 'T-Shirt Premium Negra - Vista frontal',
        width: 600,
        height: 600
      },
      {
        url: '/placeholder-tshirt-black-back.jpg',
        altText: 'T-Shirt Premium Negra - Vista trasera',
        width: 600,
        height: 600
      }
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '35.00',
        currencyCode: 'USD'
      },
      minVariantPrice: {
        amount: '30.00',
        currencyCode: 'USD'
      }
    },
    variants: [
      {
        id: 'gid://variant/2-s',
        title: 'S / Negro',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Color', value: 'Negro' }
        ],
        price: {
          amount: '30.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/2-m',
        title: 'M / Negro',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Negro' }
        ],
        price: {
          amount: '32.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/2-l',
        title: 'L / Negro',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Negro' }
        ],
        price: {
          amount: '35.00',
          currencyCode: 'USD'
        }
      }
    ],
    options: [
      {
        id: 'gid://option/size',
        name: 'Size',
        values: ['S', 'M', 'L']
      },
      {
        id: 'gid://option/color',
        name: 'Color',
        values: ['Negro']
      }
    ],
    seo: {
      title: 'T-Shirt Premium Negra - Camiseta de Algodón Orgánico',
      description: 'Compra la mejor t-shirt premium negra de algodón orgánico. Diseño moderno y cómodo.'
    }
  },
  {
    id: 'gid://product/3',
    handle: 'hoodie-classic-gray',
    title: 'Hoodie Clásica Gris',
    description: 'Sudadera con capucha clásica en color gris. Perfecta para clima frío.',
    descriptionHtml: '<p>Sudadera con capucha clásica en color gris. Perfecta para clima frío.</p>',
    availableForSale: true,
    updatedAt: '2024-01-03T00:00:00Z',
    tags: ['hoodie', 'gris', 'clásico', 'sudadera'],
    featuredImage: {
      url: '/placeholder-hoodie-gray.jpg',
      altText: 'Hoodie Clásica Gris',
      width: 600,
      height: 600
    },
    images: [
      {
        url: '/placeholder-hoodie-gray.jpg',
        altText: 'Hoodie Clásica Gris - Vista frontal',
        width: 600,
        height: 600
      },
      {
        url: '/placeholder-hoodie-gray-back.jpg',
        altText: 'Hoodie Clásica Gris - Vista trasera',
        width: 600,
        height: 600
      }
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD'
      },
      minVariantPrice: {
        amount: '45.00',
        currencyCode: 'USD'
      }
    },
    variants: [
      {
        id: 'gid://variant/3-s',
        title: 'S / Gris',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Color', value: 'Gris' }
        ],
        price: {
          amount: '45.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/3-m',
        title: 'M / Gris',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Gris' }
        ],
        price: {
          amount: '50.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/3-l',
        title: 'L / Gris',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Gris' }
        ],
        price: {
          amount: '55.00',
          currencyCode: 'USD'
        }
      }
    ],
    options: [
      {
        id: 'gid://option/size',
        name: 'Size',
        values: ['S', 'M', 'L']
      },
      {
        id: 'gid://option/color',
        name: 'Color',
        values: ['Gris']
      }
    ],
    seo: {
      title: 'Hoodie Clásica Gris - Sudadera con Capucha',
      description: 'Compra la mejor hoodie clásica gris. Perfecta para clima frío y uso casual.'
    }
  },
  {
    id: 'gid://product/4',
    handle: 'hoodie-black-street',
    title: 'Hoodie Street Negra',
    description: 'Sudadera estilo urbano en color negro. Diseño moderno y juvenil.',
    descriptionHtml: '<p>Sudadera estilo urbano en color negro. Diseño moderno y juvenil.</p>',
    availableForSale: true,
    updatedAt: '2024-01-04T00:00:00Z',
    tags: ['hoodie', 'negro', 'street', 'urbano'],
    featuredImage: {
      url: '/placeholder-hoodie-black.jpg',
      altText: 'Hoodie Street Negra',
      width: 600,
      height: 600
    },
    images: [
      {
        url: '/placeholder-hoodie-black.jpg',
        altText: 'Hoodie Street Negra - Vista frontal',
        width: 600,
        height: 600
      },
      {
        url: '/placeholder-hoodie-black-back.jpg',
        altText: 'Hoodie Street Negra - Vista trasera',
        width: 600,
        height: 600
      }
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '65.00',
        currencyCode: 'USD'
      },
      minVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD'
      }
    },
    variants: [
      {
        id: 'gid://variant/4-s',
        title: 'S / Negro',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Color', value: 'Negro' }
        ],
        price: {
          amount: '55.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/4-m',
        title: 'M / Negro',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Negro' }
        ],
        price: {
          amount: '60.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/4-l',
        title: 'L / Negro',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Negro' }
        ],
        price: {
          amount: '65.00',
          currencyCode: 'USD'
        }
      }
    ],
    options: [
      {
        id: 'gid://option/size',
        name: 'Size',
        values: ['S', 'M', 'L']
      },
      {
        id: 'gid://option/color',
        name: 'Color',
        values: ['Negro']
      }
    ],
    seo: {
      title: 'Hoodie Street Negra - Sudadera Urbana',
      description: 'Compra la hoodie street negra. Diseño moderno y juvenil perfecto para el estilo urbano.'
    }
  },
{
    id: 'gid://product/5',
    handle: 't-shirt_eat_sleep_while',
    title: 'T-Shirt Básica Blanca',
    description: 'Camiseta básica material pima en color . Perfecta para uso diario',
    descriptionHtml: '<p>Camiseta básica de algodón 100% en color blanco. Perfecta para uso diario.</p>',
    availableForSale: true,
    updatedAt: '2024-01-01T00:00:00Z',
    tags: ['camiseta', 'blanco', 'básico', 'algodón'],
    featuredImage: {
      url: '/placeholder-tshirt-white.jpg',
      altText: 'T-Shirt Básica Blanca',
      width: 600,
      height: 600
    },
    images: [
      {
        url: '/placeholder-tshirt-white.jpg',
        altText: 'T-Shirt Básica Blanca - Vista frontal',
        width: 600,
        height: 600
      },
      {
        url: '/placeholder-tshirt-white-back.jpg',
        altText: 'T-Shirt Básica Blanca - Vista trasera',
        width: 600,
        height: 600
      }
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD'
      },
      minVariantPrice: {
        amount: '20.00',
        currencyCode: 'USD'
      }
    },
    variants: [
      {
        id: 'gid://variant/1-s',
        title: 'S / Blanco',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Color', value: 'Blanco' }
        ],
        price: {
          amount: '20.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/1-m',
        title: 'M / Blanco',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Blanco' }
        ],
        price: {
          amount: '22.00',
          currencyCode: 'USD'
        }
      },
      {
        id: 'gid://variant/1-l',
        title: 'L / Blanco',
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Blanco' }
        ],
        price: {
          amount: '25.00',
          currencyCode: 'USD'
        }
      }
    ],
    options: [
      {
        id: 'gid://option/size',
        name: 'Size',
        values: ['S', 'M', 'L']
      },
      {
        id: 'gid://option/color',
        name: 'Color',
        values: ['Blanco']
      }
    ],
    seo: {
      title: 'T-Shirt Básica Blanca - Camiseta de Algodón',
      description: 'Compra la mejor t-shirt básica blanca de algodón 100%. Perfecta para uso diario.'
    }
  },
];

export const localCollections: Collection[] = [
  {
    handle: '',
    title: 'All',
    description: 'All products',
    seo: {
      title: 'All',
      description: 'All products'
    },
    path: '/search',
    updatedAt: new Date().toISOString()
  },
  {
    handle: 't-shirts',
    title: 'T-Shirts',
    description: 'Colección de camisetas básicas y premium',
    seo: {
      title: 'T-Shirts - Camisetas',
      description: 'Descubre nuestra colección de camisetas básicas y premium'
    },
    path: '/search/t-shirts',
    updatedAt: new Date().toISOString()
  },
  {
    handle: 'hoodies',
    title: 'Hoodies',
    description: 'Colección de sudaderas con capucha',
    seo: {
      title: 'Hoodies - Sudaderas',
      description: 'Descubre nuestra colección de hoodies y sudaderas'
    },
    path: '/search/hoodies',
    updatedAt: new Date().toISOString()
  }
];

export const localMenu = [
  {
    title: 'All',
    path: '/search'
  },
  {
    title: 'T-Shirts',
    path: '/search/t-shirts'
  },
  {
    title: 'Hoodies',
    path: '/search/hoodies'
  }
];