import React, { useEffect, useState } from "react";
import { FaArrowRight, FaFire } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";
import newLabel from "@/assets/new_label.svg";
import { getPublicCategories, getPublicProducts } from "@/service/contentService";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";
// import { translateCategoryName } from "@/lib/i18nUtils";

export default function BestSellers() {
  const { t, i18n } = useTranslation();
  const [categoryTabs, setCategoryTabs] = useState([{ name: t('home.bestSellers.all'), slug: "" }]);
  const [activeCategorySlug, setActiveCategorySlug] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, page_size: 12, total: 0, total_pages: 0 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const catRes = await getPublicCategories();
      if (!mounted) return;
      if (catRes?.success) {
        const payload = catRes.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        const tabs = [{ name: t('home.bestSellers.all'), slug: "" }];
        list.forEach((parent) => {
          if (parent?.name && parent?.slug) {
            tabs.push({ 
              // Use raw name from BE; BE will handle localization
              name: safeText(parent.name, i18n.language, 'N/A'), 
              originalName: parent.name,
              slug: parent.slug 
            });
          }
        });
        setCategoryTabs(tabs);
      } else {
        setCategoryTabs([{ name: t('home.bestSellers.all'), slug: "" }]);
      }
    })();
    return () => { mounted = false };
  }, [t, i18n.language]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      const res = await getPublicProducts({ sort: "best_sellers", category_slug: activeCategorySlug, page: 1, page_size: 12 });
      if (!mounted) return;
      if (res?.success && Array.isArray(res.data?.data)) {
        const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
        const apiProducts = res.data.data.map((p) => {
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
            sold: typeof p.sold === "number" ? p.sold : 0,
            createdAt: p.createdAt || p.created_at || null,
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
  }, [activeCategorySlug, i18n.language]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  return (
    <section className="py-8 px-10 md:px-20">
      {/* Tiêu đề - Responsive */}
      <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
        <h2 className="text-[#0A1E33] flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
          <span className="font-semibold text-base sm:text-xl md:text-[1.5rem] lg:text-[2rem]">—</span>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3rem] font-semibold">
            {t('home.bestSellers.title')}
          </span>
          <span className="font-semibold text-base sm:text-xl md:text-[1.5rem] lg:text-[2rem]">—</span>
        </h2>

        {/* Bộ lọc danh mục - Responsive */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-5 sm:mt-6 md:mt-8">
          {categoryTabs.map((cat) => (
            <button
              key={cat.slug || "all"}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3
                rounded-lg border-2 border-color1 
                text-sm sm:text-base md:text-lg lg:text-xl
                font-semibold cursor-pointer 
                transition-all duration-300
                min-h-[44px] flex items-center justify-center
                hover:shadow-md
                ${
                activeCategorySlug === cat.slug
                  ? "bg-color1 text-white shadow-md"
                  : "bg-white text-[#0A1E33] hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách sản phẩm - Responsive Grid */}
      <div className="grid gap-3 sm:gap-4 md:gap-5 lg:gap-6
        grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4">
        {products.map((item) => (
            <div
              key={item.id}
              className="relative group border-2 border-[#DEDEDE] rounded-xl sm:rounded-2xl 
                overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-color4
                transition-all duration-300 
                flex flex-col
                bg-white"
            >
              {/* Badge New/Hot - Responsive */}
              {(() => {
                const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
                const createdTime = item.createdAt ? new Date(item.createdAt).getTime() : null;
                const isOlderThan10Days = createdTime ? (Date.now() - createdTime) > TEN_DAYS : false;
                const isHot = (item.sold || 0) > 10;
                const showNew = !isHot && !isOlderThan10Days;
                if (!isHot && !showNew) return null;
                return (
                  <div
                    className={`absolute top-2 sm:top-3 md:top-4 left-0 
                      px-2 py-1 sm:px-3 sm:py-1.5
                      text-white text-xs sm:text-sm font-bold
                      rounded-tr-lg rounded-br-lg shadow-md
                      flex items-center gap-1 z-10`}
                    style={{ backgroundColor: isHot ? "#E63946" : "#0A1E33" }}
                  >
                    {isHot ? (
                      <>
                        <FaFire className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{t('home.bestSellers.hot')}</span>
                      </>
                    ) : (
                      <span>{t('home.bestSellers.new')}</span>
                    )}
                  </div>
                );
              })()}

              {/* Nút yêu thích - Responsive with min touch target */}
              <button
                onClick={() => toggleFavorite(item.id)}
                className="cursor-pointer absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 
                  w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11
                  flex items-center justify-center 
                  hover:scale-110 transition-transform
                  z-10
                  bg-white/90 hover:bg-white rounded-full shadow-sm"
                aria-label="Add to wishlist"
              >
                {favorites.includes(item.id) ? (
                  <GoHeartFill
                    className="text-red-500 transition-transform duration-300"
                    size={20}
                  />
                ) : (
                  <GoHeart
                    className="text-[#0A1E33] hover:text-red-400 transition"
                    size={20}
                  />
                )}
              </button>

              {/* Ảnh nền sản phẩm - Square aspect ratio */}
              <div
                className="w-full rounded-t-xl sm:rounded-t-2xl 
                  aspect-square
                  bg-cover bg-center bg-no-repeat bg-gray-50"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              />

              {/* Thông tin sản phẩm - Responsive */}
              <div className="p-3 sm:p-4 md:p-5 lg:p-6
                flex flex-col gap-2">
                <h3 className="text-[#0B132B] 
                  text-sm sm:text-base md:text-lg lg:text-xl
                  leading-tight
                  font-semibold 
                  line-clamp-2">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[#0A1E33] font-bold 
                      text-base sm:text-lg md:text-xl lg:text-2xl">
                      {item.price}
                    </p>
                    {item.oldPrice && (
                      <span className="text-gray-400 
                        text-xs sm:text-sm md:text-base
                        font-medium line-through">
                        {item.oldPrice}
                      </span>
                    )}
                  </div>
                  
                  {/* Arrow Button - Responsive with min touch target */}
                  <button className="flex items-center justify-center transition cursor-pointer 
                    flex-shrink-0 min-h-[44px] min-w-[44px]"
                    aria-label="View product">
                    <img
                      src="/icon/arrow.svg"
                      alt="Arrow Right"
                      className="hover:scale-110 transition-transform w-8 h-8 sm:w-10 sm:h-10"
                    />
                  </button>
                </div>
              </div>
            </div>
        ))}
      </div>
    </section>
  );
}
