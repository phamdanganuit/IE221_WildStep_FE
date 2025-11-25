import { useEffect, useState } from "react";
import { getVouchers, createVoucher, updateVoucher, deleteVoucher, getCategories } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Ticket, ChevronDown, Check, ShoppingBag, Truck } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";

const Vouchers = () => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDialog, setFormDialog] = useState({ open: false, voucher: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, voucher: null });
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    discount: "",
    min_value: "",
    start_date: "",
    expired_date: "",
    categories: [],
  });

  useEffect(() => {
    fetchVouchers();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const result = await getCategories();
    if (result.success) {
      const payload = result.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.categories)
            ? payload.categories
            : [];
      setCategories(list);
      // Flatten child categories for selection
      const flattened = [];
      list.forEach((parent) => {
        if (Array.isArray(parent.children) && parent.children.length > 0) {
          parent.children.forEach((child) => {
            const parentName = safeText(parent.name, i18n.language, 'N/A');
            const childName = safeText(child.name, i18n.language, 'N/A');
            flattened.push({ 
              id: child.id || child._id, 
              name: `${parentName} / ${childName}` 
            });
          });
        }
      });
      setCategoryOptions(flattened);
    }
  };

  const fetchVouchers = async () => {
    setLoading(true);
    const result = await getVouchers();

    if (result.success) {
      const payload = result.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.vouchers)
            ? payload.vouchers
            : [];
      setVouchers(list);
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải danh sách vouchers",
      });
    }
    setLoading(false);
  };

  const handleOpenForm = (voucher = null) => {
    if (voucher) {
      // Format dates for input (YYYY-MM-DDTHH:mm)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        name: voucher.name || "",
        code: voucher.code || "",
        description: voucher.description || "",
        discount: voucher.discount?.toString() || "",
        min_value: voucher.min_value?.toString() || "",
        start_date: formatDateForInput(voucher.start_date || voucher.start),
        expired_date: formatDateForInput(voucher.expired_date || voucher.expired),
        categories: Array.isArray(voucher.categories) 
          ? voucher.categories.map(cat => cat._id || cat.id || cat)
          : [],
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        discount: "",
        min_value: "",
        start_date: "",
        expired_date: "",
        categories: [],
      });
    }
    setFormDialog({ open: true, voucher });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.code || !formData.discount) {
      addToast({
        type: "error",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      return;
    }

    if (!formData.start_date || !formData.expired_date) {
      addToast({
        type: "error",
        message: "Vui lòng chọn ngày bắt đầu và ngày hết hạn",
      });
      return;
    }

    const startDate = new Date(formData.start_date);
    const expiredDate = new Date(formData.expired_date);
    
    if (expiredDate <= startDate) {
      addToast({
        type: "error",
        message: "Ngày hết hạn phải sau ngày bắt đầu",
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim() || "",
      discount: parseFloat(formData.discount),
      min_value: formData.min_value ? parseFloat(formData.min_value) : 0,
      start_date: new Date(formData.start_date).toISOString(),
      expired_date: new Date(formData.expired_date).toISOString(),
      categories: formData.categories || [],
    };

    const result = formDialog.voucher
      ? await updateVoucher(formDialog.voucher._id || formDialog.voucher.id, payload)
      : await createVoucher(payload);

    if (result.success) {
      addToast({
        type: "success",
        message: formDialog.voucher ? "Cập nhật voucher thành công!" : "Tạo voucher thành công!",
      });
      fetchVouchers();
      setFormDialog({ open: false, voucher: null });
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể lưu voucher",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.voucher) return;

    const result = await deleteVoucher(deleteDialog.voucher._id || deleteDialog.voucher.id);

    if (result.success) {
      addToast({
        type: "success",
        message: "Xóa voucher thành công!",
      });
      fetchVouchers();
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể xóa voucher",
      });
    }

    setDeleteDialog({ open: false, voucher: null });
  };

  const getStatusBadge = (voucher) => {
    const now = new Date();
    const start = new Date(voucher.start_date || voucher.start);
    const expired = new Date(voucher.expired_date || voucher.expired);

    if (now < start) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          Sắp diễn ra
        </span>
      );
    }
    if (now > expired) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          Đã hết hạn
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Đang hoạt động
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDiscount = (discount) => {
    if (discount < 1) {
      return `${(discount * 100).toFixed(0)}%`;
    }
    return `${discount.toLocaleString("vi-VN")}đ`;
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const currentCategories = prev.categories || [];
      if (currentCategories.includes(categoryId)) {
        return {
          ...prev,
          categories: currentCategories.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prev,
          categories: [...currentCategories, categoryId],
        };
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Vouchers</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý mã giảm giá</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm voucher mới
        </Button>
      </div>

      {/* Vouchers List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Vouchers ({vouchers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có voucher nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(vouchers) && vouchers.map((voucher) => {
                // Kiểm tra voucher vận chuyển: categories rỗng hoặc không có
                const isShippingVoucher = !voucher?.categories?.length;
                return (
                <div key={voucher._id || voucher.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${isShippingVoucher ? 'bg-color3/10' : 'bg-color4/10'}`}>
                        {isShippingVoucher ? (
                          <Truck className="w-6 h-6 text-color3" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-color4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{voucher.name}</p>
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {voucher.code}
                          </span>
                        </div>
                        {voucher.description && (
                          <p className="text-sm text-gray-600 mb-2">{voucher.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>Giảm: <strong className="text-color4">{formatDiscount(voucher.discount)}</strong></span>
                          {voucher.min_value > 0 && (
                            <span>Đơn tối thiểu: <strong>{voucher.min_value.toLocaleString("vi-VN")}đ</strong></span>
                          )}
                          <span>
                            {voucher.categories?.length > 0 
                              ? `Áp dụng cho ${voucher.categories.length} danh mục`
                              : "Voucher vận chuyển"
                            }
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Từ {formatDate(voucher.start_date || voucher.start)} đến {formatDate(voucher.expired_date || voucher.expired)}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(voucher)}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenForm(voucher)}
                      className="px-3"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteDialog({ open: true, voucher })}
                      className="px-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, voucher: null })}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {formDialog.voucher ? "Sửa voucher" : "Thêm voucher mới"}
              </DialogTitle>
              <DialogDescription>
                {formDialog.voucher 
                  ? "Cập nhật thông tin voucher của bạn." 
                  : "Điền thông tin để tạo voucher mới."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              {/* Row 1: Tên và Mã voucher */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên voucher <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Giảm 29.900đ cho đơn hàng đầu tiên"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã voucher <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="VD: WILDSTEPWELCOME"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Mã sẽ tự động chuyển thành chữ hoa</p>
                </div>
              </div>

              {/* Row 2: Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về voucher"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  rows={2}
                />
              </div>

              {/* Row 3: Giảm giá và Giá trị đơn hàng tối thiểu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giảm giá <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="VD: 29900 hoặc 0.1 (10%)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Số tiền cố định (đồng) hoặc phần trăm (0.1 = 10%)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá trị đơn hàng tối thiểu
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.min_value}
                    onChange={(e) => setFormData({ ...formData, min_value: e.target.value })}
                    placeholder="VD: 300000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Để trống hoặc 0 = không giới hạn</p>
                </div>
              </div>

              {/* Row 4: Ngày bắt đầu và Ngày hết hạn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.expired_date}
                    onChange={(e) => setFormData({ ...formData, expired_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Row 5: Danh mục áp dụng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục áp dụng
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Chọn danh mục để voucher áp dụng. Để trống = voucher vận chuyển
                </p>
                <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between text-left font-normal"
                    >
                      <span className="truncate">
                        {formData.categories?.length > 0
                          ? `Đã chọn ${formData.categories.length} danh mục`
                          : "Chọn danh mục áp dụng"}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-60 overflow-y-auto">
                      {categories.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Đang tải danh mục...
                        </div>
                      ) : (
                        <div className="p-2">
                          {categories.map((parent) => {
                            if (!Array.isArray(parent.children) || parent.children.length === 0) {
                              return null;
                            }
                            const parentName = safeText(parent.name, i18n.language, 'N/A');
                            return (
                              <div key={parent._id || parent.id} className="mb-3 last:mb-0">
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded mb-1">
                                  {parentName}
                                </div>
                                <div className="ml-2 space-y-0.5">
                                  {parent.children.map((child) => {
                                    const childId = child.id || child._id;
                                    const childName = safeText(child.name, i18n.language, 'N/A');
                                    const isSelected = formData.categories?.includes(childId);
                                    return (
                                      <label
                                        key={childId}
                                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCategoryChange(childId);
                                        }}
                                      >
                                        <div className="flex items-center justify-center w-4 h-4 border-2 rounded border-gray-300 bg-white">
                                          {isSelected && (
                                            <Check className="h-3 w-3 text-color4" />
                                          )}
                                        </div>
                                        <span className="text-sm flex-1">{childName}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {formData.categories?.length > 0 && (
                      <div className="border-t p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-red-500 hover:text-red-600"
                          onClick={() => {
                            setFormData({ ...formData, categories: [] });
                          }}
                        >
                          Xóa tất cả
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                {formData.categories?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.categories.map((catId) => {
                      // Tìm category từ cấu trúc phân cấp
                      let foundCat = null;
                      for (const parent of categories) {
                        if (Array.isArray(parent.children)) {
                          const child = parent.children.find(
                            (c) => (c.id || c._id) === catId
                          );
                          if (child) {
                            const parentName = safeText(parent.name, i18n.language, 'N/A');
                            const childName = safeText(child.name, i18n.language, 'N/A');
                            foundCat = { name: `${parentName} / ${childName}` };
                            break;
                          }
                        }
                      }
                      return foundCat ? (
                        <span
                          key={catId}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-color4/10 text-color4 rounded-md"
                        >
                          {foundCat.name}
                          <button
                            type="button"
                            onClick={() => handleCategoryChange(catId)}
                            className="hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialog({ open: false, voucher: null })}
              >
                Hủy
              </Button>
              <Button type="submit">
                {formDialog.voucher ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, voucher: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa voucher "{deleteDialog.voucher?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, voucher: null })}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vouchers;

