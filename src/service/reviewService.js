const base_url = import.meta.env.VITE_BACKEND_URL;
import { getStoredToken } from "./authService";

const parseErrorResponse = async (res) => {
  let errorDetail = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    errorDetail =
      body?.detail ||
      body?.message ||
      body?.error?.message ||
      errorDetail;
  } catch {
    // ignore JSON parse error
  }
  return errorDetail;
};

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null || item === "") return;
        query.append(key, item);
      });
      return;
    }
    query.append(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
};

export const getProductReviews = async (productId, params = {}) => {
  if (!productId) {
    return { success: false, error: "Thiếu productId để tải đánh giá" };
  }

  const qs = buildQueryString({
    page: params.page,
    page_size: params.page_size,
    rating: params.rating,
    ratings: params.ratings,
    has_images: params.has_images,
    has_media: params.has_media,
    has_description: params.has_description,
    sort: params.sort,
  });

  try {
    const res = await fetch(`${base_url}/products/${productId}/reviews${qs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = await parseErrorResponse(res);
      return { success: false, error };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Không thể tải danh sách đánh giá",
    };
  }
};

export const createProductReview = async (productId, payload) => {
  if (!productId) {
    return { success: false, error: "Thiếu productId để tạo đánh giá" };
  }
  const token = getStoredToken();
  if (!token) {
    return { success: false, error: "Vui lòng đăng nhập để đánh giá sản phẩm" };
  }

  try {
    const res = await fetch(`${base_url}/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await parseErrorResponse(res);
      return { success: false, error };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Không thể gửi đánh giá",
    };
  }
};

export const reactToReview = async (reviewId, action = "like") => {
  if (!reviewId) {
    return { success: false, error: "Thiếu reviewId" };
  }

  const token = getStoredToken();
  if (!token) {
    return { success: false, error: "Vui lòng đăng nhập để tương tác đánh giá" };
  }

  const normalizedAction =
    action === "dislike" || action === "unlike" ? "dislike" : "like";
  const endpoint = `${base_url}/reviews/${reviewId}/${normalizedAction}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body:
        action === "unlike" && normalizedAction === "like"
          ? JSON.stringify({ action: "unlike" })
          : undefined,
    });

    if (!res.ok) {
      const error = await parseErrorResponse(res);
      return { success: false, error };
    }

    const data = await res.json().catch(() => ({}));
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Không thể cập nhật tương tác",
    };
  }
};

export const getReviewableItems = async (orderId) => {
  if (!orderId) {
    return { success: false, error: "Thiếu orderId để tải danh sách đánh giá" };
  }

  const token = getStoredToken();
  if (!token) {
    return { success: false, error: "Vui lòng đăng nhập để xem đánh giá" };
  }

  try {
    const res = await fetch(
      `${base_url}/orders/${orderId}/reviewable-items`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const error = await parseErrorResponse(res);
      return { success: false, error };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Không thể tải danh sách sản phẩm cần đánh giá",
    };
  }
};

export const submitOrderReviews = async (orderId, items = []) => {
  if (!orderId) {
    return { success: false, error: "Thiếu orderId" };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: "Danh sách review không được để trống" };
  }

  const token = getStoredToken();
  if (!token) {
    return { success: false, error: "Vui lòng đăng nhập để đánh giá" };
  }

  try {
    const res = await fetch(`${base_url}/orders/${orderId}/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const error = await parseErrorResponse(res);
      return { success: false, error };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Không thể gửi đánh giá",
    };
  }
};

export const updateOrderReview = async (orderId, reviewId, payload = {}) => {
  if (!orderId || !reviewId) {
    return { success: false, error: "Thiếu orderId hoặc reviewId" };
  }

  const token = getStoredToken();
  if (!token) {
    return { success: false, error: "Vui lòng đăng nhập để chỉnh sửa đánh giá" };
  }

  try {
    const res = await fetch(
      `${base_url}/orders/${orderId}/reviews/${reviewId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const error = await parseErrorResponse(res);
      return { success: false, error };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Không thể cập nhật đánh giá",
    };
  }
};

export default {
  getProductReviews,
  createProductReview,
  reactToReview,
  getReviewableItems,
  submitOrderReviews,
  updateOrderReview,
};

