/**
 * Safe localStorage utilities.
 * Prevents JSON.parse from throwing on corrupted/invalid data.
 * @see .cursor/skills/local-storage-security
 */

export function getStorageJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStorageJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      console.warn(`[storage] Quota exceeded for key: ${key}`);
    }
  }
}
