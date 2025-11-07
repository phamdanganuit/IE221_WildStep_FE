import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree, 
  Award,
  Image as ImageIcon,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const AdminLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.title'), path: "/admin/dashboard" },
    { icon: Package, label: t('admin.products.title'), path: "/admin/products" },
    { icon: ShoppingCart, label: t('admin.orders.title'), path: "/admin/orders" },
    { icon: Users, label: t('admin.customers.title'), path: "/admin/customers" },
    { icon: FolderTree, label: t('admin.categories.title'), path: "/admin/categories" },
    { icon: Award, label: t('admin.brands.title'), path: "/admin/brands" },
    { icon: ImageIcon, label: t('admin.banners.title'), path: "/admin/banners" },
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
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/Logo_main.svg" alt={t('admin.layout.logoAlt')} className="h-8" />
          </div>
          <p className="text-sm text-gray-400 mt-2">{t('admin.layout.panel')}</p>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all hover:opacity-90 cursor-pointer ${
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
                {user?.displayName?.charAt(0)?.toUpperCase() || t('admin.layout.defaultInitial')}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.displayName || t('admin.layout.defaultAdminName')}</p>
              <p className="text-xs text-gray-400">{t('admin.layout.administrator')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-color2 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('header.logout')}</span>
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
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSidebarOpen(false) || navigate("/") }>
                <img src="/Logo_main.svg" alt={t('admin.layout.logoAlt')} className="h-8" />
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all hover:opacity-90 cursor-pointer ${
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
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-color2 transition-all hover:opacity-90 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('header.logout')}</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 bg-color1 text-white p-2 rounded-lg shadow-lg hover:opacity-90 transition"
          aria-label={t('admin.layout.openMenuAria')}
        >
          <Menu className="w-6 h-6" />
        </button>

        <main className="p-4 md:p-6 lg:p-6 pt-14 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

