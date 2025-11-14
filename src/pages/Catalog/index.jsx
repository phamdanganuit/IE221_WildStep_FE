import CatalogList from "@/components/Catalog/CatalogList";
import { CatalogSidebar } from "@/components/Catalog/CatalogSideBar";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function CatalogLayout({ filters, setFilters, children }) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <CatalogSidebar filters={filters} setFilters={setFilters} />
        <main className="flex-1 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

// Helper function to initialize filters from URL params
const initializeFiltersFromParams = (filterParam, searchQuery) => {
  const baseFilters = {
    category: "", // Sản-phẩm-mới, Giảm-giá, Phụ-kiện
    search: searchQuery || "", // Từ khóa tìm kiếm
    gender: [
      { label: "Nam", value: false },
      { label: "Nữ", value: false },
      { label: "Unisex", value: false },
      { label: "Trẻ em", value: false },
    ],
    price: { from: "", to: "" },
    brand: [],  // Will be populated from API
    size: [],   // Will be populated from API
    color: [],  // Will be populated from API
  };

  if (!filterParam) {
    return baseFilters;
  }

  // Validate filter param
  if (!/^(Sản-phẩm-mới|Giảm-giá|Phụ-kiện|Nam|Nữ|Trẻ-em|Unisex)$/.test(filterParam)) {
    return baseFilters;
  }

  // Process filter param
  const updated = { ...baseFilters };

  switch (filterParam) {
    case "Nam":
      updated.gender = baseFilters.gender.map((g) => ({
        ...g,
        value: g.label === "Nam",
      }));
      break;
    case "Nữ":
      updated.gender = baseFilters.gender.map((g) => ({
        ...g,
        value: g.label === "Nữ",
      }));
      break;
    case "Unisex":
      updated.gender = baseFilters.gender.map((g) => ({
        ...g,
        value: g.label === "Unisex",
      }));
      break;
    case "Trẻ-em":
      updated.gender = baseFilters.gender.map((g) => ({
        ...g,
        value: g.label === "Trẻ em",
      }));
      break;
    default:
      updated.category = filterParam;
  }

  return updated;
};

function Catalog() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const searchQuery = searchParams.get("search");
  
  // Initialize filters from URL params immediately
  const [filters, setFilters] = useState(() => 
    initializeFiltersFromParams(filterParam, searchQuery)
  );

  useEffect(() => {
    // Only update if params changed
    const newFilters = initializeFiltersFromParams(filterParam, searchQuery);
    setFilters((prev) => {
      // Check if filters actually changed to avoid unnecessary updates
      if (
        prev.category === newFilters.category &&
        prev.search === newFilters.search &&
        JSON.stringify(prev.gender) === JSON.stringify(newFilters.gender)
      ) {
        return prev;
      }
      return newFilters;
    });
  }, [filterParam, searchQuery]);
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="relative z-50">
        <Header/>
      </div>
      <CatalogLayout filters={filters} setFilters={setFilters}>
        <CatalogList filters={filters} setFilters={setFilters} />
      </CatalogLayout>
    </div>
  );
}

export default Catalog;
