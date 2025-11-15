import React from "react";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

export default function OrderSummary({
  cart,
  setCart,
}) {
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

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
            className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm w-full"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
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
                onClick={() => updateQty(item.id, -1)}
                className="p-1 rounded border hover:bg-gray-50"
                aria-label="Giảm số lượng"
              >
                <FiMinus />
              </button>
              <span className="w-8 text-center">{item.qty}</span>
              <button
                onClick={() => updateQty(item.id, 1)}
                className="p-1 rounded border hover:bg-gray-50"
                aria-label="Tăng số lượng"
              >
                <FiPlus />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-800 p-2"
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
