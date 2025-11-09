import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { getPublicProducts } from "@/service/contentService";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";

const CARDS_PER_PAGE = 3;

const ProductCard = ({ image, name, price, oldPrice, className = "" }) => {
  return (
    <div
      className={`group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border-2 border-[#DEDEDE] overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-color4
        ${className}`}
    >
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-2 bg-white">
        <h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 line-clamp-2 leading-tight">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-lg sm:text-xl md:text-2xl text-color1">
              {price}
            </p>
            {oldPrice && (
              <span className="text-gray-400 text-sm sm:text-base font-medium line-through">
                {oldPrice}
              </span>
            )}
          </div>
          <button 
            className="flex items-center justify-center transition cursor-pointer flex-shrink-0
              min-h-[44px] min-w-[44px]"
            aria-label="View product"
          >
            <img
              src="/icon/arrow.svg"
              alt="Arrow Right"
              className="hover:scale-110 transition-transform w-8 h-8 sm:w-10 sm:h-10"
            />
          </button>
        </div>
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
          const priceNumber = p.discountPrice ?? p.price;
          const oldPriceNumber = p.discountPrice ? p.price : null;
          return {
            id: p.id,
            name: safeText(p.name, i18n.language, 'N/A'),
            image: (Array.isArray(p.images) && p.images[0]) || "",
            price: typeof priceNumber === 'number' ? currency.format(priceNumber) : String(priceNumber ?? ""),
            oldPrice: typeof oldPriceNumber === 'number' ? currency.format(oldPriceNumber) : null,
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
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-10 lg:gap-12 items-center">
          <div className="flex flex-col gap-4 sm:gap-6 lg:w-1/4 w-full">
            <div className="h-6 sm:h-8 w-32 sm:w-40 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
            <div className="h-20 sm:h-24 w-full max-w-md bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
            <div className="h-10 w-28 sm:w-32 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 sm:h-56 md:h-64 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 text-center">
          <h3 className="text-color1 font-medium 
            text-base sm:text-lg md:text-xl lg:text-[1.5rem] 
            flex items-center justify-center gap-2">
            <span className="w-6 sm:w-8 h-[2px] bg-color1"></span>
            {t('home.popularProducts.subtitle')}
            <span className="w-6 sm:w-8 h-[2px] bg-color1"></span>
          </h3>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
            font-semibold text-color1 leading-tight">
            {t('home.popularProducts.heading')}
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl 
            text-[#000000]/75 leading-relaxed 
            max-w-3xl mx-auto">
            {t('home.popularProducts.description')}
          </p>
        </div>

        {/* Products Grid - 2 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
          <button className="px-8 py-3 sm:px-10 sm:py-4 
            bg-color4 text-white font-semibold 
            text-base sm:text-lg
            rounded-lg hover:bg-hover4 transition-all 
            shadow-lg hover:shadow-xl hover:-translate-y-0.5
            cursor-pointer
            min-h-[44px]">
            {t('home.popularProducts.explore')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
