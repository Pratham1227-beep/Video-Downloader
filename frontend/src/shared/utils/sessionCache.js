const TTL_MS = 5 * 60 * 1000; // 5 minutes

export function sessionCacheGet(key) {
  try {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (error) {
    return null;
  }
}

export function sessionCacheSet(key, value) {
  try {
    const now = new Date().getTime();
    const item = {
      value,
      expiresAt: now + TTL_MS,
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn("Failed to set session cache", error);
  }
}
