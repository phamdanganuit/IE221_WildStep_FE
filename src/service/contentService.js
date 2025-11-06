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

export default {
  getPublicBanners,
};


