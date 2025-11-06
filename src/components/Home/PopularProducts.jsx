import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

import shoe1 from "@/assets/shoes/shoe_1.png";
import shoe2 from "@/assets/shoes/shoe_2.png";
import shoe3 from "@/assets/shoes/shoe_3.png";
import shoe4 from "@/assets/shoes/shoe_4.png";
import shoe5 from "@/assets/shoes/shoe_5.png";
import shoe6 from "@/assets/shoes/shoe_6.png";

const products = [
  { id: 1, image: shoe1, name: "Running sport shoe", price: "₫ 3.999.000" },
  { id: 2, image: shoe2, name: "Running sport shoe", price: "₫ 3.999.000" },
  { id: 3, image: shoe3, name: "Running sport shoe", price: "₫ 3.999.000" },
  { id: 4, image: shoe4, name: "Running sport shoe", price: "₫ 3.999.000" },
  { id: 5, image: shoe5, name: "Running sport shoe", price: "₫ 3.999.000" },
  { id: 6, image: shoe6, name: "Running sport shoe", price: "₫ 3.999.000" },
  { id: 7, image: shoe1, name: "Running sport shoe", price: "₫ 3.999.000" },
  { id: 8, image: shoe2, name: "Running sport shoe", price: "₫ 3.999.000" },
  { id: 9, image: shoe3, name: "Running sport shoe", price: "₫ 3.999.000" },
];

const CARDS_PER_PAGE = 3;

const ProductCard = ({ image, name, price, className = "" }) => {
  return (
    <div
      className={`group relative flex flex-col bg-[D9D9D9]/15 rounded-xl border-[1.5px] border-[#DEDEDE] overflow-hidden
        transition-all duration-300 hover:-translate-y-1
        md:min-w-0 ${className}`}
    >
      <div className="h-[16rem] max-md:h-[12rem] pt-6 flex items-center justify-center overflow-hidden bg-transparent">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex items-center justify-between bg-[D9D9D9]/15">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-sm md:text-base text-gray-900">
            {name}
          </h3>
          <p className="font-semibold text-base md:text-lg text-color1">{price}</p>
        </div>

        {/* <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-color1 text-white hover:scale-105 transition-colors"
          aria-label="View product"
        >
          <ArrowUpRight className="w-4.5 h-5" />
        </button> */}
        <button className="flex items-center justify-center transition cursor-pointer">
          <img
            src="/icon/arrow.svg"
            alt="Arrow Right"
            className="hover:scale-105 w-10 h-10"
          />
        </button>
      </div>
    </div>
  );
};

const PopularProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = products.length - CARDS_PER_PAGE;
  const totalPages = Math.ceil(products.length / CARDS_PER_PAGE);
  const currentPage = Math.floor(currentIndex / CARDS_PER_PAGE);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  const handleDotClick = (pageIndex) => {
    setCurrentIndex(pageIndex * CARDS_PER_PAGE);
  };
  return (
    <section className="w-full px-10 md:px-20 mt-12 md:mt-20">
      <div className="flex flex-col md:flex-row justify-between md:gap-12 items-center">
        {/* Left Section */}
        <div className="flex flex-col gap-6 md:w-1/4 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-color1 font-medium mb-2 text-[1.5rem] flex items-center gap-2">
              <span className="w-8 h-[2px] bg-color1"></span>
              Giày Hot Trend
            </h3>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-color1 leading-tight">
              Most Popular Products
            </h2>
          </div>

          <p className="text-[1.125rem] text-[#000000]/75 leading-relaxed">
          Khám phá những đôi giày WildStep được yêu thích nhất mùa này.
          </p>

          <button className="px-8 py-3 bg-color4 text-white font-semibold rounded hover:bg-hover4 transition-colors shadow-md hover:shadow-lg self-center md:self-start cursor-pointer">
            Khám Phá
          </button>
        </div>

        {/* Right Carousel */}
        <div className="flex-1 w-full md:w-3/4">
          <div className="flex items-center gap-4">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all ${
                currentIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100 hover:rounded-full hover:border-2 border-gray-300 cursor-pointer "
              }`}
              aria-label="Previous product"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Cards Container */}
            <div className="flex-1 overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-500 ease-out mt-1"
                style={{
                  transform: `translateX(-${
                    currentIndex * (100 / CARDS_PER_PAGE)
                  }%)`,
                }}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0"
                    style={{
                      width: `calc(${100 / CARDS_PER_PAGE}% - ${
                        ((CARDS_PER_PAGE - 1) * 16) / CARDS_PER_PAGE
                      }px)`,
                    }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
              className={`flex-shrink-0 w-10 h-10  flex items-center justify-center transition-all ${
                currentIndex === maxIndex
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100 hover:rounded-full hover:border-2 border-gray-300 cursor-pointer "
              }`}
              aria-label="Next product"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => handleDotClick(pageIndex)}
                className={`h-3  transition-all duration-300 cursor-pointer ${
                  currentPage === pageIndex
                    ? "bg-color1 w-8 rounded-[1.5rem]"
                    : "bg-gray-300 w-3 rounded-full hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${pageIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
