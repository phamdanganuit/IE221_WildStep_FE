"use client";
import React, { useState } from "react";

const SizeSelector = ({ selectedSize, onSizeChange, productSizes, currentLang = 'vi' }) => {
  // Convert API format to component format
  const sizes = productSizes && productSizes.length > 0
    ? productSizes.map(size => 
        size.size_name?.[currentLang] || size.size_name?.vi || size.size_name?.en || 'N/A'
      )
    : ["Chưa có size"];

  return (
    <div className="pb-3 mt-8 w-full leading-tight bg-white max-md:max-w-full">
      <div className="flex flex-wrap gap-1.5">
        <div className="flex justify-between items-center text-xl w-full max-md:max-w-full">
          <div className="flex font-medium text-neutral-400 max-md:mr-2">
            Size:&nbsp;
            <span className="font-bold text-color2">{selectedSize}</span>
          </div>
          <div className="flex gap-1.5 self-end text-base font-medium text-right">
            <img
              src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/1c4fe518d80d9711ac42cf741137d5fd8023569d?placeholderIfAbsent=true"
              alt="Size guide icon"
              className="object-contain shrink-0 w-6 aspect-square"
            />
            <button className="my-auto basis-auto hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Hướng dẫn chọn size
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5 mt-5 text-xl font-semibold whitespace-nowrap">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`flex overflow-hidden flex-col justify-center items-center px-7 py-2 rounded-lg border border-solid border-neutral-200 max-md:px-5 ${
                selectedSize === size
                  ? "text-white bg-color2"
                  : "text-[#525252] hover:bg-gray-200"
              }`}
              role="radio"
              aria-checked={selectedSize === size}
              aria-label={`Select size ${size}`}
              tabIndex={selectedSize === size ? 0 : -1}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SizeSelector;
