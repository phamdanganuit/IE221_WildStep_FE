import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";

const CustomerList = () => {
  const { t } = useTranslation();
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
        message: result.error || t('admin.customers.loadError'),
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
      active: { label: t('admin.customers.active'), class: "bg-green-100 text-green-800" },
      inactive: { label: t('admin.customers.inactive'), class: "bg-gray-100 text-gray-800" },
      vip: { label: t('admin.customers.vip'), class: "bg-purple-100 text-purple-800" },
      blocked: { label: t('admin.customers.blocked'), class: "bg-red-100 text-red-800" },
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
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.customers.title')}</h1>
        <p className="text-gray-600 mt-1">{t('admin.customers.subtitle')}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('admin.customers.search')}
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
              <option value="">{t('admin.customers.allStatus')}</option>
              <option value="active">{t('admin.customers.active')}</option>
              <option value="inactive">{t('admin.customers.inactive')}</option>
              <option value="vip">{t('admin.customers.vip')}</option>
              <option value="blocked">{t('admin.customers.blocked')}</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="joinDate">{t('admin.customers.sort.joinDate')}</option>
              <option value="name">{t('admin.customers.sort.name')}</option>
              <option value="totalOrders">{t('admin.customers.sort.totalOrders')}</option>
              <option value="totalSpent">{t('admin.customers.sort.totalSpent')}</option>
            </select>
            <select
              value={filters.order}
              onChange={(e) => setFilters({ ...filters, order: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="desc">{t('common.desc')}</option>
              <option value="asc">{t('common.asc')}</option>
            </select>
            <Button type="submit">{t('header.search')}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.customers.title')} ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('admin.customers.noCustomers')}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.customers.name')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.customers.email')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.customers.orders')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.customers.spent')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.customers.status')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.customers.joined')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">{t('admin.customers.actions')}</th>
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
                                <span className="text-xs text-purple-600 font-medium">⭐ {t('admin.customers.vip')}</span>
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

export default CustomerList;

