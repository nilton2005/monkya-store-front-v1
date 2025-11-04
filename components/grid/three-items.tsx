import { localProducts } from 'lib/local-data/exports';
import ThreeItemGridClient from './three-items-client';

export async function ThreeItemGrid() {
  // Mostrar los primeros productos disponibles en el home
  const homepageItems = localProducts.slice(0, 3);

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <ThreeItemGridClient
      firstProduct={firstProduct}
      secondProduct={secondProduct}
      thirdProduct={thirdProduct}
    />
  );
}