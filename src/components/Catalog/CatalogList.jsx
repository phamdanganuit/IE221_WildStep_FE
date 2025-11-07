import React, { useEffect, useState } from "react";
import CatalogBreadCrumb from "./CatalogBreadCrumb";

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
  return (
    <div
      onClick={() => navigateToProductDetail(product._id)}
      title={product?.name}
      className={`group relative flex flex-col bg-[D9D9D9]/15 rounded-xl border-[1.5px] border-[#DEDEDE] overflow-hidden
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-2
        md:min-w-0 cursor-pointer`}
    >
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden bg-transparent">
        <img
          src={product?.images[0]}
          alt={product?.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex items-center justify-between bg-[D9D9D9]/15">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm md:text-base text-color3">
            {product?.brandId?.name}
          </p>
          <h3 className="font-semibold text-base md:text-lg xl:text-xl text-color1 max-w-full truncate">
            {product?.name}
          </h3>
          <p className="flex items-center gap-2 text-sm md:text-base">
            {product?.color?.length} màu - {product?.size?.length} kích cỡ
          </p>
          {product?.discount > 0 ? (
            <p className="font-semibold text-base md:text-lg text-red-600">
              {formatPrice(((100 - product?.discount) * product?.originalPrice) / 100)}
              <span className="text-gray-400 text-sm font-medium line-through ml-2">
                {formatPrice(product?.originalPrice)}
              </span>{" "}
            </p>
          ) : (
            <p className="font-semibold text-base md:text-lg text-red-600">
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
    <div className="flex flex-col w-full">
      <div className="mx-4 flex-col space-y-4">
        <CatalogBreadCrumb category={filters?.category} />
        <h2 className="font-semibold text-xl">Tất cả sản phẩm</h2>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-3">
        {products.map((product) => (
          <div key={product._id} className="col-span-1 p-2">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogList;
