import { useNavigate } from "react-router-dom";
import { FiUser, FiShoppingCart, FiTruck, FiCreditCard, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const SUPPORT_ITEMS = [
  {
    icon: FiUser,
    label: "Tài khoản",
    description: "Quản lý thông tin cá nhân, địa chỉ, mật khẩu",
    path: "/profile",
  },
  {
    icon: FiShoppingCart,
    label: "Mua sắm",
    description: "Tìm kiếm sản phẩm, giỏ hàng, mã giảm giá",
    path: "/cart",
  },
  {
    icon: FiTruck,
    label: "Đơn hàng & vận chuyển",
    description: "Theo dõi đơn hàng, hủy đơn, hoàn tiền",
    path: "/orders",
  },
  {
    icon: FiCreditCard,
    label: "Thanh toán",
    description: "Phương thức thanh toán, ví điện tử, COD",
    path: "/checkout",
  },
];

export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
        {/* Title */}
        <h2 className="text-[2rem] md:text-3xl font-bold text-center text-gray-800">
          Hướng dẫn và trợ giúp
        </h2>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
            <Input
              type="text"
              placeholder="Tìm kiếm câu hỏi thường gặp..."
              className="pl-12 pr-4 py-6 text-base rounded-full border-teal-200 focus:border-teal-500 focus:ring-teal-500 shadow-sm"
            />
          </div>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SUPPORT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-teal-200"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                  <Icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* FAQ Section (Optional) */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Câu hỏi thường gặp</h2>
          <div className="space-y-3">
            {[
              "Làm thế nào để thay đổi địa chỉ giao hàng?",
              "Tôi có thể hủy đơn hàng khi nào?",
              "Phí vận chuyển được tính như thế nào?",
              "Làm sao để sử dụng mã giảm giá?",
            ].map((q, i) => (
              <details
                key={i}
                className="group border-b border-gray-200 pb-3"
              >
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-gray-700 font-medium">{q}</span>
                  <span className="text-teal-600 group-open:rotate-180 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Bạn có thể thay đổi địa chỉ giao hàng trong phần{" "}
                  <strong>Đơn hàng của tôi</strong> trước khi đơn hàng được xác nhận.
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Vẫn cần hỗ trợ? Liên hệ với chúng tôi
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
              </svg>
              Gửi email
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V13H13V7ZM13 15H11V17H13V15Z" />
              </svg>
              Chat trực tuyến
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}