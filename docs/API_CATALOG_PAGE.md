# 📋 Tóm Tắt Catalog API - Cho Frontend Team

## ✅ Các API Đã Implement

Tất cả các endpoint đều nằm dưới base URL: `/api/`

---

## 1. 🛍️ **GET `/api/products`** - Danh Sách Sản Phẩm (Với Filter & Sort)

**Mục đích:** Endpoint chính để lấy danh sách sản phẩm với đầy đủ tính năng filter, sort, pagination

**Query Parameters:**
- `page`, `page_size` - Phân trang
- `sort` - Sắp xếp: `popular`, `newest`, `oldest`, `price_asc`, `price_desc`, `rating_desc`, `name_asc`, `name_desc`
- `brand` - Filter theo brand (phân cách bằng dấu phẩy): `Nike,Adidas`
- `gender` - Filter theo giới tính (từ parent category): `Nam,Nữ,Unisex`
- `color` - Filter theo màu: `Đen,Trắng`
- `size` - Filter theo size: `EU36,EU37`
- `priceFrom`, `priceTo` - Filter theo giá
- `category` - Special category: `Sản-phẩm-mới`, `Giảm-giá`, `Phụ-kiện`
- `category_slug` - Filter theo category slug: `giay-nam`
- `search` - Tìm kiếm theo tên
- `min_rating` - Rating tối thiểu (1-5)
- `in_stock` - Chỉ lấy sản phẩm còn hàng: `true`/`false`
- `lang` - Ngôn ngữ: `vi`, `en`, `ja` (mặc định: `vi`)

**Response:**
```json
{
  "data": [...products],
  "pagination": {...},
  "filters": {
    "availableBrands": [...],
    "availableColors": [...],
    "availableSizes": [...],
    "availableGenders": [...],
    "priceRange": {...}
  }
}
```

**Ví dụ:**
```
GET /api/products?page=1&page_size=12&sort=popular&brand=Nike&gender=Nam&color=Đen&priceFrom=1000000&priceTo=5000000&lang=vi
```

---

## 2. 🏷️ **GET `/api/brands`** - Danh Sách Thương Hiệu

**Mục đích:** Lấy danh sách brands cho filter sidebar

**Query Parameters:**
- `lang` - Ngôn ngữ (mặc định: `vi`)
- `active_only` - Chỉ lấy active brands: `true`/`false` (mặc định: `true`)
- `with_count` - Bao gồm số lượng sản phẩm: `true`/`false` (mặc định: `false`)

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "slug": "nike",
      "name": {"vi": "Nike", "en": "Nike"},
      "logo": "...",
      "status": "active",
      "productCount": 45  // Chỉ có khi with_count=true
    }
  ]
}
```

**Ví dụ:**
```
GET /api/brands?lang=vi&active_only=true&with_count=true
```

---

## 3. 📂 **GET `/api/categories`** - Danh Sách Danh Mục

**Mục đích:** Lấy cấu trúc danh mục phân cấp (parent-child)

**Query Parameters:**
- `lang` - Ngôn ngữ (mặc định: `vi`)
- `include_children` - Bao gồm danh mục con: `true`/`false` (mặc định: `true`)
- `active_only` - Chỉ lấy active: `true`/`false` (mặc định: `true`)

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "slug": "nam",
      "name": {"vi": "Nam", "en": "Men"},
      "type": "parent",
      "children": [
        {
          "id": "...",
          "slug": "giay-chay-bo",
          "name": {"vi": "Giày chạy bộ"},
          "type": "child",
          "parentId": "...",
          "productCount": 25
        }
      ]
    }
  ]
}
```

**Ví dụ:**
```
GET /api/categories?lang=vi&include_children=true
```

---

## 4. 🔍 **GET `/api/products/filter-options`** - Tùy Chọn Filter Có Sẵn

**Mục đích:** Lấy các giá trị filter có sẵn (màu, size, giá range) dựa trên filter hiện tại

