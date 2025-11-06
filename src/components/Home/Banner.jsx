import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getPublicBanners } from "@/service/contentService";

const Banner = () => {
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
  }, []);

  useEffect(() => {
    if (!banners.length) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, current]);

  if (loading) {
    return (
      <section className="px-10 md:px-20 mt-12 md:mt-20">
        <div className="relative w-full h-[400px] overflow-hidden rounded-2xl shadow-lg bg-gray-200 animate-pulse" />
      </section>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <section className="px-10 md:px-20 mt-12 md:mt-20">
      <div className="relative w-full h-[400px] overflow-hidden rounded-2xl shadow-lg">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner) => {
            const imageUrl = banner.image || banner.img || banner.url;
            const title = banner.title || `Banner ${banner.id}`;
            const content = (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-[400px] object-cover"
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

        {/* Nút điều hướng */}
        <button
          onClick={prevSlide}
          className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow transition-all duration-300 hover:scale-105"
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow transition-all duration-300 hover:scale-105"
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>

        {/* Dấu chấm chỉ số */
        }
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                current === index
                  ? "bg-[#000000]/85 w-4 h-4 scale-115 border-[0.1rem] border-gray-400"
                  : "bg-[#000000]/30 w-4 h-4 hover:bg-[#000000]/60"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
