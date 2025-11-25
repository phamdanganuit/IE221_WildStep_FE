import React, { useState } from "react";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { updateCartItemQuantity, removeFromCart } from "@/service/cartService";
import { useToast } from "@/contexts/ToastContext";

export default function OrderSummary({
  cart,
  setCart,
  reloadCart,
  fullCart, // Pass fullCart to find original index
}) {
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const { success: showSuccess, error: showError } = useToast();

  // Find original index in fullCart based on product_id + size + color
  const findOriginalIndex = (item) => {
    if (item.originalIndex !== undefined) {
      return item.originalIndex;
    }
    
    // Fallback: find by product_id + size + color in fullCart
    if (fullCart && fullCart.length > 0) {
      const index = fullCart.findIndex((cartItem) => {
        const productIdMatch = String(cartItem.product_id) === String(item.product_id);
        const sizeMatch = String(cartItem.size || "") === String(item.size || "");
        const colorMatch = String(cartItem.color || "") === String(item.color || "");
        return productIdMatch && sizeMatch && colorMatch;
      });
      return index >= 0 ? index : item.id;
    }
    
    return item.id;
  };

  const updateQty = async (item, delta) => {
    const newQty = Math.max(1, item.qty + delta);
    if (newQty === item.qty) return;

    const itemKey = `${item.product_id}_${item.size}_${item.color}`;
    setUpdatingItems(prev => new Set(prev).add(itemKey));
    
    try {
      // Find original index in fullCart
      const originalIndex = findOriginalIndex(item);
      const result = await updateCartItemQuantity(originalIndex, newQty);
      
      if (result.success) {
        // Reload cart from API to get updated data
        if (reloadCart) {
          await reloadCart();
        } else {
          setCart((prev) =>
            prev.map((cartItem) =>
              cartItem.id === item.id ? { ...cartItem, qty: newQty } : cartItem
            )
          );
        }
      } else {
        showError(result.error || "Không thể cập nhật số lượng");
      }
    } catch (err) {
      showError(err.message || "Đã xảy ra lỗi khi cập nhật số lượng");
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const removeItem = async (item) => {
    const itemKey = `${item.product_id}_${item.size}_${item.color}`;
    setUpdatingItems(prev => new Set(prev).add(itemKey));
    
    try {
      // Find original index in fullCart
      const originalIndex = findOriginalIndex(item);
      const result = await removeFromCart(originalIndex);
      
      if (result.success) {
        // Reload cart from API to get updated data
        if (reloadCart) {
          await reloadCart();
        } else {
          setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
        }
        showSuccess(result.message || "Đã xóa sản phẩm khỏi giỏ hàng");
      } else {
        showError(result.error || "Không thể xóa sản phẩm");
      }
    } catch (err) {
      showError(err.message || "Đã xảy ra lỗi khi xóa sản phẩm");
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="flex gap-6 w-full">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-2 text-color4">Tổng quan đơn hàng</h2>
          <p className="text-sm text-gray-500 mb-4">
            Xem lại các mặt hàng của bạn trước khi thanh toán
          </p>
          <div className="p-8 text-center bg-white border rounded-lg">
            <p className="text-gray-600">Không có sản phẩm nào trong giỏ hàng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 w-full">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold mb-2 text-color4">Tổng quan đơn hàng</h2>
        <p className="text-sm text-gray-500 mb-4">
          Xem lại các mặt hàng của bạn trước khi thanh toán
        </p>

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-6 p-6 bg-white border rounded-lg shadow-sm w-full"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-32 h-32 object-cover rounded"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
              }}
            />
            <div className="flex-1">
              <h4 className="font-medium line-clamp-2">{item.name}</h4>
              <p className="text-sm text-gray-600">
                Màu sắc: {item.color}
              </p>
              <p className="text-sm text-gray-600">
                Kích cỡ: {item.size}
              </p>
              <p className="font-semibold mt-1">
                {(item.price * item.qty).toLocaleString()} VND
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item, -1)}
                disabled={updatingItems.has(`${item.product_id}_${item.size}_${item.color}`) || item.qty <= 1}
                className="p-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Giảm số lượng"
              >
                <FiMinus />
              </button>
              <span className="w-8 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item, 1)}
                disabled={updatingItems.has(`${item.product_id}_${item.size}_${item.color}`)}
                className="p-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Tăng số lượng"
              >
                <FiPlus />
              </button>
            </div>

            <button
              onClick={() => removeItem(item)}
              disabled={updatingItems.has(`${item.product_id}_${item.size}_${item.color}`)}
              className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Xóa sản phẩm"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
