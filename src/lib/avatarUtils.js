/**
 * Convert avatar URL to full URL if it's a relative path
 * @param {string} avatarUrl - Avatar URL from API (can be relative or absolute)
 * @returns {string} - Full URL to avatar image
 */
export const getFullAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  
  // If already a full URL (starts with http:// or https://), return as is
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }
  
  // If it's a relative path, construct full URL
  const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
  // Remove /api suffix if exists
  const mediaBaseUrl = baseUrl.replace('/api', '');
  
  // Ensure avatarUrl starts with /
  const normalizedPath = avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`;
  
  return `${mediaBaseUrl}${normalizedPath}`;
};

