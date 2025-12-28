import { TAGS } from 'lib/constants';
import {
    unstable_cacheLife as cacheLife,
    unstable_cacheTag as cacheTag
} from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
    Cart,
    Collection,
    Menu,
    Page,
    Product
} from '../shopify/types';

// Import local functions
import {
    addToLocalCart,
    createLocalCart,
    getLocalCart,
    getLocalCollection,
    getLocalCollectionProducts,
    getLocalCollections,
    getLocalMenu,
    getLocalProduct,
    getLocalProductRecommendations,
    getLocalProducts,
    removeFromLocalCart,
    updateLocalCart
} from '../local-data';

export async function createCart(): Promise<Cart> {
  return await createLocalCart();
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number; customImage?: string; customTitle?: string }[]
): Promise<Cart> {
  return await addToLocalCart(lines);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  return await removeFromLocalCart(lineIds);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  return await updateLocalCart(lines);
}

export async function getCart(): Promise<Cart | undefined> {
  return await getLocalCart();
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  return await getLocalCollection(handle);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife('days');

  return await getLocalCollectionProducts({ collection, reverse, sortKey });
}

export async function getCollections(): Promise<Collection[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  return await getLocalCollections();
}

export async function getMenu(handle: string): Promise<Menu[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  return await getLocalMenu(handle);
}

export async function getPage(handle: string): Promise<Page> {
  // For now, return a mock page since we don't have local pages
  return {
    id: 'local-page',
    title: 'Local Page',
    handle: handle,
    body: 'This is a local page',
    bodySummary: 'Local page summary',
    seo: {
      title: 'Local Page',
      description: 'Local page description'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function getPages(): Promise<Page[]> {
  // Return empty array for now since we don't have local pages
  return [];
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  return await getLocalProduct(handle);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  return await getLocalProductRecommendations(productId);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  return await getLocalProducts({ query, reverse, sortKey });
}

// This is called from `app/api/revalidate.ts` - kept for compatibility
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // For local data, we just return success since there's no external service to revalidate
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}