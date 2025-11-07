import React, { useEffect, useState } from 'react';
import { getPublicHero } from '@/service/contentService';
import { useTranslation } from 'react-i18next';
import { safeText } from '@/lib/i18nUtils';

const HeroSection = () => {
  const { i18n } = useTranslation();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await getPublicHero();
      if (!mounted) return;
      if (res?.success) {
        const payload = res.data;
        setHero(payload?.data || null);
      } else {
        setHero(null);
      }
      setLoading(false);
    })();
    return () => { mounted = false };
  }, [i18n.language]);

  if (loading) return null;
  if (!hero) return null;

  return (
    <section className="relative bg-gradient-to-br from-gradient-start to-gradient-end pt-32 pb-20 px-4 md:px-16 flex flex-col md:flex-row items-center justify-center min-h-screen overflow-hidden">
      {/* Background large "NIKE" text (mờ ảo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18rem] md:text-[25rem] lg:text-[30rem] font-extrabold text-gray-200 opacity-20 select-none pointer-events-none z-0">
        NIKE
      </div>

      {/* SVG Scribbles (mô phỏng, có thể điều chỉnh vị trí và kiểu dáng) */}
      <svg className="absolute top-[18%] left-[45%] w-16 h-auto text-primary-dark opacity-70 animate-float-shoe z-10 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 50 Q 30 20, 50 50 Q 70 80, 90 50"/>
      </svg>
      <svg className="absolute bottom-[15%] left-[25%] w-24 h-auto text-primary-dark opacity-70 animate-float-shoe z-10 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M80 20 C 60 5, 40 95, 20 80 S 5 40, 30 20"/>
      </svg>

      <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 relative z-10 animate-fade-in-left">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary-dark leading-tight mb-4">
          {safeText(hero?.headline, i18n.language, 'N/A')}
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-md mx-auto md:mx-0">
          {safeText(hero?.subtext, i18n.language, '')}
        </p>
        <a href={hero?.cta_url || "#"} className="mt-8 inline-block px-8 py-3 bg-primary-dark text-white text-lg font-semibold rounded-full shadow-lg hover:bg-secondary-teal hover:text-primary-dark transition duration-300 transform hover:-translate-y-1">
          {safeText(hero?.cta_text, i18n.language, 'N/A')}
        </a>
      </div>
      <div className="md:w-1/2 flex justify-center items-center relative z-10 animate-fade-in-right">
        <img
          src={hero?.image || "https://i.ibb.co/b3F3f9F/nike-running-shoe.png"}
          alt="Hero"
          className="max-w-full h-auto drop-shadow-2xl animate-float-shoe"
        />
      </div>
    </section>
  );
};


export default HeroSection;
