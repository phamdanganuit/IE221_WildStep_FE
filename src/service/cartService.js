const base_url = import.meta.env.VITE_BACKEND_URL;
import { getStoredToken } from "./authService";
import i18n from '@/i18n/config';
import { getCurrentLocale } from '@/lib/i18nUtils';

/*
return {
        success: true,
        data: {
          _id: "dafafgd3135r31",
          userId: "954321345674321",
          cart_products: [
            {
              _id: "cart_product_id",
              product: {
                _id: "exampleId",
                name: "Converse x NARUTO Chuck Taylor All Star",
                originalPrice: 5432200,
                sold: 31,
                rate: 4.3,
                stock: 12,
                discount: 10,
                description:
                  "The OG classic reworked with colors, graphics and details inspired by Naruto and his unique powers.",
                images: [
                  "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/50266e78-2bcf-4dfe-bce4-293a63a05dae/NIKE+AVA+ROVER.png",
                ],
                brandId: {
                  name: "Converse",
                },
                sizeTable:
                  "https://templates.mediamodifier.com/63ff3c773e8bc57b10ca810b/size-table-chart-template-for-shoes.jpg",
                categoryId: {
                  name: "Giày chạy bộ",
                  parentId: {
                    name: "Nam",
                  },
                },
                createdAt: "2025-10-20T10:00:00Z",
              },
              option: {
                // Lựa chọn của người dùng khi thêm vào giỏ hàng
                size: {
                  name: "US M10/W12",
                  tags: ["XX-Large"],
                },
                color: {
                  colorName: "Mặc định",
                  image: "...",
                  tags: ["Đen", "Trắng", "Cam"],
                },
                quantity: 1,
              },
            },
            {
              _id: "cart_product_id2",
              product: {
                _id: "exampleId",
                name: "Converse x NARUTO Chuck Taylor All Star",
                originalPrice: 5432200,
                sold: 31,
                rate: 4.3,
                stock: 12,
                discount: 10,
                description:
                  "The OG classic reworked with colors, graphics and details inspired by Naruto and his unique powers.",
                images: [
                  "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4effb1e7-75b8-49bd-9fd6-d8b1a1fe7acb/NIKE+AVA+ROVER.png",
                ],
                brandId: {
                  name: "Converse",
                },
                sizeTable:
                  "https://templates.mediamodifier.com/63ff3c773e8bc57b10ca810b/size-table-chart-template-for-shoes.jpg",
                categoryId: {
                  name: "Giày chạy bộ",
                  parentId: {
                    name: "Nam",
                  },
                },
                createdAt: "2025-10-20T10:00:00Z",
              },
              option: {
                // Lựa chọn của người dùng khi thêm vào giỏ hàng
                size: {
                  name: "US M10/W12",
                  tags: ["XX-Large"],
                },
                color: {
                  colorName: "Mặc định",
                  image: "...",
                  tags: ["Đen", "Trắng", "Cam"],
                },
                quantity: 1,
              },
            },
          ],
        },
      };
*/

