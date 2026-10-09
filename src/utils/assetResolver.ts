/**
 * Universal Asset URL Resolver for UKADA Ride.
 * Ensures all image paths resolve reliably on whatever domain or environment the app is hosted on:
 * - Localhost dev server (port 3000)
 * - Cloud Run development domain (*.run.app)
 * - Cloud Run shared preview domain (*.run.app)
 * - Production custom domain
 */

/**
 * Normalizes an image path so it always loads from the active domain/origin.
 * Strips mismatched hostnames, ensures leading slashes, and falls back gracefully.
 */
export function resolveImageUrl(src: string | undefined | null): string {
  if (!src) return '';

  // Data URLs and Blobs can be used directly
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  // If a full URL was saved with a different host (e.g., from old dev session or external origin)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    try {
      const parsed = new URL(src);
      // If it points to an internal assets path, strip the alien origin so it uses the current host
      if (parsed.pathname.includes('/assets/') || parsed.pathname.includes('/src/assets/')) {
        return parsed.pathname;
      }
      // If it's on a different origin, return the pathname to ensure same-domain resolution
      if (typeof window !== 'undefined' && parsed.origin !== window.location.origin) {
        if (parsed.pathname.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)) {
          return parsed.pathname;
        }
      }
      return src;
    } catch {
      return src;
    }
  }

  // Ensure relative path starts with /
  if (!src.startsWith('/') && !src.startsWith('.')) {
    return '/' + src;
  }

  return src;
}
