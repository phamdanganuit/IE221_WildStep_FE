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
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";

const Categories = () => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formDialog, setFormDialog] = useState({ open: false, category: null, parentId: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, category: null });
  const [formData, setFormData] = useState({
    name_vi: "",
    name_en: "",
    name_ja: "",
    description_vi: "",
    description_en: "",
    description_ja: "",
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
        message: result.error || t('admin.categories.loadError'),
      });
    }
    setLoading(false);
  };

  const handleOpenForm = (category = null, parentId = null) => {
    if (category) {
      const name = category.name || {};
      const desc = category.description || {};
      setFormData({
        name_vi: typeof name === 'object' ? (name.vi || '') : (name || ''),
        name_en: typeof name === 'object' ? (name.en || '') : '',
        name_ja: typeof name === 'object' ? (name.ja || '') : '',
        description_vi: typeof desc === 'object' ? (desc.vi || '') : (desc || ''),
        description_en: typeof desc === 'object' ? (desc.en || '') : '',
        description_ja: typeof desc === 'object' ? (desc.ja || '') : '',
        status: category.status || "active",
      });
    } else {
      setFormData({
        name_vi: "",
        name_en: "",
        name_ja: "",
        description_vi: "",
        description_en: "",
        description_ja: "",
        status: "active",
      });
    }
    setFormDialog({ open: true, category, parentId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name_vi && !formData.name_en && !formData.name_ja) {
      addToast({
        type: "error",
        message: t('admin.categories.nameRequired'),
      });
      return;
    }

    const submitData = {
      name: { vi: formData.name_vi || '', en: formData.name_en || '', ja: formData.name_ja || '' },
      description: { vi: formData.description_vi || '', en: formData.description_en || '', ja: formData.description_ja || '' },
      status: formData.status || 'active',
      type: formDialog.parentId ? "child" : "parent",
      ...(formDialog.parentId && { parentId: formDialog.parentId }),
    };

    const result = formDialog.category
      ? await updateCategory(formDialog.category._id || formDialog.category.id, submitData)
      : await createCategory(submitData);

    if (result.success) {
      addToast({
        type: "success",
        message: formDialog.category ? t('admin.categories.updateSuccess') : t('admin.categories.createSuccess'),
      });
      fetchCategories();
      setFormDialog({ open: false, category: null, parentId: null });
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.categories.saveError'),
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.category) return;

    const result = await deleteCategory(deleteDialog.category._id || deleteDialog.category.id);

    if (result.success) {
      addToast({
        type: "success",
        message: t('admin.categories.deleteSuccess'),
      });
      fetchCategories();
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.categories.deleteError'),
      });
    }

    setDeleteDialog({ open: false, category: null });
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        {t('admin.categories.active')}
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        {t('admin.categories.inactive')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.categories.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.categories.subtitle')}</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.categories.addParent')}
        </Button>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.categories.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('admin.categories.noCategories')}</p>
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
                        <p className="font-semibold text-gray-900">{safeText(parent.name, i18n.language, "N/A")}</p>
                        {parent.description && (
                          <p className="text-sm text-gray-500">{safeText(parent.description, i18n.language, "")}</p>
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
                            <p className="font-medium text-gray-900">{safeText(child.name, i18n.language, "N/A")}</p>
                            {child.description && (
                              <p className="text-sm text-gray-500">{safeText(child.description, i18n.language, "")}</p>
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
                  ? t('admin.categories.editCategory')
                  : formDialog.parentId
                  ? t('admin.categories.addChild')
                  : t('admin.categories.addParent')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.nameVI')}</label>
                  <Input value={formData.name_vi} onChange={(e) => setFormData({ ...formData, name_vi: e.target.value })} placeholder={t('admin.categories.name')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.nameEN')}</label>
                  <Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} placeholder={t('admin.categories.name')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.nameJA')}</label>
                  <Input value={formData.name_ja} onChange={(e) => setFormData({ ...formData, name_ja: e.target.value })} placeholder={t('admin.categories.name')} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.descriptionVI')}</label>
                  <textarea value={formData.description_vi} onChange={(e) => setFormData({ ...formData, description_vi: e.target.value })} placeholder={t('admin.categories.descriptionPlaceholder')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.descriptionEN')}</label>
                  <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} placeholder={t('admin.categories.descriptionPlaceholder')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.descriptionJA')}</label>
                  <textarea value={formData.description_ja} onChange={(e) => setFormData({ ...formData, description_ja: e.target.value })} placeholder={t('admin.categories.descriptionPlaceholder')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4" rows={3} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.categories.status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                >
                  <option value="active">{t('admin.categories.active')}</option>
                  <option value="inactive">{t('admin.categories.inactive')}</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormDialog({ open: false, category: null, parentId: null })}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('common.save')}
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
            <DialogTitle>{t('common.confirm')}</DialogTitle>
            <DialogDescription>
              {t('admin.categories.deleteConfirm', { name: deleteDialog.category?.name || '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, category: null })}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;

