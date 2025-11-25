import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";

const OrderList = () => {
  const { t } = useTranslation();
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
        message: result.error || t('admin.orders.loadError'),
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
      pending: { label: t('dashboard.orderStatus.pending'), class: "bg-yellow-100 text-yellow-800" },
      processing: { label: t('dashboard.orderStatus.processing'), class: "bg-blue-100 text-blue-800" },
      shipping: { label: t('dashboard.orderStatus.shipping'), class: "bg-purple-100 text-purple-800" },
      completed: { label: t('dashboard.orderStatus.completed'), class: "bg-green-100 text-green-800" },
      cancelled: { label: t('dashboard.orderStatus.cancelled'), class: "bg-red-100 text-red-800" },
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
      pending: { label: t('admin.orders.paymentPending'), class: "bg-yellow-100 text-yellow-800" },
      paid: { label: t('admin.orders.paymentPaid'), class: "bg-green-100 text-green-800" },
      refunded: { label: t('admin.orders.paymentRefunded'), class: "bg-blue-100 text-blue-800" },
      failed: { label: t('dashboard.orderStatus.cancelled'), class: "bg-red-100 text-red-800" },
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
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.orders.title')}</h1>
        <p className="text-gray-600 mt-1">{t('admin.orders.subtitle')}</p>
      </div>

      {/* Stats */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats).map(([key, value]) => {
            const labels = {
              pending: t('dashboard.orderStatus.pending'),
              processing: t('dashboard.orderStatus.processing'),
              shipping: t('dashboard.orderStatus.shipping'),
              completed: t('dashboard.orderStatus.completed'),
              cancelled: t('dashboard.orderStatus.cancelled'),
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
                  placeholder={t('admin.orders.search')}
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
              <option value="">{t('admin.orders.allStatus')}</option>
              <option value="pending">{t('dashboard.orderStatus.pending')}</option>
              <option value="processing">{t('dashboard.orderStatus.processing')}</option>
              <option value="shipping">{t('dashboard.orderStatus.shipping')}</option>
              <option value="completed">{t('dashboard.orderStatus.completed')}</option>
              <option value="cancelled">{t('dashboard.orderStatus.cancelled')}</option>
            </select>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="">{t('admin.orders.allPaymentStatus')}</option>
              <option value="pending">{t('admin.orders.paymentPending')}</option>
              <option value="paid">{t('admin.orders.paymentPaid')}</option>
              <option value="refunded">{t('admin.orders.paymentRefunded')}</option>
              <option value="failed">{t('dashboard.orderStatus.cancelled')}</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="createdAt">{t('admin.orders.sort.createdAt')}</option>
              <option value="total">{t('admin.orders.sort.total')}</option>
              <option value="status">{t('admin.orders.sort.status')}</option>
            </select>
            <select
              value={filters.order}
              onChange={(e) => setFilters({ ...filters, order: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="desc">{t('common.desc')}</option>
              <option value="asc">{t('common.asc')}</option>
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
            <Button type="submit">{t('header.search')}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.orders.title')} ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('admin.orders.noOrders')}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.orders.orderNumber')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.orders.customer')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.orders.total')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.orders.status')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.orders.paymentStatus')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.orders.date')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">{t('admin.orders.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-color4">
                          {order.order_number || order.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                          {formatCurrency(order.total_price || order.total || 0)}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                        <td className="py-3 px-4">{getPaymentStatusBadge(order.paymentStatus)}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(order.created_at || order.createdAt).toLocaleDateString("vi-VN")}
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
                    {t('common.page')} {filters.page} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={filters.page === 1}
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    >
                      {t('common.prev')}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={filters.page === totalPages}
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    >
                      {t('common.next')}
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

