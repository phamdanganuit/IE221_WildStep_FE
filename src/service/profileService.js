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

// 1. Lấy thông tin profile (đã có trong authService.js)
export const getProfile = async () => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      if (res.status === 404) {
        throw new Error("Không tìm thấy người dùng");
      }
      throw new Error("Không thể lấy thông tin người dùng");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error("Lỗi lấy thông tin người dùng:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi lấy thông tin người dùng",
    };
  }
};

// 2. Cập nhật thông tin profile
export const updateProfile = async (profileData) => {
  try {
    const res = await fetch(`${base_url}/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
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
          error: errorData.detail || "Dữ liệu không hợp lệ",
        };
      }
      throw new Error("Không thể cập nhật thông tin");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Cập nhật thông tin thành công!",
    };
  } catch (err) {
    console.error("Lỗi cập nhật profile:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi cập nhật thông tin",
    };
  }
};

// 3. Upload avatar
export const uploadAvatar = async (file) => {
  try {
    const token = getStoredToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${base_url}/profile/avatar`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }
      if (res.status === 413) {
        return {
          success: false,
          error: "File quá lớn. Vui lòng chọn ảnh dưới 1MB.",
        };
      }
      if (res.status === 400) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "File không hợp lệ. Chỉ chấp nhận JPEG/PNG.",
        };
      }
      throw new Error("Không thể upload avatar");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Cập nhật ảnh đại diện thành công!",
    };
  } catch (err) {
    console.error("Lỗi upload avatar:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi upload ảnh",
    };
  }
};

// 4. Xóa tài khoản
export const deleteAccount = async (password = null) => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/me`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: password ? JSON.stringify({ password }) : null,
    });

    if (!res.ok) {
      if (res.status === 401) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Mật khẩu không đúng hoặc phiên đã hết hạn",
        };
      }
      throw new Error("Không thể xóa tài khoản");
    }

    return {
      success: true,
      message: "Xóa tài khoản thành công",
    };
  } catch (err) {
    console.error("Lỗi xóa tài khoản:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi xóa tài khoản",
    };
  }
};

