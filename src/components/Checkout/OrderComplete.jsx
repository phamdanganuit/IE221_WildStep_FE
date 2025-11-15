
import React from "react";
import { FiCheck, FiShoppingBag, FiMapPin, FiCreditCard } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const formatAddress = (addr) => {
  return [
    addr.detail,
    addr.ward,
    addr.district,
    addr.province,
  ].filter(Boolean).join(", ");
};

export default function OrderComplete({
  orderId,
  cart,
  selectedAddress,
  paymentMethod,
  total,
  subtotal,
  shipping,
  discount,
  appliedVoucher,
}) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Header Success */}
      {/* <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FiCheck className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-green-700">Hoàn tất đơn hàng</h1>
        <p className="text-sm text-gray-600 mt-2">
          Đơn hàng của bạn đã được đặt thành công!
        </p>
        <p className="text-sm font-mono text-teal-600 mt-1">Mã đơn: {orderId}</p>
      </div> */}

<div className="flex justify-between items-center">
        <div className="flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-4">Hoàn tất đơn hàng</h2>
      <p className="text-sm text-gray-600">
        Xem lại tất cả thông tin đơn hàng bên dưới
      </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
        variant="outline"
        onClick={() => navigate(`/orders/${orderId}`)}
      >
        Xem chi tiết đơn hàng
      </Button>
      <Button onClick={() => navigate("/cart")}>
        Xem giỏ hàng
      </Button>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* LEFT: Product List */}
        <div className="lg:col-span-2 space-y-4">
          {/* <h2 className="font-semibold text-lg flex items-center gap-2">
            <FiShoppingBag className="text-teal-600" /> Sản phẩm
          </h2> */}
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
              <span className="text-sm text-gray-600">
                Màu sắc: 
                <span className="text-[#000000]/90 font-medium">{" "}{item.color}</span>
              </span>
              <p className="text-sm text-gray-600">
                Kích cỡ: 
                <span className="text-[#000000]/90 font-medium">{" "}{item.size}</span>
              </p>
              <p className="font-semibold mt-1">
                <span className="text-[#5C5C63] font-medium">{item.qty}x{" "}</span> 
                {(item.price).toLocaleString()} VND
              </p>
            </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-5">
          <h3 className="font-semibold text-lg">Đơn hàng của bạn</h3>

          {/* Address */}
          {selectedAddress && (
            <div className="p-3 bg-teal-50 rounded-lg text-sm border border-teal-200">
              <div className="flex items-center gap-1 text-teal-700 font-medium mb-1">
                <FiMapPin className="text-xs" />
                <span>Người nhận</span>
              </div>
              <p className="font-medium">{selectedAddress.receiver}</p>
              <p className="text-gray-600">{selectedAddress.phone}</p>
              <p className="text-gray-600 mt-1">{formatAddress(selectedAddress)}</p>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tổng tiền hàng</span>
              <span>{subtotal.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{shipping.toLocaleString()} VND</span>
            </div>
            {discount > 0 && appliedVoucher && (
              <div className="flex justify-between text-green-600">
                <span>{appliedVoucher.name}</span>
                <span>-{discount.toLocaleString()} VND</span>
              </div>
            )}
            <div className="border-t pt-2 font-semibold text-lg flex justify-between">
              <span>Thành tiền</span>
              <span className="text-teal-600">{total.toLocaleString()} VND</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-200">
            <div className="flex items-center gap-1 text-blue-700 font-medium mb-1">
              <FiCreditCard className="text-xs" />
              <span>Phương thức thanh toán</span>
            </div>
            <p className="font-medium">
              {paymentMethod === "COD" && "Thanh toán khi nhận hàng (COD)"}
              {paymentMethod === "card" && "Thẻ tín dụng/ghi nợ"}
              {paymentMethod === "wallet" && "Ví điện tử"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 flex justify-end gap-3">
        <Button size="lg" onClick={() => navigate("/")}>
          Hoàn tất
        </Button>
      </div>
    </div>
  );
}