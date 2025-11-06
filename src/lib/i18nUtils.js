/**
 * Utility functions for i18n translation
 */

/**
 * Translate category name from API
 * @param {string} categoryName - Category name from API (e.g., "Nam", "Nữ")
 * @param {Function} t - i18next translation function
 * @returns {string} - Translated category name
 */
export const translateCategoryName = (categoryName, t) => {
  if (!categoryName) return '';
  
  // Create a mapping for Vietnamese category names to translation keys
  const categoryMap = {
    'Nam': 'categories.men',
    'Nữ': 'categories.women',
    'Unisex': 'categories.unisex',
    'Trẻ em': 'categories.kids',
    'Phụ kiện thể thao': 'categories.accessories',
    'Chạy bộ': 'categories.running',
    'Bóng đá': 'categories.football',
    'Bóng rổ': 'categories.basketball',
    'Tennis': 'categories.tennis',
    'Lifestyle': 'categories.lifestyle',
  };

  // Check if the category name exists in our mapping
  const translationKey = categoryMap[categoryName];
  
  // If found, translate it; otherwise return original name
  return translationKey ? t(translationKey) : categoryName;
};

/**
 * Translate brand name (if needed in future)
 * @param {string} brandName - Brand name from API
 * @param {Function} t - i18next translation function
 * @returns {string} - Translated or original brand name
 */
export const translateBrandName = (brandName, t) => {
  // For now, brand names are typically kept as-is (Nike, Adidas, etc.)
  // But you can add translations if needed
  return brandName;
};

/**
 * Translate status (for orders, products, etc.)
 * @param {string} status - Status value
 * @param {Function} t - i18next translation function
 * @param {string} context - Context prefix (e.g., 'dashboard.orderStatus')
 * @returns {string} - Translated status
 */
export const translateStatus = (status, t, context = 'dashboard.orderStatus') => {
  if (!status) return '';
  
  try {
    return t(`${context}.${status}`);
  } catch (error) {
    return status;
  }
};

// ================== I18N helpers for API ==================

import i18n from '@/i18n/config';

/**
 * Get current locale from URL prefix (/vi|/en|/ja), i18n, or fallback 'vi'.
 */
export const getCurrentLocale = () => {
  try {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const match = path.match(/^\/(vi|en|ja)(\/|$)/);
    if (match) return match[1];
  } catch {}
  if (i18n?.language) return i18n.language.split('-')[0];
  return 'vi';
};

/**
 * Pick localized text with fallback chain. Accepts string or {vi,en,ja}.
 */
export const pickLocalized = (value, lang, fallbacks = ['vi', 'en', 'ja']) => {
  if (value == null) return '';
  if (typeof value === 'string') return value || '';
  if (typeof value === 'object') {
    const primary = value[lang];
    if (primary) return primary;
    for (const fb of fallbacks) {
      if (value[fb]) return value[fb];
    }
    const any = Object.values(value).find((v) => !!v);
    return any || '';
  }
  return String(value ?? '');
};

/**
 * Safe display text: try localized pick then default fallback string.
 */
export const safeText = (value, lang, fallbackDisplay = 'N/A') => {
  const picked = pickLocalized(value, lang);
  return picked && String(picked).trim() ? picked : fallbackDisplay;
};

