# API Yêu Cầu Cho Trang Giỏ Hàng (Cart)

Tài liệu này mô tả các API endpoints cần thiết cho trang giỏ hàng và chức năng thêm vào giỏ hàng từ trang chi tiết sản phẩm.

**Lưu ý quan trọng:**
- Tất cả API yêu cầu authentication (Bearer token)
- Tất cả response text fields phải hỗ trợ đa ngôn ngữ theo `lang` query param (vi/en/ja)
- Cấu trúc response phải nhất quán với các API hiện có (product, address, etc.)

---

## Base URL
Tất cả các endpoint đều nằm dưới base URL: `/api/`

---

## 1. Lấy Giỏ Hàng

### GET `/api/cart`

**Mục đích:** Lấy danh sách sản phẩm trong giỏ hàng của user hiện tại

**Auth:** Required (Bearer token)

**Query Parameters:**
- `lang`: Ngôn ngữ (vi, en, ja) - mặc định: vi

**Ví dụ request:**
```http
GET /api/cart?lang=vi
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "_id": "cart_id",
  "userId": "user_id",
  "cart_products": [
    {
      "_id": "cart_product_id",
      "product": {
        "_id": "product_id",
        "name": {
          "vi": "Converse x NARUTO Chuck Taylor All Star",
          "en": "Converse x NARUTO Chuck Taylor All Star",
          "ja": "コンバース x ナルト チャックテイラーオールスター"
        },
        "originalPrice": 5432200,
        "discount": 10,
        "sold": 31,
        "rate": 4.3,
        "stock": 12,
        "description": {
          "vi": "The OG classic reworked with colors, graphics and details inspired by Naruto and his unique powers.",
          "en": "The OG classic reworked with colors, graphics and details inspired by Naruto and his unique powers.",
          "ja": "ナルトとその独特な力にインスパイアされた色、グラフィック、ディテールで再構築されたOGクラシック。"
        },
        "images": [
          "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/50266e78-2bcf-4dfe-bce4-293a63a05dae/NIKE+AVA+ROVER.png"
        ],
        "brandId": {
          "_id": "brand_id",
          "name": {
            "vi": "Converse",
            "en": "Converse",
            "ja": "コンバース"
          }
        },
        "sizeTable": "https://templates.mediamodifier.com/63ff3c773e8bc57b10ca810b/size-table-chart-template-for-shoes.jpg",
        "categoryId": {
          "_id": "category_id",
          "name": {
            "vi": "Giày chạy bộ",
            "en": "Running Shoes",
            "ja": "ランニングシューズ"
          },
          "parentId": {
            "_id": "parent_category_id",
            "name": {
              "vi": "Nam",
              "en": "Men",
              "ja": "メンズ"
            }
          }
        },
        "createdAt": "2025-10-20T10:00:00.000Z"
      },
      "option": {
        "size": {
          "name": "US M10/W12",
          "tags": ["XX-Large"]
        },
        "color": {
          "colorName": {
            "vi": "Mặc định",
            "en": "Default",
            "ja": "デフォルト"
          },
          "image": "https://example.com/color-image.jpg",
          "tags": {
            "vi": ["Đen", "Trắng", "Cam"],
            "en": ["Black", "White", "Orange"],
            "ja": ["黒", "白", "オレンジ"]
          }
        },
        "quantity": 1
      }
    }
  ],
  "updatedAt": "2025-10-25T10:00:00.000Z"
}
```

**Response khi giỏ hàng trống:**
```json
{
  "_id": "cart_id",
  "userId": "user_id",
  "cart_products": [],
  "updatedAt": "2025-10-25T10:00:00.000Z"
}
```

**Lỗi:**
- `401`: Unauthorized (token không hợp lệ hoặc hết hạn)
- `404`: Cart không tồn tại (có thể tạo mới)

**Yêu cầu đặc biệt:**
- Nếu cart chưa tồn tại, tự động tạo cart mới và trả về
- Tất cả text fields (name, description, colorName, tags) phải trả về theo ngôn ngữ được yêu cầu trong `lang` param
- Product phải bao gồm đầy đủ thông tin cần thiết để hiển thị (images, brand, category, price, discount)

---

## 2. Thêm Sản Phẩm Vào Giỏ Hàng

### POST `/api/cart/items`

**Mục đích:** Thêm sản phẩm vào giỏ hàng từ trang chi tiết sản phẩm

**Auth:** Required (Bearer token)

**Query Parameters:**
- `lang`: Ngôn ngữ (vi, en, ja) - mặc định: vi

**Ví dụ request:**
```http
POST /api/cart/items?lang=vi
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "60d5ec49f1b2c72b8c8e4f3c",
  "quantity": 1,
  "size": "EU36",
  "color": "White/Aluminium"
}
```

