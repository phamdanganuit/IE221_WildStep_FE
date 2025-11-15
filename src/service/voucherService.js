const base_url = import.meta.env.VITE_BACKEND_URL;
import { getStoredToken } from "./authService";

export const addVoucherIntoMyList = async (code) => {
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/addVoucher`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      if (res.status === 400) {
        throw new Error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      }
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      if (res.status === 409) {
        throw new Error("Mã giảm giá đã được sử dụng");
      }
      throw new Error("Không thể thêm mã giảm giá.");
    }
    const data = await res.json();
    return {
      success: true,
      message: "Thêm mã giảm giá thành công!",
      data,
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
    const token = getStoredToken();
    const res = await fetch(`${base_url}/vouchers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      throw new Error("Không thể lấy danh sách mã giảm giá");
    }
    const data = await res.json();
    return {
      success: true,
      data,
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
    const token = getStoredToken();
    const res = await fetch(`${base_url}/removeVoucher`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ voucherId }),
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      throw new Error("Không thể lấy xóa mã giảm giá");
    }
    return {
      success: true,
      message: "Xóa mã giảm giá thành công!",
    };
  } catch (error) {
    console.log("Không thể lấy xóa mã giảm giá: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi xóa mã giảm giá",
    };
  }
};
