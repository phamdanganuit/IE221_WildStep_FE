const base_url = import.meta.env.VITE_BACKEND_URL;
import { getStoredToken } from "./authService";

/**
 * Lấy giỏ hàng của user hiện tại
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getMyCard = async () => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Không thể lấy giỏ hàng");
    }
    const data = await res.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi lấy giỏ hàng",
    };
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {string} productId - ID của sản phẩm
 * @param {number} quantity - Số lượng (min: 1, max: 99)
 * @param {string} size - Tên size (phải khớp với size_name trong product)
 * @param {string} color - Tên màu (phải khớp với color_name trong product)
 * @returns {Promise<{success: boolean, data?: object, message?: string, error?: string}>}
 */
export const addToCart = async (productId, quantity, size, color) => {
  try {
    const token = getStoredToken();
    
    // Validate inputs
    if (!productId) {
      throw new Error("Product ID không được để trống");
    }
    if (!size || !size.trim()) {
      throw new Error("Size không được để trống");
    }
    if (!color || !color.trim()) {
      throw new Error("Color không được để trống");
    }
    
    // Mặc định quantity = 1 nếu không được truyền hoặc không hợp lệ
    let finalQuantity = 1;
    if (quantity !== undefined && quantity !== null) {
      const numQuantity = Number(quantity);
      if (!isNaN(numQuantity) && numQuantity >= 1 && numQuantity <= 99) {
        finalQuantity = numQuantity;
      }
    }

    const requestBody = {
      productId: String(productId).trim(),
      quantity: finalQuantity,
      size: String(size).trim(),
      color: String(color).trim(),
    };

    const res = await fetch(`${base_url}/cart/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
      }
      
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { detail: `HTTP ${res.status}: ${res.statusText}` };
      }
      
      const errorMessage = errorData.detail || 
                          errorData.message || 
                          `Không thể thêm sản phẩm vào giỏ hàng (${res.status})`;
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    
    return {
      success: true,
      data,
      message: data.message || "Đã thêm sản phẩm vào giỏ hàng",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng",
    };
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {string|number} cartItemId - ID hoặc index của cart item
 * @param {number} quantity - Số lượng mới (min: 1, max: 99)
 * @returns {Promise<{success: boolean, data?: object, message?: string, error?: string}>}
 */
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/cart/items/${cartItemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Không thể cập nhật số lượng");
    }
    const data = await res.json();
    return {
      success: true,
      data,
      message: data.message || "Đã cập nhật số lượng thành công",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi cập nhật số lượng",
    };
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {string|number} cartItemId - ID hoặc index của cart item
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const removeFromCart = async (cartItemId) => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/cart/items/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Không thể xóa sản phẩm khỏi giỏ hàng");
    }
    // Response có thể là 200 với body hoặc 204 No Content
    const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
    return {
      success: true,
      message: data.message || "Xóa sản phẩm khỏi giỏ hàng thành công!",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng",
    };
  }
};

/**
 * Xóa tất cả sản phẩm khỏi giỏ hàng
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const clearCart = async () => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/cart/items`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Không thể xóa giỏ hàng");
    }
    const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
    return {
      success: true,
      message: data.message || "Đã xóa tất cả sản phẩm khỏi giỏ hàng",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi xóa giỏ hàng",
    };
  }
};

/**
 * Lấy tổng số lượng sản phẩm trong giỏ hàng (cho badge)
 * @returns {Promise<{success: boolean, count?: number, error?: string}>}
 */
export const getCartCount = async () => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/cart/count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Không thể lấy số lượng giỏ hàng");
    }
    const data = await res.json();
    return {
      success: true,
      count: data.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi lấy số lượng giỏ hàng",
      count: 0,
    };
  }
};
