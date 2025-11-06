import { useEffect, useRef, useState } from "react";
import { getBrands, createBrand, updateBrand, deleteBrand, uploadBrandLogo } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Award, Upload } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Brands = () => {
  const { addToast } = useToast();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDialog, setFormDialog] = useState({ open: false, brand: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, brand: null });
  const [uploading, setUploading] = useState({});
  const fileInputsRef = useRef({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    country: "",
    status: "active",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    const result = await getBrands();

    if (result.success) {
      const payload = result.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.brands)
          ? payload.brands
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
      setBrands(list);
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải danh sách thương hiệu",
      });
    }
    setLoading(false);
  };

  const handleOpenForm = (brand = null) => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        description: brand.description || "",
        website: brand.website || "",
        country: brand.country || "",
        status: brand.status || "active",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        website: "",
        country: "",
        status: "active",
      });
    }
    setFormDialog({ open: true, brand });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      addToast({
        type: "error",
        message: "Vui lòng nhập tên thương hiệu",
      });
      return;
    }

    const result = formDialog.brand
      ? await updateBrand(formDialog.brand._id || formDialog.brand.id, formData)
      : await createBrand(formData);

    if (result.success) {
      addToast({
        type: "success",
        message: formDialog.brand ? "Cập nhật thương hiệu thành công" : "Tạo thương hiệu thành công",
      });
      fetchBrands();
      setFormDialog({ open: false, brand: null });
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể lưu thương hiệu",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.brand) return;

    const result = await deleteBrand(deleteDialog.brand._id || deleteDialog.brand.id);

    if (result.success) {
      addToast({
        type: "success",
        message: "Xóa thương hiệu thành công",
      });
      fetchBrands();
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể xóa thương hiệu",
      });
    }

    setDeleteDialog({ open: false, brand: null });
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        Không hoạt động
      </span>
    );
  };

  const getBrandLogoUrl = (brand) => {
    return brand.logo || brand.logoUrl || brand.image || brand.icon || "";
  };

  const handleTriggerUpload = (brand) => {
    const id = brand._id || brand.id;
    if (fileInputsRef.current[id]) fileInputsRef.current[id].click();
  };

  const handleUploadLogo = async (brand, e) => {
    const id = brand._id || brand.id;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((prev) => ({ ...prev, [id]: true }));
    const res = await uploadBrandLogo(id, file);
    if (res.success) {
      addToast({ type: "success", message: "Tải logo thành công" });
      fetchBrands();
    } else {
      addToast({ type: "error", message: res.error || "Tải logo thất bại" });
    }
    setUploading((prev) => ({ ...prev, [id]: false }));
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thương hiệu</h1>
          <p className="text-gray-600 mt-1">Quản lý thương hiệu sản phẩm</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm thương hiệu
        </Button>
      </div>

      {/* Brands List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thương hiệu ({brands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có thương hiệu nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(brands) && brands.map((brand) => (
                <div key={brand._id || brand.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getBrandLogoUrl(brand) ? (
                        <img
                          src={getBrandLogoUrl(brand)}
                          alt={brand.name}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="p-2 bg-color4/10 rounded-lg">
                          <Award className="w-6 h-6 text-color4" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{brand.name}</p>
                        {brand.country && (
                          <p className="text-sm text-gray-500">{brand.country}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(brand.status)}
                  </div>

                  {brand.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{brand.description}</p>
                  )}

                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-color4 hover:underline block mb-3"
                    >
                      {brand.website}
                    </a>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenForm(brand)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteDialog({ open: true, brand })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileInputsRef.current[brand._id || brand.id] = el)}
                      onChange={(e) => handleUploadLogo(brand, e)}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleTriggerUpload(brand)}
                      disabled={!!uploading[brand._id || brand.id]}
                      className="cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading[brand._id || brand.id] ? "Đang tải..." : "Tải logo"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, brand: null })}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {formDialog.brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên thương hiệu <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nike"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả thương hiệu..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.nike.com"
                  type="url"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quốc gia</label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="USA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialog({ open: false, brand: null })}
              >
                Hủy
              </Button>
              <Button type="submit">
                {formDialog.brand ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, brand: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa thương hiệu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thương hiệu <strong>{deleteDialog.brand?.name}</strong>?
              Lưu ý: Không thể xóa nếu có sản phẩm đang sử dụng thương hiệu này.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, brand: null })}>
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

export default Brands;

