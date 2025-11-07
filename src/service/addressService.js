const base_url = import.meta.env.VITE_BACKEND_URL;
import { getStoredToken } from "./authService";

// Helper function để tạo headers với token
const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// 1. Lấy danh sách địa chỉ
export const getAddresses = async () => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/addresses`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn");
      }
      throw new Error("Không thể lấy danh sách địa chỉ");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error("Lỗi lấy danh sách địa chỉ:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi lấy danh sách địa chỉ",
    };
  }
};

// 2. Thêm địa chỉ mới
export const createAddress = async (addressData) => {
  try {
    const res = await fetch(`${base_url}/addresses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }
      if (res.status === 400) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Dữ liệu địa chỉ không hợp lệ",
        };
      }
      throw new Error("Không thể thêm địa chỉ");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Thêm địa chỉ thành công!",
    };
  } catch (err) {
    console.error("Lỗi thêm địa chỉ:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi thêm địa chỉ",
    };
  }
};

// 3. Cập nhật địa chỉ
export const updateAddress = async (addressId, addressData) => {
  try {
    const res = await fetch(`${base_url}/addresses/${addressId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }
      if (res.status === 404) {
        return {
          success: false,
          error: "Không tìm thấy địa chỉ",
        };
      }
      if (res.status === 400) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Dữ liệu địa chỉ không hợp lệ",
        };
      }
      throw new Error("Không thể cập nhật địa chỉ");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Cập nhật địa chỉ thành công!",
    };
  } catch (err) {
    console.error("Lỗi cập nhật địa chỉ:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi cập nhật địa chỉ",
    };
  }
};

// 4. Đặt địa chỉ mặc định
export const setDefaultAddress = async (addressId) => {
  try {
    const res = await fetch(`${base_url}/addresses/${addressId}/default`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }
      if (res.status === 404) {
        return {
          success: false,
          error: "Không tìm thấy địa chỉ",
        };
      }
      throw new Error("Không thể đặt địa chỉ mặc định");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Đặt địa chỉ mặc định thành công!",
    };
  } catch (err) {
    console.error("Lỗi đặt địa chỉ mặc định:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi đặt địa chỉ mặc định",
    };
  }
};

// 5. Xóa địa chỉ
export const deleteAddress = async (addressId) => {
  try {
    const res = await fetch(`${base_url}/addresses/${addressId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }
      if (res.status === 404) {
        return {
          success: false,
          error: "Không tìm thấy địa chỉ",
        };
      }
      throw new Error("Không thể xóa địa chỉ");
    }

    return {
      success: true,
      message: "Xóa địa chỉ thành công!",
    };
  } catch (err) {
    console.error("Lỗi xóa địa chỉ:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi xóa địa chỉ",
    };
  }
};

