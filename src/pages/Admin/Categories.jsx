import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Categories = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDialog, setFormDialog] = useState({ open: false, category: null, parentId: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
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
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải danh sách danh mục",
      });
    }
    setLoading(false);
  };

  const handleOpenForm = (category = null, parentId = null) => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        status: category.status || "active",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: "active",
      });
    }
    setFormDialog({ open: true, category, parentId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      addToast({
        type: "error",
        message: "Vui lòng nhập tên danh mục",
      });
      return;
    }

    const submitData = {
      ...formData,
      type: formDialog.parentId ? "child" : "parent",
      ...(formDialog.parentId && { parentId: formDialog.parentId }),
    };

    const result = formDialog.category
      ? await updateCategory(formDialog.category._id || formDialog.category.id, submitData)
      : await createCategory(submitData);

    if (result.success) {
      addToast({
        type: "success",
        message: formDialog.category ? "Cập nhật danh mục thành công" : "Tạo danh mục thành công",
      });
      fetchCategories();
      setFormDialog({ open: false, category: null, parentId: null });
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể lưu danh mục",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.category) return;

    const result = await deleteCategory(deleteDialog.category._id || deleteDialog.category.id);

    if (result.success) {
      addToast({
        type: "success",
        message: "Xóa danh mục thành công",
      });
      fetchCategories();
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể xóa danh mục",
      });
    }

    setDeleteDialog({ open: false, category: null });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600 mt-1">Quản lý danh mục sản phẩm</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục cha
        </Button>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có danh mục nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(categories) && categories.map((parent) => (
                <div key={parent._id || parent.id} className="border rounded-lg p-4">
                  {/* Parent Category */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FolderTree className="w-5 h-5 text-color4" />
                      <div>
                        <p className="font-semibold text-gray-900">{parent.name}</p>
                        {parent.description && (
                          <p className="text-sm text-gray-500">{parent.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(parent.status)}
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleOpenForm(null, parent._id || parent.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleOpenForm(parent)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setDeleteDialog({ open: true, category: parent })}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Child Categories */}
                  {Array.isArray(parent.children) && parent.children.length > 0 && (
                    <div className="ml-8 space-y-2 pt-3 border-t">
                      {parent.children.map((child) => (
                        <div
                          key={child._id || child.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{child.name}</p>
                            {child.description && (
                              <p className="text-sm text-gray-500">{child.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(child.status)}
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleOpenForm(child, parent._id || parent.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => setDeleteDialog({ open: true, category: child })}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, category: null, parentId: null })}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {formDialog.category
                  ? "Chỉnh sửa danh mục"
                  : formDialog.parentId
                  ? "Thêm danh mục con"
                  : "Thêm danh mục cha"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Giày thể thao"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả danh mục..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  rows={3}
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
                onClick={() => setFormDialog({ open: false, category: null, parentId: null })}
              >
                Hủy
              </Button>
              <Button type="submit">
                {formDialog.category ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, category: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục <strong>{deleteDialog.category?.name}</strong>?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, category: null })}>
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

export default Categories;

