import { Collection, Product } from '../shopify/types';

export const localProducts: Product[] = [
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