/**
 * Validates if a string is a well-formed HTTP/HTTPS URL.
 * @param {string} url - The URL string to validate.
 * @returns {Object} { valid: boolean, url?: string, error?: string }
 */
function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required and must be a string.' };
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return { valid: true, url: parsedUrl.toString() };
    }
    return { valid: false, error: 'URL must use HTTP or HTTPS protocol.' };
  } catch (err) {
    return { valid: false, error: 'Malformed URL provided.' };
  }
}

module.exports = { validateUrl };
