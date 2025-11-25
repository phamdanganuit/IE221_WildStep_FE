const base_url = import.meta.env.VITE_BACKEND_URL // tạo file .env thêm biến vào

// Helper function để lưu token
const saveToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem("access_token", token);
  } else {
    sessionStorage.setItem("access_token", token);
  }
};

// Helper function để lấy token
export const getStoredToken = () => {
  return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
};

// Helper function để xóa token
export const clearStoredToken = () => {
  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");
};

// 1. Đăng nhập cơ bản
export const login = async (email, password, rememberMe = false) => {
  try {
    const res = await fetch(`${base_url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Thông tin đăng nhập không đúng.",
          type: "error"
        };
      }
      if (res.status === 403) {
        return {
          success: false,
          error: "Account is blocked",
          type: "error"
        };
      }
      return {
        success: false,
        error: "Đăng nhập thất bại. Vui lòng thử lại.",
        type: "error"
      };
    }

    const data = await res.json();
    
    // Lưu token
    if (data.access_token) {
      saveToken(data.access_token, rememberMe);
    }

    return {
      success: true,
      data: data,
      message: "Đăng nhập thành công!",
      type: "success"
    };
  } catch (e) {
    return {
      success: false,
      error: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.",
      type: "error"
    };
  }
};

// 2. Đăng ký tài khoản mới
export const register = async (email, password, displayName, admin_key = null) => {
  try {
    const res = await fetch(`${base_url}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        displayName,
        ...(admin_key && { admin_key }), // chỉ gửi khi có admin_key
      }),
    });

    if (!res.ok) {
      if (res.status === 400) {
        return {
          success: false,
          error: "Dữ liệu không hợp lệ (thiếu email/password, email sai định dạng, mật khẩu quá ngắn)",
          type: "error"
        };
      }
      if (res.status === 409) {
        return {
          success: false,
          error: "Email đã được đăng ký",
          type: "error"
        };
      }
      return {
        success: false,
        error: "Đăng ký thất bại. Vui lòng thử lại.",
        type: "error"
      };
    }

    const data = await res.json();
    return {
      success: true,
      data: data,
      message: "Đăng ký thành công!",
      type: "success"
    };
  } catch (e) {
    return {
      success: false,
      error: "Có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng.",
      type: "error"
    };
  }
};

// 3. Đăng nhập bằng Google OAuth
export const loginWithGoogle = async (accessToken, rememberMe = false) => {
  try {
    const res = await fetch(`${base_url}/oauth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Token Google không hợp lệ",
          type: "error"
        };
      }
      if (res.status === 403) {
        return {
          success: false,
          error: "Account is blocked",
          type: "error"
        };
      }
      return {
        success: false,
        error: "Đăng nhập Google thất bại. Vui lòng thử lại.",
        type: "error"
      };
    }

    const data = await res.json();
    
    // Lưu token
    if (data.access_token) {
      saveToken(data.access_token, rememberMe);
    }

    return {
      success: true,
      data: data,
      message: "Đăng nhập Google thành công!",
      type: "success"
    };
  } catch (e) {
    return {
      success: false,
      error: "Có lỗi xảy ra khi đăng nhập Google. Vui lòng thử lại.",
      type: "error"
    };
  }
};

// 4. Đăng nhập bằng Facebook OAuth
export const loginWithFacebook = async (accessToken, rememberMe = false) => {
  try {
    const res = await fetch(`${base_url}/oauth/facebook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Token Facebook không hợp lệ",
          type: "error"
        };
      }
      if (res.status === 403) {
        return {
          success: false,
          error: "Account is blocked",
          type: "error"
        };
      }
      return {
        success: false,
        error: "Đăng nhập Facebook thất bại. Vui lòng thử lại.",
        type: "error"
      };
    }

    const data = await res.json();
    
    // Lưu token
    if (data.access_token) {
      saveToken(data.access_token, rememberMe);
    }

    return {
      success: true,
      data: data,
      message: "Đăng nhập Facebook thành công!",
      type: "success"
    };
  } catch (e) {
    return {
      success: false,
      error: "Có lỗi xảy ra khi đăng nhập Facebook. Vui lòng thử lại.",
      type: "error"
    };
  }
};

// 5. Lấy thông tin hồ sơ người dùng chi tiết (để lấy avatar)
export const getProfile = async (token) => {
  try {
    const res = await fetch(`${base_url}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearStoredToken();
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      if (res.status === 404) {
        throw new Error("Không tìm thấy người dùng");
      }
      throw new Error("Không thể lấy thông tin người dùng");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return null;
  }
};

// 6. Đăng xuất
export const logout = () => {
  clearStoredToken();
  return {
    success: true,
    message: "Đăng xuất thành công!",
    type: "success"
  };
};
