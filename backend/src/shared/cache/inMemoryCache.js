/**
 * In-memory cache with TTL logic.
 */
class InMemoryCache {
  constructor() {
    this.cache = new Map();
    // Default TTL is 5 minutes (300000ms), but can be configured via env
    this.ttlMs = parseInt(process.env.CACHE_TTL_MS, 10) || 300000;

    // Run eviction sweep every 60 seconds
    setInterval(() => this.sweep(), 60000).unref();
  }

  /**
   * Get an item from the cache.
   * @param {string} key 
   * @returns {*} cached value or null if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set an item in the cache.
   * @param {string} key 
   * @param {*} value 
   */
  set(key, value) {
    const expiry = Date.now() + this.ttlMs;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Evict expired entries from the cache map.
   */
  sweep() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Export a singleton instance
module.exports = new InMemoryCache();
