# Admin Panel Implementation

## Tổng quan

Admin panel đã được tích hợp hoàn chỉnh vào dự án với đầy đủ các tính năng quản lý theo API_ADMIN.md.

## Cấu trúc

### 1. Services (src/service/)
- **adminService.js**: Tất cả API calls cho admin (Dashboard, Products, Orders, Customers, Categories, Brands)

### 2. Components (src/components/Admin/)
- **AdminLayout.jsx**: Layout chính với sidebar navigation cho admin panel

### 3. Routes (src/routes/)
- **AdminRoute.jsx**: Protected route kiểm tra quyền admin (role = "admin")

### 4. Pages (src/pages/Admin/)

#### Dashboard (Dashboard.jsx)
- Hiển thị thống kê tổng quan (doanh thu, đơn hàng, khách hàng, sản phẩm)
- Filter theo tuần/tháng/năm
- Danh sách đơn hàng gần đây

#### Products
- **ProductList.jsx**: Danh sách sản phẩm với search & filter
- **ProductForm.jsx**: Form tạo/sửa sản phẩm (dùng chung)
- **ProductDetail.jsx**: Chi tiết sản phẩm
- Upload ảnh, quản lý specifications, tags

#### Orders
- **OrderList.jsx**: Danh sách đơn hàng với filter
- **OrderDetail.jsx**: Chi tiết đơn hàng và cập nhật trạng thái

#### Customers
- **CustomerList.jsx**: Danh sách khách hàng
- **CustomerDetail.jsx**: Chi tiết khách hàng, chặn/bỏ chặn

#### Categories & Brands
- **Categories.jsx**: Quản lý danh mục cha-con
- **Brands.jsx**: Quản lý thương hiệu

## Routes đã thêm vào App.jsx

```
/admin/dashboard          - Dashboard
/admin/products           - Danh sách sản phẩm
/admin/products/create    - Tạo sản phẩm mới
/admin/products/:id       - Chi tiết sản phẩm
/admin/products/:id/edit  - Sửa sản phẩm
/admin/orders             - Danh sách đơn hàng
/admin/orders/:id         - Chi tiết đơn hàng
/admin/customers          - Danh sách khách hàng
/admin/customers/:id      - Chi tiết khách hàng
/admin/categories         - Quản lý danh mục
/admin/brands             - Quản lý thương hiệu
```

## Cách sử dụng

### 1. Đăng nhập với tài khoản admin
- User phải có `role = "admin"` trong database
- Nếu không phải admin, sẽ hiển thị thông báo "Truy cập bị từ chối"

### 2. Truy cập Admin Panel
- Sau khi đăng nhập, truy cập: `http://localhost:5173/admin/dashboard`
- Hoặc từ header, có thể thêm link "Admin" cho user có role admin

### 3. Navigation
- Sidebar bên trái: Menu điều hướng các trang
- Header: Tên trang hiện tại và link về trang chủ
- Mobile: Menu hamburger

## Tính năng chính

### Dashboard
- Thống kê tổng quan theo period (week/month/year)
- Cards hiển thị doanh thu, đơn hàng, khách hàng, sản phẩm
- Bảng đơn hàng gần đây

### Products
- CRUD đầy đủ (Create, Read, Update, Delete)
- Search theo tên
- Filter theo trạng thái (active, inactive, out_of_stock, low_stock)
- Upload tối đa 5 ảnh
- Quản lý specifications (size, color, material, weight)
- Tags

### Orders
- Xem danh sách với filter status & payment status
- Search theo mã đơn, tên, email
- Cập nhật trạng thái theo flow: pending → processing → shipping → completed
- Có thể hủy từ bất kỳ trạng thái nào (trừ completed/cancelled)

### Customers
- Xem danh sách với thống kê tự động (totalOrders, totalSpent)
- Filter theo status (active, inactive, vip, blocked)
- Chi tiết: lịch sử đơn hàng, địa chỉ
- Chặn/bỏ chặn khách hàng

### Categories
- Quản lý cấu trúc cha-con
- CRUD cho cả danh mục cha và con
- Hiển thị dạng tree

### Brands
- CRUD đầy đủ
- Thông tin: name, description, website, country

## API Integration

Tất cả endpoints được implement đúng theo API_ADMIN.md:
- Base URL: `/api/admin`
- Authentication: Bearer token (tự động thêm từ localStorage/sessionStorage)
- Error handling: Hiển thị toast notifications

## Theme & Styling

- Sử dụng colors từ dự án: color1 (#0B132B), color4 (#5BC0BE), hover4 (#248F8D)
- Logo: /Logo_main.svg
- Components: Tái sử dụng shadcn/ui components (Button, Card, Input, Dialog)
- Responsive: Mobile-friendly với hamburger menu

## Notes

### Thông tin thiếu trong API_ADMIN.md
Không có thông tin thiếu quan trọng. Tất cả endpoints và fields đã được implement đúng theo documentation.

### Các field tự động tính
- `discountPrice`: Tự động tính khi có price và discount
- `status` (products): Tự động cập nhật thành out_of_stock/low_stock
- `status` (customers): Tự động tính (active/inactive/vip) trừ blocked
- `isVip`: Tự động set khi totalOrders > 10

### Validation
- Required fields được validate client-side
- Server errors được handle và hiển thị toast
- 401 Unauthorized → redirect login
- 403 Forbidden → hiển thị access denied

## Testing

Để test admin panel:
1. Đảm bảo backend đang chạy
2. Đảm bảo có file `.env` với `VITE_BACKEND_URL`
3. Tạo user với `role = "admin"` trong database
4. Đăng nhập và truy cập `/admin/dashboard`

## Future Enhancements

Có thể thêm:
- Analytics charts (revenue over time, category distribution)
- Bulk actions (delete multiple products)
- Export data (CSV/Excel)
- Image cropping/editing
- Rich text editor cho descriptions

