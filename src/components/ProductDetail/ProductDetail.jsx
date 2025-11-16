import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductDetail = ({ product }) => {
  const [open, setOpen] = useState(true);
  const [showMore, setShowMore] = useState(false);

  // Extract product attributes from new API structure
  const material = product?.material || null;
  const weight = product?.weight || null;
  const origin = product?.origin || null;
  const style = product?.style || null;
  const colors = product?.colors || [];
  const sizes = product?.sizes || [];

  const content = `
  Phiên bản Low sở hữu lớp da cao cấp kết hợp với chất liệu tổng hợp ở phần thân giày.
  Một bộ phận Air được tích hợp ở gót giày, mang đến cho bạn lớp đệm nhẹ nhàng, đã trở thành xu hướng trong hơn một thế hệ.
  Logo Wings ở gót giày và họa tiết Jumpman ở lưỡi gà tạo nên một đôi giày với những chi tiết mang tính biểu tượng.
  Logo Wings ở gót giày
  Thiết kế dấu Swoosh khâu
  Mũi giày dạng lỗ
  Đế giữa bằng mút xốp
  Độ bám cao su
  ${style ? `Kiểu dáng: ${style}` : ''}
  ${origin ? `Quốc gia/khu vực xuất xứ: ${origin}` : ''}
  `.trim();

  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const shortLines = lines.slice(0, 3);
  
  return (
    <div className="flex flex-col w-full max-md:max-w-full leading-relaxed">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-start text-left gap-2"
      >
        <h2 className="z-10 self-start text-[1.875rem] font-semibold leading-tight text-slate-900">
          Thông tin chi tiết
        </h2>
        {open ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {open && (
        <div className="mt-4 text-gray-700 text-[1rem] leading-relaxed transition-all">
          {/* Product Info Grid */}
          {(material || weight || origin || style || colors.length > 0 || sizes.length > 0) && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Thông số kỹ thuật</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {material && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Chất liệu:</span>
                    <span className="text-gray-900">{material}</span>
                  </div>
                )}
                {weight && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Trọng lượng:</span>
                    <span className="text-gray-900">{weight}</span>
                  </div>
                )}
                {origin && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Xuất xứ:</span>
                    <span className="text-gray-900">{origin}</span>
                  </div>
                )}
                {style && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Kiểu dáng:</span>
                    <span className="text-gray-900">{style}</span>
                  </div>
                )}
                {colors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Màu sắc:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {colors.map((color, idx) => {
                        // Extract localized color name - support both formats
                        let colorName = 'Unnamed';
                        
                        // Try color_name first (multilingual object)
                        if (color.color_name) {
                          if (typeof color.color_name === 'object') {
                            colorName = color.color_name.vi || color.color_name.en || color.color_name.ja || 'Unnamed';
                          } else {
                            colorName = color.color_name;
                          }
                        }
                        // Fallback to name field (simple string)
                        else if (color.name) {
                          if (typeof color.name === 'object') {
                            colorName = color.name.vi || color.name.en || color.name.ja || 'Unnamed';
                          } else {
                            colorName = color.name;
                          }
                        }
                        
                        const hexColor = color.hex_color || color.hex;
                        
                        return (
                          <div key={idx} className="flex items-center gap-1">
                            {hexColor && (
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-gray-300" 
                                style={{ backgroundColor: hexColor }}
                                title={colorName}
                              />
                            )}
                            <span className="text-gray-900 text-sm">{colorName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {sizes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Sizes:</span>
                    <span className="text-gray-900">{sizes.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <h3 className="font-semibold mb-1">Chất liệu cao cấp</h3>
          <p className="mb-3">
            Phiên bản Low sở hữu lớp da cao cấp kết hợp với chất liệu tổng hợp ở
            phần thân giày.
          </p>

          <h3 className="font-semibold mb-1">Công nghệ Air Within</h3>
          <p className="mb-3">
            Một bộ phận Air được tích hợp ở gót giày, mang đến cho bạn lớp đệm
            nhẹ nhàng, đã trở thành xu hướng trong hơn một thế hệ.
          </p>

          <h3 className="font-semibold mb-1">Thiết kế vượt thời gian</h3>
          <p className="mb-3">
            Logo Wings ở gót giày và họa tiết Jumpman ở lưỡi gà tạo nên một đôi
            giày với những chi tiết mang tính biểu tượng.
          </p>

          <h3 className="font-semibold mb-1">Chi tiết sản phẩm</h3>

          {/* Danh sách liệt kê có dấu chấm */}
          <ul className="list-disc pl-5 space-y-1">
            {(showMore ? lines : shortLines).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
            {!showMore && <li className="text-gray-400 italic">...</li>}
          </ul>

          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-3 text-blue-600 font-medium hover:underline"
          >
            {showMore ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
