// Web Storage helpers that never throw (private mode, blocked storage, SSR).
// Pass the store by NAME: even reading `window.sessionStorage` can throw.

export type StoreName = 'local' | 'session'

function store(name: StoreName): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return name === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function safeGet(name: StoreName, key: string): string | null {
  try {
    return store(name)?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function safeSet(name: StoreName, key: string, value: string): boolean {
  try {
    const s = store(name)
    if (!s) return false
    s.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function safeRemove(name: StoreName, key: string): void {
  try {
    store(name)?.removeItem(key)
  } catch {
    /* ignore */
  }
}

/** JSON read; returns null on missing or malformed data. */
export function safeGetJSON<T>(name: StoreName, key: string): T | null {
  const raw = safeGet(name, key)
  if (raw == null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function safeSetJSON(name: StoreName, key: string, value: unknown): boolean {
  try {
    return safeSet(name, key, JSON.stringify(value))
  } catch {
    return false
  }
}

/** Storage keys used by the page (sessionStorage survives the /, /ca/, /en/ switch). */
export const STORAGE_KEYS = {
  theme: 'theme', // localStorage: 'light' | 'dark' | absent (= system)
  legacyLocale: 'locale', // localStorage key from the old site, removed once on mount
  tasks: 'dh:tasks', // sessionStorage: { ids, other, otherOn }
  draft: 'dh:draft', // sessionStorage: contact draft (owned by useContactForm)
  autorun: 'dh:autorun', // sessionStorage: '1' once the hero autorun has played
} as const
