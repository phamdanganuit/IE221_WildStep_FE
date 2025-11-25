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
        error: errorData.error?.message || errorData.message || `Request failed with status ${res.status}`,
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
    console.error("API Error:", error);
    return {
      success: false,
      error: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.",
    };
  }
};

export const addVoucherIntoMyList = async (code) => {
  try {
    const result = await makeAuthRequest("/addVoucher", {
      method: "POST",
      body: JSON.stringify({ code: code.trim().toUpperCase() }),
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Mã giảm giá không hợp lệ hoặc đã hết hạn",
      };
    }

    // Transform response data to match expected format
    const voucherData = result.data?.voucher || result.data;
    
    return {
      success: true,
      message: "Thêm mã giảm giá thành công!",
      data: voucherData,
    };
  } catch (error) {
    console.log("Đã xảy ra lỗi khi thêm voucher: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi thêm voucher.",
    };
  }
};

export const getMyVouchersList = async () => {
  try {
    const result = await makeAuthRequest("/vouchers", {
      method: "GET",
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Không thể lấy danh sách mã giảm giá",
      };
    }

    // Transform response data to match expected format
    const vouchers = result.data?.data || result.data || [];
    
    // Map backend format to frontend format (if needed)
    const transformedVouchers = vouchers.map((v) => {
      const voucher = v.voucher || v;
      return {
        ...voucher,
        // Map field names if backend uses different names
        start: voucher.start_date || voucher.start,
        expired: voucher.expired_date || voucher.expired,
        minValue: voucher.min_value || voucher.minValue,
        category: voucher.categories || voucher.category || [],
      };
    });

    return {
      success: true,
      data: transformedVouchers,
    };
  } catch (error) {
    console.log("Không thể lấy danh sách mã giảm giá: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi lấy danh sách mã giảm giá",
    };
  }
};

export const removeVoucherFromList = async (voucherId) => {
  try {
    const result = await makeAuthRequest("/removeVoucher", {
      method: "DELETE",
      body: JSON.stringify({ voucherId }),
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Không thể xóa mã giảm giá",
      };
    }

    return {
      success: true,
      message: "Xóa mã giảm giá thành công!",
    };
  } catch (error) {
    console.log("Không thể xóa mã giảm giá: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi xóa mã giảm giá",
    };
  }
};
