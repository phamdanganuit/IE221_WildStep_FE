import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { getPublicProducts } from "@/service/contentService";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";

const CARDS_PER_PAGE = 3;

const ProductCard = ({ image, name, price, oldPrice, className = "" }) => {
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

      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-sm md:text-base text-gray-900">
            {name}
          </h3>
          <p className="font-bold text-base md:text-lg text-color1">{price}</p>
          {oldPrice && (
            <span className="text-gray-400 text-xs md:text-sm font-medium line-through">
              {oldPrice}
            </span>
          )}
        </div>

        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-color1 text-white hover:scale-105 transition-colors"
          aria-label="View product"
        >
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const PopularProducts = () => {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, page_size: 12, total: 0, total_pages: 0 });

  const maxIndex = Math.max(0, products.length - CARDS_PER_PAGE);
  const totalPages = Math.ceil(products.length / CARDS_PER_PAGE);
  const currentPage = Math.floor(currentIndex / CARDS_PER_PAGE);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  const handleDotClick = (pageIndex) => {
    setCurrentIndex(pageIndex * CARDS_PER_PAGE);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getPublicProducts({ sort: "popular", page: 1, page_size: 12 });
      if (!mounted) return;
      if (res?.success && Array.isArray(res.data?.data)) {
        const apiProducts = res.data.data.map(p => {
          const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
          
          // Calculate actual price based on discount
          const originalPrice = p.originalPrice || 0;
          const discount = p.discount || 0;
          const discountedPrice = discount > 0 ? (originalPrice * (100 - discount) / 100) : originalPrice;
          const hasDiscount = discount > 0;
          
          return {
            id: p._id || p.id,  // Use _id from MongoDB
            name: safeText(p.name, i18n.language, 'N/A'),
            image: (Array.isArray(p.images) && p.images[0]) || "",
            price: currency.format(discountedPrice),
            oldPrice: hasDiscount ? currency.format(originalPrice) : null,
          };
        });
        setProducts(apiProducts);
        if (res.data.pagination) setPagination(res.data.pagination);
      } else {
        setProducts([]);
      }
      setLoading(false);
    })();
    return () => { mounted = false };
  }, [i18n.language]);

  if (loading) {
    return (
      <section className="py-8 px-10 md:px-20">
        <div className="flex flex-col md:flex-row justify-between md:gap-12 items-center">
          <div className="flex flex-col gap-6 md:w-1/4 text-center md:text-left">
            <div className="h-6 sm:h-8 w-32 sm:w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 sm:h-24 w-full max-w-md bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-28 sm:w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex-1 w-full md:w-3/4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-8 px-10 md:px-20">
      <div className="flex flex-col md:flex-row justify-between md:gap-12 items-center">
        {/* Left Section */}
        <div className="flex flex-col gap-6 md:w-1/4 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-color1 font-medium mb-2 text-[1.5rem] flex items-center gap-2">  
              <span className="w-8 h-[2px] bg-color1"></span>
              {t('home.popularProducts.subtitle')}
            </h3>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-color1 leading-tight">
              {t('home.popularProducts.heading')}
            </h2>
          </div>

          <p className="text-[1.125rem] text-[#000000]/75 leading-relaxed">
            {t('home.popularProducts.description')}
          </p>

          <button className="mt-4 px-8 py-3 bg-color4 text-white font-semibold rounded-lg hover:bg-color1 transition-colors shadow-md hover:shadow-lg self-center md:self-start cursor-pointer">
            {t('home.popularProducts.explore')}
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
                  : "hover:bg-gray-100 hover:rounded-full hover:border-2 border-gray-300 cursor-pointer"
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
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all ${
                currentIndex === maxIndex
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-100 hover:rounded-full hover:border-2 border-gray-300 cursor-pointer"
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
                className={`h-3 transition-all duration-300 cursor-pointer ${
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
