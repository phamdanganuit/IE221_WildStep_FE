import React, { useState, useEffect, useRef } from "react";
import shoeImg from "@/assets/shoe.png";
import bgShoe from "@/assets/bg_shoe_3.png";
import ultimate from "@/assets/ultimate.png";
import Header from "@/components/Header";
import HeroSection from "../../components/Home/HeroSection";
import BrandLogos from "../../components/Home/BrandLogo";
import PopularProducts from "../../components/Home/PopularProducts";
import Banner from "../../components/Home/Banner";
import BestSellers from "../../components/Home/BestSeller";
import CustomerReviews from "../../components/Home/CustomerReview";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="w-full min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* NAVBAR */}
      <Header />

      {/* HERO SECTION - Responsive with preserved layout */}
      <main className="flex flex-col items-center justify-start">
        {/* Hero Container with Background */}
        <div
          className="flex flex-col lg:flex-row items-center justify-center w-full 
          bg-no-repeat bg-center bg-contain
          sm:bg-[center_right] md:bg-right
          lg:bg-right
          min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[calc(100vh-4rem)]
          relative overflow-hidden"
          style={{
            backgroundImage: `url(${bgShoe})`,
            backgroundSize: 'auto 100%',
          }}
        >
          {/* LEFT TEXT CONTENT */}
          <div className="flex flex-col items-center lg:items-start justify-center 
            w-full lg:w-1/2 
            py-8 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20
            text-center lg:text-left 
            gap-3 sm:gap-4 md:gap-6
            z-10">
            
            {/* Hero Heading - Responsive Typography */}
            <div className="flex flex-col justify-center items-center lg:items-start font-['Stardos_Stencil']">
              <div className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[5.625rem] 
                flex font-extrabold text-[#0A1E33] leading-tight mb-1">
                Find Your
              </div>
              <div className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[5.625rem] 
                flex font-extrabold text-color4 leading-tight mb-1">
                Sole Mate
              </div>
              <div className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[5.625rem] 
                flex font-extrabold text-[#0A1E33] leading-tight mb-1">
                With Us
              </div>
            </div>

            {/* Description - Responsive */}
            <p className="text-[#000000]/75 mb-4 sm:mb-6 md:mb-8 
              w-full max-w-md lg:max-w-full 
              font-normal text-sm sm:text-base md:text-lg lg:text-xl xl:text-[1.5rem] 
              tracking-wide leading-relaxed">
              {t('home.hero.description')}
            </p>

            {/* CTA Button - Responsive with min touch target */}
            <button className="px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-4 
              bg-color4 text-white font-semibold 
              text-sm sm:text-base md:text-lg
              rounded hover:bg-hover4 transition-colors 
              shadow-xl hover:shadow-lg 
              min-h-[44px]
              cursor-pointer">
              {t('home.hero.buyNow')}
            </button>
          </div>

          {/* RIGHT IMAGE SECTION - Responsive */}
          <div className="relative w-full lg:w-1/2 
            flex items-center justify-center 
            py-8 px-4 lg:py-0
            z-10">
            
            {/* Product Image - Scaled responsively */}
            <img
              src={shoeImg}
              alt="Trendy Slick Pro"
              className="w-3/4 sm:w-2/3 md:w-3/5 lg:w-full 
                max-w-[280px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[32rem]
                object-contain drop-shadow-xl
                transform scale-75 sm:scale-85 md:scale-90 lg:scale-95 xl:scale-100"
            />
            
            {/* Product Info - Positioned relative to image */}
            <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-0 
              left-1/2 lg:right-1/3 lg:left-auto
              transform -translate-x-1/2 lg:translate-x-0
              text-center">
              <h2 className="text-[#0A1E33] 
                text-base sm:text-lg md:text-xl lg:text-[1.5rem] xl:text-[1.75rem] 
                font-semibold">
                {t('home.hero.productName')}
              </h2>
              <p className="text-[#000000]/50 
                text-sm sm:text-base md:text-lg lg:text-xl xl:text-[1.5rem] 
                font-semibold">
                 3.999.000₫
              </p>
            </div>
          </div>
        </div>
        <BrandLogos />
        <PopularProducts />
        <Banner />
        <BestSellers />
        <CustomerReviews />
      </main>
      <Footer />
    </div>
  );
}
