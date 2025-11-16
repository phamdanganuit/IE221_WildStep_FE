const base_url = import.meta.env.VITE_BACKEND_URL;
import { getStoredToken } from "./authService";

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
      throw new Error("Không thể lấy giỏ hàng");
    }
    const data = await res.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log("Không thể lấy giỏ hàng: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi lấy giỏ hàng",
    };
  }
};

export const removeFromCart = async (cartProductId) => {
  // cardProduct khác product vì có thêm cả option
  try {
    const token = getStoredToken();
    const res = await fetch(`${base_url}/removeCartProduct`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartProductId }),
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
      }
      throw new Error("Không thể lấy xóa sản phẩm khỏi giỏ hàng");
    }
    return {
      success: true,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công!",
    };
  } catch (error) {
    console.log("Không thể lấy xóa sản phẩm khỏi giỏ hàng: ", error);
    return {
      success: false,
      error: error.message || "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng",
    };
  }
};
