// 🎯 Re-exports limpios desde auto-generator
// Este archivo puede ser importado tanto por Server Components como Client Components
// ya que no tiene directivas de caché

export {
    getProductsByCategory,
    getProductsByTags,
    getStoreStats, localCollections,
    localMenu, localProducts
} from './auto-generator';

export { CATEGORY_CONFIG, PRODUCTOS, STORE_CONFIG } from './simple-products';
export type { SimpleProduct } from './simple-products';

