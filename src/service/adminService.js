import { getStoredToken } from "./authService";

const base_url = import.meta.env.VITE_BACKEND_URL;

// Helper function to make authenticated requests
const makeAuthRequest = async (endpoint, options = {}) => {
  const token = getStoredToken();
  
  const headers = {
    ...options.headers,
  };

  // Only add Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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

    // Handle No Content (e.g., DELETE 204)
    if (res.status === 204) {
      return { success: true, data: null };
    }

    // Some backends may return empty body with 200/202
    const contentLength = res.headers.get("content-length");
    const contentType = res.headers.get("content-type") || "";
    if (contentLength === "0" || contentType.indexOf("application/json") === -1) {
      return { success: true, data: null };
    }

    const data = await res.json().catch(() => null);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.",
    };
  }
};

// ==================== DASHBOARD ====================

export const getDashboardStats = async (period = "month") => {
  return makeAuthRequest(`/admin/dashboard/stats?period=${period}`);
};

export const getAnalytics = async (period = "month") => {
  return makeAuthRequest(`/admin/analytics?period=${period}`);
};

// ==================== PRODUCTS ====================

export const getProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      queryParams.append(key, params[key]);
    }
  });

  const queryString = queryParams.toString();
  return makeAuthRequest(`/admin/products${queryString ? `?${queryString}` : ""}`);
};

export const getProduct = async (id) => {
  return makeAuthRequest(`/admin/products/${id}`);
};

export const createProduct = async (productData) => {
  return makeAuthRequest("/admin/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id, productData) => {
  return makeAuthRequest(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  return makeAuthRequest(`/admin/products/${id}`, {
    method: "DELETE",
  });
};

export const uploadProductImages = async (id, files) => {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append("images", file);
  });

  return makeAuthRequest(`/admin/products/${id}/images`, {
    method: "POST",
    body: formData,
  });
};

// Delete a single product image by URL
export const removeProductImage = async (id, imageUrl) => {
  return makeAuthRequest(`/admin/products/${id}/images`, {
    method: "DELETE",
    body: JSON.stringify({ image: imageUrl }),
  });
};

// ==================== ORDERS ====================

export const getOrders = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      queryParams.append(key, params[key]);
    }
  });

  const queryString = queryParams.toString();
  return makeAuthRequest(`/admin/orders${queryString ? `?${queryString}` : ""}`);
};

export const getOrder = async (id) => {
  return makeAuthRequest(`/admin/orders/${id}`);
};

export const updateOrderStatus = async (id, status) => {
  return makeAuthRequest(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ==================== CUSTOMERS ====================

export const getCustomers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      queryParams.append(key, params[key]);
    }
  });

  const queryString = queryParams.toString();
  return makeAuthRequest(`/admin/customers${queryString ? `?${queryString}` : ""}`);
};

export const getCustomer = async (id) => {
  return makeAuthRequest(`/admin/customers/${id}`);
};

export const updateCustomerStatus = async (id, status) => {
  return makeAuthRequest(`/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ==================== CATEGORIES ====================

export const getCategories = async () => {
  return makeAuthRequest("/admin/categories");
};

export const createCategory = async (categoryData) => {
  return makeAuthRequest("/admin/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

export const updateCategory = async (id, categoryData) => {
  return makeAuthRequest(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategory = async (id) => {
  return makeAuthRequest(`/admin/categories/${id}`, {
    method: "DELETE",
  });
};

// ==================== BRANDS ====================

export const getBrands = async () => {
  return makeAuthRequest("/admin/brands");
};

export const createBrand = async (brandData) => {
  return makeAuthRequest("/admin/brands", {
    method: "POST",
    body: JSON.stringify(brandData),
  });
};

export const updateBrand = async (id, brandData) => {
  return makeAuthRequest(`/admin/brands/${id}`, {
    method: "PUT",
    body: JSON.stringify(brandData),
  });
};

export const deleteBrand = async (id) => {
  return makeAuthRequest(`/admin/brands/${id}`, {
    method: "DELETE",
  });
};

// Upload brand logo (multipart)
export const uploadBrandLogo = async (id, fileOrFormData) => {
  const formData = fileOrFormData instanceof FormData ? fileOrFormData : new FormData();
  if (!(fileOrFormData instanceof FormData)) {
    if (!fileOrFormData) {
      return { success: false, error: "Thiếu file logo" };
    }
    // Backend accepts keys: image | logo | file (ưu tiên image)
    formData.append("image", fileOrFormData);
  }
  return makeAuthRequest(`/admin/brands/${id}/logo`, {
    method: "POST",
    body: formData,
  });
};

// ==================== BANNERS (ADMIN) ====================

export const getAdminBanners = async () => {
  // GET /admin/banners (sorted by order asc)
  return makeAuthRequest(`/admin/banners`);
};

export const getAdminBanner = async (bannerId) => {
  return makeAuthRequest(`/admin/banners/${bannerId}`);
};

export const createAdminBanner = async (payload) => {
  // JSON body variant
  return makeAuthRequest(`/admin/banners`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const createAdminBannerForm = async (file, fields = {}) => {
  // Multipart variant
  const formData = new FormData();
  if (file) formData.append("image", file);
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) formData.append(k, v);
  });
  return makeAuthRequest(`/admin/banners`, {
    method: "POST",
    body: formData,
  });
};

export const updateAdminBanner = async (bannerId, payload) => {
  return makeAuthRequest(`/admin/banners/${bannerId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteAdminBanner = async (bannerId) => {
  return makeAuthRequest(`/admin/banners/${bannerId}`, {
    method: "DELETE",
  });
};

export const uploadAdminBannerImage = async (bannerId, file) => {
  const formData = new FormData();
  if (!file) return { success: false, error: "Thiếu file ảnh banner" };
  formData.append("image", file);
  return makeAuthRequest(`/admin/banners/${bannerId}/image`, {
    method: "POST",
    body: formData,
  });
};

// ==================== VOUCHERS (ADMIN) ====================

export const getVouchers = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      queryParams.append(key, params[key]);
    }
  });

  const queryString = queryParams.toString();
  return makeAuthRequest(`/admin/vouchers${queryString ? `?${queryString}` : ""}`);
};

export const getVoucher = async (id) => {
  return makeAuthRequest(`/admin/vouchers/${id}`);
};

export const createVoucher = async (voucherData) => {
  return makeAuthRequest("/admin/vouchers", {
    method: "POST",
    body: JSON.stringify(voucherData),
  });
};

export const updateVoucher = async (id, voucherData) => {
  return makeAuthRequest(`/admin/vouchers/${id}`, {
    method: "PUT",
    body: JSON.stringify(voucherData),
  });
};

export const deleteVoucher = async (id) => {
  return makeAuthRequest(`/admin/vouchers/${id}`, {
    method: "DELETE",
  });
};

