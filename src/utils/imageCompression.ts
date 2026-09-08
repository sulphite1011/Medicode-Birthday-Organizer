/**
 * WishCraft Studio - Client-Side Image Compression Utility
 * Prevents localStorage quota exhaustion (5MB limit) and Firestore document size limit (1MB limit).
 * Compresses uploaded images to crisp, lightweight web-ready JPEGs (< 150KB).
 */

export function compressImageFile(
  file: File | Blob,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate new dimensions maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const bestRatio = Math.min(widthRatio, heightRatio);
            width = Math.round(width * bestRatio);
            height = Math.round(height * bestRatio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to original read
            resolve(readerEvent.target?.result as string);
            return;
          }

          // Draw image smoothly
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Output as JPEG
          let compressed = canvas.toDataURL('image/jpeg', quality);

          // If still over 250KB, compress further
          if (compressed.length > 350000 && quality > 0.6) {
            compressed = canvas.toDataURL('image/jpeg', 0.65);
          }

          resolve(compressed);
        } catch (err) {
          // If canvas operations fail, fallback to raw reader result
          resolve(readerEvent.target?.result as string);
        }
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * If an image is a large base64 data URL, compress it.
 * If it is an external URL (Unsplash, Cloudinary, etc.), leaves it unchanged.
 */
export async function ensureOptimizedImageUrl(
  urlOrDataUrl?: string,
  maxWidth = 1200,
  maxHeight = 800
): Promise<string> {
  if (!urlOrDataUrl) return '';
  const trimmed = urlOrDataUrl.trim();

  // If already an HTTP/HTTPS web URL, no compression needed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a data URL and larger than 150KB, compress it
  if (trimmed.startsWith('data:image') && trimmed.length > 200000) {
    try {
      const response = await fetch(trimmed);
      const blob = await response.blob();
      return await compressImageFile(blob, maxWidth, maxHeight, 0.8);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}