**Body (bắt buộc):**
- `productId`: ID sản phẩm (string)
- `quantity`: Số lượng (integer, min: 1, mặc định: 1)
- `size`: Size sản phẩm (string, ví dụ: "EU36", "US M10/W12")
- `color`: Tên màu sắc (string, ví dụ: "White/Aluminium", "Đen")

**Response 201:**
```json
{
  "_id": "cart_product_id",
  "product": {
    "_id": "product_id",
    "name": {
      "vi": "Air Jordan 1 Low",
      "en": "Air Jordan 1 Low",
      "ja": "エアジョーダン1ロー"
    },
    "originalPrice": 3239000,
    "discount": 20,
    "images": [
      "/media/products/nike-air-jordan-1-low-1.jpg"
    ],
    "brandId": {
      "_id": "brand_id",
      "name": {
        "vi": "Nike",
        "en": "Nike",
        "ja": "ナイキ"
      }
    },
    "categoryId": {
      "_id": "category_id",
      "name": {
        "vi": "Giày nữ",
        "en": "Women's Shoes",
        "ja": "レディースシューズ"
      }
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "option": {
    "size": {
      "name": "EU36",
      "tags": []
    },
    "color": {
      "colorName": {
        "vi": "White/Aluminium",
        "en": "White/Aluminium",
        "ja": "ホワイト/アルミニウム"
      },
      "image": "/media/products/color-white.jpg",
      "tags": {
        "vi": ["Trắng"],
        "en": ["White"],
        "ja": ["白"]
      }
    },
    "quantity": 1
  },
  "createdAt": "2025-10-25T10:00:00.000Z"
}
```

**Lỗi:**
- `400`: Bad Request
  - Sản phẩm không tồn tại
  - Size/Color không hợp lệ cho sản phẩm này
  - Số lượng vượt quá tồn kho
  - Số lượng <= 0
- `401`: Unauthorized
- `409`: Conflict - Sản phẩm với size/color này đã có trong giỏ hàng (có thể tăng quantity thay vì tạo mới)

**Yêu cầu đặc biệt:**
- Nếu sản phẩm với cùng productId, size, color đã có trong giỏ hàng, **tăng quantity** thay vì tạo mới (trừ khi vượt quá stock)
- Validate size và color phải tồn tại trong specifications của sản phẩm
- Validate quantity không vượt quá stock còn lại
- Response text fields phải theo ngôn ngữ được yêu cầu

---

## 3. Cập Nhật Số Lượng Sản Phẩm

### PUT `/api/cart/items/{cartProductId}`

**Mục đích:** Cập nhật số lượng của một sản phẩm trong giỏ hàng

**Auth:** Required (Bearer token)

**Query Parameters:**
- `lang`: Ngôn ngữ (vi, en, ja) - mặc định: vi

