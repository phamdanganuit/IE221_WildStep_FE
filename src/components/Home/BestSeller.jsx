import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";
import newLabel from "@/assets/new_label.svg";
import shoe_1 from "@/assets/shoes/shoe_1.png";
import shoe_2 from "@/assets/shoes/shoe_2.png";
import shoe_3 from "@/assets/shoes/shoe_3.png";
import shoe_4 from "@/assets/shoes/shoe_4.png";
import shoe_5 from "@/assets/shoes/shoe_5.png";
import shoe_6 from "@/assets/shoes/shoe_6.png";

const categories = ["Nam", "Nữ", "Unisex", "Trẻ Em", "Phụ Kiện Thể Thao"];

const products = [
  {
    id: 1,
    name: "WildStep formal sneaker shoe",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_1,
    category: "Nam",
  },
  {
    id: 2,
    name: "WildStep formal sneaker shoe",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_2,
    category: "Nam",
  },
  {
    id: 3,
    name: "WildStep sneaker",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_3,
    category: "Nam",
  },
  {
    id: 4,
    name: "WildStep formal sneaker shoe",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_4,
    category: "Nam",
  },
  {
    id: 5,
    name: "WildStep trendy sneaker shoe",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_5,
    category: "Nam",
  },
  {
    id: 6,
    name: "Slick formal sneaker shoe",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_6,
    category: "Nam",
  },
  {
    id: 6,
    name: "Slick formal sneaker shoe",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_6,
    category: "Nữ",
  },
  {
    id: 6,
    name: "Slick formal sneaker shoe",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_5,
    category: "Trẻ Em",
  },
  {
    id: 6,
    name: "Slick formal sneaker shoe",
    price: "₫ 3.999.000",
    oldPrice: "₫ 4999.00",
    image: shoe_4,
    category: "Phụ Kiện Thể Thao",
  },
];

export default function BestSellers() {
  const [activeCategory, setActiveCategory] = useState("Nam");
  const [favorites, setFavorites] = useState([]); // lưu danh sách sản phẩm được yêu thích

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  return (
    <section className="w-full px-10 md:px-20 mt-12 md:mt-20 bg-transparent">
      {/* Tiêu đề */}
      <div className="text-center mb-10">
        <h2 className="text-[#0A1E33] flex items-center justify-center gap-5">
          <span className="font-semibold text-[2rem]">—</span>
          <span className="text-[2.5rem] font-semibold">BÁN CHẠY NHẤT</span>
          <span className="font-semibold text-[2rem]">—</span>
        </h2>

        {/* Bộ lọc danh mục */}
        <div className="flex flex-wrap justify-center gap-5 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded border-[1.5px] border-color1 text-[1rem] md:text-[1.5rem] font-medium cursor-pointer transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-color1 text-white"
                  : "bg-white text-[#0A1E33] hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
        {products
          .filter((item) => item.category === activeCategory)
          .map((item) => (
            <div
              key={item.id}
              className="relative group border-2 border-[#DEDEDE] rounded-2xl overflow-hidden hover:shadow-sm hover:-translate-y-1 transition-all duration-300"
            >
              {/* Badge New */}
              <img
                src={newLabel}
                alt="New Badge"
                className="absolute top-5 left-0 w-[3.125rem]"
                style={{
                  filter: "drop-shadow(8px 7px 10px rgba(0,0,0,0.25))",
                }}
              />

              {/* Nút yêu thích */}
              <button
                onClick={() => toggleFavorite(item.id)}
                className="cursor-pointer absolute top-5 right-3 w-8 h-8 flex items-center justify-center hover:scale-110 transition"
              >
                {favorites.includes(item.id) ? (
                  <GoHeartFill
                    className="text-red-500 transition-transform duration-300 scale-110"
                    size={24}
                  />
                ) : (
                  <GoHeart
                    className="text-[#0A1E33] hover:text-red-400 transition"
                    size={24}
                  />
                )}
              </button>

              {/* Ảnh sản phẩm */}
              {/* <div className="w-full flex mt-10 justify-center items-center transition overflow-hidden bg-transparent">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-w-full h-[16rem] flip- object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div> */}

              <div className="w-full flex mt-10 justify-center items-center overflow-hidden bg-transparent perspective">
                <div className="relative w-full h-[16rem] preserve-3d transition-transform duration-700 ease-in-out group-hover:rotate-y-180">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover backface-hidden rounded-2xl"
                  />

                  <img
                    src={item.image}
                    alt={`${item.name} back`}
                    className="absolute inset-0 w-full h-full object-cover backface-hidden rotate-y-180 rounded-2xl"
                  />
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="pl-6 pr-3 pt-3 pb-2 flex justify-between items-center">
                <div className="flex flex-col gap-2 mb-2">
                  <h3 className="self-stretch h-7 justify-start text-[#0B132B] text-[1.25rem] leading-7 font-medium ">
                    {item.name}
                  </h3>

                  <p className="text-[#0A1E33] font-semibold text-[1.25rem]">
                    {item.price}
                    <span className="text-gray-400 text-[1rem] font-medium line-through ml-2">
                      {item.oldPrice}
                    </span>
                  </p>
                </div>
                <button className="flex items-center justify-center transition cursor-pointer">
                  <img
                    src="/icon/arrow.svg"
                    alt="Arrow Right"
                    className="hover:scale-105 w-[3.125rem] h-[3.125rem]"
                  />
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
