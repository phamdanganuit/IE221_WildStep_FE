import React, { useState } from "react";

const ColorSelector = ({selectedColor, onColorChange}) => {
  const allColors = [
    {
      name: "White/Aluminium",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/9e9a4fb89253ba6b71a6a916cbaea0494ab62786?placeholderIfAbsent=true",
    },
    {
      name: "Black/Red",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/5fb2e02ded02c23615d9847a8476843ca4d9ac04?placeholderIfAbsent=true",
    },
    {
      name: "Blue/White",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/c66603612540446a2c329839d49a7427bee9a7be?placeholderIfAbsent=true",
    },
    {
      name: "Green/Black",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/aeaeb1cc7017f4106f2f3d30d78fbce9743f087d?placeholderIfAbsent=true",
    },
    {
      name: "Red/White",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/fd0ea65bd6882d5ef38b49c06b7ee5ee1e758bad?placeholderIfAbsent=true",
    },
    {
      name: "Purple/White",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/da6bfd695eca5d56ed456d0a247af198f5e50241?placeholderIfAbsent=true",
    },
    {
      name: "Orange/Black",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/bec2347fa81908d9782e98e5adb33af1f693d0c0?placeholderIfAbsent=true",
    },
    {
      name: "Pink/White",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/2252e39042080219f8a36235f5102fb0e6fc2f97?placeholderIfAbsent=true",
    },
    {
      name: "Yellow/Black",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/4e516a4496931b4622107a5053f31490ed2eba86?placeholderIfAbsent=true",
    },
    {
      name: "Gray/White",
      image:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/8013a1e4ef902e1a6b9597eef4e106044d8ec4c2?placeholderIfAbsent=true",
    },
  ];

  return (
    <div>
      <h3 className="self-start mt-5 text-xl font-semibold leading-tight text-neutral-400">
        <span className="font-medium">Màu sắc: </span>
        <span className="text-neutral-900">
          {selectedColor}
        </span>
      </h3>

      <div className="grid grid-cols-5 gap-5 mt-4">
        {allColors.map((color, index) => (
          <button
            key={index}
            onClick={() => onColorChange(color.name)}
            className={`rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C2541] ${
              selectedColor === color.name ? "ring-2 ring-[#1C2541]" : ""
            }`}
            role="radio"
            aria-checked={selectedColor === color.name}
            aria-label={`Select color ${color.name}`}
            tabIndex={selectedColor === color.name ? 0 : -1}
          >
            <img
              src={color.image}
              alt={color.name}
              className="object-contain w-full rounded-lg aspect-square hover:opacity-80"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
