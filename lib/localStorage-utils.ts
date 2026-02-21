/**
 * Utilities for managing AI images in localStorage
 */

const AI_IMAGE_PREFIX = "ai-img-";

/**
 * Get all AI image keys stored in localStorage
 */
export function getAllAIImageKeys(): string[] {
  if (typeof window === "undefined") return [];

  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(AI_IMAGE_PREFIX)) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Get AI image keys that are currently in use (referenced in cookies)
 */
export function getActiveAIImageKeys(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const cartCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cart="));

    if (!cartCookie) return [];

    const cookieValue = cartCookie.split("=")[1];
    if (!cookieValue) return [];

    const cartData = JSON.parse(decodeURIComponent(cookieValue));
    const activeKeys: string[] = [];

    for (const item of cartData.items || []) {
      if (item.customImageRef) {
        activeKeys.push(item.customImageRef);
      }
    }

    return activeKeys;
  } catch (error) {
    console.error("Error getting active AI image keys:", error);
    return [];
  }
}

/**
 * Clean up AI images that are no longer referenced in the cart
 * Returns the number of images cleaned
 */
export function cleanupUnusedAIImages(): number {
  if (typeof window === "undefined") return 0;

  const allKeys = getAllAIImageKeys();
  const activeKeys = new Set(getActiveAIImageKeys());
  let cleaned = 0;

  for (const key of allKeys) {
    if (!activeKeys.has(key)) {
      try {
        localStorage.removeItem(key);
        cleaned++;
        console.log("🗑️ Cleaned unused AI image:", key);
      } catch (error) {
        console.error("Error removing AI image:", key, error);
      }
    }
  }

  if (cleaned > 0) {
    console.log(`✅ Cleaned ${cleaned} unused AI image(s) from localStorage`);
  }

  return cleaned;
}

/**
 * Clear all AI images from localStorage (use with caution!)
 */
export function clearAllAIImages(): number {
  if (typeof window === "undefined") return 0;

  const allKeys = getAllAIImageKeys();
  let cleared = 0;

  for (const key of allKeys) {
    try {
      localStorage.removeItem(key);
      cleared++;
    } catch (error) {
      console.error("Error clearing AI image:", key, error);
    }
  }

  console.log(`🗑️ Cleared ${cleared} AI image(s) from localStorage`);
  return cleared;
}

/**
 * Get the total size of AI images in localStorage (approximate)
 */
export function getAIImagesSize(): number {
  if (typeof window === "undefined") return 0;

  const allKeys = getAllAIImageKeys();
  let totalSize = 0;

  for (const key of allKeys) {
    const value = localStorage.getItem(key);
    if (value) {
      // Each character in localStorage takes 2 bytes (UTF-16)
      totalSize += value.length * 2;
    }
  }

  return totalSize;
}

/**
 * Get human-readable size of AI images
 */
export function getAIImagesSizeFormatted(): string {
  const bytes = getAIImagesSize();

  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Check if we're close to localStorage quota
 * Returns true if usage is over 80%
 */
export function isLocalStorageNearQuota(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const testKey = "__quota_test__";
    const testValue = new Array(1024 * 1024).join("a"); // 1MB

    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);

    return false; // We have space
  } catch (e) {
    return true; // We're near or at quota
  }
}
