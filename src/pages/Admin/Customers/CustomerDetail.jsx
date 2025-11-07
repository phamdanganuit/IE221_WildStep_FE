import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomer, updateCustomerStatus } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban, CheckCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

const CustomerDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [blockDialog, setBlockDialog] = useState({ open: false, action: null });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    const result = await getCustomer(id);

    if (result.success) {
      setCustomer(result.data);
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.customers.detail.loadError'),
      });
      navigate("/admin/customers");
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (status) => {
    setUpdating(true);
    const result = await updateCustomerStatus(id, status);

    if (result.success) {
      addToast({
        type: "success",
        message: status === "blocked" ? t('admin.customers.detail.blocked') : t('admin.customers.detail.unblocked'),
      });
      fetchCustomer();
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.customers.detail.updateError'),
      });
    }
    setUpdating(false);
    setBlockDialog({ open: false, action: null });
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
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/customers")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.displayName}</h1>
            <p className="text-gray-600 mt-1">{customer.email}</p>
          </div>
        </div>
        {customer.status !== "blocked" ? (
          <Button
            variant="destructive"
            onClick={() => setBlockDialog({ open: true, action: "block" })}
            disabled={updating}
          >
            <Ban className="w-4 h-4 mr-2" />
            Chặn khách hàng
          </Button>
        ) : (
          <Button
            onClick={() => setBlockDialog({ open: true, action: "unblock" })}
            disabled={updating}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Bỏ chặn
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          {customer.recentOrders && customer.recentOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng gần đây ({customer.recentOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                        <p className="text-sm text-gray-500">
                          {order.status === "pending" ? "Chờ xử lý" :
                           order.status === "processing" ? "Đang xử lý" :
                           order.status === "shipping" ? "Đang giao" :
                           order.status === "completed" ? "Hoàn thành" :
                           "Đã hủy"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Addresses */}
          {customer.addresses && customer.addresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Địa chỉ ({customer.addresses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.addresses.map((address, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{address.fullName}</p>
                          <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.address}, {address.ward}, {address.district}, {address.province}
                          </p>
                        </div>
                        {address.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium bg-color4/10 text-color4 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                {customer.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.displayName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-color4/20 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-color4">
                      {customer.displayName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">{customer.displayName}</p>
                <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
              </div>
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số điện thoại:</span>
                    <span className="text-sm text-gray-900">{customer.phone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <div>{getStatusBadge(customer.status)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê mua hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Tổng số đơn:</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">{customer.totalOrders || 0}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Tổng chi tiêu:</span>
                <p className="text-2xl font-bold text-color4 mt-1">
                  {formatCurrency(customer.totalSpent || 0)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Giá trị đơn TB:</span>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {formatCurrency(customer.averageOrderValue || 0)}
                </p>
              </div>
              {customer.isVip && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-purple-600">
                    <span className="text-2xl">⭐</span>
                    <span className="font-semibold">Khách hàng VIP</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Hơn 10 đơn hàng</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.firstOrderDate && (
                <div>
                  <span className="text-sm text-gray-600">Đơn đầu tiên:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(customer.firstOrderDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
              {customer.lastOrderDate && (
                <div>
                  <span className="text-sm text-gray-600">Đơn gần nhất:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(customer.lastOrderDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">Tham gia:</span>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Block/Unblock Dialog */}
      <Dialog open={blockDialog.open} onOpenChange={(open) => setBlockDialog({ open, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {blockDialog.action === "block" ? "Chặn khách hàng" : "Bỏ chặn khách hàng"}
            </DialogTitle>
            <DialogDescription>
              {blockDialog.action === "block"
                ? `Bạn có chắc chắn muốn chặn khách hàng ${customer.displayName}? Họ sẽ không thể thực hiện mua hàng.`
                : `Bạn có chắc chắn muốn bỏ chặn khách hàng ${customer.displayName}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBlockDialog({ open: false, action: null })}
            >
              Hủy
            </Button>
            <Button
              variant={blockDialog.action === "block" ? "destructive" : "default"}
              onClick={() =>
                handleUpdateStatus(blockDialog.action === "block" ? "blocked" : "active")
              }
              disabled={updating}
            >
              {blockDialog.action === "block" ? "Chặn" : "Bỏ chặn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerDetail;

