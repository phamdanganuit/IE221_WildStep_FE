import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

const OrderList = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
    paymentStatus: "",
    sort: "createdAt",
    order: "desc",
    startDate: "",
    endDate: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getOrders(filters);

    if (result.success) {
      setOrders(result.data.orders || []);
      setTotalPages(result.data.totalPages || 1);
      setStats(result.data.stats || {});
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải danh sách đơn hàng",
      });
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Chờ xử lý", class: "bg-yellow-100 text-yellow-800" },
      processing: { label: "Đang xử lý", class: "bg-blue-100 text-blue-800" },
      shipping: { label: "Đang giao", class: "bg-purple-100 text-purple-800" },
      completed: { label: "Hoàn thành", class: "bg-green-100 text-green-800" },
      cancelled: { label: "Đã hủy", class: "bg-red-100 text-red-800" },
    };

    const statusInfo = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800" };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Chờ thanh toán", class: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Đã thanh toán", class: "bg-green-100 text-green-800" },
      refunded: { label: "Đã hoàn tiền", class: "bg-blue-100 text-blue-800" },
      failed: { label: "Thất bại", class: "bg-red-100 text-red-800" },
    };

    const statusInfo = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800" };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600 mt-1">Xem và quản lý tất cả đơn hàng</p>
      </div>

      {/* Stats */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats).map(([key, value]) => {
            const labels = {
              pending: "Chờ xử lý",
              processing: "Đang xử lý",
              shipping: "Đang giao",
              completed: "Hoàn thành",
              cancelled: "Đã hủy",
            };
            return (
              <Card key={key}>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">{labels[key] || key}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="">Tất cả thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="refunded">Đã hoàn tiền</option>
              <option value="failed">Thất bại</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="createdAt">Ngày tạo</option>
              <option value="total">Tổng tiền</option>
              <option value="status">Trạng thái</option>
            </select>
            <select
              value={filters.order}
              onChange={(e) => setFilters({ ...filters, order: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
            <input
              type="date"
              value={filters.startDate ? filters.startDate.substring(0, 10) : ""}
              onChange={(e) => {
                const d = e.target.value ? new Date(e.target.value) : null;
                const iso = d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).toISOString() : "";
                setFilters({ ...filters, startDate: iso, page: 1 });
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="date"
              value={filters.endDate ? filters.endDate.substring(0, 10) : ""}
              onChange={(e) => {
                const d = e.target.value ? new Date(e.target.value) : null;
                const iso = d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).toISOString() : "";
                setFilters({ ...filters, endDate: iso, page: 1 });
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Mã đơn</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Khách hàng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tổng tiền</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Thanh toán</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày đặt</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-color4">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                        <td className="py-3 px-4">{getPaymentStatusBadge(order.paymentStatus)}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    Trang {filters.page} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={filters.page === 1}
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      disabled={filters.page === totalPages}
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderList;