**Query Parameters:**
- Có thể truyền các filter hiện tại: `brand`, `gender`, `category_slug`, etc.
- `lang` - Ngôn ngữ (mặc định: `vi`)

**Response:**
```json
{
  "colors": [
    {"name": "Đen", "hex": "#000000", "count": 15}
  ],
  "sizes": [
    {"name": "EU36", "count": 8}
  ],
  "genders": [
    {"name": "Nam", "count": 45}
  ],
  "priceRange": {
    "min": 1500000,
    "max": 8000000
  }
}
```

**Ví dụ:**
```
GET /api/products/filter-options?brand=Nike&gender=Nam&lang=vi
```

---

## 5. 🔎 **GET `/api/products/search`** - Tìm Kiếm Sản Phẩm

**Mục đích:** Tìm kiếm sản phẩm theo từ khóa

**Query Parameters:**
- `q` - Từ khóa tìm kiếm (bắt buộc)
- `page`, `page_size` - Phân trang
- `sort` - Sắp xếp (giống như GET `/api/products`)
- `lang` - Ngôn ngữ (mặc định: `vi`)

**Response:**
```json
{
  "data": [...products],
  "pagination": {...},
  "suggestions": ["nike jordan", "nike air max"]
}
```

**Ví dụ:**
```
GET /api/products/search?q=nike+jordan&page=1&page_size=12&lang=vi
```

---

## 6. 💡 **GET `/api/products/autocomplete`** - Autocomplete/Suggestions

**Mục đích:** Lấy gợi ý tìm kiếm khi user đang gõ

**Query Parameters:**
- `q` - Từ khóa (bắt buộc, tối thiểu 2 ký tự)
- `limit` - Số lượng gợi ý (mặc định: 5, tối đa: 10)
- `lang` - Ngôn ngữ (mặc định: `vi`)

**Response:**
```json
{
  "suggestions": [
    {
      "text": "Nike Air Jordan 1 Low",
      "type": "product",
      "url": "/product/nike-air-jordan-1-low"
    },
    {
      "text": "Nike",
      "type": "brand",
      "url": "/products?brand=Nike"
    }
  ]
}
```

**Ví dụ:**
```
GET /api/products/autocomplete?q=nike&limit=5&lang=vi
```

---

## 7. 📁 **GET `/api/categories/{slug}/products`** - Sản Phẩm Theo Category

**Mục đích:** Lấy danh sách sản phẩm theo category slug

**Path Parameters:**
- `slug` - Slug của category (ví dụ: `giay-nam`)

**Query Parameters:**
- `page`, `page_size` - Phân trang
- `sort` - Sắp xếp (giống như GET `/api/products`)
- `lang` - Ngôn ngữ (mặc định: `vi`)

**Response:**
```json
{
  "category": {
    "id": "...",
    "slug": "giay-nam",
    "name": {"vi": "Giày nam"},
    "description": {...}
  },
  "data": [...products],
  "pagination": {...}
}
```

**Ví dụ:**
```
GET /api/categories/giay-nam/products?page=1&page_size=12&sort=popular&lang=vi
```

---

## 8. 🆕 **GET `/api/products/new`** - Sản Phẩm Mới

**Mục đích:** Lấy sản phẩm mới (tạo trong 10 ngày gần nhất)

**Query Parameters:**
- `page`, `page_size` - Phân trang
- `lang` - Ngôn ngữ (mặc định: `vi`)

**Response:**
```json
{
  "data": [...products],
  "pagination": {...}
}
```

**Ví dụ:**
```
GET /api/products/new?page=1&page_size=12&lang=vi
```

---

## 9. 🏷️ **GET `/api/products/sale`** - Sản Phẩm Giảm Giá

**Mục đích:** Lấy sản phẩm đang giảm giá

