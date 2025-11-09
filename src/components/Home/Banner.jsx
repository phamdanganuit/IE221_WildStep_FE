import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getPublicBanners } from "@/service/contentService";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";

const Banner = () => {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const nextSlide = () => {
    if (!banners.length) return;
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (!banners.length) return;
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const res = await getPublicBanners();
      if (!isMounted) return;
      if (res?.success && Array.isArray(res.data?.data)) {
        setBanners(res.data.data);
      } else {
        setBanners([]);
      }
      setLoading(false);
    })();
    return () => { isMounted = false; };
  }, [i18n.language]);

  useEffect(() => {
    if (!banners.length) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, current]);

  if (loading) {
    return (
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl sm:rounded-2xl shadow-lg bg-gray-200 animate-pulse" />
      </section>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner) => {
            const imageUrl = banner.image || banner.img || banner.url;
            const title = safeText(banner.title, i18n.language, `Banner ${banner.id}`);
            const content = (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              />
            );
            return (
              <div key={banner.id} className="w-full flex-shrink-0 relative">
                {banner.link ? (
                  <a href={banner.link} aria-label={title}>
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>

        {/* Nút điều hướng - Responsive */}
        <button
          onClick={prevSlide}
          className="absolute cursor-pointer 
            left-2 sm:left-3 md:left-4 
            top-1/2 -translate-y-1/2 
            bg-white/80 hover:bg-white text-gray-800 
            rounded-full 
            p-2 sm:p-2.5 md:p-3 
            shadow transition-all duration-300 hover:scale-105
            w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
            flex items-center justify-center"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute cursor-pointer 
            right-2 sm:right-3 md:right-4 
            top-1/2 -translate-y-1/2 
            bg-white/80 hover:bg-white text-gray-800 
            rounded-full 
            p-2 sm:p-2.5 md:p-3 
            shadow transition-all duration-300 hover:scale-105
            w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
            flex items-center justify-center"
          aria-label="Next slide"
        >
          <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {/* Dấu chấm chỉ số - Responsive */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 md:gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                current === index
                  ? "bg-[#000000]/85 w-6 h-3 sm:w-8 sm:h-3 md:w-10 md:h-4 border-[0.1rem] border-gray-400"
                  : "bg-[#000000]/30 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 hover:bg-[#000000]/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
