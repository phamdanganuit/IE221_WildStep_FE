const base_url = import.meta.env.VITE_BACKEND_URL;
import i18n from '@/i18n/config';
import { getCurrentLocale } from '@/lib/i18nUtils';

const makeRequest = async (endpoint, options = {}) => {
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    // Build URL and auto-append ?lang for public endpoints
    const url = new URL(`${base_url}${endpoint}`);
    const isAdmin = url.pathname.startsWith('/admin');
    if (!isAdmin && !url.searchParams.has('lang')) {
      const lang = (i18n?.language || getCurrentLocale() || 'vi').split('-')[0];
      url.searchParams.set('lang', lang);
    }

    const res = await fetch(url.toString(), {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error?.message || `Request failed with status ${res.status}`,
        status: res.status,
      };
    }

    if (res.status === 204) {
      return { success: true, data: null };
    }

    const contentLength = res.headers.get("content-length");
    const contentType = res.headers.get("content-type") || "";
    if (contentLength === "0" || contentType.indexOf("application/json") === -1) {
      return { success: true, data: null };
    }

    const data = await res.json().catch(() => null);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng." };
  }
};

export const getPublicBanners = async () => {
  // GET /api/content/banners → { data: Banner[] }
  return makeRequest(`/content/banners`);
};

export const getPublicBrands = async (lang) => {
  // GET /api/brands?lang=vi|en|ja → { data: Brand[] }
  const qs = lang ? `?lang=${encodeURIComponent(lang)}` : "";
  return makeRequest(`/brands${qs}`);
};

export const getPublicProducts = async ({ sort = "popular", category_slug = "", page = 1, page_size = 12, search = "", brand = "", gender = "", color = "", size = "", priceFrom = "", priceTo = "", category = "", min_rating = "", in_stock = "" } = {}) => {
  // GET /api/products?sort=&category_slug=&page=&page_size=&search=&brand=&gender=...
  const params = new URLSearchParams();
  if (sort) params.set("sort", sort);
  if (category_slug) params.set("category_slug", category_slug);
  if (page) params.set("page", String(page));
  if (page_size) params.set("page_size", String(page_size));
  if (search) params.set("search", search);
  if (brand) params.set("brand", brand);
  if (gender) params.set("gender", gender);
  if (color) params.set("color", color);
  if (size) params.set("size", size);
  if (priceFrom) params.set("priceFrom", String(priceFrom));
  if (priceTo) params.set("priceTo", String(priceTo));
  if (category) params.set("category", category);
  if (min_rating) params.set("min_rating", String(min_rating));
  if (in_stock) params.set("in_stock", String(in_stock));
  const qs = params.toString();
  return makeRequest(`/products${qs ? `?${qs}` : ""}`);
};

export const getPublicCategories = async () => {
  // GET /api/categories → { data: CategoryTree[] }
  return makeRequest(`/categories`);
};

// HERO CONTENT
export const getPublicHero = async () => {
  // GET /api/content/hero → { data: {...} } or { data: null }
  return makeRequest(`/content/hero`);
};

// PUBLIC REVIEWS
export const getPublicReviews = async ({ placement = "home", page = 1, page_size = 10 } = {}) => {
  // GET /api/reviews?placement=&page=&page_size=
  const params = new URLSearchParams();
  if (placement) params.set("placement", placement);
  if (page) params.set("page", String(page));
  if (page_size) params.set("page_size", String(page_size));
  const qs = params.toString();
  return makeRequest(`/reviews${qs ? `?${qs}` : ""}`);
};

// AUTOCOMPLETE
export const getProductAutocomplete = async (query, limit = 5) => {
  if (!query || query.length < 2) {
    return { success: false, error: "Query must be at least 2 characters" };
  }
  const params = new URLSearchParams();
  params.set("q", query);
  params.set("limit", String(limit));
  return makeRequest(`/products/autocomplete?${params.toString()}`);
};

// SEARCH PRODUCTS
export const searchProducts = async ({ query, page = 1, page_size = 12, sort = "relevance", brand = "", category_slug = "", priceFrom = "", priceTo = "", min_rating = "", in_stock = "" } = {}) => {
  if (!query) {
    return { success: false, error: "Query is required" };
  }
  const params = new URLSearchParams();
  params.set("q", query);
  params.set("page", String(page));
  params.set("page_size", String(page_size));
  if (sort) params.set("sort", sort);
  if (brand) params.set("brand", brand);
  if (category_slug) params.set("category_slug", category_slug);
  if (priceFrom) params.set("priceFrom", String(priceFrom));
  if (priceTo) params.set("priceTo", String(priceTo));
  if (min_rating) params.set("min_rating", String(min_rating));
  if (in_stock) params.set("in_stock", String(in_stock));
  return makeRequest(`/products/search?${params.toString()}`);
};

// GET PRODUCT DETAIL
export const getProductDetail = async (id) => {
  // GET /api/products/:id
  return makeRequest(`/products/${id}`);
};

export default {
  getPublicBanners,
  getPublicBrands,
  getPublicProducts,
  getPublicCategories,
  getPublicHero,
  getPublicReviews,
  getProductAutocomplete,
  searchProducts,
  getProductDetail,
};


