import React, { useEffect, useState, useRef } from "react";
import CatalogBreadCrumb from "./CatalogBreadCrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh, faBars, faFilter } from "@fortawesome/free-solid-svg-icons";
import StarRating from "@/components/ProductDetail/StarRating";
import { getPublicProducts } from "@/service/contentService";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

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

function CatalogList({ filters, setFilters }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, page_size: 12, total: 0, total_pages: 1 });
  const [hasInitializedFilters, setHasInitializedFilters] = useState(false);
  
  // Use ref to prevent duplicate calls in Strict Mode
  const lastRequestParamsRef = useRef(null);
  
  // Get page and sort from URL
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentSort = searchParams.get("sort") || "popular";
  const categorySlug = searchParams.get("category_slug") || "";
  const brandFromUrl = searchParams.get("brand") || "";
  
  // Reset filters when URL params change (especially when brand/category_slug is removed)
  useEffect(() => {
    // If brand is not in URL but was selected in filters, reset it
    if (!brandFromUrl) {
      setFilters((prev) => {
        const hasSelectedBrand = prev.brand.some((b) => b.value);
        if (hasSelectedBrand) {
          return {
            ...prev,
            brand: prev.brand.map((b) => ({ ...b, value: false })),
          };
        }
        return prev;
      });
    }
    
    // If category_slug is not in URL but category filter exists, reset it
    if (!categorySlug) {
      setFilters((prev) => {
        if (prev.category) {
          return {
            ...prev,
            category: "",
          };
        }
        return prev;
      });
    }
  }, [brandFromUrl, categorySlug]);
  
  // Create filter query params (dependencies for API call)
  // Use URL params if available, otherwise use filters state (but only if URL doesn't have brand)
  const selectedBrands = brandFromUrl || filters.brand.filter((b) => b.value).map((b) => b.label).join(",");
  const selectedGenders = filters.gender.filter((g) => g.value).map((g) => g.label).join(",");
  const selectedColors = filters.color.filter((c) => c.value).map((c) => c.label).join(",");
  const selectedSizes = filters.size.filter((s) => s.value).map((s) => s.label).join(",");
  const priceFrom = filters.price.from;
  const priceTo = filters.price.to;
  const searchQuery = filters.search;
  const category = filters.category;
  
  useEffect(() => {
    // Create request params string for comparison
    const requestParamsKey = JSON.stringify({
      search: searchQuery || "",
      brand: selectedBrands || "",
      gender: selectedGenders || "",
      color: selectedColors || "",
      size: selectedSizes || "",
      priceFrom: priceFrom || "",
      priceTo: priceTo || "",
      category: category || "",
      category_slug: categorySlug || "",
      sort: currentSort,
      page: currentPage,
    });
    
    // Check if this is a duplicate request (same params) - prevents Strict Mode double call
    if (lastRequestParamsRef.current === requestParamsKey) {
      return; // Skip duplicate request
    }
    
    // Mark this request as the last one
    lastRequestParamsRef.current = requestParamsKey;
    
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getPublicProducts({
          search: searchQuery || "",
          brand: selectedBrands || "",
          gender: selectedGenders || "",
          color: selectedColors || "",
          size: selectedSizes || "",
          priceFrom: priceFrom || "",
          priceTo: priceTo || "",
          category: category || "",
          category_slug: categorySlug || "",
          sort: currentSort,
          page: currentPage,
          page_size: 12,
        });

        // Only update state if this is still the latest request (prevent stale updates)
        if (lastRequestParamsRef.current !== requestParamsKey) {
          return;
        }

        if (result.success && result.data) {
          setProducts(result.data.data || []);
          setPagination(result.data.pagination || { page: 1, page_size: 12, total: 0, total_pages: 1 });
          
          // Only update filters on first load
          if (!hasInitializedFilters && result.data.filters) {
            updateFiltersFromAPI(result.data.filters);
            setHasInitializedFilters(true);
          }
        } else {
          setError(result.error || "Không thể tải danh sách sản phẩm");
          setProducts([]);
        }
      } catch (err) {
        // Only handle error if this is still the latest request
        if (lastRequestParamsRef.current !== requestParamsKey) {
          return;
        }
        console.error("Error fetching products:", err);
        setError("Có lỗi xảy ra khi tải sản phẩm");
        setProducts([]);
      } finally {
        // Always set loading to false if this is still the latest request
        if (lastRequestParamsRef.current === requestParamsKey) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [selectedBrands, selectedGenders, selectedColors, selectedSizes, priceFrom, priceTo, searchQuery, category, categorySlug, brandFromUrl, currentPage, currentSort, hasInitializedFilters]);

  // Update filters with API data while preserving user selections
  const updateFiltersFromAPI = (apiFilters) => {
    setFilters((prev) => {
      const updated = { ...prev };

      // Update brands - Always update, even if empty
      if (apiFilters.availableBrands) {
        // If brand is in URL, use it; otherwise clear selections (don't preserve)
        const brandsToSelect = brandFromUrl ? [brandFromUrl] : [];
        updated.brand = apiFilters.availableBrands.length > 0 
          ? apiFilters.availableBrands.map(brand => ({
              label: brand.name,
              value: brandsToSelect.includes(brand.name),
              count: brand.count || 0
            }))
          : []; // Empty array if no brands available
      } else if (prev.brand.length === 0) {
        // Fallback to default brands if API doesn't return filters
        updated.brand = [
          { label: "Nike", value: false },
          { label: "Adidas", value: false },
          { label: "Puma", value: false },
          { label: "New Balance", value: false },
          { label: "Converse", value: false },
          { label: "Fila", value: false },
          { label: "Vans", value: false },
          { label: "MLB", value: false },
        ];
      }

      // Update colors - Always update, even if empty
      if (apiFilters.availableColors) {
        const currentSelectedColors = prev.color.filter(c => c.value).map(c => c.label);
        updated.color = apiFilters.availableColors.length > 0
          ? apiFilters.availableColors.map(color => ({
              label: color.name,
              value: currentSelectedColors.includes(color.name),
              color: color.hex || "#000000",
              count: color.count || 0
            }))
          : [];
      } else if (prev.color.length === 0) {
        // Fallback to default colors if API doesn't return filters
        updated.color = [
          { label: "Đen", value: false, color: "#000000" },
          { label: "Xanh dương", value: false, color: "#2196F3" },
          { label: "Nâu", value: false, color: "#8B4513" },
          { label: "Xanh lá", value: false, color: "#4CAF50" },
          { label: "Xám", value: false, color: "#9E9E9E" },
          { label: "Cam", value: false, color: "#FF5722" },
          { label: "Hồng", value: false, color: "#E91E63" },
          { label: "Tím", value: false, color: "#9C27B0" },
          { label: "Đỏ", value: false, color: "#F44336" },
          { label: "Trắng", value: false, color: "#FFFFFF" },
          { label: "Vàng", value: false, color: "#FFEB3B" },
        ];
      }

      // Update sizes - Always update, even if empty
      if (apiFilters.availableSizes) {
        const currentSelectedSizes = prev.size.filter(s => s.value).map(s => s.label);
        updated.size = apiFilters.availableSizes.length > 0
          ? apiFilters.availableSizes.map(size => ({
              label: size.size,
              value: currentSelectedSizes.includes(size.size),
              count: size.count || 0
            }))
          : [];
      } else if (prev.size.length === 0) {
        // Fallback to default sizes if API doesn't return filters
        updated.size = [
          { label: "XX-Small", value: false },
          { label: "X-Small", value: false },
          { label: "Small", value: false },
          { label: "Medium", value: false },
          { label: "Large", value: false },
          { label: "X-Large", value: false },
          { label: "XX-Large", value: false },
          { label: "3X-Large", value: false },
          { label: "4X-Large", value: false },
        ];
      }

      return updated;
    });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    params.set("page", "1"); // Reset to page 1 when sorting
    setSearchParams(params);
  };
  
  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex-col space-y-4 mb-6">
        <CatalogBreadCrumb 
          category={filters?.category} 
          brandName={brandFromUrl || (filters.brand.find(b => b.value)?.label)}
          categoryName={categorySlug ? categorySlug.replace(/-/g, " ") : ""}
        />
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl">
            {filters?.search ? `Kết quả tìm kiếm: "${filters.search}"` : 'Tất cả sản phẩm'}
          </h2>
          
          {/* Sort Dropdown - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              Sắp xếp:
            </label>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color1 min-w-[180px]"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
              <option value="rating_desc">Đánh giá cao nhất</option>
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
            </select>
          </div>
        </div>
        
        {/* Mobile Controls */}
        <div className="lg:hidden flex flex-col gap-3">
          {/* Sort Dropdown - Mobile */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">
              Sắp xếp:
            </label>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-color1"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
              <option value="rating_desc">Đánh giá cao nhất</option>
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
            </select>
          </div>
          
          {/* Filter Button + Layout Switcher */}
          <div className="flex items-center justify-between gap-3">
            <SidebarTrigger className="flex items-center gap-2 px-4 py-2.5 bg-[#0A1E33] text-white rounded-lg hover:bg-[#1a2e43] transition-colors font-medium text-sm min-h-[44px]">
              <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
              <span>Lọc</span>
            </SidebarTrigger>
            
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  viewMode === 'grid' ? 'bg-white text-[#0A1E33] shadow-sm' : 'text-gray-600'
                }`}
              >
                <FontAwesomeIcon icon={faTh} className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  viewMode === 'list' ? 'bg-white text-[#0A1E33] shadow-sm' : 'text-gray-600'
                }`}
              >
                <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Count */}
        {!loading && !error && pagination.total > 0 && (
          <p className="text-sm text-gray-600">
            Hiển thị {(pagination.page - 1) * pagination.page_size + 1} - {Math.min(pagination.page * pagination.page_size, pagination.total)} của {pagination.total} sản phẩm
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color1 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
            <button
              onClick={() => window.location.href = '/products'}
              className="px-6 py-2 bg-color1 text-white rounded-lg hover:bg-opacity-90 transition"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className={`grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.total_pages}
              </p>
              
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition min-h-[44px]"
                >
                  Trước
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 border rounded-lg transition min-h-[44px] min-w-[44px] ${
                        pagination.page === pageNum
                          ? 'bg-color1 text-white border-color1'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.total_pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition min-h-[44px]"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CatalogList;
