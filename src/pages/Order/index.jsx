import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiPackage,
  FiTruck,
  FiClock,
  FiMapPin,
  FiCreditCard,
  FiXCircle,
  FiCheck,
} from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineInboxArrowDown, HiOutlineNewspaper } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { getOrderDetail, cancelOrder } from "@/service/orderService";
import { useToast } from "@/contexts/ToastContext";

const statusSteps = [
  { key: "placed", label: "Đơn hàng đã đặt", icon: HiOutlineNewspaper },
  { key: "pending", label: "Đang xử lý", icon: FiClock },
  { key: "preparing", label: "Đang chuẩn bị cho ĐVVC", icon: FiPackage },
  { key: "shipping", label: "Đã vận chuyển", icon: FiTruck },
  { key: "delivered", label: "Đã giao", icon: HiOutlineInboxArrowDown },
];

const CANCELLABLE_STATUSES = ["placed", "pending"];

// Map status từ API sang status hiển thị
const mapApiStatusToDisplay = (apiStatus) => {
  const statusMap = {
    pending: "pending",
    processing: "pending",
    shipping: "shipping",
    completed: "delivered",
    cancelled: "cancelled",
    placed: "placed",
  };
  return statusMap[apiStatus] || apiStatus;
};

// Transform order từ API sang format UI
const transformOrder = (apiOrder) => {
  // Tính subtotal từ items nếu subtotal không có hoặc = 0
  let subtotal = apiOrder.subtotal || 0;
  if (subtotal === 0 && apiOrder.items && apiOrder.items.length > 0) {
    subtotal = apiOrder.items.reduce((sum, item) => {
      const itemTotal = item.total || (item.price * (item.quantity || 0));
      return sum + itemTotal;
    }, 0);
  }
  
  const shipping = apiOrder.shipping_fee || apiOrder.shippingFee || 0;
  const discount = apiOrder.discount || 0;
  
  // Tính total từ total_price, nếu không có hoặc = 0 thì tính từ subtotal + shipping - discount
  let total = apiOrder.total_price || apiOrder.total;
  if (!total || total === 0) {
    total = subtotal + shipping - discount;
    // Đảm bảo total không âm
    if (total < 0) total = 0;
  }
  
  return {
    orderId: apiOrder._id || apiOrder.id || apiOrder.order_number || apiOrder.orderNumber,
    orderNumber: apiOrder.order_number || apiOrder.orderNumber,
    status: mapApiStatusToDisplay(apiOrder.status),
    createdAt: apiOrder.created_at || apiOrder.createdAt,
    estimatedDelivery: apiOrder.estimated_delivery || apiOrder.estimatedDelivery,
    total: total,
    subtotal: subtotal,
    shipping: shipping,
    discount: discount,
    appliedVoucher: apiOrder.voucher || apiOrder.appliedVoucher,
    selectedAddress: (apiOrder.shippingAddress || (apiOrder.address && typeof apiOrder.address === 'object')) ? {
      receiver: (apiOrder.shippingAddress || apiOrder.address)?.fullName || (apiOrder.shippingAddress || apiOrder.address)?.receiver,
      phone: (apiOrder.shippingAddress || apiOrder.address)?.phone,
      detail: (apiOrder.shippingAddress || apiOrder.address)?.address || (apiOrder.shippingAddress || apiOrder.address)?.detail,
      ward: (apiOrder.shippingAddress || apiOrder.address)?.ward,
      district: (apiOrder.shippingAddress || apiOrder.address)?.district,
      province: (apiOrder.shippingAddress || apiOrder.address)?.province,
    } : null,
    cart: (apiOrder.items || []).map(item => ({
      image: item.product_image || item.product?.images?.[0] || item.product?.image || "",
      name: item.product_name || item.product?.name?.vi || item.product?.name || item.productName?.vi || item.productName || "Sản phẩm",
      color: item.color || "",
      size: item.size || "",
      price: item.price || 0,
      qty: item.quantity || 0,
    })),
    cancelledAt: apiOrder.cancelled_at || apiOrder.cancelledAt,
    paymentMethod: apiOrder.payment_method || apiOrder.paymentMethod,
  };
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    const result = await getOrderDetail(id);
    
    if (result.success && result.data) {
      const transformedOrder = transformOrder(result.data);
      setOrder(transformedOrder);
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải chi tiết đơn hàng",
      });
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (!order)
    return (
      <div className="text-center py-10 text-black/90">
        Không tìm thấy đơn hàng
      </div>
    );

  const currentStep = statusSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "cancelled";

  const formatAddress = () => {
    if (!order.selectedAddress) return "Chưa có địa chỉ";
    return [
      order.selectedAddress.detail,
      order.selectedAddress.ward,
      order.selectedAddress.district,
      order.selectedAddress.province,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng?")) return;

    const result = await cancelOrder(id);
    
    if (result.success) {
      addToast({
        type: "success",
        message: result.message || "Hủy đơn hàng thành công",
      });
      // Refresh order data
      await fetchOrder();
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể hủy đơn hàng",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <div className="max-w-[90%] mx-auto p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          {/* <h2 className="text-[2rem] font-bold">Theo dõi đơn hàng</h2> */}
          <Button variant="outline" onClick = {()=>navigate("/orders")}  >
            <IoIosArrowBack />
            TRỞ VỀ
          </Button>
          <div className="flex justify-center items-center gap-2 ">
            {CANCELLABLE_STATUSES.includes(order.status) && (
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleCancelOrder}
                  className="flex items-center gap-2"
                >
                  <FiXCircle className="w-5 h-5" />
                  Hủy đơn hàng
                </Button>
              </div>
            )}
            <Button onClick={() => navigate("/cart")}>
              Tiếp tục mua hàng
            </Button>
          </div>
        </div>

        {/* Cancelled Notice */}
        {isCancelled && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium flex items-center gap-2">
              <FiXCircle className="w-5 h-5" />
              Đơn hàng đã bị hủy
            </p>
            <p className="text-sm mt-1">
              Thời gian hủy:{" "}
              {new Date(order.cancelledAt).toLocaleString("vi-VN")}
            </p>
          </div>
        )}

        {/* Estimated Delivery */}
        {!isCancelled && (
          <div className="text-center">
            <p className="text-lg font-semibold">
              Ngày dự kiến giao hàng:{" "}
              <span className="text-teal-600">{order.estimatedDelivery}</span>
            </p>
          </div>
        )}

        {/* Tracking Timeline */}
        {!isCancelled && (
          <div className="relative">
            <div className="flex justify-between items-start relative">
              {/* Thanh nền */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300 -z-10"></div>
              {/* Thanh tiến trình */}
              {currentStep >= 0 && (
                <div
                  className="absolute top-6 left-0 h-0.5 bg-teal-600 transition-all duration-500 -z-10"
                  style={{
                    width: `${(100 / (statusSteps.length - 1)) * currentStep}%`,
                  }}
                />
              )}

              {statusSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= currentStep;

                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all relative",
                        isActive
                          ? "bg-teal-100 border-teal-600 text-teal-600"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      )}
                    >
                      <Icon className="w-6 h-6 stroke-2" />
                      {isActive && step.key === "delivered" && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <p
                      className={cn(
                        "mt-2 text-xs font-medium text-center",
                        isActive ? "text-teal-700" : "text-gray-500"
                      )}
                    >
                      {step.label}
                    </p>

                    {idx === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Products */}
          <div className="bg-white p-5 rounded-xl shadow-sm lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg">Chi tiết đơn hàng</h2>
            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-[#939393]">Mã đơn hàng</span>
                <span className="font-mono">{order.orderNumber || order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939393]">Ngày đặt</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#939393]">Tổng tiền</span>
                <span className="font-semibold">
                  {order.total.toLocaleString()} VND
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {order.cart.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-white border rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-2">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Màu: {item.color} • Kích thước: {item.size}
                    </p>
                    <p className="font-semibold mt-1">
                      <span className="text-[#5C5C63] font-medium">
                        {item.qty}x{" "}
                      </span>{" "}
                      {item.price.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="bg-white p-5 rounded-xl shadow-sm space-y-4">
            <h3 className="font-semibold text-lg">Thông tin đơn hàng</h3>

            {/* Address */}
            {order.selectedAddress && (
              <div className="p-3 bg-teal-50 rounded-lg text-sm border border-teal-200">
                <div className="flex items-center gap-1 text-teal-700 font-medium mb-1">
                  <FiMapPin className="text-xs" />
                  <span>Người nhận</span>
                </div>
                <p className="font-medium">{order.selectedAddress.receiver}</p>
                <p className="text-gray-600">{order.selectedAddress.phone}</p>
                <p className="text-gray-600 mt-1">{formatAddress()}</p>
              </div>
            )}

            {/* Payment Method */}
            <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-200">
              <div className="flex items-center gap-1 text-blue-700 font-medium mb-1">
                <FiCreditCard className="text-xs" />
                <span>Phương thức thanh toán</span>
              </div>
              <p className="font-medium">
                {order.paymentMethod === "COD" &&
                  "Thanh toán khi nhận hàng (COD)"}
                {order.paymentMethod === "card" && "Thẻ tín dụng/ghi nợ"}
                {order.paymentMethod === "wallet" && "Ví điện tử"}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span>{order.subtotal.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{order.shipping.toLocaleString()} VND</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Voucher từ WildStep</span>
                  <span>-{order.discount.toLocaleString()} VND</span>
                </div>
              )}
              <div className="border-t pt-2 font-semibold text-lg flex justify-between">
                <span>Thành tiền</span>
                <span className="text-teal-600">
                  {order.total.toLocaleString()} VND
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
