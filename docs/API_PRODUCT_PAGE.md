# API Endpoints cho Trang Product Detail

Tài liệu này mô tả tất cả các API endpoints cần thiết cho trang chi tiết sản phẩm (`/product/:id` hoặc `/product/:slug`).

## Base URL
Tất cả các endpoint đều nằm dưới base URL: `/api/`

---

## 1. Lấy Thông Tin Chi Tiết Sản Phẩm

### ✅ GET `/api/products/{id}` hoặc `/api/products/{slug}`
**Mục đích:** Lấy thông tin chi tiết của một sản phẩm

**Ví dụ request:**
```http
GET /api/products/60d5ec49f1b2c72b8c8e4f3c
# hoặc
GET /api/products/nike-air-jordan-1-low
```

**Query Parameters (tùy chọn):**
- `lang`: Ngôn ngữ (vi, en, ja) - mặc định: vi

**Response 200:**
```json
{
  "id": "60d5ec49f1b2c72b8c8e4f3c",
  "slug": "nike-air-jordan-1-low",
  "name": {
    "vi": "Air Jordan 1 Low",
    "en": "Air Jordan 1 Low",
    "ja": "エアジョーダン1ロー"
  },
  "description": {
    "vi": "Phiên bản Low sở hữu lớp da cao cấp...",
    "en": "The Low version features premium leather...",
    "ja": "ロー版は高級レザーを採用..."
  },
  "price": 3239000,
  "discountPrice": 2591199,
  "discount": 20,
  "images": [
    "/media/products/nike-air-jordan-1-low-1.jpg",
    "/media/products/nike-air-jordan-1-low-2.jpg",
    "/media/products/nike-air-jordan-1-low-3.jpg"
  ],
  "brand": {
    "id": "...",
    "name": {
      "vi": "Nike",
      "en": "Nike",
      "ja": "ナイキ"
    },
    "logo": "/media/brands/nike-logo.png"
  },
  "category": {
    "id": "...",
    "name": {
      "vi": "Giày nữ",
      "en": "Women's Shoes",
      "ja": "レディースシューズ"
    },
    "slug": "giay-nu"
  },
  "specifications": {
    "sizes": ["EU36", "EU37", "EU38", "EU39", "EU40", "EU41"],
    "colors": [
      {
        "name": "White/Aluminium",
        "hex": "#FFFFFF",
        "image": "/media/products/color-white.jpg"
      },
      {
        "name": "Black/Red",
        "hex": "#000000",
        "image": "/media/products/color-black.jpg"
      }
    ],
    "material": "Da cao cấp",
    "weight": "300g",
    "origin": "Indonesia",
    "style": "DC0774-605"
  },
  "stock": 45,
  "soldCount": 1238,
  "rating": 4.5,
  "reviewCount": 1250,
  "status": "active",
  "tags": ["nike", "jordan", "sports"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-10-15T00:00:00.000Z"
}
```

**Lưu ý:**
- Có thể truy cập bằng `id` hoặc `slug`
- Trả về thông tin đầy đủ bao gồm: giá, hình ảnh, thông số kỹ thuật (size, color), brand, category
- `soldCount`: Số lượng đã bán
- `rating`: Điểm đánh giá trung bình (0-5)
- `reviewCount`: Tổng số đánh giá

---

## 2. Lấy Đánh Giá Sản Phẩm

### ✅ GET `/api/products/{id}/reviews`
**Mục đích:** Lấy danh sách đánh giá của sản phẩm với phân trang và lọc

**Ví dụ request:**
```http
GET /api/products/60d5ec49f1b2c72b8c8e4f3c/reviews?page=1&page_size=10&rating=5&has_media=true
```

**Query Parameters:**
- `page`: Số trang (mặc định: 1)
- `page_size`: Số lượng review mỗi trang (mặc định: 10)
- `rating`: Lọc theo số sao (1, 2, 3, 4, 5) - tùy chọn
- `has_media`: Lọc review có ảnh/video (true/false) - tùy chọn
- `has_description`: Lọc review có mô tả (true/false) - tùy chọn
- `sort`: Sắp xếp (`newest`, `oldest`, `helpful`, `rating_desc`, `rating_asc`) - mặc định: `newest`

