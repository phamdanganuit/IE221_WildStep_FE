import React, { useEffect, useState } from "react";
import { FaArrowRight, FaFire } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";
import newLabel from "@/assets/new_label.svg";
import { getPublicCategories, getPublicProducts } from "@/service/contentService";
import { useTranslation } from "react-i18next";
import { translateCategoryName } from "@/lib/i18nUtils";

export default function BestSellers() {
  const { t } = useTranslation();
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
              name: translateCategoryName(parent.name, t), 
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
  }, [t]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      const res = await getPublicProducts({ sort: "best_sellers", category_slug: activeCategorySlug, page: 1, page_size: 12 });
      if (!mounted) return;
      if (res?.success && Array.isArray(res.data?.data)) {
        const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
        const apiProducts = res.data.data.map((p) => {
          const priceNumber = p.discountPrice ?? p.price;
          const oldPriceNumber = p.discountPrice ? p.price : null;
          return {
            id: p.id,
            name: p.name,
            image: (Array.isArray(p.images) && p.images[0]) || "",
            price: typeof priceNumber === "number" ? currency.format(priceNumber) : String(priceNumber ?? ""),
            oldPrice: typeof oldPriceNumber === "number" ? currency.format(oldPriceNumber) : null,
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
  }, [activeCategorySlug]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  return (
    <section className="w-full px-10 md:px-20 mt-12 md:mt-20 bg-transparent">
      {/* Tiêu đề */}
      <div className="text-center mb-10">
        <h2 className="text-[#0A1E33] flex items-center justify-center gap-5">
          <span className="font-semibold text-[2rem]">—</span>
          <span className="text-[2.5rem] font-semibold">{t('home.bestSellers.title')}</span>
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
                  : "bg-white text-[#0A1E33] hover:bg-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
        {products.map((item) => (
            <div
              key={item.id}
              className=" relative group border-2 border-[#DEDEDE] rounded-2xl overflow-hidden hover:shadow-sm hover:-translate-y-1 transition-all duration-300 group-hover:scale-105 "
            >
              {/* Badge New/Hot */}
              {(() => {
                const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;
                const createdTime = item.createdAt ? new Date(item.createdAt).getTime() : null;
                const isOlderThan10Days = createdTime ? (Date.now() - createdTime) > TEN_DAYS : false;
                const isHot = (item.sold || 0) > 10;
                const showNew = !isHot && !isOlderThan10Days;
                if (!isHot && !showNew) return null;
                return (
                  <div
                    className={`absolute top-5 left-0 px-3 py-1 text-white text-sm font-semibold rounded-tr-xl rounded-br-xl shadow flex items-center gap-1`}
                    style={{ backgroundColor: isHot ? "#E63946" : "#0A1E33" }}
                  >
                    {isHot ? (
                      <>
                        <FaFire className="w-4 h-4" />
                        <span>{t('home.bestSellers.hot')}</span>
                      </>
                    ) : (
                      <span>{t('home.bestSellers.new')}</span>
                    )}
                  </div>
                );
              })()}

              {/* Nút yêu thích */}
              <button
                onClick={() => toggleFavorite(item.id)}
                className="cursor-pointer absolute top-5 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition"
              >
                {favorites.includes(item.id) ? (
                  <GoHeartFill
                    className="text-red-500 transition-transform duration-300 scale-110"
                    size={24}
                  />
                ) : (
                  <GoHeart
                    className="text-[#0A1E33] hover:text-red-400 transition"
                    size={24}
                  />
                )}
              </button>

              {/* Ảnh nền sản phẩm */}
              <div
              className="w-full mt-0 rounded-t-2xl rounded-b-none aspect-[4/3] bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              />

              {/* Thông tin sản phẩm */}
              <div className="pl-6 pr-3 pt-3 pb-2 flex justify-between items-center">
                <div className="flex flex-col gap-2 mb-2">
                  <h3 className="self-stretch h-7 justify-start text-[#0B132B] text-[1.25rem] leading-7 font-medium ">
                    {item.name}
                  </h3>

                  <p className="text-[#0A1E33] font-semibold text-[1.25rem]">
                    {item.price}
                    <span className="text-gray-400 text-[1rem] font-medium line-through ml-2">
                      {item.oldPrice}
                    </span>
                  </p>
                </div>
                <button className="flex items-center justify-center transition cursor-pointer">
                  <img
                    src="/icon/arrow.svg"
                    alt="Arrow Right"
                    className="hover:scale-105 w-[3.125rem] h-[3.125rem]"
                  />
                </button>
              </div>
            </div>
        ))}
      </div>
    </section>
  );
}
