/**
 * Image compression utilities for localStorage optimization
 */

/**
 * Compress a base64 image by reducing quality
 * @param base64Image - Full base64 data URL (data:image/png;base64,...)
 * @param maxWidth - Maximum width in pixels (default: 1024)
 * @param quality - Quality from 0 to 1 (default: 0.8)
 * @returns Compressed base64 data URL
 */
export async function compressBase64Image(
  base64Image: string,
  maxWidth: number = 1024,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG for better compression (PNG is usually larger)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        console.log('🗜️ Image compression:', {
          originalSize: `${(base64Image.length / 1024).toFixed(2)} KB`,
          compressedSize: `${(compressedBase64.length / 1024).toFixed(2)} KB`,
          reduction: `${(((base64Image.length - compressedBase64.length) / base64Image.length) * 100).toFixed(1)}%`
        });
        
        resolve(compressedBase64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = base64Image;
  });
}

/**
 * Get the size of a base64 string in bytes
 */
export function getBase64Size(base64String: string): number {
  // Each character in base64 is ~0.75 bytes (4 chars = 3 bytes)
  // Plus overhead for data URL prefix
  return base64String.length * 0.75;
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
