import CatalogList from "@/components/Catalog/CatalogList";
import { CatalogSidebar } from "@/components/Catalog/CatalogSideBar";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function CatalogLayout({ filters, setFilters, children }) {
  return (
    <SidebarProvider>
      <CatalogSidebar filters={filters} setFilters={setFilters} />
      <main>
        {children}
      </main>
    </SidebarProvider>
  );
}

function Catalog() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const [filters, setFilters] = useState({
    category: "", // Sản-phẩm-mới, Giảm-giá, Phụ-kiện
    gender: [
      { label: "Nam", value: false },
      { label: "Nữ", value: false },
      { label: "Unisex", value: false },
      { label: "Trẻ em", value: false },
    ],
    price: { from: "", to: "" },
    brand: [
      { label: "Nike", value: false },
      { label: "Adidas", value: false },
      { label: "Puma", value: false },
      { label: "New Balance", value: false },
      { label: "Converse", value: false },
      { label: "Fila", value: false },
      { label: "Vans", value: false },
      { label: "MLB", value: false },
    ],
    size: [
      { label: "XX-Small", value: false },
      { label: "X-Small", value: false },
      { label: "Small", value: false },
      { label: "Medium", value: false },
      { label: "Large", value: false },
      { label: "X-Large", value: false },
      { label: "XX-Large", value: false },
      { label: "3X-Large", value: false },
      { label: "4X-Large", value: false },
    ],
    color: [
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
    ],
  });
  useEffect(() => {
    if (!filterParam) return;
    if (!/^(Sản-phẩm-mới|Giảm-giá|Phụ-kiện|Nam|Nữ|Trẻ-em|Unisex)$/.test(filterParam)) {
      searchParams.delete("filter");
      window.location.href = "/products"
    }
    setFilters((prev) => {
      const updated = { ...prev };

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
      return updated;
    });
  }, [filterParam]);
  return (
    <div className="w-full min-h-screen">
      <Header/>
      <CatalogLayout filters={filters} setFilters={setFilters}>
      <CatalogList filters={filters} />
      </CatalogLayout>
    </div>
  );
}

export default Catalog;
