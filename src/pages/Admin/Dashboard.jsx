import { useEffect, useState } from "react";
import { getDashboardStats } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const { addToast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, [period]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    const result = await getDashboardStats(period);
    
    if (result.success) {
      setStats(result.data);
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải dữ liệu dashboard",
      });
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const StatCard = ({ title, value, change, icon: Icon, format = "number" }) => {
    const isPositive = change >= 0;
    const formattedValue = format === "currency" ? formatCurrency(value) : formatNumber(value);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{title}</span>
            <div className="p-2 bg-color4/10 rounded-lg">
              <Icon className="w-5 h-5 text-color4" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : ""}{change.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">so với kỳ trước</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan về hoạt động kinh doanh</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === "week"
                ? "bg-color4 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Tuần
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === "month"
                ? "bg-color4 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Tháng
          </button>
          <button
            onClick={() => setPeriod("year")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === "year"
                ? "bg-color4 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Năm
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Doanh thu"
            value={stats.summary.totalRevenue}
            change={stats.summary.revenueChange}
            icon={DollarSign}
            format="currency"
          />
          <StatCard
            title="Đơn hàng"
            value={stats.summary.totalOrders}
            change={stats.summary.ordersChange}
            icon={ShoppingCart}
          />
          <StatCard
            title="Khách hàng"
            value={stats.summary.totalCustomers}
            change={stats.summary.customersChange}
            icon={Users}
          />
          <StatCard
            title="Sản phẩm"
            value={stats.summary.totalProducts}
            change={stats.summary.productsChange}
            icon={Package}
          />
        </div>
      )}

      {/* Recent Orders */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Mã đơn</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Khách hàng</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tổng tiền</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-color4">{order.orderNumber}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.customerName}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "completed" ? "bg-green-100 text-green-800" :
                          order.status === "processing" ? "bg-blue-100 text-blue-800" :
                          order.status === "shipping" ? "bg-purple-100 text-purple-800" :
                          order.status === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status === "pending" ? "Chờ xử lý" :
                           order.status === "processing" ? "Đang xử lý" :
                           order.status === "shipping" ? "Đang giao" :
                           order.status === "completed" ? "Hoàn thành" :
                           "Đã hủy"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