**Response 200:**
```json
{
  "data": [
    {
      "id": "review_id_1",
      "userId": "user_id_1",
      "user": {
        "displayName": "Nguyễn Minh Quân",
        "avatar": "/media/avatars/user1.jpg"
      },
      "rating": 5,
      "title": "Giày cực kỳ êm, giao hàng nhanh",
      "content": "Mình đặt tối hôm trước, sáng hôm sau nhận được...",
      "images": [
        "/media/reviews/review1-img1.jpg"
      ],
      "likes": 42,
      "dislikes": 1,
      "isLiked": false,
      "isDisliked": false,
      "hasMedia": true,
      "hasDescription": true,
      "createdAt": "2025-10-12T14:31:00.000Z",
      "updatedAt": "2025-10-12T14:31:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 10,
    "total": 1250,
    "total_pages": 125
  },
  "summary": {
    "averageRating": 4.5,
    "totalReviews": 1250,
    "ratingDistribution": {
      "5": 196,
      "4": 50,
      "3": 4,
      "2": 0,
      "1": 0
    }
  }
}
```

### ✅ POST `/api/products/{id}/reviews`
**Mục đích:** Tạo đánh giá mới cho sản phẩm (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
POST /api/products/60d5ec49f1b2c72b8c8e4f3c/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "title": "Giày cực kỳ êm, giao hàng nhanh",
  "content": "Mình đặt tối hôm trước, sáng hôm sau nhận được...",
  "images": ["/media/reviews/temp-img1.jpg"] // URLs từ upload trước
}
```

**Body (bắt buộc):**
- `rating`: Số sao (1-5)
- `title`: Tiêu đề đánh giá
- `content`: Nội dung đánh giá

**Body (tùy chọn):**
- `images`: Mảng URL ảnh (đã upload trước)

**Response 201:**
```json
{
  "id": "review_id_new",
  "userId": "user_id_current",
  "rating": 5,
  "title": "Giày cực kỳ êm, giao hàng nhanh",
  "content": "Mình đặt tối hôm trước, sáng hôm sau nhận được...",
  "images": ["/media/reviews/review-new-img1.jpg"],
  "likes": 0,
  "dislikes": 0,
  "createdAt": "2025-10-25T10:00:00.000Z"
}
```

### ✅ POST `/api/reviews/{reviewId}/like`
**Mục đích:** Like một đánh giá (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
POST /api/reviews/review_id_1/like
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "id": "review_id_1",
  "likes": 43,
  "dislikes": 1,
  "isLiked": true,
  "isDisliked": false
}
```

### ✅ POST `/api/reviews/{reviewId}/dislike`
**Mục đích:** Dislike một đánh giá (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
POST /api/reviews/review_id_1/dislike
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "id": "review_id_1",
  "likes": 42,
  "dislikes": 2,
  "isLiked": false,
  "isDisliked": true
}
```

### ✅ DELETE `/api/reviews/{reviewId}/reaction`
**Mục đích:** Bỏ like/dislike (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
DELETE /api/reviews/review_id_1/reaction
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "id": "review_id_1",
  "likes": 42,
  "dislikes": 1,
  "isLiked": false,
  "isDisliked": false
}
```

---

## 3. Lấy Sản Phẩm Liên Quan

### ✅ GET `/api/products/{id}/related`
**Mục đích:** Lấy danh sách sản phẩm liên quan (cùng category, cùng brand, hoặc sản phẩm được xem cùng)

**Ví dụ request:**
```http
GET /api/products/60d5ec49f1b2c72b8c8e4f3c/related?limit=6
```

**Query Parameters:**
- `limit`: Số lượng sản phẩm (mặc định: 6, tối đa: 20)

**Response 200:**
```json
{
  "data": [
    {
      "id": "product_id_2",
      "slug": "nike-jumpman-mvp",
      "name": {
        "vi": "Jumpman MVP",
        "en": "Jumpman MVP"
      },
      "price": 3879199,
      "discountPrice": 3879199,
      "discount": 0,
      "image": "/media/products/jumpman-mvp-1.jpg",
      "category": {
        "name": {
          "vi": "Giày nam",
          "en": "Men's Shoes"
        }
      },
      "rating": 4.8,
      "reviewCount": 234
    }
  ]
}
```

---

## 4. Thêm Vào Giỏ Hàng

