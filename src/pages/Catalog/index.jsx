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

function Catalog() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const searchQuery = searchParams.get("search");
  const [filters, setFilters] = useState({
    category: "", // Sản-phẩm-mới, Giảm-giá, Phụ-kiện
    search: "", // Từ khóa tìm kiếm
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
  });
  useEffect(() => {
    if (!filterParam && !searchQuery) return;
    
    setFilters((prev) => {
      const updated = { ...prev };

      // Set search query
      updated.search = searchQuery || "";

      // Only process filter if exists
      if (filterParam) {
        if (!/^(Sản-phẩm-mới|Giảm-giá|Phụ-kiện|Nam|Nữ|Trẻ-em|Unisex)$/.test(filterParam)) {
          searchParams.delete("filter");
          window.location.href = "/products"
          return prev;
        }

        // Reset gender
        updated.gender = prev.gender.map((g) => ({ ...g, value: false }));

        switch (filterParam) {
          case "Nam":
            updated.gender = prev.gender.map((g) => ({
              ...g,
              value: g.label === "Nam",
            }));
            break;
          case "Nữ":
            updated.gender = prev.gender.map((g) => ({
              ...g,
              value: g.label === "Nữ",
            }));
            break;
          case "Unisex":
            updated.gender = prev.gender.map((g) => ({
              ...g,
              value: g.label === "Unisex",
            }));
            break;
          case "Trẻ-em":
            updated.gender = prev.gender.map((g) => ({
              ...g,
              value: g.label === "Trẻ em",
            }));
            break;
          default:
            updated.category = filterParam;
        }
      }
      return updated;
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
