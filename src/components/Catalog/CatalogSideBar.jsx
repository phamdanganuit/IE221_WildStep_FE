import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Input } from "../ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";

export function CatalogSidebar({ filters, setFilters }) {
  const [from, setFrom] = useState(filters?.price?.from || "");
  const [to, setTo] = useState(filters?.price?.to || "");
  const { error } = useToast();
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
  const handleApplyPrice = () => {
    if (from > to) {
      error("Giá từ không được lớn hơn giá đến");
      return;
    }
    setFilters((prev) => ({
      ...prev,
      price: {
        from: from,
        to: to,
      },
    }));
  };
  return (
    <Sidebar className={"sticky"}>
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
          <label className="text-sm flex items-center px-2">
            <Input value={from} onChange={(e) => setFrom(e.target.value)} />₫
          </label>
          <p className="text-sm px-2">Đến</p>
          <label className="text-sm flex items-center px-2">
            <Input value={to} onChange={(e) => setTo(e.target.value)} />₫
          </label>
          <Button className={"mt-4"} onClick={handleApplyPrice}>Áp dụng</Button>
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
              {filters?.brand && filters?.brand.length > 0 ? (
                filters?.brand.map((item, index) => {
                  return (
                    <div key={index}>
                      <label className="flex items-center p-2 gap-2 cursor-pointer justify-between">
                        <div className="flex items-center gap-2">
                          <Input
                            type="checkbox"
                            checked={item.value}
                            onChange={() => handleBrandChange(index)}
                            className="w-5 h-5 accent-teal-600"
                          />
                          <p className="text-sm">{item.label}</p>
                        </div>
                        {item.count !== undefined && (
                          <span className="text-xs text-gray-400">({item.count})</span>
                        )}
                      </label>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 p-2">Không có dữ liệu</p>
              )}
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
                {filters?.size && filters?.size.length > 0 ? (
                  filters?.size.map((item, index) => {
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
                          <p className="text-sm">
                            {item.label}
                            {item.count !== undefined && ` (${item.count})`}
                          </p>
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 p-2">Không có dữ liệu</p>
                )}
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
                {filters?.color && filters?.color.length > 0 ? (
                  filters?.color.map((item, index) => {
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
                          <p className="text-xs text-center">
                            {item.label}
                            {item.count !== undefined && (
                              <span className="block text-gray-400">({item.count})</span>
                            )}
                          </p>
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 p-2 col-span-full">Không có dữ liệu</p>
                )}
              </div>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
