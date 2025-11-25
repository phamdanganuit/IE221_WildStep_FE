import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { MobileMenuProvider } from "./contexts/MobileMenuContext";
import { CartAnimationProvider } from "./contexts/CartAnimationContext";
import ToastContainer from "./components/Toast";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Catalog from "./pages/Catalog";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrder";
import OrderDetail from "./pages/Order";
import Contact from "./pages/Contact";
import Voucher from "./pages/Voucher";
import Cart from "./pages/Cart";
import Support from "./pages/Support";

// Admin imports
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import ProductList from "./pages/Admin/Products/ProductList";
import ProductForm from "./pages/Admin/Products/ProductForm";
import AdminProductDetail from "./pages/Admin/Products/ProductDetail";
import OrderList from "./pages/Admin/Orders/OrderList";
import AdminOrderDetail from "./pages/Admin/Orders/OrderDetail";
import CustomerList from "./pages/Admin/Customers/CustomerList";
import CustomerDetail from "./pages/Admin/Customers/CustomerDetail";
import Categories from "./pages/Admin/Categories";
import Brands from "./pages/Admin/Brands";
import Banners from "./pages/Admin/Banners";
import Vouchers from "./pages/Admin/Vouchers";

function AppContent() {
  const { toasts, removeToast } = useToast();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Khởi tạo auth state khi app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<ProductDetail />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/products'element={<Catalog />}/>
        <Route path="/contact" element={<Contact />}/>
        <Route path="/support" element={<Support />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/vouchers" element={<Voucher/>}/>
          <Route path="/cart" element={<Cart/>}/>
        </Route>
        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/create" element={<ProductForm />} />
            <Route path="products/:id" element={<AdminProductDetail />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="banners" element={<Banners />} />
            <Route path="vouchers" element={<Vouchers />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MobileMenuProvider>
        <CartAnimationProvider>
          <AppContent />
        </CartAnimationProvider>
      </MobileMenuProvider>
    </ToastProvider>
  );
}
