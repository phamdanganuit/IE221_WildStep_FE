import React, { useEffect, useState } from "react";
import CatalogBreadCrumb from "./CatalogBreadCrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faBars, faFilter } from "@fortawesome/free-solid-svg-icons";
import StarRating from "@/components/ProductDetail/StarRating";

const EXAMPLE_DATA = [
  {
    _id: "1",
    name: "Nike Ava Rover",
    originalPrice: 3829000,
    sold: 20,
    rate: 4.5,
    stock: 50,
    discount: 0,
    description: "Shoes with Reflective Design Accents",
    images: [
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/50266e78-2bcf-4dfe-bce4-293a63a05dae/NIKE+AVA+ROVER.png",
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/30ae34c4-7fb1-40a1-88e9-d98d30314a2b/NIKE+AVA+ROVER.png",
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4effb1e7-75b8-49bd-9fd6-d8b1a1fe7acb/NIKE+AVA+ROVER.png",
    ],
    color: [
      {
        colorName: "College Grey/Black/Dark Smoke Grey/Black",
        image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/50266e78-2bcf-4dfe-bce4-293a63a05dae/NIKE+AVA+ROVER.png",
        tags: ["Xám", "Đen" ],
      },
      {
        colorName: "Sequoia/Oil Green/Soft Yellow/Soft Yellow",
        image: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/6ec44936-34d5-46d1-ae78-97281ff453f8/NIKE+AVA+ROVER.png",
        tags: ["Xanh lá", "Vàng"],
      },
    ],
    size: [
      {
        sizeName: "EU37",
        tags: ["Large"],
      },
      {
        sizeName: "EU38",
        tags: ["Large"],
      },
      {
        sizeName: "EU39",
        tags: ["Large"],
      },
      {
        sizeName: "EU40",
        tags: ["X-Large"],
      },
    ],
    brandId: {
      name: "Nike",
    },
    sizeTable:
      "https://templates.mediamodifier.com/63ff3c773e8bc57b10ca810b/size-table-chart-template-for-shoes.jpg",
    categoryId: {
      name: "Giày chạy bộ",
      parentId: {
        name: "Nam",
      },
    },
    createdAt: "2025-10-20T10:00:00Z",
  },
  {
    _id: "2",
    name: "Nike Air Heights",
    originalPrice: 2349000,
    sold: 20,
    rate: 4.5,
    stock: 50,
    discount: 10,
    description: "The '90s are back in a big way with the brand-new, retro-inspired Nike Air Heights. A bold, chunky design with modern detailing brings this lightweight, comfortable shoe to the next level.",
    images: [
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/zugfcrqkbqvhsjyhp7ch/WMNS+NIKE+AIR+HEIGHTS.png",
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/lcqdrqqiaizqwbi1ycbn/WMNS+NIKE+AIR+HEIGHTS.png",
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/dsdp5toa9cxg1zsiuvrc/WMNS+NIKE+AIR+HEIGHTS.png",
    ],
    color: [
      {
        colorName: "Black/Black",
        image: "",
        tags: ["Đen"],
      },
    ],
    size: [
      {
        sizeName: "EU34",
        tags: ["Small"],
      },
      {
        sizeName: "EU35",
        tags: ["Medium"],
      },
      {
        sizeName: "EU36",
        tags: ["Medium"],
      },
      {
        sizeName: "EU37",
        tags: ["Large"],
      },
      {
        sizeName: "EU38",
        tags: ["Large"],
      },
      {
        sizeName: "EU39",
        tags: ["X-Large"],
      },
    ],
    brandId: {
      name: "Nike",
    },
    sizeTable:
      "https://templates.mediamodifier.com/63ff3c773e8bc57b10ca810b/size-table-chart-template-for-shoes.jpg",
    categoryId: {
      name: "Giày chạy bộ",
      parentId: {
        name: "Nam",
      },
    },
    createdAt: "2025-10-20T10:00:00Z",
  },
  {
    _id: "3",
    name: "Giày UltraBoost 20",
    originalPrice: 5000000,
    sold: 20,
    rate: 4.5,
    stock: 50,
    discount: 50,
    description: "Đây là 1 đôi giày :)",
    images: [
      "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/e3a7db18925d4728809baafc0106b761_9366/Giay_UltraBoost_20_DJen_EF1043_01_standard.jpg",
      "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/0ae41968d69f49f5b912aafc0106d84a_9366/Giay_UltraBoost_20_DJen_EF1043_02_standard_hover.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/18dff8daa4bd417fa4b2aafc0106effb_9366/Giay_UltraBoost_20_DJen_EF1043_04_standard.jpg",
    ],
    color: [
      {
        colorName: "Core Black / Night Metallic / Cloud White",
        image: "",
        tags: ["Đen", "Trắng"],
      },
      {
        colorName: "Core Black / Core Black / Solar Red",
        image: "",
        tags: ["Đen", "Đỏ"],
      },
    ],
    size: [
      {
        sizeName: "3 UK",
        tags: ["Large"],
      },
      {
        sizeName: "4 UK",
        tags: ["Large"],
      },
      {
        sizeName: "10 UK",
        tags: ["Large"],
      },
      {
        sizeName: "13 UK",
        tags: ["X-Large"],
      },
      {
        sizeName: "15 UK",
        tags: ["XX-Large"],
      },
    ],
    brandId: {
      name: "Adidas",
    },
    sizeTable:
      "https://templates.mediamodifier.com/63ff3c773e8bc57b10ca810b/size-table-chart-template-for-shoes.jpg",
    categoryId: {
      name: "Giày chạy bộ",
      parentId: {
        name: "Nam",
      },
    },
    createdAt: "2025-10-21T10:00:00Z",
  },
  {
    _id: "4",
    name: "Converse x NARUTO Chuck Taylor All Star",
    originalPrice: 2900000,
    sold: 20,
    rate: 4.2,
    stock: 50,
    discount: 20,
    description: "The OG classic reworked with colors, graphics and details inspired by Naruto and his unique powers.",
    images: [
      "https://www.converse.vn/media/catalog/product/cache/ae7cee22ac1ff58c2794c87414f27b45/0/8/0882-CONA14836C00O010-1.jpg",
      "https://www.converse.vn/media/catalog/product/cache/81be3f71803e8b19243c0cf4508ce3b1/0/8/0882-CONA14836C00O010-2.jpg",
      "https://www.converse.vn/media/catalog/product/cache/81be3f71803e8b19243c0cf4508ce3b1/0/8/0882-CONA14836C00O010-3.jpg",
    ],
    color: [
      {
        colorName: "Mặc định",
        image: "",
        tags: ["Đen", "Trắng", "Cam"],
      },
    ],
    size: [
      {
        sizeName: "US M3.5/W5.5",
        tags: ["Small"],
      },
      {
        sizeName: "US M10/W12",
        tags: ["XX-Large"],
      },
    ],
    brandId: {
      name: "Converse",
    },
    sizeTable:
      "https://www.converse.vn/media/catalog/product/cache/ae7cee22ac1ff58c2794c87414f27b45/0/8/0882-CONA14836C00O03H-1.jpg",
    categoryId: {
      name: "Giày thể thao",
      parentId: {
        name: "Nam",
      },
    },
    createdAt: "2025-10-20T10:00:00Z",
  },
];

