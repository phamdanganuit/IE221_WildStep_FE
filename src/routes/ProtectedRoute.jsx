// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getStoredToken } from "../service/authService";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const hasToken = getStoredToken();

  // Chỉ hiển thị loading khi có token và đang kiểm tra
  if (isLoading && hasToken) {
    return <div className="w-full min-h-screen flex items-center justify-center font-semibold text-2xl gap-2">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#50D5C4] rounded-full animate-spin"></div>
      Đang kiểm tra đăng nhập...
    </div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}