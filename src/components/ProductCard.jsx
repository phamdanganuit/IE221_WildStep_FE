import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StarRating = ({ rating, size = "w-4 h-4" }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      stars.push(
        <svg key={i} className={`${size} text-yellow-400 fill-current`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    } else if (i < rating) {
      stars.push(
        <svg key={i} className={`${size} text-yellow-400`} viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-${i})`}
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className={`${size} text-gray-300 fill-current`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleClick = () => {
    if (product.slug) {
      navigate(`/product/${product.slug}`);
    } else if (product.id || product._id) {
      navigate(`/product/${product.id || product._id}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get localized text
  const getLocalizedText = (textObj) => {
    if (typeof textObj === "string") return textObj;
    return textObj?.[i18n.language] || textObj?.vi || textObj?.en || "";
  };

  // Check if product is new (created within last 10 days)
  const isNew = product?.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      10 * 24 * 60 * 60 * 1000
    : false;

  const rating = product?.rating || product?.rate || 0;
  const reviewCount = product?.reviewCount || product?.sold || 0;
  const productName = getLocalizedText(product?.name);
  const brandName = getLocalizedText(product?.brand?.name || product?.brandId?.name);
  const categoryName = getLocalizedText(
    product?.category?.name || product?.categoryId?.parentId?.name
  );

  // Determine price
  const price = product?.price || product?.originalPrice || 0;
  const discountPrice = product?.discountPrice || 0;
  const discount = product?.discount || 0;
  const finalPrice = discount > 0 ? discountPrice || ((100 - discount) * price) / 100 : price;

  // Get image
  const image = product?.image || product?.images?.[0] || "/placeholder.png";

  return (
    <div
      onClick={handleClick}
      title={productName}
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border-2 border-[#DEDEDE] overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-color4
        cursor-pointer"
    >
      {/* NEW Badge */}
      {isNew && (
        <div
          className="absolute top-2 sm:top-3 left-0 
          px-2 py-1 sm:px-3 sm:py-1.5
          bg-green-500 text-white text-xs sm:text-sm font-bold
          rounded-tr-lg rounded-br-lg shadow-md
          z-10"
        >
          NEW
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && !isNew && (
        <div
          className="absolute top-2 sm:top-3 md:top-4 left-0 
          px-2 py-1 sm:px-3 sm:py-1.5
          bg-red-600 text-white text-xs sm:text-sm font-bold
          rounded-tr-lg rounded-br-lg shadow-md
          flex items-center gap-1 z-10"
        >
          -{discount}%
        </div>
      )}

      {/* Product Image - Square */}
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-2 bg-white">
        {/* Brand | Category */}
        {(brandName || categoryName) && (
          <p className="font-semibold text-xs sm:text-sm text-color4 uppercase tracking-wide">
            {brandName}
            {brandName && categoryName && " | "}
            {categoryName}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2 leading-tight">
          {productName}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={rating} size="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm text-gray-600">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-2">
          {discount > 0 ? (
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-base sm:text-lg md:text-xl text-red-600">
                {formatPrice(finalPrice)}
              </p>
              <span className="text-gray-400 text-xs sm:text-sm font-medium line-through">
                {formatPrice(price)}
              </span>
            </div>
          ) : (
            <p className="font-bold text-base sm:text-lg md:text-xl text-color1">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

