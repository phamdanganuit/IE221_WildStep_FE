import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  createProduct,
  updateProduct,
  uploadProductImages,
  getCategories,
  getBrands,
  removeProductImage,
} from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";
import i18n from "@/i18n/config";

const ProductForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]); // new images (create mode)
  const [existingImages, setExistingImages] = useState([]); // urls from server (edit mode)
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    name_vi: "",
    name_en: "",
    name_ja: "",
    description_vi: "",
    description_en: "",
    description_ja: "",
    categoryId: "",
    brandId: "",
    price: "",
    stock: "",
    discount: "",
    status: "active",
    specifications: {
      size: [],
      color: [],
      material: "",
      weight: "",
    },
    tags: [],
  });

  const initializedRef = useRef(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [imagesReordered, setImagesReordered] = useState(false);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    setExistingImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setImagesReordered(true);
    setDragIndex(null);
  };

  const handleSaveImagesOrder = async () => {
    if (!isEdit) return;
    const result = await updateProduct(id, { images: existingImages });
    if (result.success) {
      setImagesReordered(false);
      addToast({ type: "success", message: t('admin.products.form.saveImageOrderSuccess') });
    } else {
      addToast({ type: "error", message: result.error || t('admin.products.form.saveImageOrderError') });
    }
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    fetchCategories();
    fetchBrands();
    if (isEdit) {
      fetchProduct();
    }
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
      // Only allow selecting child categories as API expects child category id
      const flattened = [];
      list.forEach((parent) => {
        if (Array.isArray(parent.children) && parent.children.length > 0) {
          parent.children.forEach((child) => {
            // parent.name / child.name may be localized objects; display safely
            const parentName = safeText(parent.name, i18n.language, 'N/A');
            const childName = safeText(child.name, i18n.language, 'N/A');
            flattened.push({ id: child.id || child._id, name: `${parentName} / ${childName}` });
          });
        }
      });
      setCategoryOptions(flattened);
    }
  };

  const fetchBrands = async () => {
    const result = await getBrands();
    if (result.success) {
      const payload = result.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.brands)
            ? payload.brands
            : [];
      setBrands(list);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    const result = await getProduct(id);

    if (result.success) {
      const product = result.data;
      const name = product.name || {};
      const desc = product.description || {};
      setFormData({
        name_vi: typeof name === 'object' ? (name.vi || '') : (name || ''),
        name_en: typeof name === 'object' ? (name.en || '') : '',
        name_ja: typeof name === 'object' ? (name.ja || '') : '',
        categoryId: product.categoryId || product.category?.id || "",
        brandId: product.brandId || "",
        price: product.price || "",
        description_vi: typeof desc === 'object' ? (desc.vi || '') : (desc || ''),
        description_en: typeof desc === 'object' ? (desc.en || '') : '',
        description_ja: typeof desc === 'object' ? (desc.ja || '') : '',
        stock: product.stock || "",
        discount: product.discount || "",
        status: product.status || "active",
        specifications: {
          size: product.specifications?.size || [],
          color: product.specifications?.color || [],
          material: product.specifications?.material || "",
          weight: product.specifications?.weight || "",
        },
        tags: product.tags || [],
      });
      setExistingImages(Array.isArray(product.images) ? product.images : []);
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.products.loadProductError'),
      });
      navigate("/admin/products");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if ((!formData.name_vi && !formData.name_en && !formData.name_ja) || !formData.categoryId || !formData.brandId || !formData.price) {
      addToast({
        type: "error",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      setLoading(false);
      return;
    }

    const submitData = {
      name: { vi: formData.name_vi || '', en: formData.name_en || '', ja: formData.name_ja || '' },
      description: { vi: formData.description_vi || '', en: formData.description_en || '', ja: formData.description_ja || '' },
      categoryId: formData.categoryId,
      brandId: formData.brandId,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      discount: parseFloat(formData.discount) || 0,
      status: formData.status,
      specifications: formData.specifications,
      tags: formData.tags,
    };

    const result = isEdit
      ? await updateProduct(id, submitData)
      : await createProduct(submitData);

    if (result.success) {
      // Upload images if any
      if (images.length > 0) {
        const productId = isEdit ? id : (result.data._id || result.data.id);
        await uploadProductImages(productId, images);
      }

      addToast({
        type: "success",
        message: isEdit ? t('admin.products.form.updateSuccess') : t('admin.products.form.createSuccess'),
      });
      navigate("/admin/products");
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.products.form.saveError'),
      });
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      addToast({
        type: "error",
        message: "Chỉ có thể upload tối đa 5 ảnh",
      });
      return;
    }
    // If editing, upload immediately and merge; otherwise store for upload after create
    if (isEdit) {
      const doUpload = async () => {
        const productId = id;
        const result = await uploadProductImages(productId, files);
        if (result.success) {
          const newImages = Array.isArray(result.data?.images) ? result.data.images : [];
          setExistingImages((prev) => {
            // Merge and de-duplicate
            const merged = [...prev];
            newImages.forEach((url) => {
              if (!merged.includes(url)) merged.push(url);
            });
            return merged;
          });
          addToast({ type: "success", message: t('admin.products.form.uploadSuccess') });
        } else {
          addToast({ type: "error", message: result.error || t('admin.products.form.uploadImageError') });
        }
      };
      doUpload();
      // reset input
      e.target.value = "";
    } else {
      setImages(files);
    }
  };

  const handleDeleteExistingImage = async (imageUrl) => {
    if (!isEdit) return;
    const result = await removeProductImage(id, imageUrl);
    if (result.success) {
      setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
      addToast({ type: "success", message: t('admin.products.form.deleteImageSuccess') });
    } else {
      addToast({ type: "error", message: result.error || t('admin.products.form.deleteImageError') });
    }
  };

  const handleAddSize = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = sizeInput.trim();
      if (value && !formData.specifications.size.includes(value)) {
        setFormData({
          ...formData,
          specifications: {
            ...formData.specifications,
            size: [...formData.specifications.size, value],
          },
        });
        setSizeInput("");
      }
    }
  };

  const handleRemoveSize = (index) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        size: formData.specifications.size.filter((_, i) => i !== index),
      },
    });
  };

  const handleAddColor = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = colorInput.trim();
      if (value && !formData.specifications.color.includes(value)) {
        setFormData({
          ...formData,
          specifications: {
            ...formData.specifications,
            color: [...formData.specifications.color, value],
          },
        });
        setColorInput("");
      }
    }
  };

  const handleRemoveColor = (index) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        color: formData.specifications.color.filter((_, i) => i !== index),
      },
    });
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !formData.tags.includes(value)) {
        setFormData({ ...formData, tags: [...formData.tags, value] });
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? t('admin.products.editProduct') : t('admin.products.addNew')}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? t('admin.products.subtitle') : t('admin.products.subtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.products.form.productInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.nameVI')} <span className="text-red-500">*</span></label>
                <Input value={formData.name_vi} onChange={(e) => setFormData({ ...formData, name_vi: e.target.value })} placeholder={t('admin.products.form.productNamePlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.nameEN')}</label>
                <Input value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} placeholder={t('admin.products.form.productNamePlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.nameJA')}</label>
                <Input value={formData.name_ja} onChange={(e) => setFormData({ ...formData, name_ja: e.target.value })} placeholder={t('admin.products.form.productNamePlaceholder')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.products.category')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  required
                >
                  <option value="">{t('admin.products.form.selectCategory')}</option>
                  {Array.isArray(categoryOptions) && categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.products.brand')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  required
                >
                  <option value="">{t('admin.products.form.selectBrand')}</option>
                  {Array.isArray(brands) && brands.map((brand) => (
                    <option key={brand._id || brand.id} value={brand._id || brand.id}>
                      {safeText(brand.name, i18n.language, 'N/A')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.descriptionVI')}</label>
                <textarea value={formData.description_vi} onChange={(e) => setFormData({ ...formData, description_vi: e.target.value })} placeholder={t('admin.products.form.descriptionPlaceholder')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.descriptionEN')}</label>
                <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} placeholder={t('admin.products.form.descriptionPlaceholder')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.common.descriptionJA')}</label>
                <textarea value={formData.description_ja} onChange={(e) => setFormData({ ...formData, description_ja: e.target.value })} placeholder={t('admin.products.form.descriptionPlaceholder')} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4" rows={4} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.products.form.priceAndStock')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.products.priceVND')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder={t('admin.products.form.pricePlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.discount')}</label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder={t('admin.products.form.discountPlaceholder')}
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.stock')}</label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder={t('admin.products.form.stockPlaceholder')}
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.status')}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
              >
                <option value="active">{t('admin.products.active')}</option>
                <option value="inactive">{t('admin.products.inactive')}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.products.form.specifications')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.products.form.size')}
              </label>
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={handleAddSize}
                placeholder={t('admin.products.form.size')}
              />
              {formData.specifications.size.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specifications.size.map((size, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-color4 text-white text-sm rounded-full"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.products.form.color')}
              </label>
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={handleAddColor}
                placeholder={t('admin.products.form.color')}
              />
              {formData.specifications.color.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.specifications.color.map((color, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-color4 text-white text-sm rounded-full"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.form.material')}</label>
                <Input
                  value={formData.specifications.material}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, material: e.target.value },
                    })
                  }
                  placeholder={t('admin.products.form.materialPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.form.weight')}</label>
                <Input
                  value={formData.specifications.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, weight: e.target.value },
                    })
                  }
                  placeholder={t('admin.products.form.weightPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.products.form.tags')}
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={t('admin.products.form.enterTag')}
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-color4 text-white text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.products.form.images')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {isEdit && existingImages.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.form.images')}</label>
                  {imagesReordered && (
                    <div className="flex justify-end mb-3">
                      <Button type="button" onClick={handleSaveImagesOrder}>{t('admin.products.form.saveImageOrder')}</Button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group cursor-move"
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(idx)}
                        title={t('admin.products.form.dragToSort')}
                      >
                        <button type="button" onClick={() => { setPreviewImage(url); setIsPreviewOpen(true); }} className="block w-full">
                          <div className="relative w-full aspect-square">
                            <img src={url} alt={`image-${idx}`} className="absolute inset-0 w-full h-full object-cover rounded-md" />
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExistingImage(url)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full p-1"
                          aria-label={t('admin.products.form.deleteImage')}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload ảnh (tối đa 5 ảnh)
              </label>
              <div className="mt-2 flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">{t('admin.products.form.selectImages')}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {!isEdit && images.length > 0 && (
                  <span className="text-sm text-gray-600">{images.length} {t('admin.products.form.imagesSelected')}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t('admin.products.form.imageFormats')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Image Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-[90vw] max-w-[90vw] p-0 bg-transparent border-none shadow-none">
            <DialogHeader className="sr-only">
              <DialogTitle>{t('admin.products.form.viewImage')}</DialogTitle>
              <DialogDescription>{t('admin.products.form.imagePreview')}</DialogDescription>
            </DialogHeader>
            {previewImage && (
              <div className="flex items-center justify-center">
                <img src={previewImage} alt="Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded" />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? t('common.loading') : isEdit ? t('common.save') : t('admin.products.addNew')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

