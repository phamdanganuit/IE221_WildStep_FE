import React, { useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border-2 border-[#DEDEDE] overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-color4
        cursor-pointer flex-shrink-0 w-full"
    >
      {/* Product Image - Square */}
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-2 bg-white">
        {/* Category */}
        <p className="font-semibold text-xs sm:text-sm text-color4 uppercase tracking-wide">
          {product.category}
        </p>
        
        {/* Product Name */}
        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Price and Rating */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-base sm:text-lg md:text-xl text-color1">
              {product.price}
            </p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <FaStar className="text-[#FFA439] w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-semibold text-neutral-900">
              {product.rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RelatedProducts = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const products = [
    {
      id: 1,
      name: "Jumpman MVP",
      price: "3,879,199₫",
      category: "Giày nam",
      rating: "4.8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/585f54a7363232147bec14854065f0b3414e2dee?placeholderIfAbsent=true",
    },
    {
      id: 2,
      name: "Nike Air Max 90",
      price: "3,519,000₫",
      category: "Giày nam",
      rating: "4.8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/5964064352f25dca0271368b122d60e2375aeb24?placeholderIfAbsent=true",
    },
    {
      id: 3,
      name: "Nike JAM",
      price: "2,815,199₫",
      category: "Giày nữ",
      rating: "4.8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/ad54876821ee9468268164618e83dfabbbefc060?placeholderIfAbsent=true",
    },
    {
      id: 4,
      name: "Nike Air Max Plus",
      price: "4,699,000₫",
      category: "Giày nam",
      rating: "4.8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/e0f589640a067894f8b20c85c587a705d673d7ba?placeholderIfAbsent=true",
    },
    {
      id: 5,
      name: "Nike Air More Uptempo Low",
      price: "4,699,000₫",
      category: "Giày nam",
      rating: "4.8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/66d87b6f15a446dbdaa882ab91d3ff1d17c0be78?placeholderIfAbsent=true",
    },
    {
      id: 6,
      name: "Nike Air Force 1",
      price: "3,239,000₫",
      category: "Giày nam",
      rating: "4.7",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/585f54a7363232147bec14854065f0b3414e2dee?placeholderIfAbsent=true",
    },
  ];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  return (
    <section className="w-full">
      <div className="flex flex-col">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 sm:mb-8">
          Sản phẩm liên quan
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 sm:w-12 sm:h-12
              flex items-center justify-center 
              bg-white/90 hover:bg-white
              rounded-full shadow-lg
              transition-all
              -ml-5
              ${!canScrollLeft ? 'opacity-0 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-110'}`}
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          {/* Products Scroll Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="w-[45%] sm:w-[30%] md:w-[28%] lg:w-[23%] xl:w-[18%] flex-shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 sm:w-12 sm:h-12
              flex items-center justify-center 
              bg-white/90 hover:bg-white
              rounded-full shadow-lg
              transition-all
              -mr-5
              ${!canScrollRight ? 'opacity-0 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-110'}`}
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
