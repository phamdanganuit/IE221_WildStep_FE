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
import { safeText } from "@/lib/i18nUtils";

const emptyForm = {
  image: "",
  title_vi: "",
  title_en: "",
  title_ja: "",
  link: "",
  order: 0,
  status: "active",
};

import { useTranslation } from "react-i18next";

export default function Banners() {
  const { t, i18n } = useTranslation();
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
      addToast({ type: "error", message: res.error || t('admin.banners.loadError') });
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
      title_vi: typeof banner.title === 'object' ? (banner.title.vi || '') : (banner.title || ''),
      title_en: typeof banner.title === 'object' ? (banner.title.en || '') : '',
      title_ja: typeof banner.title === 'object' ? (banner.title.ja || '') : '',
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
      // Append dot fields for multipart
      result = await createAdminBannerForm(file, {
        'title.vi': formData.title_vi || '',
        'title.en': formData.title_en || '',
        'title.ja': formData.title_ja || '',
        link: formData.link,
        order: formData.order,
        status: formData.status,
      });
    } else if (isEdit) {
      result = await updateAdminBanner(formDialog.banner.id || formDialog.banner._id, {
        title: { vi: formData.title_vi || '', en: formData.title_en || '', ja: formData.title_ja || '' },
        link: formData.link,
        order: formData.order,
        status: formData.status,
        image: formData.image || undefined,
      });
    } else {
      // Create with image URL
      if (!formData.image) {
        addToast({ type: "error", message: t('admin.banners.imageRequired') });
        return;
      }
      result = await createAdminBanner({
        image: formData.image,
        title: { vi: formData.title_vi || '', en: formData.title_en || '', ja: formData.title_ja || '' },
        link: formData.link,
        order: formData.order,
        status: formData.status,
      });
    }

    if (result.success) {
      addToast({ type: "success", message: isEdit ? t('admin.banners.updateSuccess') : t('admin.banners.createSuccess') });
      setFormDialog({ open: false, banner: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchBanners();
    } else {
      addToast({ type: "error", message: result.error || t('admin.banners.saveError') });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.banner) return;
    const id = deleteDialog.banner.id || deleteDialog.banner._id;
    const res = await deleteAdminBanner(id);
    if (res.success) {
      addToast({ type: "success", message: t('admin.banners.deleteSuccess') });
      setDeleteDialog({ open: false, banner: null });
      fetchBanners();
    } else {
      addToast({ type: "error", message: res.error || t('admin.banners.deleteError') });
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
      addToast({ type: "success", message: t('admin.banners.uploadImageSuccess') });
      fetchBanners();
    } else {
      addToast({ type: "error", message: res.error || t('admin.banners.uploadImageError') });
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.banners.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.banners.subtitle')}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.banners.addNew')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.banners.title')} ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">{t('admin.banners.noBanners')}</div>
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
                          <p className="font-semibold text-gray-900 line-clamp-1">{safeText(b.title, i18n.language, t('admin.banners.noTitle'))}</p>
                          <p className="text-sm text-gray-500">{t('admin.banners.order')}: {b.order ?? 0} · {t('admin.banners.status')}: {b.status}</p>
                        </div>
                      </div>
                    </div>
                    {b.image && (
                      <img src={b.image} alt={safeText(b.title, i18n.language, String(id))} className="w-full h-36 object-cover rounded-md mb-3" />
                    )}

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(b)} className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />{t('admin.banners.edit')}
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
                        <Upload className="w-4 h-4 mr-2" />{t('admin.banners.uploadImage')}
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
              <DialogTitle>{formDialog.banner ? t('admin.banners.editBanner') : t('admin.banners.addNew')}</DialogTitle>
              <DialogDescription>
                {t('admin.banners.createHint')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!formDialog.banner && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.banners.selectImage')}</label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="block w-full" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.banners.imageUrl')}</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder={t('admin.banners.imageUrlPlaceholder')}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.titleVI')}</label>
                  <Input value={formData.title_vi} onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })} placeholder={t('admin.banners.titlePlaceholder')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.titleEN')}</label>
                  <Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} placeholder={t('admin.banners.titlePlaceholder')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.titleJA')}</label>
                  <Input value={formData.title_ja} onChange={(e) => setFormData({ ...formData, title_ja: e.target.value })} placeholder={t('admin.banners.titlePlaceholder')} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.banners.link')}</label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder={t('admin.banners.linkPlaceholder')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.banners.order')}</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    placeholder={t('admin.banners.orderPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.banners.status')}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  >
                    <option value="active">{t('admin.banners.active')}</option>
                    <option value="inactive">{t('admin.banners.inactive')}</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormDialog({ open: false, banner: null })}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.save')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, banner: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.confirm')}</DialogTitle>
            <DialogDescription>
              {t('admin.banners.deleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, banner: null })}>{t('common.cancel')}</Button>
            <Button variant="destructive" onClick={handleDelete}>{t('common.delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


