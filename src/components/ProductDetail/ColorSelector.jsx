import React, { useState } from "react";

const ColorSelector = ({selectedColor, onColorChange, productColors, currentLang = 'vi'}) => {
  // Convert API format to component format
  // New API structure: specifications.colors = [{ name: "White/Aluminium", hex: "#FFFFFF", image: "..." }]
  const allColors = productColors && productColors.length > 0 
    ? productColors.map(color => ({
        name: color.name || 'Unnamed',
        hex: color.hex || '#CCCCCC',
        image: color.image || ''
      }))
    : [
        { name: "Chưa có màu", hex: "#CCCCCC", image: "" }
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
            className={`relative rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C2541] ${
              selectedColor === color.name ? "ring-2 ring-[#1C2541]" : ""
            }`}
            role="radio"
            aria-checked={selectedColor === color.name}
            aria-label={`Select color ${color.name}`}
            tabIndex={selectedColor === color.name ? 0 : -1}
          >
            {color.image ? (
              <img
                src={color.image}
                alt={color.name}
                className="object-contain w-full rounded-lg aspect-square hover:opacity-80"
              />
            ) : (
              // Fallback to color hex if no image is provided
              <div 
                className="w-full aspect-square rounded-lg border-2 border-gray-300 hover:opacity-80"
                style={{ backgroundColor: color.hex || '#CCCCCC' }}
                title={color.hex}
              />
            )}
            {/* Show color indicator if hex is provided */}
            {color.hex && (
              <div 
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color.hex }}
                title={color.hex}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
