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

      {/* Revenue line chart */}
      {Array.isArray(stats?.revenueChart) && stats.revenueChart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartLine data={stats.revenueChart} height={220} />
          </CardContent>
        </Card>
      )}

      {/* Category distribution bar chart */}
      {Array.isArray(stats?.categoryDistribution) && stats.categoryDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tỷ trọng danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar data={stats.categoryDistribution} height={240} />
          </CardContent>
        </Card>
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

// Lightweight SVG Line Chart (no external deps)
function ChartLine({ data, height = 220 }) {
  // data: [{ label: '2025-11-01', value: 12345 }, ...]
  const padding = { top: 10, right: 10, bottom: 24, left: 36 };
  const width = 800; // container width; svg is responsive via viewBox
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({ x: i, y: Number(d.value) || 0, label: d.label }));
  const maxY = Math.max(1, ...points.map((p) => p.y));
  const stepX = points.length > 1 ? innerW / (points.length - 1) : innerW;
  const toX = (i) => padding.left + i * stepX;
  const toY = (v) => padding.top + innerH - (v / maxY) * innerH;

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.y)}`)
    .join(' ');

  const yTicks = 4;
  const lines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const y = padding.top + (innerH / yTicks) * i;
    const value = Math.round(maxY - (maxY / yTicks) * i);
    return { y, value };
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[${height}px]">
        {/* grid */}
        {lines.map((l, idx) => (
          <g key={idx}>
            <line x1={padding.left} x2={width - padding.right} y1={l.y} y2={l.y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={padding.left - 6} y={l.y + 4} textAnchor="end" fontSize="10" fill="#6b7280">
              {new Intl.NumberFormat('vi-VN').format(l.value)}
            </text>
          </g>
        ))}

        {/* path */}
        <path d={path} fill="none" stroke="#5BC0BE" strokeWidth="2.5" />

        {/* points */}
        {points.map((p, i) => (
          <circle key={i} cx={toX(i)} cy={toY(p.y)} r="3" fill="#0B132B" />
        ))}

        {/* x labels */}
        {points.map((p, i) => (
          <text key={i} x={toX(i)} y={height - 4} fontSize="10" textAnchor="middle" fill="#6b7280">
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// Lightweight SVG Bar Chart
function ChartBar({ data, height = 240 }) {
  // data: [{ label: 'Running', value: 120 }, ...]
  const padding = { top: 10, right: 10, bottom: 36, left: 36 };
  const width = 800;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const items = data.map((d) => ({ label: d.label, value: Number(d.value) || 0 }));
  const maxV = Math.max(1, ...items.map((i) => i.value));
  const barW = items.length > 0 ? innerW / items.length - 12 : innerW;

  const toX = (i) => padding.left + i * (barW + 12) + 6;
  const toH = (v) => (v / maxV) * innerH;

  const yTicks = 4;
  const lines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const y = padding.top + (innerH / yTicks) * i;
    const value = Math.round(maxV - (maxV / yTicks) * i);
    return { y, value };
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[${height}px]">
        {/* grid */}
        {lines.map((l, idx) => (
          <g key={idx}>
            <line x1={padding.left} x2={width - padding.right} y1={l.y} y2={l.y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={padding.left - 6} y={l.y + 4} textAnchor="end" fontSize="10" fill="#6b7280">
              {new Intl.NumberFormat('vi-VN').format(l.value)}
            </text>
          </g>
        ))}

        {/* bars */}
        {items.map((it, i) => {
          const h = toH(it.value);
          const x = toX(i);
          const y = padding.top + innerH - h;
          return <rect key={i} x={x} y={y} width={barW} height={h} rx="6" fill="#5BC0BE" />;
        })}

        {/* x labels */}
        {items.map((it, i) => (
          <text key={i} x={toX(i) + barW / 2} y={height - 6} fontSize="10" textAnchor="middle" fill="#6b7280">
            {it.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default Dashboard;

