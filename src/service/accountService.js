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

// ============================================
// PASSWORD MANAGEMENT
// ============================================

// Đổi mật khẩu
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const res = await fetch(`${base_url}/change-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Mật khẩu hiện tại không đúng",
        };
      }
      if (res.status === 400) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Mật khẩu mới không hợp lệ",
        };
      }
      throw new Error("Không thể đổi mật khẩu");
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || "Đổi mật khẩu thành công!",
    };
  } catch (err) {
    console.error("Lỗi đổi mật khẩu:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi đổi mật khẩu",
    };
  }
};

// ============================================
// SOCIAL LINKS MANAGEMENT
// ============================================

// Lấy trạng thái liên kết các tài khoản MXH
export const getSocialLinks = async () => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/links`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn");
      }
      throw new Error("Không thể lấy thông tin liên kết");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error("Lỗi lấy thông tin liên kết:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi lấy thông tin liên kết",
    };
  }
};

// Liên kết tài khoản Google
export const linkGoogleAccount = async (accessToken) => {
  try {
    const res = await fetch(`${base_url}/links/google`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Token Google không hợp lệ",
        };
      }
      if (res.status === 400) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Không thể liên kết tài khoản Google",
        };
      }
      throw new Error("Không thể liên kết tài khoản Google");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Liên kết tài khoản Google thành công!",
    };
  } catch (err) {
    console.error("Lỗi liên kết Google:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi liên kết tài khoản Google",
    };
  }
};

// Hủy liên kết tài khoản Google
export const unlinkGoogleAccount = async () => {
  try {
    const res = await fetch(`${base_url}/links/google`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Phiên đăng nhập đã hết hạn",
        };
      }
      throw new Error("Không thể hủy liên kết tài khoản Google");
    }

    return {
      success: true,
      message: "Hủy liên kết tài khoản Google thành công!",
    };
  } catch (err) {
    console.error("Lỗi hủy liên kết Google:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi hủy liên kết tài khoản Google",
    };
  }
};

// Liên kết tài khoản Facebook
export const linkFacebookAccount = async (accessToken) => {
  try {
    const res = await fetch(`${base_url}/links/facebook`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Token Facebook không hợp lệ",
        };
      }
      if (res.status === 400) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Không thể liên kết tài khoản Facebook",
        };
      }
      throw new Error("Không thể liên kết tài khoản Facebook");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Liên kết tài khoản Facebook thành công!",
    };
  } catch (err) {
    console.error("Lỗi liên kết Facebook:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi liên kết tài khoản Facebook",
    };
  }
};

// Hủy liên kết tài khoản Facebook
export const unlinkFacebookAccount = async () => {
  try {
    const res = await fetch(`${base_url}/links/facebook`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Phiên đăng nhập đã hết hạn",
        };
      }
      throw new Error("Không thể hủy liên kết tài khoản Facebook");
    }

    return {
      success: true,
      message: "Hủy liên kết tài khoản Facebook thành công!",
    };
  } catch (err) {
    console.error("Lỗi hủy liên kết Facebook:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi hủy liên kết tài khoản Facebook",
    };
  }
};

// ============================================
// NOTIFICATION SETTINGS
// ============================================

// Lấy cài đặt thông báo
export const getNotificationSettings = async () => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/notification-settings`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn");
      }
      throw new Error("Không thể lấy cài đặt thông báo");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error("Lỗi lấy cài đặt thông báo:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi lấy cài đặt thông báo",
    };
  }
};

// Cập nhật cài đặt thông báo
export const updateNotificationSettings = async (settings) => {
  try {
    const res = await fetch(`${base_url}/notification-settings`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
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
      throw new Error("Không thể cập nhật cài đặt thông báo");
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Cập nhật cài đặt thông báo thành công!",
    };
  } catch (err) {
    console.error("Lỗi cập nhật cài đặt thông báo:", err);
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi cập nhật cài đặt thông báo",
    };
  }
};