/**
 * Lấy giỏ hàng của user hiện tại
 * @param {string} lang - Ngôn ngữ (vi, en, ja) - mặc định lấy từ i18n
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getMyCard = async (lang = null) => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Bạn cần đăng nhập để xem giỏ hàng");
    }

    // Lấy lang từ param hoặc từ i18n
    const currentLang = lang || (i18n?.language || getCurrentLocale() || 'vi').split('-')[0];
    const url = `${base_url}/api/cart?lang=${encodeURIComponent(currentLang)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      if (res.status === 404) {
        // Cart chưa tồn tại, trả về cart rỗng
        return {
          success: true,
          data: {
            _id: null,
            userId: null,
            cart_products: [],
            updatedAt: new Date().toISOString(),
          },
        };
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message?.vi || errorData.error?.message || "Không thể lấy giỏ hàng");
    }

    const data = await res.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Không thể lấy giỏ hàng: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi lấy giỏ hàng",
    };
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {string} productId - ID sản phẩm
 * @param {number} quantity - Số lượng (mặc định: 1)
 * @param {string} size - Size sản phẩm
 * @param {string} color - Tên màu sắc
 * @param {string} lang - Ngôn ngữ (vi, en, ja) - mặc định lấy từ i18n
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const addToCart = async (productId, quantity = 1, size, color, lang = null) => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
    }

    if (!productId || !size || !color) {
      throw new Error("Vui lòng chọn đầy đủ size và màu sắc");
    }

    if (quantity < 1) {
      throw new Error("Số lượng phải lớn hơn 0");
    }

    // Lấy lang từ param hoặc từ i18n
    const currentLang = lang || (i18n?.language || getCurrentLocale() || 'vi').split('-')[0];
    const url = `${base_url}/api/cart/items?lang=${encodeURIComponent(currentLang)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
        size,
        color,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      if (res.status === 400) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message?.vi || errorData.error?.message || "Không thể thêm sản phẩm vào giỏ hàng");
      }
      if (res.status === 409) {
        // Sản phẩm đã có trong giỏ hàng, có thể coi là thành công
        const errorData = await res.json().catch(() => ({}));
        return {
          success: true,
          message: errorData.error?.message?.vi || "Sản phẩm đã có trong giỏ hàng",
          data: null,
        };
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message?.vi || errorData.error?.message || "Không thể thêm sản phẩm vào giỏ hàng");
    }

    const data = await res.json();
    return {
      success: true,
      data,
      message: "Đã thêm sản phẩm vào giỏ hàng",
    };
  } catch (error) {
    console.error("Không thể thêm sản phẩm vào giỏ hàng: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng",
    };
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {string} cartProductId - ID cart product
 * @param {number} quantity - Số lượng mới
 * @param {string} lang - Ngôn ngữ (vi, en, ja) - mặc định lấy từ i18n
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateCartItemQuantity = async (cartProductId, quantity, lang = null) => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Bạn cần đăng nhập để cập nhật giỏ hàng");
    }

    if (!cartProductId) {
      throw new Error("ID sản phẩm không hợp lệ");
    }

    if (quantity < 1) {
      throw new Error("Số lượng phải lớn hơn 0");
    }

    // Lấy lang từ param hoặc từ i18n
    const currentLang = lang || (i18n?.language || getCurrentLocale() || 'vi').split('-')[0];
    const url = `${base_url}/api/cart/items/${cartProductId}?lang=${encodeURIComponent(currentLang)}`;

    const res = await fetch(url, {
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
      if (res.status === 400) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message?.vi || errorData.error?.message || "Số lượng không hợp lệ");
      }
      if (res.status === 403) {
        throw new Error("Bạn không có quyền cập nhật sản phẩm này");
      }
      if (res.status === 404) {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message?.vi || errorData.error?.message || "Không thể cập nhật số lượng");
    }

    const data = await res.json();
    return {
      success: true,
      data,
      message: "Đã cập nhật số lượng",
    };
  } catch (error) {
    console.error("Không thể cập nhật số lượng: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi cập nhật số lượng",
    };
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {string} cartProductId - ID cart product
 * @param {string} lang - Ngôn ngữ (vi, en, ja) - mặc định lấy từ i18n
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const removeFromCart = async (cartProductId, lang = null) => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng");
    }

    if (!cartProductId) {
      throw new Error("ID sản phẩm không hợp lệ");
    }

    // Lấy lang từ param hoặc từ i18n
    const currentLang = lang || (i18n?.language || getCurrentLocale() || 'vi').split('-')[0];
    const url = `${base_url}/api/cart/items/${cartProductId}?lang=${encodeURIComponent(currentLang)}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      if (res.status === 403) {
        throw new Error("Bạn không có quyền xóa sản phẩm này");
      }
      if (res.status === 404) {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error?.message?.vi || errorData.error?.message || "Không thể xóa sản phẩm khỏi giỏ hàng");
    }

    // DELETE trả về 204 No Content
    return {
      success: true,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công!",
    };
  } catch (error) {
    console.error("Không thể xóa sản phẩm khỏi giỏ hàng: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng",
    };
  }
};
