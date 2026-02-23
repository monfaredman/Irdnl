export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  storageUrl: process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:3001/storage',
};

// In static export mode, storage URLs must be absolute
export function getStorageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.storageUrl}/${path.replace(/^\/storage\//, '')}`;
}