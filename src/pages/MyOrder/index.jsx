import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { getOrders } from "@/service/orderService";
import { useToast } from "@/contexts/ToastContext";

const STATUS_TABS = [
  { key: "all", label: "Tất cả", icon: BiCategory },
  { key: "placed", label: "Chờ xác nhận", icon: FiClock },
  { key: "pending", label: "Chờ lấy hàng", icon: FiPackage },
  { key: "shipping", label: "Chờ giao hàng", icon: FiTruck },
  { key: "delivered", label: "Hoàn thành", icon: FiCheckCircle },
  { key: "cancelled", label: "Đã hủy", icon: FiXCircle },
];

const STATUS_CONFIG = {
  placed: {
    label: "Chờ xác nhận",
    bgColor: "#fffba5",
    textColor: "#000",
  },
  pending: {
    label: "Chờ lấy hàng",
    bgColor: "#EFF6FF",
    textColor: "#155dfc",
  },
  shipping: {
    label: "Đang giao",
    bgColor: "#B7FFBA",
    textColor: "#000",
  },
  delivered: {
    label: "Đã giao",
    bgColor: "#18a81e",
    textColor: "#fff",
  },
  cancelled: {
    label: "Đã hủy",
    bgColor: "#ff0000",
    textColor: "#fff",
  },
};

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

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getOrders();
    
    if (result.success && result.data) {
      const ordersArray = Array.isArray(result.data) ? result.data : (result.data.orders || []);
      const transformedOrders = ordersArray.map(transformOrder);
      // Sắp xếp theo ngày đặt (mới nhất trước)
      setOrders(
        transformedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải danh sách đơn hàng",
      });
      setOrders([]);
    }
    setLoading(false);
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <h2 className="text-[2rem] font-bold mb-6">Đơn hàng của tôi</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all",
                  isActive
                    ? "bg-white text-color4 border-t border-x border-gray-300"
                    : "text-gray-600 hover:text-color4"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có đơn hàng nào</p>
            <Button onClick={() => navigate("/")}>Tiếp tục mua sắm</Button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const config =
              STATUS_CONFIG[order.status] || STATUS_CONFIG.cancelled;
            const isPendingPickup = order.status === "pending";

            return (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/orders/${order.orderId}`)}
              >
                {/* Header */}
                <div className="p-4 border-b flex flex-wrap justify-between items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 justify-between text-sm">
                      <span className="font-mono text-color4">
                        MÃ ĐƠN HÀNG|{order.orderNumber || order.orderId}
                      </span>
                      <div className="flex justify-center items-center gap-1">
                        {/* <span className="text-gray-400 text-center flex justify-center items-start">
                          |
                        </span> */}
                        <span
                          className={cn(
                            "font-medium uppercase px-3 py-1 rounded-[0.5rem] text-sm"
                          )}
                          style={{
                            backgroundColor: config.bgColor,
                            color: config.textColor,
                          }}
                        >
                          {config.label}
                        </span>
                      </div>
                      {/* <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/orders/${order.orderId}`);
                          }}
                          className="ml-auto sm:ml-0"
                        >
                          CHỜ LẤY HÀNG
                        </Button> */}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm justify-between">
                      <span className="text-gray-600 hidden sm:inline">
                        Ngày đặt: {formatDate(order.createdAt)}
                      </span>
                      {order.status === "shipping" && (
                        <span className="text-gray-600">
                          Dự kiến giao: {order.estimatedDelivery}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="p-4 space-y-3">
                  {order.cart.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col flex-1 min-w-0 justify-center items-start">
                        <p className="font-medium text-sm line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Màu: {item.color} 
                        </p>
                        <p className="text-xs text-gray-600">
                          Kích thước: {item.size} 
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.qty}x</p>
                        <p className="text-sm">
                          {item.price.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.cart.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      + {order.cart.length - 3} sản phẩm khác
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#5BC0BE]/5 flex justify-end items-center">
                  <div className="text-right flex flex-col justify-end">
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="font-semibold text-lg text-color4">
                      {order.total.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
