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

      {/* HERO SECTION - Separate Mobile & Desktop */}
      <main className="flex flex-col items-center justify-start">
        
        {/* MOBILE/TABLET Hero (< md) */}
        <div
          className="md:hidden flex flex-col items-center justify-center w-full 
          bg-no-repeat bg-center bg-contain
          min-h-[600px] sm:min-h-[700px]
          relative overflow-hidden"
          style={{
            backgroundImage: `url(${bgShoe})`,
            backgroundSize: 'auto 100%',
          }}
        >
          {/* LEFT TEXT CONTENT */}
          <div className="flex flex-col items-center justify-center 
            w-full 
            py-8 px-4 sm:px-8
            text-center 
            gap-3 sm:gap-4
            z-10">
            
            {/* Hero Heading */}
            <div className="flex flex-col justify-center items-center font-['Stardos_Stencil']">
              <div className="text-[2.5rem] sm:text-[3rem]
                flex font-extrabold text-[#0A1E33] leading-tight mb-1">
                Find Your
              </div>
              <div className="text-[2.5rem] sm:text-[3rem]
                flex font-extrabold text-color4 leading-tight mb-1">
                Sole Mate
              </div>
              <div className="text-[2.5rem] sm:text-[3rem]
                flex font-extrabold text-[#0A1E33] leading-tight mb-1">
                With Us
              </div>
            </div>

            {/* Description */}
            <p className="text-[#000000]/75 mb-4 sm:mb-6
              w-full max-w-md 
              font-normal text-sm sm:text-base
              tracking-wide leading-relaxed">
              {t('home.hero.description')}
            </p>

            {/* CTA Button */}
            <button className="px-6 py-3 sm:px-8 sm:py-3
              bg-color4 text-white font-semibold 
              text-sm sm:text-base
              rounded hover:bg-hover4 transition-colors 
              shadow-xl hover:shadow-lg 
              min-h-[44px]
              cursor-pointer">
              {t('home.hero.buyNow')}
            </button>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="relative w-full 
            flex items-center justify-center 
            py-8 px-4
            z-10">
            
            {/* Product Image */}
            <img
              src={shoeImg}
              alt="Trendy Slick Pro"
              className="w-3/4 sm:w-2/3
                max-w-[280px] sm:max-w-[360px]
                object-contain drop-shadow-xl
                transform scale-75 sm:scale-85"
            />
            
            {/* Product Info */}
            <div className="absolute bottom-4 sm:bottom-8
              left-1/2
              transform -translate-x-1/2
              text-center">
              <h2 className="text-[#0A1E33] 
                text-base sm:text-lg
                font-semibold">
                {t('home.hero.productName')}
              </h2>
              <p className="text-[#000000]/50 
                text-sm sm:text-base
                font-semibold">
                 3.999.000₫
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP Hero (>= md) - Original Design */}
        <div
          className="hidden md:flex md:flex-row flex-col items-center justify-start w-full gap-10
          bg-no-repeat bg-right bg-contain
          min-h-[56.25vw] md:min-h-[calc(100vh-3.5rem)]"
          style={{
            backgroundImage: `url(${bgShoe})`,
            backgroundPosition: 'right center',
            backgroundSize: 'auto 150%',
          }}
        >
          {/* LEFT TEXT CONTENT */}
          <div className="flex flex-col items-start justify-center md:w-1/2 py-10 px-20 text-left pt-10 gap-4">
            
            {/* Hero Heading */}
            <div className="flex flex-col justify-center items-start font-['Stardos_Stencil']">
              <div className="text-[5.625rem] flex font-extrabold text-[#0A1E33] leading-tight mb-1 justify-start">
                Find Your
              </div>
              <div className="text-[5.625rem] flex font-extrabold text-color4 leading-tight mb-1 justify-start">
                Sole Mate
              </div>
              <div className="text-[5.625rem] flex-1 font-extrabold text-[#0A1E33] leading-tight mb-1 justify-start">
                With Us
              </div>
            </div>

            {/* Description */}
            <p className="text-[#000000]/75 mb-8 w-full font-normal text-[1.5rem] tracking-wide">
              {t('home.hero.description')}
            </p>

            {/* CTA Button */}
            <button className="px-8 py-3 bg-color4 text-white font-semibold rounded hover:bg-hover4 transition-colors shadow-xl hover:shadow-lg self-center md:self-start cursor-pointer">
              {t('home.hero.buyNow')}
            </button>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="relative md:w-1/2 flex items-center justify-center">
            
            {/* Product Image */}
            <img
              src={shoeImg}
              alt="Trendy Slick Pro"
              className="w-[32rem] object-contain drop-shadow-xl"
            />
            
            {/* Product Info */}
            <div className="absolute bottom-0 right-3/10 text-center">
              <h2 className="text-[#0A1E33] text-[1.75rem] font-semibold">
                {t('home.hero.productName')}
              </h2>
              <p className="text-[#000000]/50 text-[1.5rem] font-semibold">
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
