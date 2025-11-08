import React from "react";
import { FaStar } from "react-icons/fa";

const RelatedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Jumpman MVP",
      price: "3,879,199₫",
      category: "Giày nam",
      rating: "4,8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/585f54a7363232147bec14854065f0b3414e2dee?placeholderIfAbsent=true",
    },
    {
      id: 2,
      name: "Nike Air Max 90",
      price: "3,519,000₫",
      category: "Giày nam",
      rating: "4,8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/5964064352f25dca0271368b122d60e2375aeb24?placeholderIfAbsent=true",
    },
    {
      id: 3,
      name: "Nike JAM",
      price: "2,815,199₫",
      category: "Giày nữ",
      rating: "4,8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/ad54876821ee9468268164618e83dfabbbefc060?placeholderIfAbsent=true",
    },
    {
      id: 4,
      name: "Nike Air Max Plus",
      price: "4,699,000₫",
      category: "Giày nam",
      rating: "4,8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/e0f589640a067894f8b20c85c587a705d673d7ba?placeholderIfAbsent=true",
    },
    {
      id: 5,
      name: "Nike Air More Uptempo Low",
      price: "4,699,000₫",
      category: "Giày nam",
      rating: "4,8",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/66d87b6f15a446dbdaa882ab91d3ff1d17c0be78?placeholderIfAbsent=true",
    },
  ];

  return (
    <section className="flex max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-full max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:mt-9 max-md:max-w-full">
            <h2 className="self-start text-3xl font-bold leading-tight text-slate-900">
              Sản phẩm liên quan
            </h2>

            <div className="flex mt-10 max-md:max-w-full">
              <div className="grid grid-cols-5 gap-10 max-md:flex-col">
                {products.slice(0, 5).map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col gap-3 max-md:ml-0 max-md:w-full"
                  >
                    <div className="flex flex-col grow items-start max-md:mt-8">
                      <div className="self-stretch rounded-lg bg-zinc-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-contain aspect-[0.75] w-[220px] hover:opacity-80 transition-opacity"
                        />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold tracking-normal leading-snug w-full max-w-[220px] text-zinc-800 truncate">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 text-xl font-semibold tracking-normal leading-snug text-right text-neutral-900">
                        {product.price}
                      </p>
                    </div>
                    <div className="flex justify-between items-center w-full text-[1rem]">
                      <span className="leading-tight text-[#7A7A7A]">
                        {product.category}
                      </span>
                      <div className="flex">
                        <FaStar className="mx-2 mt-1 text-[#FFA439]" />
                        <span className="leading-relaxed self-stretch text-neutral-950">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
