/**
 * Normalizes a URL for comparison.
 * - Removes trailing slashes.
 * - Converts to lowercase.
 * - Removes http/https prefix for agnostic comparison.
 * @param {string} url 
 * @returns {string}
 */
export const normalizeUrl = (url) => {
  if (!url) return '';
  try {
    let normalized = url.trim().toLowerCase();
    // Remove protocol
    normalized = normalized.replace(/^https?:\/\//, '');
    // Remove trailing slash
    normalized = normalized.replace(/\/$/, '');
    // Remove www.
    normalized = normalized.replace(/^www\./, '');
    return normalized;
  } catch (e) {
    return url;
  }
};

export const isDuplicateUrl = (newUrl, existingBookmarks) => {
  const normalizedNew = normalizeUrl(newUrl);
  return existingBookmarks.some(b => normalizeUrl(b.url) === normalizedNew);
};