const ProductCard = ({ product }) => {
  const navigateToProductDetail = (productId) => {
    window.location.href = `/product/${productId}`;
  };
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN')+"₫"
  }
  
  // Check if product is new (created within last 10 days)
  const isNew = product?.createdAt ? (Date.now() - new Date(product.createdAt).getTime()) < (10 * 24 * 60 * 60 * 1000) : false;
  const rating = product?.rate || 0;
  const reviewCount = product?.sold || 0;
  const categoryName = product?.categoryId?.parentId?.name ? `${product.categoryId.parentId.name}` : '';
  const genderName = categoryName || '';
  const colorHex = product?.colorHex || null;
  
  return (
    <div
      onClick={() => navigateToProductDetail(product._id)}
      title={product?.name}
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border-2 border-[#DEDEDE] overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-color4
        cursor-pointer"
    >
      {/* Color Indicator */}
      {colorHex && (
        <div 
          className="absolute top-2 sm:top-3 right-2 sm:right-3 
            w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-md
            z-10"
          style={{ backgroundColor: colorHex }}
          title={`Color: ${colorHex}`}
        />
      )}

      {/* NEW Badge */}
      {isNew && (
        <div className="absolute top-2 sm:top-3 left-0 
          px-2 py-1 sm:px-3 sm:py-1.5
          bg-green-500 text-white text-xs sm:text-sm font-bold
          rounded-tr-lg rounded-br-lg shadow-md
          z-10">
          NEW
        </div>
      )}

      {/* Discount Badge */}
      {product?.discount > 0 && !isNew && (
        <div className="absolute top-2 sm:top-3 md:top-4 left-0 
          px-2 py-1 sm:px-3 sm:py-1.5
          bg-red-600 text-white text-xs sm:text-sm font-bold
          rounded-tr-lg rounded-br-lg shadow-md
          flex items-center gap-1 z-10">
          -{product?.discount}%
        </div>
      )}

      {/* Product Image - Square */}
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-gray-50">
        <img
          src={product?.images[0]}
          alt={product?.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-2 bg-white">
        {/* Brand | Category */}
        <p className="font-semibold text-xs sm:text-sm text-color4 uppercase tracking-wide">
          {product?.brandId?.name} {genderName ? `| ${genderName.toUpperCase()}` : ''}
        </p>
        
        {/* Product Name */}
        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2 leading-tight">
          {product?.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={rating} size="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm text-gray-600">
            {rating} ({reviewCount})
          </span>
        </div>
        
        {/* Price */}
        <div className="mt-auto pt-2">
          {product?.discount > 0 ? (
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-base sm:text-lg md:text-xl text-red-600">
                {formatPrice(((100 - product?.discount) * product?.originalPrice) / 100)}
              </p>
              <span className="text-gray-400 text-xs sm:text-sm font-medium line-through">
                {formatPrice(product?.originalPrice)}
              </span>
            </div>
          ) : (
            <p className="font-bold text-base sm:text-lg md:text-xl text-color1">
              {formatPrice(product?.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

function CatalogList({ filters }) {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  useEffect(() => {
    if (!filters) return;
    const fetchProducts = async () => {
      const params = new URLSearchParams();
      const selectedBrands = filters.brand
        .filter((b) => b.value)
        .map((b) => b.label);
      const selectedGenders = filters.gender
        .filter((g) => g.value)
        .map((g) => g.label);
      const selectedColors = filters.color
        .filter((c) => c.value)
        .map((c) => c.label);
      const selectedSizes = filters.size
        .filter((s) => s.value)
        .map((s) => s.label);

      if (selectedBrands.length)
        params.append("brand", selectedBrands.join(","));
      if (selectedGenders.length)
        params.append("gender", selectedGenders.join(","));
      if (selectedColors.length)
        params.append("color", selectedColors.join(","));
      if (selectedSizes.length) params.append("size", selectedSizes.join(","));
      if (filters.price.from) params.append("priceFrom", filters.price.from);
      if (filters.price.to) params.append("priceTo", filters.price.to);
      if (filters.category) params.append("category", filters.category);
      console.log(decodeURIComponent(params.toString()));
      // const res = await fetch(`/api/products?${decodeURIComponent(params.toString())}`);
      // const data = await res.json();
      const data = EXAMPLE_DATA; //sử dụng data mẫu
      setProducts(data);
    };

    fetchProducts();
  }, [filters]);
  
  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:p-8">
      <div className="flex-col space-y-4 mb-6">
        <CatalogBreadCrumb category={filters?.category} />
        <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl">Tất cả sản phẩm</h2>
        
        {/* Filter and Sort Button + Layout Switcher */}
        <div className=" lg:hidden flex items-center justify-between gap-3">
          {/* Filter and Sort Button - Only show on mobile/tablet */}
          <SidebarTrigger className="lg:hidden flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 
            bg-[#0A1E33] text-white rounded-lg 
            hover:bg-[#1a2e43] transition-colors
            font-medium text-sm sm:text-base
            min-h-[44px]">
            <FontAwesomeIcon icon={faFilter} className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Lọc Và Sắp Xếp</span>
          </SidebarTrigger>
          
          {/* Layout Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                viewMode === 'grid' 
                  ? 'bg-white text-[#0A1E33] shadow-sm' 
                  : 'text-gray-600 hover:text-[#0A1E33]'
              }`}
              aria-label="Grid view"
            >
              <FontAwesomeIcon icon={faTh} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                viewMode === 'list' 
                  ? 'bg-white text-[#0A1E33] shadow-sm' 
                  : 'text-gray-600 hover:text-[#0A1E33]'
              }`}
              aria-label="List view"
            >
              <FontAwesomeIcon icon={faBars} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid - 2 Columns */}
      <div className={`grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default CatalogList;
