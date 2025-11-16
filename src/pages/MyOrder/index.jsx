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

const mockOrders = [
  {
    orderId: "ORDER-20251115001",
    status: "pending",
    createdAt: "2025-11-15T10:00:00.000Z",
    estimatedDelivery: "2025-11-18",
    total: 492000,
    subtotal: 360000,
    shipping: 32000,
    discount: 29900,
    appliedVoucher: { name: "Giảm 29.900đ cho đơn hàng đầu tiên" },
    selectedAddress: {
      receiver: "Nguyễn Văn A",
      phone: "09102345678",
      detail: "123 Đường ABC",
      ward: "Phường Linh Xuân",
      district: "Quận Thủ Đức",
      province: "TP. Hồ Chí Minh",
    },
    cart: [
      {
        image:
          "https://shoeshop.blob.core.windows.net/media/products/69110ac083c5c6519af1ec97_37accb34.avif",
        name: "Cloud Shift Lightweight Runner Pro Edition",
        color: "White/Brown",
        size: "EU37",
        price: 120000,
        qty: 3,
      },
    ],
  },
  {
    orderId: "ORDER-20251114002",
    status: "shipping",
    createdAt: "2025-11-14T08:30:00.000Z",
    estimatedDelivery: "2025-11-16",
    total: 780000,
    subtotal: 720000,
    shipping: 60000,
    discount: 0,
    selectedAddress: {
      receiver: "Trần Thị B",
      phone: "0909123456",
      detail: "456 Đường XYZ",
      ward: "Phường 5",
      district: "Quận 3",
      province: "TP. Hồ Chí Minh",
    },
    cart: [
      {
        image:
          "https://shoeshop.blob.core.windows.net/media/products/69110ac083c5c6519af1ec97_37accb34.avif",
        name: "Cloud Shift Lightweight Runner Pro Edition",
        color: "Black/Red",
        size: "EU39",
        price: 240000,
        qty: 3,
      },
    ],
  },
  {
    orderId: "ORDER-20251113003",
    status: "delivered",
    createdAt: "2025-11-13T14:20:00.000Z",
    estimatedDelivery: "2025-11-15",
    total: 360000,
    subtotal: 360000,
    shipping: 32000,
    discount: 32000,
    appliedVoucher: { name: "Giảm 32.000đ phí ship" },
    selectedAddress: {
      receiver: "Lê Văn C",
      phone: "0987654321",
      detail: "789 Đường DEF",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
    },
    cart: [
      {
        image:
          "https://shoeshop.blob.core.windows.net/media/products/69110ac083c5c6519af1ec97_37accb34.avif",
        name: "Cloud Shift Lightweight Runner Pro Edition",
        color: "Navy Blue",
        size: "EU40",
        price: 180000,
        qty: 2,
      },
    ],
  },
  {
    orderId: "ORDER-20251112004",
    status: "cancelled",
    createdAt: "2025-11-12T09:15:00.000Z",
    cancelledAt: "2025-11-12T09:45:00.000Z",
    total: 600000,
    subtotal: 600000,
    shipping: 32000,
    discount: 32000,
    selectedAddress: {
      receiver: "Phạm Thị D",
      phone: "0938123456",
      detail: "101 Đường GHI",
      ward: "Phường Tân Định",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
    },
    cart: [
      {
        image:
          "https://shoeshop.blob.core.windows.net/media/products/69110ac083c5c6519af1ec97_37accb34.avif",
        name: "Cloud Shift Lightweight Runner Pro Edition",
        color: "Gray",
        size: "EU38",
        price: 300000,
        qty: 2,
      },
    ],
  },
  {
    orderId: "ORDER-20251111005",
    status: "placed",
    createdAt: "2025-11-11T16:00:00.000Z",
    estimatedDelivery: "2025-11-19",
    total: 240000,
    subtotal: 240000,
    shipping: 32000,
    discount: 32000,
    selectedAddress: {
      receiver: "Hoàng Văn E",
      phone: "0977123456",
      detail: "202 Đường JKL",
      ward: "Phường 12",
      district: "Quận 10",
      province: "TP. Hồ Chí Minh",
    },
    cart: [
      {
        image:
          "https://shoeshop.blob.core.windows.net/media/products/69110ac083c5c6519af1ec97_37accb34.avif",
        name: "Cloud Shift Lightweight Runner Pro Edition",
        color: "White",
        size: "EU36",
        price: 120000,
        qty: 2,
      },
    ],
  },
];

// Lưu vào localStorage
localStorage.setItem("myOrders", JSON.stringify(mockOrders));

// Lưu từng đơn hàng riêng (để OrderDetailPage đọc)
mockOrders.forEach((order) => {
  localStorage.setItem(`order_${order.orderId}`, JSON.stringify(order));
});

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("myOrders");
    if (saved) {
      const data = JSON.parse(saved);
      // Sắp xếp theo ngày đặt (mới nhất trước)
      setOrders(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    }
    setLoading(false);
  }, []);

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
                        MÃ ĐƠN HÀNG|{order.orderId}
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
