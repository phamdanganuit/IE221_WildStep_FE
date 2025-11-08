import React, { useState } from "react";
import Header from "../../components/Header";
// import ProductGallery from "./ProductGallery";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import ReviewSection from "@/components/ProductDetail/Review";
import RelatedProducts from "@/components/ProductDetail/RelatedProduct";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductDescription from "@/components/ProductDetail/ProductDescription";
import ProductDetail from "@/components/ProductDetail/ProductDetail";

const ChiTietSanPham = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const images = [
    "https://i.postimg.cc/Yq1XM1XV/Frame-139.png",
    "https://i.postimg.cc/90ys6swX/Frame-140.png",
    "https://i.postimg.cc/gj31C1XC/Frame-141.png",
    "https://i.postimg.cc/mk7KvKz0/Frame-143.png",
    "https://i.postimg.cc/QCcv2v9Y/Frame-144.png",
    "https://i.postimg.cc/Y0QT5TLq/Frame-142.png",
  ];

  const [selectedColor, setSelectedColor] = useState("White/Aluminium");
  const [selectedSize, setSelectedSize] = useState("EU36");

  const handleAddToCart = () => {
    console.log("Adding to cart:", { selectedColor, selectedSize });
    // Add to cart logic here
  };

  const handleBuyNow = () => {
    console.log("Buy now:", { selectedColor, selectedSize });
    // Buy now logic here
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="flex overflow-hidden flex-col pb-20 bg-white">
      <Header />
      <Breadcrumb className="px-20 max-md:px-10 mt-6 w-full max-md:max-w-full">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1">
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
        <BreadcrumbSeparator> | </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/shoes">Giày</BreadcrumbLink>
          </BreadcrumbItem>
        <BreadcrumbSeparator> | </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/shoes/women">Giày nữ</BreadcrumbLink>
          </BreadcrumbItem>
        <BreadcrumbSeparator> | </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Air Jordan 1 Low</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <main className="flex flex-col items-start self-center px-20 gap-8 max-md:gap-4 max-md:px-10 w-full max-md:max-w-full">
        <section className="flex max-md:flex-col self-stretch mt-5 max-md:mr-0.5 max-md:max-w-full">
          <div className="flex md:gap-20 gap-5 max-md:flex-col">
            <div className="w-[55%] max-md:ml-0 max-md:w-full">
              <div className="w-full max-md:mt-10 max-md:max-w-full">
                <div className="relative h-[45rem] w-full flex justify-center items-center border border-[#1C2541] rounded-xl overflow-hidden">
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 bg-white/70 hover:bg-white rounded-full p-2 shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <img
                    src={images[currentIndex]}
                    alt={`Product view ${currentIndex + 1}`}
                    className="object-cover h-full w-full rounded-lg aspect-[1.1] transition-all duration-300 max-md:mr-2.5 max-md:max-w-full"
                  />
                  <button
                    onClick={handleNext}
                    className="absolute right-3 bg-white/70 hover:bg-white rounded-full p-2 shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 justify-between items-center mt-5">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C2541] hover:scale-105 ${
                        currentIndex === index
                          ? "ring-2 ring-[#1C2541] bg-[#1C2541]/20"
                          : ""
                      }`}
                      aria-label={`View product image ${index}`}
                    >
                      <img
                        src={image}
                        alt={`Product thumbnail ${index}`}
                        className="object-cover shrink-0 rounded-lg aspect-[0.75] w-[76px] hover:opacity-80"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex w-[45%] max-md:ml-0 max-md:w-full">
              <ProductInfo
                title="Air Jordan 1 Low"
                originalPrice="3,239,000₫"
                salePrice="2,591,199₫"
                soldCount="1,238"
                rating="4.5"
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                selectedSize={selectedSize}
                handleSizeChange={handleSizeChange}
                selectedColor={selectedColor}
                handleColorChange={handleColorChange}
              />
            </div>
          </div>
        </section>

        <img
          src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/2c690c8f3c4b63372042985765f6e103dad8f008?placeholderIfAbsent=true"
          alt="Product features separator"
          className="object-contain w-full max-md:max-w-full"
        />
        <section className="max-md:mt-3 max-md:ml-2.5">
          <ProductDescription />
        </section>
        <img
          src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/2c690c8f3c4b63372042985765f6e103dad8f008?placeholderIfAbsent=true"
          alt="Product features separator"
          className="object-contain w-full max-md:max-w-full"
        />

        <section className="max-md:mt-3 max-md:ml-2.5">
          <ProductDetail />
        </section>

        <img
          src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/2c690c8f3c4b63372042985765f6e103dad8f008?placeholderIfAbsent=true"
          alt="Section separator"
          className="object-contain w-full max-md:max-w-full"
        />

        <ReviewSection />

        <img
          src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/2c690c8f3c4b63372042985765f6e103dad8f008?placeholderIfAbsent=true"
          alt="Section separator"
          className="object-contain w-full max-md:max-w-full"
        />

        <RelatedProducts />
      </main>
    </div>
  );
};

export default ChiTietSanPham;
