import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
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
import { getProductDetail } from "@/service/contentService";
import { safeText } from "@/lib/i18nUtils";

const ChiTietSanPham = () => {
  const { id } = useParams(); // Get product ID or slug from URL
  const { i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Fetch product data from API
  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getProductDetail(id);
        
        if (result.success && result.data) {
          setProduct(result.data);
          
          // Set default color and size from specifications
          if (result.data.specifications?.colors && result.data.specifications.colors.length > 0) {
            const firstColor = result.data.specifications.colors[0];
            // Extract localized color name - support both formats
            let colorName = 'N/A';
            
            // Try color_name first (multilingual object)
            if (firstColor.color_name) {
              if (typeof firstColor.color_name === 'object') {
                colorName = firstColor.color_name[i18n.language] || firstColor.color_name.vi || firstColor.color_name.en || firstColor.color_name.ja || 'N/A';
              } else {
                colorName = firstColor.color_name;
              }
            }
            // Fallback to name field (simple string)
            else if (firstColor.name) {
              if (typeof firstColor.name === 'object') {
                colorName = firstColor.name[i18n.language] || firstColor.name.vi || firstColor.name.en || firstColor.name.ja || 'N/A';
              } else {
                colorName = firstColor.name;
              }
            }
            
            setSelectedColor(colorName);
          }
          
          if (result.data.specifications?.sizes && result.data.specifications.sizes.length > 0) {
            const firstSize = result.data.specifications.sizes[0];
            setSelectedSize(firstSize);
          }
        } else {
          setError(result.error || "Không thể tải thông tin sản phẩm");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, i18n.language]);

  // Get images from product or use placeholder
  const images = product?.images && product.images.length > 0 
    ? product.images 
    : ["https://via.placeholder.com/400"];

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

  // Loading state
  if (loading) {
    return (
      <div className="flex overflow-hidden flex-col pb-20 bg-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color1 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex overflow-hidden flex-col pb-20 bg-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6">{error || "Sản phẩm không tồn tại"}</p>
            <button
              onClick={() => window.location.href = '/products'}
              className="px-6 py-2 bg-color1 text-white rounded-lg hover:bg-opacity-90 transition"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Extract data from new API structure
  const originalPrice = product.price || 0;
  const discount = product.discount || 0;
  const salePrice = product.discountPrice || originalPrice;
  const productName = safeText(product.name, i18n.language, 'N/A');
  const categoryName = safeText(product.category?.name, i18n.language, 'N/A');
  const brandName = safeText(product.brand?.name, i18n.language, 'N/A');
  const description = safeText(product.description, i18n.language, '');

  return (
    <div className="flex overflow-hidden flex-col pb-20 bg-white">
      <Header />
      <Breadcrumb className="px-20 max-md:px-10 mt-6 w-full max-md:max-w-full">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                Trang chủ
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator> | </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/products" className="flex items-center gap-1">
                Tất cả sản phẩm
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {brandName && brandName !== 'N/A' && (
            <>
              <BreadcrumbSeparator> | </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/products?brand=${encodeURIComponent(brandName)}`}>
                    {brandName}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          {categoryName && categoryName !== 'N/A' && (
            <>
              <BreadcrumbSeparator> | </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/products?brand=${encodeURIComponent(brandName)}&category_slug=${product.category?.slug || ''}`}>
                    {categoryName}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator> | </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{productName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <main className="flex flex-col items-start self-center px-20 gap-8 max-md:gap-4 max-md:px-10 w-full max-md:max-w-full">
        <section className="flex max-md:flex-col self-stretch mt-5 max-md:mr-0.5 max-md:max-w-full">
          <div className="flex md:gap-20 gap-5 max-md:flex-col">
            <div className="w-[55%] max-md:ml-0 max-md:w-full">
              <div className="w-full max-md:mt-10 max-md:max-w-full">
                <div className="relative h-fit w-fit flex justify-center items-center border border-[#1C2541] rounded-xl overflow-hidden">
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
                title={productName}
                originalPrice={discount > 0 ? formatPrice(originalPrice) : null}
                salePrice={formatPrice(salePrice)}
                soldCount={product.soldCount || 0}
                rating={product.rating || 0}
                reviewCount={product.reviewCount || 0}
                stock={product.stock || 0}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                selectedSize={selectedSize}
                handleSizeChange={handleSizeChange}
                selectedColor={selectedColor}
                handleColorChange={handleColorChange}
                productColors={product.specifications?.colors || []}
                productSizes={product.specifications?.sizes || []}
                currentLang={i18n.language}
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
          <ProductDescription description={description} />
        </section>
        <img
          src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/2c690c8f3c4b63372042985765f6e103dad8f008?placeholderIfAbsent=true"
          alt="Product features separator"
          className="object-contain w-full max-md:max-w-full"
        />

        <section className="max-md:mt-3 max-md:ml-2.5">
          <ProductDetail 
            product={{
              material: product.specifications?.material || '',
              weight: product.specifications?.weight || '',
              origin: product.specifications?.origin || '',
              style: product.specifications?.style || '',
              colors: product.specifications?.colors || [],
              sizes: product.specifications?.sizes || [],
            }} 
          />
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
