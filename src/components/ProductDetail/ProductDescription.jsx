import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductDescription = () => {
  const [openDes, setOpenDes] = useState(true);

  return (
    <div className="flex flex-col w-full max-md:max-w-full leading-relaxed">
      <button
        onClick={() => setOpenDes(!openDes)}
        className="flex items-center justify-start text-left gap-2"
      >
        <h2 className="z-10 self-start text-[1.875rem] font-semibold leading-tight text-slate-900">
          Mô tả
        </h2>
        {openDes ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {openDes && (
        <div className="mt-4 text-gray-700 text-[1rem] leading-relaxed transition-all">
          <p className="">
            Luôn hợp thời, luôn mới mẻ. Air Jordan 1 Low mang đến cho bạn một
            phần lịch sử và di sản của Jordan, mang đến sự thoải mái suốt cả
            ngày. Chọn màu sắc yêu thích, rồi bước ra ngoài với thiết kế biểu
            tượng được chế tác từ sự kết hợp chất liệu cao cấp và lớp đệm Air
            được bọc kín ở gót giày.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
