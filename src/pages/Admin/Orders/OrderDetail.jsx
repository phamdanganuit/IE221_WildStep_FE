import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrder, updateOrderStatus } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    const result = await getOrder(id);

    if (result.success) {
      setOrder(result.data);
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải thông tin đơn hàng",
      });
      navigate("/admin/orders");
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    const result = await updateOrderStatus(id, newStatus);

    if (result.success) {
      addToast({
        type: "success",
        message: "Cập nhật trạng thái thành công",
      });
      fetchOrder();
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể cập nhật trạng thái",
      });
    }
    setUpdating(false);
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
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.class}`}>
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
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getAvailableStatusTransitions = (currentStatus) => {
    const transitions = {
      pending: ["processing", "cancelled"],
      processing: ["shipping", "cancelled"],
      shipping: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };
    return transitions[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const availableTransitions = getAvailableStatusTransitions(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/orders")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đơn hàng #{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">Chi tiết đơn hàng</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(order.status)}
          {getPaymentStatusBadge(order.paymentStatus)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm ({order.items?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product?.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-gray-900">{formatCurrency(order.shippingFee || 0)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="text-red-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-color4">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{order.shippingAddress?.fullName}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress?.phone}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.address}, {order.shippingAddress?.ward},{" "}
                  {order.shippingAddress?.district}, {order.shippingAddress?.province}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Tên:</span>
                <p className="text-base font-medium text-gray-900 mt-1">{order.customer?.displayName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-sm text-gray-900 mt-1">{order.customer?.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Số điện thoại:</span>
                <p className="text-sm text-gray-900 mt-1">{order.customer?.phone || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          {availableTransitions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cập nhật trạng thái</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableTransitions.map((status) => {
                  const statusLabels = {
                    processing: "Đang xử lý",
                    shipping: "Đang giao hàng",
                    completed: "Hoàn thành",
                    cancelled: "Hủy đơn",
                  };
                  return (
                    <Button
                      key={status}
                      variant={status === "cancelled" ? "destructive" : "outline"}
                      className="w-full"
                      onClick={() => handleUpdateStatus(status)}
                      disabled={updating}
                    >
                      {statusLabels[status]}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Ngày đặt:</span>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              {order.completedDate && (
                <div>
                  <span className="text-sm text-gray-600">Ngày hoàn thành:</span>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(order.completedDate).toLocaleString("vi-VN")}
                  </p>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(order.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