**Ví dụ request:**
```http
PUT /api/cart/items/cart_product_id?lang=vi
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

**Body (bắt buộc):**
- `quantity`: Số lượng mới (integer, min: 1, max: stock còn lại)

**Response 200:**
```json
{
  "_id": "cart_product_id",
  "product": {
    "_id": "product_id",
    "name": {
      "vi": "Air Jordan 1 Low",
      "en": "Air Jordan 1 Low",
      "ja": "エアジョーダン1ロー"
    },
    "originalPrice": 3239000,
    "discount": 20,
    "images": [
      "/media/products/nike-air-jordan-1-low-1.jpg"
    ],
    "brandId": {
      "_id": "brand_id",
      "name": {
        "vi": "Nike",
        "en": "Nike",
        "ja": "ナイキ"
      }
    },
    "categoryId": {
      "_id": "category_id",
      "name": {
        "vi": "Giày nữ",
        "en": "Women's Shoes",
        "ja": "レディースシューズ"
      }
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "option": {
    "size": {
      "name": "EU36",
      "tags": []
    },
    "color": {
      "colorName": {
        "vi": "White/Aluminium",
        "en": "White/Aluminium",
        "ja": "ホワイト/アルミニウム"
      },
      "image": "/media/products/color-white.jpg",
      "tags": {
        "vi": ["Trắng"],
        "en": ["White"],
        "ja": ["白"]
      }
    },
    "quantity": 3
  },
  "updatedAt": "2025-10-25T10:05:00.000Z"
}
```

**Lỗi:**
- `400`: Bad Request
  - Quantity <= 0
  - Quantity vượt quá stock còn lại
- `401`: Unauthorized
- `403`: Forbidden - Cart product không thuộc về user hiện tại
- `404`: Not Found - Cart product không tồn tại

**Yêu cầu đặc biệt:**
- Validate quantity không vượt quá stock
- Chỉ user sở hữu cart product mới được cập nhật
- Response text fields phải theo ngôn ngữ được yêu cầu

---

## 4. Xóa Sản Phẩm Khỏi Giỏ Hàng

### DELETE `/api/cart/items/{cartProductId}`

**Mục đích:** Xóa một sản phẩm khỏi giỏ hàng

**Auth:** Required (Bearer token)

**Query Parameters:**
- `lang`: Ngôn ngữ (vi, en, ja) - mặc định: vi (chỉ dùng cho error message)

**Ví dụ request:**
```http
DELETE /api/cart/items/cart_product_id?lang=vi
Authorization: Bearer {token}
```

**Response 204:** No Content (thành công)

**Lỗi:**
- `401`: Unauthorized
- `403`: Forbidden - Cart product không thuộc về user hiện tại
- `404`: Not Found - Cart product không tồn tại

**Response lỗi (400/403/404):**
```json
{
  "error": {
    "code": "CART_PRODUCT_NOT_FOUND",
    "message": {
      "vi": "Không tìm thấy sản phẩm trong giỏ hàng",
      "en": "Cart product not found",
      "ja": "カート内の商品が見つかりません"
    }
  }
}
```

**Yêu cầu đặc biệt:**
- Chỉ user sở hữu cart product mới được xóa
- Error message phải theo ngôn ngữ được yêu cầu

---

## Tóm Tắt Các Endpoint

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/cart` | ✅ | Lấy giỏ hàng |
| POST | `/api/cart/items` | ✅ | Thêm vào giỏ hàng |
| PUT | `/api/cart/items/{cartProductId}` | ✅ | Cập nhật số lượng |
| DELETE | `/api/cart/items/{cartProductId}` | ✅ | Xóa khỏi giỏ hàng |

---

## Error Handling

Tất cả API trả về error theo format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": {
      "vi": "Thông báo lỗi bằng tiếng Việt",
      "en": "Error message in English",
      "ja": "日本語のエラーメッセージ"
    },
    "details": {}
  }
}
```

**Common HTTP status codes:**
- `200`: Success
- `201`: Created (POST)
- `204`: No Content (DELETE)
- `400`: Bad Request (validation error)
- `401`: Unauthorized (chưa đăng nhập hoặc token hết hạn)
- `403`: Forbidden (không có quyền)
- `404`: Not Found (cart/cart product không tồn tại)
- `409`: Conflict (sản phẩm đã có trong giỏ hàng)

---

## Lưu Ý Quan Trọng

### 1. **Cấu trúc Response nhất quán**
- Product object trong cart response phải có cấu trúc giống với API product detail (`/api/products/{id}`)
- Brand và Category phải có cấu trúc đa ngôn ngữ: `name: {vi, en, ja}`
- Color phải có `colorName` dạng đa ngôn ngữ nếu backend hỗ trợ

### 2. **Multilingual Support**
- Tất cả text fields phải trả về theo `lang` query param
- Format: `name: {vi: "...", en: "...", ja: "..."}`
- Frontend sẽ tự extract theo ngôn ngữ hiện tại

### 3. **Validation**
- Size và Color phải match với specifications của product
- Quantity không được vượt quá stock
- Quantity tối thiểu: 1

### 4. **Performance**
- GET `/api/cart` nên cache hoặc optimize để tránh call dư thừa
- Khi add/update/delete, có thể trả về toàn bộ cart hoặc chỉ item được thay đổi (tùy backend quyết định)

### 5. **Tránh call dư thừa**
- Sau khi add/update/delete, frontend sẽ tự refresh cart bằng GET `/api/cart`
- Backend không cần tự động trả về full cart trong response của add/update/delete (trừ khi cần thiết)

---

## Ví Dụ Flow Tích Hợp

### Thêm vào giỏ hàng từ Product Detail:
1. User chọn size, color, quantity
2. POST `/api/cart/items` với `{productId, size, color, quantity}`
3. Nếu thành công, hiển thị toast "Đã thêm vào giỏ hàng"
4. (Optional) Refresh cart count trong header

### Cập nhật số lượng trong Cart:
1. User thay đổi quantity trong QuantitySelector
2. PUT `/api/cart/items/{cartProductId}` với `{quantity}`
3. Nếu thành công, cập nhật UI local (optimistic update)
4. (Optional) Refresh cart để đảm bảo sync

### Xóa sản phẩm:
1. User click nút xóa
2. Hiển thị dialog xác nhận
3. DELETE `/api/cart/items/{cartProductId}`
4. Nếu thành công, refresh cart list












