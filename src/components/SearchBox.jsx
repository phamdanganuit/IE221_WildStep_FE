import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProductAutocomplete } from "@/service/contentService";

const SearchBox = ({ className = "", isMobile = false, onClose }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch autocomplete suggestions with debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const result = await getProductAutocomplete(searchQuery, 5);
        if (result.success && result.data?.suggestions) {
          setSuggestions(result.data.suggestions);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowDropdown(false);
    setSearchQuery("");
    navigate(suggestion.url);
    if (onClose) onClose();
  };

  const handleSeeAll = () => {
    setShowDropdown(false);
    const query = searchQuery;
    setSearchQuery("");
    navigate(`/products?search=${encodeURIComponent(query)}`);
    if (onClose) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSeeAll();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="flex items-center bg-white rounded-[1.5rem] px-3 py-2 text-[#0A1E33]">
        <img
          src="/icon/material-symbols_search-rounded.svg"
          alt="Search"
          className="w-5 h-5 mr-1"
        />
        <input
          type="text"
          placeholder={t("header.search")}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`bg-transparent outline-none text-base px-2 ${
            isMobile ? "w-full" : "w-32"
          }`}
        />
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[800px] overflow-y-auto w-[400px] min-w-[400px]">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-color1 mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {/* Suggestions List */}
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.id}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                >
                  {suggestion.type === "product" ? (
                    // Product Suggestion
                    <div className="flex items-center gap-3">
                      <img
                        src={suggestion.image}
                        alt={suggestion.text}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {suggestion.discount > 0 ? (
                            <>
                              <span className="text-sm font-semibold text-color1">
                                {formatPrice(suggestion.discountPrice)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(suggestion.price)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                -{suggestion.discount}%
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(suggestion.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Brand Suggestion
                    <div className="flex items-center gap-3">
                      <img
                        src={suggestion.logo}
                        alt={suggestion.text}
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {suggestion.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("search.brand") || "Brand"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* See All Button */}
              <div
                onClick={handleSeeAll}
                className="p-3 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer border-t border-gray-200 transition"
              >
                <span className="text-sm font-medium text-color1">
                  {t("search.seeAll") || "See all results"} →
                </span>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              {t("search.noResults") || "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;

