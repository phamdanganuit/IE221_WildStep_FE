import React, { useEffect, useState } from "react";
import { FaArrowRight, FaFire } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";
import newLabel from "@/assets/new_label.svg";
import { getPublicCategories, getPublicProducts } from "@/service/contentService";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";
import { useNavigate } from "react-router-dom";
// import { translateCategoryName } from "@/lib/i18nUtils";

export default function BestSellers() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categoryTabs, setCategoryTabs] = useState([{ name: t('home.bestSellers.all'), slug: "" }]);
  const [activeCategorySlug, setActiveCategorySlug] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
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
            images: Array.isArray(p.images) ? p.images : [],
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
    <section className="w-full mt-16 bg-transparent">
      {/* Tiêu đề */}
      <div className="text-center mb-10">
        <h2 className="text-[#0A1E33] flex items-center justify-center gap-5">
          <span className="font-semibold text-[2rem]">—</span>
          <span className="text-[2.5rem] font-semibold">
            {t('home.bestSellers.title')}
          </span>
          <span className="font-semibold text-[2rem]">—</span>
        </h2>

        {/* Bộ lọc danh mục */}
        <div className="flex flex-wrap justify-center gap-5 mt-6">
          {categoryTabs.map((cat) => (
            <button
              key={cat.slug || "all"}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`px-5 py-2 rounded border-[1.5px] border-color1 text-[1rem] md:text-[1.5rem] font-medium cursor-pointer transition-all duration-300 ${
                activeCategorySlug === cat.slug
                  ? "bg-color1 text-white"
                  : "bg-white text-[#0A1E33] hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid gap-6 px-10 md:px-20 grid-cols-2 md:grid-cols-3">
        {products.map((item) => {
          const displayImage = hoveredProduct === item.id && item.images.length > 1 
            ? item.images[1] 
            : item.image;
          
          return (
            <div
              key={item.id}
              className="relative group border-2 border-[#DEDEDE] rounded-2xl overflow-hidden hover:shadow-sm hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredProduct(item.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => navigate(`/product/${item.id}`)}
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
                  <img
                    src={newLabel}
                    alt="New Badge"
                    className="absolute top-5 left-0 w-[3.125rem]"
                    style={{
                      filter: "drop-shadow(8px 7px 10px rgba(0,0,0,0.25))",
                    }}
                  />
                );
                /* Old hot badge code - commented out
                return (
                  <div
                    className={`absolute top-5 left-0 
                      px-3 py-1.5
                      text-white text-sm font-bold
                      rounded-tr-lg rounded-br-lg shadow-md
                      flex items-center gap-1 z-10`}
                    style={{ backgroundColor: isHot ? "#E63946" : "#0A1E33" }}>
                */
              })()}

              {/* Nút yêu thích */}
              <button
                onClick={() => toggleFavorite(item.id)}
                className="absolute top-5 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition"
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

              {/* Ảnh sản phẩm */}
              <div
                className="w-full h-[22.6rem] cursor-pointer bg-center bg-cover bg-no-repeat transition-all duration-500 ease-in-out"
                style={{
                  backgroundImage: `url(${displayImage})`,
                }}
              />

              {/* Thông tin sản phẩm */}
              <div className="pl-6 pr-3 pt-3 pb-2 flex justify-between items-center">
                <div className="flex flex-col gap-2 mb-2">
                  <h3 className="self-stretch h-7 justify-start text-[#0B132B] text-[1.25rem] leading-7 font-medium">
                    {item.name}
                  </h3>

                  <p className="text-[#0A1E33] font-semibold text-[1.25rem]">
                    {item.price}
                    {item.oldPrice && (
                      <span className="text-gray-400 text-[1rem] font-medium line-through ml-2">
                        {item.oldPrice}
                      </span>
                    )}
                  </p>
                </div>
                <button className="flex items-center justify-center transition">
                  <img
                    src="/icon/arrow.svg"
                    alt="Arrow Right"
                    className="hover:scale-105 w-[3.125rem] h-[3.125rem]"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
