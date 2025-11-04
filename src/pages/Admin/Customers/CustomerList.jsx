import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

const CustomerList = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
    sort: "joinDate",
    order: "desc",
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const fetchCustomers = async () => {
    setLoading(true);
    const result = await getCustomers(filters);

    if (result.success) {
      const payload = result.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.customers)
            ? payload.customers
            : Array.isArray(payload?.items)
              ? payload.items
              : [];

      setCustomers(list);
      const pages = payload?.pagination?.totalPages || payload?.totalPages || 1;
      setTotalPages(pages);
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải danh sách khách hàng",
      });
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = (filters.search || "").trim();
    setFilters({ ...filters, page: 1, search: trimmed });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: "Hoạt động", class: "bg-green-100 text-green-800" },
      inactive: { label: "Không hoạt động", class: "bg-gray-100 text-gray-800" },
      vip: { label: "VIP", class: "bg-purple-100 text-purple-800" },
      blocked: { label: "Đã chặn", class: "bg-red-100 text-red-800" },
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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
        <p className="text-gray-600 mt-1">Xem và quản lý thông tin khách hàng</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="vip">VIP</option>
              <option value="blocked">Đã chặn</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="joinDate">Ngày tham gia</option>
              <option value="name">Tên</option>
              <option value="totalOrders">Số đơn</option>
              <option value="totalSpent">Tổng chi</option>
            </select>
            <select
              value={filters.order}
              onChange={(e) => setFilters({ ...filters, order: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có khách hàng nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Khách hàng</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Số đơn</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tổng chi</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày tham gia</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer._id || customer.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {customer.avatar ? (
                              <img
                                src={customer.avatar}
                                alt={customer.displayName || customer.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-color4/20 flex items-center justify-center">
                                <span className="text-sm font-semibold text-color4">
                                  {(customer.displayName || customer.name || "U").charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{customer.displayName || customer.name}</p>
                              {customer.isVip && (
                                <span className="text-xs text-purple-600 font-medium">⭐ VIP</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{customer.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{customer.totalOrders || 0}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {formatCurrency(customer.totalSpent || 0)}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(customer.status)}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(customer.joinDate || customer.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => navigate(`/admin/customers/${customer._id || customer.id}`)}
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

export default CustomerList;

