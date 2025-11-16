import React, { useState } from "react";

const ColorSelector = ({selectedColor, onColorChange, productColors, currentLang = 'vi'}) => {
  // Convert API format to component format
  // Backend API supports 2 formats:
  // Format 1: { name: "Đen", hex: "#000000", image: "..." }
  // Format 2: { color_name: {vi, en, ja}, hex_color: "#FFFFFF", image: "..." }
  const allColors = productColors && productColors.length > 0 
    ? productColors.map(color => {
        // Extract localized color name - support both formats
        let colorName = 'Unnamed';
        
        // Try color_name first (multilingual object)
        if (color.color_name) {
          if (typeof color.color_name === 'object') {
            colorName = color.color_name[currentLang] || color.color_name.vi || color.color_name.en || color.color_name.ja || 'Unnamed';
          } else {
            colorName = color.color_name;
          }
        } 
        // Fallback to name field (simple string)
        else if (color.name) {
          if (typeof color.name === 'object') {
            colorName = color.name[currentLang] || color.name.vi || color.name.en || color.name.ja || 'Unnamed';
          } else {
            colorName = color.name;
          }
        }
        
        return {
          name: colorName,
          hex: color.hex_color || color.hex || '#CCCCCC',
          image: color.image || ''
        };
      })
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
              <div
                className="w-full aspect-square rounded-lg bg-center bg-cover bg-no-repeat hover:opacity-80"
                style={{ backgroundImage: `url(${color.image})` }}
                title={color.name}
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
