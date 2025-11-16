import React from "react";
import { Input } from "../ui/input";

function CartHeader({ allProduct, clearAll, setAllProducts }) {
  return (
    <div className="flex items-center shadow-sm px-10 py-4">
      <div className="flex items-center space-x-2 w-1/2">
        <Input
          type="checkbox"
          className="w-5 h-5 accent-teal-600"
          checked={allProduct}
          onChange={(e) => {
            if (e.target.checked) {
              setAllProducts();
            } else {
              clearAll();
            }
          }}
        />
        <p className="text-[0.9rem]">Chọn tất cả</p>
      </div>
      <div className="flex items-center w-1/2">
        <p className="w-1/3 text-center text-[0.9rem]">Đơn giá</p>
        <p className="w-1/3 text-center text-[0.9rem]">Số lượng</p>
        <p className="w-1/3 text-center text-[0.9rem]">Hành động</p>
      </div>
    </div>
  );
}

export default CartHeader;