### ✅ POST `/api/cart/items`
**Mục đích:** Thêm sản phẩm vào giỏ hàng (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
POST /api/cart/items
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
- `productId`: ID sản phẩm
- `quantity`: Số lượng (mặc định: 1)
- `size`: Size sản phẩm
- `color`: Màu sắc sản phẩm

**Response 201:**
```json
{
  "id": "cart_item_id",
  "productId": "60d5ec49f1b2c72b8c8e4f3c",
  "product": {
    "name": {
      "vi": "Air Jordan 1 Low"
    },
    "image": "/media/products/nike-air-jordan-1-low-1.jpg",
    "price": 3239000,
    "discountPrice": 2591199
  },
  "quantity": 1,
  "size": "EU36",
  "color": "White/Aluminium",
  "subtotal": 2591199,
  "createdAt": "2025-10-25T10:00:00.000Z"
}
```

**Lỗi có thể xảy ra:**
- `400`: Sản phẩm không còn hàng
- `400`: Size/Color không hợp lệ
- `400`: Số lượng vượt quá tồn kho

---

## 5. Mua Ngay (Buy Now)

### ✅ POST `/api/orders/quick-checkout`
**Mục đích:** Tạo đơn hàng ngay lập tức từ trang product (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
POST /api/orders/quick-checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "60d5ec49f1b2c72b8c8e4f3c",
  "quantity": 1,
  "size": "EU36",
  "color": "White/Aluminium",
  "addressId": "address_id_1", // ID địa chỉ giao hàng
  "paymentMethod": "cod" // hoặc "online"
}
```

**Body (bắt buộc):**
- `productId`: ID sản phẩm
- `quantity`: Số lượng
- `size`: Size sản phẩm
- `color`: Màu sắc sản phẩm
- `addressId`: ID địa chỉ giao hàng
- `paymentMethod`: Phương thức thanh toán (`cod`, `online`)

**Response 201:**
```json
{
  "id": "order_id",
  "orderNumber": "ORD-20251025-001",
  "status": "pending",
  "paymentStatus": "pending",
  "items": [
    {
      "productId": "60d5ec49f1b2c72b8c8e4f3c",
      "productName": {
        "vi": "Air Jordan 1 Low"
      },
      "quantity": 1,
      "size": "EU36",
      "color": "White/Aluminium",
      "price": 2591199,
      "subtotal": 2591199
    }
  ],
  "subtotal": 2591199,
  "shippingFee": 30000,
  "total": 2621199,
  "createdAt": "2025-10-25T10:00:00.000Z"
}
```

**Lưu ý:**
- Nếu `paymentMethod` là `online`, có thể cần redirect đến trang thanh toán
- Nếu `paymentMethod` là `cod`, đơn hàng sẽ ở trạng thái `pending` chờ xử lý

---

## 6. Kiểm Tra Tồn Kho

### ✅ GET `/api/products/{id}/stock`
**Mục đích:** Kiểm tra tồn kho của sản phẩm theo size và color

**Ví dụ request:**
```http
GET /api/products/60d5ec49f1b2c72b8c8e4f3c/stock?size=EU36&color=White/Aluminium
```

**Query Parameters:**
- `size`: Size cần kiểm tra (bắt buộc)
- `color`: Màu sắc cần kiểm tra (bắt buộc)

**Response 200:**
```json
{
  "productId": "60d5ec49f1b2c72b8c8e4f3c",
  "size": "EU36",
  "color": "White/Aluminium",
  "stock": 15,
  "available": true
}
```

**Response 200 (hết hàng):**
```json
{
  "productId": "60d5ec49f1b2c72b8c8e4f3c",
  "size": "EU36",
  "color": "White/Aluminium",
  "stock": 0,
  "available": false
}
```

---

## 7. Upload Ảnh Đánh Giá

### ✅ POST `/api/reviews/upload-image`
**Mục đích:** Upload ảnh cho đánh giá (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
POST /api/reviews/upload-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [File]
```

**Yêu cầu:**
- Format: JPEG, PNG, WebP
- Kích thước tối đa: 5MB mỗi file
- Số lượng: Tối đa 5 files mỗi lần upload

**Response 200:**
```json
{
  "images": [
    "/media/reviews/temp-upload-1.jpg",
    "/media/reviews/temp-upload-2.jpg"
  ]
}
```

**Lưu ý:**
- Ảnh được upload tạm thời, sẽ được liên kết với review khi tạo review
- Nếu không tạo review, ảnh tạm sẽ bị xóa sau 24h

---

## 8. Thêm Vào Wishlist

### ✅ POST `/api/wishlist/items`
**Mục đích:** Thêm sản phẩm vào danh sách yêu thích (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
POST /api/wishlist/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "60d5ec49f1b2c72b8c8e4f3c"
}
```

**Response 201:**
```json
{
  "id": "wishlist_item_id",
  "productId": "60d5ec49f1b2c72b8c8e4f3c",
  "product": {
    "name": {
      "vi": "Air Jordan 1 Low"
    },
    "image": "/media/products/nike-air-jordan-1-low-1.jpg",
    "price": 3239000,
    "discountPrice": 2591199
  },
  "createdAt": "2025-10-25T10:00:00.000Z"
}
```

### ✅ DELETE `/api/wishlist/items/{productId}`
**Mục đích:** Xóa sản phẩm khỏi danh sách yêu thích (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
DELETE /api/wishlist/items/60d5ec49f1b2c72b8c8e4f3c
Authorization: Bearer {token}
```

**Response:** 204 No Content

### ✅ GET `/api/wishlist/items/{productId}/check`
**Mục đích:** Kiểm tra xem sản phẩm có trong wishlist không (yêu cầu đăng nhập)

**Auth:** Required (Bearer token)

**Ví dụ request:**
```http
GET /api/wishlist/items/60d5ec49f1b2c72b8c8e4f3c/check
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "isInWishlist": true,
  "wishlistItemId": "wishlist_item_id"
}
```

---

## Tóm Tắt Các Endpoint

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/products/{id}` | ❌ | Lấy thông tin chi tiết sản phẩm |
| GET | `/api/products/{id}/reviews` | ❌ | Lấy danh sách đánh giá |
| POST | `/api/products/{id}/reviews` | ✅ | Tạo đánh giá mới |
| POST | `/api/reviews/{id}/like` | ✅ | Like đánh giá |
| POST | `/api/reviews/{id}/dislike` | ✅ | Dislike đánh giá |
| DELETE | `/api/reviews/{id}/reaction` | ✅ | Bỏ like/dislike |
| GET | `/api/products/{id}/related` | ❌ | Lấy sản phẩm liên quan |
| POST | `/api/cart/items` | ✅ | Thêm vào giỏ hàng |
| POST | `/api/orders/quick-checkout` | ✅ | Mua ngay |
| GET | `/api/products/{id}/stock` | ❌ | Kiểm tra tồn kho |
| POST | `/api/reviews/upload-image` | ✅ | Upload ảnh đánh giá |
| POST | `/api/wishlist/items` | ✅ | Thêm vào wishlist |
| DELETE | `/api/wishlist/items/{productId}` | ✅ | Xóa khỏi wishlist |
| GET | `/api/wishlist/items/{productId}/check` | ✅ | Kiểm tra wishlist |

---

## Error Handling

Tất cả API trả về error theo format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Thông báo lỗi bằng tiếng Việt",
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
- `404`: Not Found (sản phẩm/review không tồn tại)
- `409`: Conflict (sản phẩm đã có trong wishlist/cart)

---

## Notes

1. **Product ID vs Slug**: Có thể truy cập sản phẩm bằng cả `id` (ObjectId) hoặc `slug` (URL-friendly)

2. **Multi-language**: Tất cả các field text (name, description) hỗ trợ đa ngôn ngữ (vi, en, ja)

3. **Reviews**: 
   - Chỉ user đã mua sản phẩm mới có thể đánh giá
   - Có thể like/dislike nhiều review
   - Có thể bỏ like/dislike

4. **Stock Management**: 
   - Tồn kho được quản lý theo từng combination của size + color
   - Khi thêm vào giỏ hoặc mua ngay, cần kiểm tra tồn kho trước

5. **Wishlist**: 
   - Mỗi user có một wishlist riêng
   - Có thể thêm/xóa sản phẩm bất kỳ lúc nào

6. **Quick Checkout**: 
   - Tạo đơn hàng ngay mà không cần thêm vào giỏ trước
   - Yêu cầu có địa chỉ giao hàng (có thể lấy từ profile hoặc chọn địa chỉ mặc định)

