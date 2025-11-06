const base_url = import.meta.env.VITE_BACKEND_URL;

const makeRequest = async (endpoint, options = {}) => {
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(`${base_url}${endpoint}`, {
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
    console.error("Public API Error:", error);
    return { success: false, error: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng." };
  }
};

export const getPublicBanners = async () => {
  // GET /api/content/banners → { data: Banner[] }
  return makeRequest(`/content/banners`);
};

export const getPublicBrands = async () => {
  // GET /api/brands → { data: Brand[] }
  return makeRequest(`/brands`);
};

export const getPublicProducts = async ({ sort = "popular", category_slug = "", page = 1, page_size = 12 } = {}) => {
  // GET /api/products?sort=&category_slug=&page=&page_size=
  const params = new URLSearchParams();
  if (sort) params.set("sort", sort);
  if (category_slug) params.set("category_slug", category_slug);
  if (page) params.set("page", String(page));
  if (page_size) params.set("page_size", String(page_size));
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

export default {
  getPublicBanners,
  getPublicBrands,
  getPublicProducts,
  getPublicCategories,
  getPublicHero,
  getPublicReviews,
};


