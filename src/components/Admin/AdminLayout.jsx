import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  Award,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Package, label: "Sản phẩm", path: "/admin/products" },
    { icon: ShoppingCart, label: "Đơn hàng", path: "/admin/orders" },
    { icon: Users, label: "Khách hàng", path: "/admin/customers" },
    { icon: FolderTree, label: "Danh mục", path: "/admin/categories" },
    { icon: Award, label: "Thương hiệu", path: "/admin/brands" },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-color1 text-white fixed h-full">
        <div className="p-6 border-b border-color2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
            <img src="/Logo_main.svg" alt="Wild Step Admin" className="h-8" />
          </div>
          <p className="text-sm text-gray-400 mt-2">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive(item.path)
                    ? "bg-color4 text-white"
                    : "text-gray-300 hover:bg-color2"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-color2">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-color4 flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user?.displayName?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.displayName || "Admin"}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-color2 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-color1 text-white z-50 lg:hidden flex flex-col">
            <div className="p-6 border-b border-color2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/Logo_main.svg" alt="Wild Step Admin" className="h-8" />
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                      isActive(item.path)
                        ? "bg-color4 text-white"
                        : "text-gray-300 hover:bg-color2"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-color2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-color2 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => isActive(item.path))?.label || "Admin Panel"}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-color4 hover:text-hover4 font-medium"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

