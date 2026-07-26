import crypto from 'crypto';

class InMemoryCache {
  constructor() {
    this.store = new Map();
  }

  generateKey(namespace, payload) {
    const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    return `${namespace}:${hash}`;
  }

  get(namespace, payload) {
    const key = this.generateKey(namespace, payload);
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.data;
  }

  set(namespace, payload, data, ttlSeconds = 86400) {
    const key = this.generateKey(namespace, payload);
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  clear() {
    this.store.clear();
  }
}

export const inMemoryCache = new InMemoryCache();
