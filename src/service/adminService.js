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

    const data = await res.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.",
    };
  }
};

// ==================== DASHBOARD ====================

export const getDashboardStats = async (period = "month") => {
  return makeAuthRequest(`/api/admin/dashboard/stats?period=${period}`);
};

export const getAnalytics = async (period = "month") => {
  return makeAuthRequest(`/api/admin/analytics?period=${period}`);
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
  return makeAuthRequest(`/api/admin/products${queryString ? `?${queryString}` : ""}`);
};

export const getProduct = async (id) => {
  return makeAuthRequest(`/api/admin/products/${id}`);
};

export const createProduct = async (productData) => {
  return makeAuthRequest("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

export const updateProduct = async (id, productData) => {
  return makeAuthRequest(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

export const deleteProduct = async (id) => {
  return makeAuthRequest(`/api/admin/products/${id}`, {
    method: "DELETE",
  });
};

export const uploadProductImages = async (id, files) => {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append("images", file);
  });

  return makeAuthRequest(`/api/admin/products/${id}/images`, {
    method: "POST",
    body: formData,
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
  return makeAuthRequest(`/api/admin/orders${queryString ? `?${queryString}` : ""}`);
};

export const getOrder = async (id) => {
  return makeAuthRequest(`/api/admin/orders/${id}`);
};

export const updateOrderStatus = async (id, status) => {
  return makeAuthRequest(`/api/admin/orders/${id}/status`, {
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
  return makeAuthRequest(`/api/admin/customers${queryString ? `?${queryString}` : ""}`);
};

export const getCustomer = async (id) => {
  return makeAuthRequest(`/api/admin/customers/${id}`);
};

export const updateCustomerStatus = async (id, status) => {
  return makeAuthRequest(`/api/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ==================== CATEGORIES ====================

export const getCategories = async () => {
  return makeAuthRequest("/api/admin/categories");
};

export const createCategory = async (categoryData) => {
  return makeAuthRequest("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

export const updateCategory = async (id, categoryData) => {
  return makeAuthRequest(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategory = async (id) => {
  return makeAuthRequest(`/api/admin/categories/${id}`, {
    method: "DELETE",
  });
};

// ==================== BRANDS ====================

export const getBrands = async () => {
  return makeAuthRequest("/api/admin/brands");
};

export const createBrand = async (brandData) => {
  return makeAuthRequest("/api/admin/brands", {
    method: "POST",
    body: JSON.stringify(brandData),
  });
};

export const updateBrand = async (id, brandData) => {
  return makeAuthRequest(`/api/admin/brands/${id}`, {
    method: "PUT",
    body: JSON.stringify(brandData),
  });
};

export const deleteBrand = async (id) => {
  return makeAuthRequest(`/api/admin/brands/${id}`, {
    method: "DELETE",
  });
};

