import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import CatalogBreadCrumb from "./CatalogBreadCrumb";
import { Input } from "../ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export function CatalogSidebar({ filters, setFilters }) {
  const handleGenderChange = (index) => {
    setFilters((prev) => {
      const newGender = prev.gender.map((g, i) =>
        i === index ? { ...g, value: !g.value } : g
      );
      return { ...prev, gender: newGender };
    });
  };
  const handleBrandChange = (index) => {
    setFilters((prev) => {
      const newBrand = prev.brand.map((b, i) =>
        i === index ? { ...b, value: !b.value } : b
      );
      return { ...prev, brand: newBrand };
    });
  };
  const handleSizeChange = (index) => {
    setFilters((prev) => {
      const newSize = prev.size.map((s, i) =>
        i === index ? { ...s, value: !s.value } : s
      );
      return { ...prev, size: newSize };
    });
  };
  const handleColorChange = (index) => {
    setFilters((prev) => {
      const newColor = prev.color.map((c, i) =>
        i === index ? { ...c, value: !c.value } : c
      );
      return { ...prev, color: newColor };
    });
  };
  const handleFromPriceChange = (e) => {
    const newFromPrice = e.target.value;
    setFilters((prev) => ({
      ...prev,
      from: newFromPrice,
    }));
  }
  const handleToPriceChange = (e) => {
    const newToPrice = e.target.value;
    setFilters((prev) => ({
      ...prev,
      to: newToPrice,
    }));
  }
  return (
    <Sidebar className={"sticky"}>
      <SidebarHeader>
        <CatalogBreadCrumb category={filters?.category} />
      </SidebarHeader>
      <SidebarContent>
        <Separator />
        <Collapsible defaultOpen className="group/collapsible mb-2">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <p className="text-lg font-semibold">Đối tượng</p>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              {filters?.gender.map((item, index) => {
                return (
                  <div key={index}>
                    <label className="flex items-center p-2 gap-2 cursor-pointer">
                      <Input
                        type="checkbox"
                        checked={item.value}
                        onChange={() => handleGenderChange(index)}
                        className="w-5 h-5 accent-teal-600" // đặt teal thì mới ra được dấu tích trắng, 5BC0BE ra dấu tích đen :))
                      />
                      <p className="text-sm">{item.label}</p>
                    </label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel>
            <p className="text-lg font-semibold">Khoảng giá</p>
          </SidebarGroupLabel>
          <p className="text-sm px-2">Từ</p>
          <label className="text-sm flex items-center px-2"><Input value={filters.from} onChange={handleFromPriceChange}/>.000₫</label>
          <p className="text-sm px-2">Đến</p>
          <label className="text-sm flex items-center px-2"><Input value={filters.to} onChange={handleToPriceChange}/>.000₫</label>
        </SidebarGroup>
        <Separator />
        <Collapsible defaultOpen className="group/collapsible mb-2">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <p className="text-lg font-semibold">Thương hiệu</p>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              {filters?.brand.map((item, index) => {
                return (
                  <div key={index}>
                    <label className="flex items-center p-2 gap-2 cursor-pointer">
                      <Input
                        type="checkbox"
                        checked={item.value}
                        onChange={() => handleBrandChange(index)}
                        className="w-5 h-5 accent-teal-600" // đặt teal thì mới ra được dấu tích trắng, 5BC0BE ra dấu tích đen :))
                      />
                      <p className="text-sm">{item.label}</p>
                    </label>
                  </div>
                );
              })}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Separator />
        <Collapsible defaultOpen className="group/collapsible mb-2">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <p className="text-lg font-semibold">Kích cỡ</p>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <div className="flex flex-wrap">
                {filters?.size.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center p-2 gap-2 cursor-pointer"
                    >
                      <Button
                        className={`px-3 py-2 rounded-xl ${
                          item.value
                            ? "bg-teal-600 text-white"
                            : "bg-[#F0F0F0] text-gray-500"
                        }`}
                        onClick={() => handleSizeChange(index)}
                      >
                        <p className="text-sm">{item.label}</p>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Separator />
        <Collapsible defaultOpen className="group/collapsible mb-2">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <p className="text-lg font-semibold">Màu sắc</p>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-1">
                {filters?.color.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="col-span-1 flex h-full items-center space-y-2 cursor-pointer"
                    >
                      <Button
                        className={`w-full h-full flex flex-col items-center justify-center ${
                          item.value
                            ? "ring-2 ring-teal-500"
                            : "bg-white text-black"
                        }`}
                        onClick={() => handleColorChange(index)}
                      >
                        <div
                          className="rounded-full w-6 h-6 mx-auto border"
                          style={{
                            backgroundColor: item.color,
                          }}
                        />
                        <p className="text-xs text-center">{item.label}</p>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
