const base_url = import.meta.env.VITE_BACKEND_URL;
import { getStoredToken } from "./authService";

/**
 * Tạo đơn hàng từ giỏ hàng
 * @param {string} addressId - ID địa chỉ giao hàng
 * @param {string|string[]|null} voucherId - ID voucher hoặc mảng voucher IDs (optional)
 * @param {string} paymentMethod - Phương thức thanh toán (cod | bank_transfer | credit_card | e_wallet)
 * @param {string} notes - Ghi chú (optional)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createOrder = async (addressId, voucherId, paymentMethod, notes) => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      throw new Error("Vui lòng đăng nhập để đặt hàng");
    }

    if (!addressId) {
      throw new Error("Vui lòng chọn địa chỉ giao hàng");
    }

    if (!paymentMethod) {
      throw new Error("Vui lòng chọn phương thức thanh toán");
    }

    const requestBody = {
      address_id: addressId,
      payment_method: paymentMethod,
    };

    // Support both single voucher ID and array of voucher IDs
    // Note: Backend API currently only supports single voucher_id
    // If array is provided, only the first voucher will be sent
    if (voucherId) {
      if (Array.isArray(voucherId) && voucherId.length > 0) {
        // Backend only supports single voucher, so send the first one
        // TODO: Update when backend supports multiple vouchers (voucher_ids array)
        requestBody.voucher_id = voucherId[0];
        
        // Log warning if multiple vouchers provided (for debugging)
        if (voucherId.length > 1) {
          console.warn(`Multiple vouchers provided (${voucherId.length}), but backend only supports one. Using first voucher: ${voucherId[0]}`);
        }
      } else if (typeof voucherId === 'string') {
        requestBody.voucher_id = voucherId;
      }
    }

    if (notes) {
      requestBody.notes = notes;
    }

    const res = await fetch(`${base_url}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { detail: `HTTP ${res.status}: ${res.statusText}` };
      }
      
      const errorMessage = errorData.detail || 
                          errorData.message || 
                          `Không thể tạo đơn hàng (${res.status})`;
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    
    return {
      success: true,
      data: data.order || data,
      message: "Đặt hàng thành công!",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi tạo đơn hàng",
    };
  }
};

/**
 * Lấy danh sách đơn hàng của user
 * @param {object} params - Query parameters (status, page, limit, etc.)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getOrders = async (params = {}) => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      throw new Error("Vui lòng đăng nhập để xem đơn hàng");
    }

    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = `${base_url}/orders${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { detail: `HTTP ${res.status}: ${res.statusText}` };
      }
      
      const errorMessage = errorData.detail || 
                          errorData.message || 
                          `Không thể lấy danh sách đơn hàng (${res.status})`;
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    
    return {
      success: true,
      data: data.orders || data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi lấy danh sách đơn hàng",
    };
  }
};

/**
 * Lấy chi tiết đơn hàng
 * @param {string} orderId - ID đơn hàng
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getOrderDetail = async (orderId) => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      throw new Error("Vui lòng đăng nhập để xem chi tiết đơn hàng");
    }

    if (!orderId) {
      throw new Error("ID đơn hàng không hợp lệ");
    }

    const res = await fetch(`${base_url}/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      
      if (res.status === 404) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { detail: `HTTP ${res.status}: ${res.statusText}` };
      }
      
      const errorMessage = errorData.detail || 
                          errorData.message || 
                          `Không thể lấy chi tiết đơn hàng (${res.status})`;
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    
    return {
      success: true,
      data: data.order || data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi lấy chi tiết đơn hàng",
    };
  }
};

/**
 * Hủy đơn hàng
 * @param {string} orderId - ID đơn hàng
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const cancelOrder = async (orderId) => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      throw new Error("Vui lòng đăng nhập để hủy đơn hàng");
    }

    if (!orderId) {
      throw new Error("ID đơn hàng không hợp lệ");
    }

    const res = await fetch(`${base_url}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "cancelled" }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      
      if (res.status === 404) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { detail: `HTTP ${res.status}: ${res.statusText}` };
      }
      
      const errorMessage = errorData.detail || 
                          errorData.message || 
                          `Không thể hủy đơn hàng (${res.status})`;
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    
    return {
      success: true,
      data: data.order || data,
      message: "Hủy đơn hàng thành công",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi hủy đơn hàng",
    };
  }
};

