import { useEffect, useRef, useState } from "react";
import {
  getAdminBanners,
  createAdminBanner,
  createAdminBannerForm,
  updateAdminBanner,
  deleteAdminBanner,
  uploadAdminBannerImage,
} from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/contexts/ToastContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image as ImageIcon, Plus, Edit, Trash2, Upload } from "lucide-react";

const emptyForm = {
  image: "",
  title: "",
  link: "",
  order: 0,
  status: "active",
};

export default function Banners() {
  const { addToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDialog, setFormDialog] = useState({ open: false, banner: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, banner: null });
  const [formData, setFormData] = useState(emptyForm);
  const fileInputRef = useRef(null);
  const uploadInputs = useRef({});

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const res = await getAdminBanners();
    if (res.success) {
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      setBanners(list);
    } else {
      addToast({ type: "error", message: res.error || "Không thể tải banner" });
    }
    setLoading(false);
  };

  const openCreate = () => {
    setFormData(emptyForm);
    setFormDialog({ open: true, banner: null });
  };

  const openEdit = (banner) => {
    setFormData({
      image: banner.image || "",
      title: banner.title || "",
      link: banner.link || "",
      order: banner.order ?? 0,
      status: banner.status || "active",
    });
    setFormDialog({ open: true, banner });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(formDialog.banner);
    let result;
    // If user selected a file in the top-level file input (create only)
    if (!isEdit && fileInputRef.current && fileInputRef.current.files?.[0]) {
      const file = fileInputRef.current.files[0];
      result = await createAdminBannerForm(file, {
        title: formData.title,
        link: formData.link,
        order: formData.order,
        status: formData.status,
      });
    } else if (isEdit) {
      result = await updateAdminBanner(formDialog.banner.id || formDialog.banner._id, {
        title: formData.title,
        link: formData.link,
        order: formData.order,
        status: formData.status,
        image: formData.image || undefined,
      });
    } else {
      // Create with image URL
      if (!formData.image) {
        addToast({ type: "error", message: "Vui lòng chọn ảnh hoặc nhập URL ảnh" });
        return;
      }
      result = await createAdminBanner({
        image: formData.image,
        title: formData.title,
        link: formData.link,
        order: formData.order,
        status: formData.status,
      });
    }

    if (result.success) {
      addToast({ type: "success", message: isEdit ? "Cập nhật banner thành công" : "Tạo banner thành công" });
      setFormDialog({ open: false, banner: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchBanners();
    } else {
      addToast({ type: "error", message: result.error || "Không thể lưu banner" });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.banner) return;
    const id = deleteDialog.banner.id || deleteDialog.banner._id;
    const res = await deleteAdminBanner(id);
    if (res.success) {
      addToast({ type: "success", message: "Xóa banner thành công" });
      setDeleteDialog({ open: false, banner: null });
      fetchBanners();
    } else {
      addToast({ type: "error", message: res.error || "Không thể xóa banner" });
    }
  };

  const triggerUpload = (id) => {
    if (!uploadInputs.current[id]) return;
    uploadInputs.current[id].click();
  };

  const onUploadFileChange = async (id, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await uploadAdminBannerImage(id, file);
    if (res.success) {
      addToast({ type: "success", message: "Cập nhật ảnh banner thành công" });
      fetchBanners();
    } else {
      addToast({ type: "error", message: res.error || "Tải ảnh thất bại" });
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-gray-600 mt-1">Tạo, sửa, sắp xếp và tải ảnh banner</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách banner ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Chưa có banner</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((b) => {
                const id = b.id || b._id;
                return (
                  <div key={id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-color4/10 rounded-lg">
                          <ImageIcon className="w-6 h-6 text-color4" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{b.title || "(Không tiêu đề)"}</p>
                          <p className="text-sm text-gray-500">Thứ tự: {b.order ?? 0} · Trạng thái: {b.status}</p>
                        </div>
                      </div>
                    </div>
                    {b.image && (
                      <img src={b.image} alt={b.title || id} className="w-full h-36 object-cover rounded-md mb-3" />
                    )}

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(b)} className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />Sửa
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteDialog({ open: true, banner: b })}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => (uploadInputs.current[id] = el)}
                        onChange={(e) => onUploadFileChange(id, e)}
                        className="hidden"
                      />
                      <Button size="sm" variant="secondary" onClick={() => triggerUpload(id)} className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />Tải ảnh
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ open, banner: null })}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{formDialog.banner ? "Chỉnh sửa banner" : "Thêm banner mới"}</DialogTitle>
              <DialogDescription>
                Có thể tạo bằng URL ảnh hoặc chọn file khi tạo mới.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!formDialog.banner && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ảnh (tạo mới)</label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="block w-full" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL ảnh</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://cdn.example.com/banner.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Summer Sale"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Liên kết</label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/sale"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormDialog({ open: false, banner: null })}>
                Hủy
              </Button>
              <Button type="submit">{formDialog.banner ? "Cập nhật" : "Tạo mới"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, banner: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa banner</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, banner: null })}>Hủy</Button>
            <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


