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

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* NAVBAR */}
      <Header />

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-start">
        {/* LEFT TEXT CONTENT */}
        <div
          className="flex md:flex-row flex-col items-center justify-start w-full gap-10
         bg-no-repeat bg-right bg-contain
         min-h-[56.25vw] md:min-h-[calc(100vh-3.5rem)]"
          style={{
            backgroundImage: `url(${bgShoe})`,
            backgroundPosition: "right center", // neo phần phải
            backgroundSize: "auto 150%",
          }}
        >
          <div className="flex flex-col items-start justify-center md:w-1/2 py-10 px-20 text-left pt-10 gap-4">
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

            <p className="text-[#000000]/75 mb-8 w-full font-normal text-[1.5rem] tracking-wide">
            Khám phá những đôi giày được thiết kế để nâng tầm phong cách và mang lại sự thoải mái tối đa mỗi bước chân.
            </p>

            <button className="px-8 py-3 bg-color4 text-white font-semibold rounded hover:bg-hover4 transition-colors shadow-xl hover:shadow-lg self-center md:self-start cursor-pointer">
              Mua Ngay
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative md:w-1/2 flex items-center justify-center">
            <img
              src={shoeImg}
              alt="Trendy Slick Pro"
              className="w-[32rem] object-contain drop-shadow-xl"
            />
            <div className="absolute bottom-0 right-3/10 text-center">
              <h2 className="text-[#0A1E33] text-[1.75rem] font-semibold">
                Trendy WildStep Pro
              </h2>
              <p className="text-[#000000]/50 text-[1.5rem] font-semibold">
                 3.999.000₫
              </p>
            </div>
            {/* <span className="absolute text-[8rem] md:text-[10rem] font-extrabold text-[#E8E8E8] -rotate-90 opacity-30 right-0">
            ULTIMATE
          </span> */}
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
