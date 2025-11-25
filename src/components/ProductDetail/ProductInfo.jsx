import React, { useState } from "react";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import { Button } from "../ui/button";
import QuantitySelector from "../Cart/QuantitySelector";

const ProductInfo = ({
  title,
  originalPrice,
  salePrice,
  soldCount,
  rating,
  reviewCount = 0,
  stock = 0,
  onAddToCart,
  onBuyNow,
  selectedSize,
  handleSizeChange,
  selectedColor,
  handleColorChange,
  productColors,
  productSizes,
  currentLang = 'vi',
  quantity = 1,
  setQuantity,
  addToCartButtonRef,
}) => {

  return (
    <div className="flex flex-col w-full max-md:max-w-full">
      <h1 className="self-start text-4xl font-bold tracking-normal leading-tight text-slate-900">
        {title}
      </h1>

      <div className="flex flex-wrap gap-5 justify-between mt-4 w-full max-md:max-w-full">
        <div className="flex gap-4 justify-center items-center leading-tight whitespace-nowrap">
          <span className="self-stretch my-auto text-lg font-medium line-through text-stone-500">
            {originalPrice}
          </span>
          <span className="self-stretch my-auto text-3xl font-semibold text-slate-900">
            {salePrice}
          </span>
        </div>

        <div className="flex gap-3 justify-center items-center my-auto leading-none">
          <span className="items-center flex justify-center text-xl text-stone-500">
            Đã bán: {soldCount}
          </span>
          <div className="flex gap-1 justify-center items-center my-auto text-2xl font-semibold whitespace-nowrap text-neutral-900">
            <img
              src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/39c40ce39c244e8d7b00b6d26740705242085a80?placeholderIfAbsent=true"
              alt="Rating star"
              className="object-contain shrink-0 my-auto w-6 rounded-sm aspect-square"
            />
            <span className="flex self-stretch items-center my-auto">
              {rating}
            </span>
            <span className="text-sm text-stone-500 ml-1">
              ({reviewCount})
            </span>
          </div>
        </div>
      </div>

      <img
        src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/93d2205f05d05075b32b3ea720a46f24122ebd45?placeholderIfAbsent=true"
        alt="Product features"
        className="object-contain mt-5 w-full max-md:max-w-full"
      />

        <ColorSelector
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
          productColors={productColors}
          currentLang={currentLang}
        />

        <SizeSelector
          selectedSize={selectedSize}
          onSizeChange={handleSizeChange}
          productSizes={productSizes}
          currentLang={currentLang}
        />

        {/* Quantity selector */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Số lượng:</span>
            <div className="w-32">
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                max={stock}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Stock còn lại:</span>
            <span className={`text-sm font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock > 0 ? `${stock} sản phẩm` : 'Hết hàng'}
            </span>
          </div>
        </div>

        <section className="grid grid-cols-2 justify-center items-center mt-6 w-full gap-10 text-xl leading-tight max-md:max-w-full">
          <button
            ref={addToCartButtonRef}
            onClick={onAddToCart}
            disabled={stock === 0}
            className="flex w-full overflow-hidden justify-center items-center self-stretch px-12 py-4 my-auto font-semibold text-white bg-color4 rounded-lg max-md:px-5 hover:bg-hover4 focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Add product to shopping cart"
          >
            <span className="self-stretch my-auto">Thêm vào giỏ hàng</span>
          </button>

          <Button
            variant="outline"
            onClick={onBuyNow}
            disabled={stock === 0}
            className="flex w-full h-full text-xl font-semibold self-stretch my-auto max-md:px-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mua ngay
            </Button>
        </section>
    </div>
  );
};

export default ProductInfo;