**Query Parameters:**
- `page`, `page_size` - Phân trang
- `sort` - Sắp xếp: `discount_desc`, `discount_asc`, `popular`, `price_asc`, `price_desc`
- `lang` - Ngôn ngữ (mặc định: `vi`)

**Response:**
```json
{
  "data": [...products],
  "pagination": {...}
}
```

**Ví dụ:**
```
GET /api/products/sale?page=1&page_size=12&sort=discount_desc&lang=vi
```

---

## 📊 Cấu Trúc Response Product

Tất cả các endpoint trả về product đều có format:

```json
{
  "id": "product_id",
  "slug": "nike-air-jordan-1-low",
  "name": {
    "vi": "Air Jordan 1 Low",
    "en": "Air Jordan 1 Low",
    "ja": "エアジョーダン1ロー"
  },
  "price": 3239000,
  "discountPrice": 2591199,
  "discount": 20,
  "image": "/media/products/...",
  "images": ["/media/products/...", ...],
  "rating": 4.5,
  "reviewCount": 1250,
  "soldCount": 1238,
  "stock": 45,
  "status": "active",
  "isNew": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "brand": {
    "id": "brand_id",
    "name": {"vi": "Nike", "en": "Nike"},
    "slug": "nike",
    "logo": "/media/brands/..."
  },
  "category": {
    "id": "category_id",
    "name": {"vi": "Giày nữ"},
    "slug": "giay-nu",
    "type": "child",
    "parent": {
      "id": "parent_id",
      "name": {"vi": "Nữ"},
      "slug": "nu"
    }
  }
}
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. **Gender Filter**
- Gender filter hoạt động qua **parent category**
- Ví dụ: `gender=Nam` sẽ lọc các sản phẩm có category thuộc parent category "Nam"
- Cần đảm bảo parent categories có tên đúng: "Nam", "Nữ", "Unisex"

### 2. **Color Filter**
- Color filter dựa trên `color_name` trong `ColorVariant`
- Response có thêm `color_hex` để hiển thị màu
- Format: `color=Đen,Trắng` (phân cách bằng dấu phẩy)

### 3. **Multilingual**
- Tất cả text fields trả về dạng object: `{"vi": "...", "en": "...", "ja": "..."}`
- Sử dụng `lang` query param để lấy text theo ngôn ngữ
- Frontend có thể lấy: `product.name[lang]` hoặc `product.name.vi`

### 4. **Pagination**
- Mặc định: `page=1`, `page_size=12`
- Tối đa: `page_size=100`
- Response luôn có `pagination` object

### 5. **Error Handling**
- Tất cả lỗi trả về format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Thông báo lỗi bằng tiếng Việt"
  }
}
```

---

## 🎯 Endpoints Summary

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Danh sách sản phẩm với filter, sort, pagination |
| GET | `/api/brands` | Danh sách thương hiệu |
| GET | `/api/categories` | Cấu trúc danh mục |
| GET | `/api/products/filter-options` | Tùy chọn filter có sẵn |
| GET | `/api/products/search` | Tìm kiếm sản phẩm |
| GET | `/api/products/autocomplete` | Gợi ý tìm kiếm |
| GET | `/api/categories/{slug}/products` | Sản phẩm theo category |
| GET | `/api/products/new` | Sản phẩm mới |
| GET | `/api/products/sale` | Sản phẩm giảm giá |

---

## 🔧 Thay Đổi Models

### ✅ Đã thêm vào models:
1. **ColorVariant.color_hex** - Hex code cho màu sắc (ví dụ: "#000000")
2. **Product.review_count** - Số lượng reviews (mặc định: 0)

### 📝 Notes:
- Gender filter hoạt động qua parent category (không cần thêm field vào Product)
- Tất cả endpoints đều **public** (không cần authentication)

---

## 📚 Tài Liệu Chi Tiết

Xem file `docs/CATALOG_API.md` để biết chi tiết đầy đủ về từng endpoint.

