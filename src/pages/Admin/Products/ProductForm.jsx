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
    material_vi: "",
    material_en: "",
    material_ja: "",
    gender_vi: "",
    gender_en: "",
    gender_ja: "",
    weight_vi: "",
    weight_en: "",
    weight_ja: "",
    tags: [],
    colors: [],  // Array of {color_name: {vi, en, ja}, hex_color, image, tags}
    sizes: [],   // Array of {size_name: {vi, en, ja}, tags}
  });

  const initializedRef = useRef(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [imagesReordered, setImagesReordered] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState("");

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
      const material = product.material || {};
      const gender = product.gender || {};
      const weight = product.weight || {};
      
      setFormData({
        name_vi: typeof name === 'object' ? (name.vi || '') : (name || ''),
        name_en: typeof name === 'object' ? (name.en || '') : '',
        name_ja: typeof name === 'object' ? (name.ja || '') : '',
        categoryId: product.categoryId || product.category?.id || "",
        brandId: product.brandId || product.brand?.id || "",
        price: product.price || "",
        description_vi: typeof desc === 'object' ? (desc.vi || '') : (desc || ''),
        description_en: typeof desc === 'object' ? (desc.en || '') : '',
        description_ja: typeof desc === 'object' ? (desc.ja || '') : '',
        stock: product.stock || "",
        discount: product.discount || 0,
        status: product.status || "active",
        material_vi: typeof material === 'object' ? (material.vi || '') : '',
        material_en: typeof material === 'object' ? (material.en || '') : '',
        material_ja: typeof material === 'object' ? (material.ja || '') : '',
        gender_vi: typeof gender === 'object' ? (gender.vi || '') : (typeof gender === 'string' ? gender : ''),
        gender_en: typeof gender === 'object' ? (gender.en || '') : '',
        gender_ja: typeof gender === 'object' ? (gender.ja || '') : '',
        weight_vi: typeof weight === 'object' ? (weight.vi || '') : (weight ? String(weight) : ''),
        weight_en: typeof weight === 'object' ? (weight.en || '') : '',
        weight_ja: typeof weight === 'object' ? (weight.ja || '') : '',
        tags: product.tags || [],
        colors: Array.isArray(product.colors) ? product.colors.map(c => ({
          color_name: c.color_name || { vi: '', en: '', ja: '' },
          hex_color: c.hex_color || c.hex || '#000000',
          image: c.image || '',
          tags: c.tags || []
        })) : [],
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
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

    // Collect color images to upload
    const colorImagesToUpload = [];
    const colorsData = formData.colors.map((color) => {
      const colorObj = {
        color_name: color.color_name,
        hex_color: color.hex_color,
        image: color.image || "", // Keep existing URL or empty
        tags: color.tags || []
      };
      
      // If there's a new image file, store it for upload
      if (color.imageFile) {
        colorImagesToUpload.push(color.imageFile);
      }
      
      return colorObj;
    });

    const submitData = {
      name: { vi: formData.name_vi || '', en: formData.name_en || '', ja: formData.name_ja || '' },
      description: { vi: formData.description_vi || '', en: formData.description_en || '', ja: formData.description_ja || '' },
      categoryId: formData.categoryId,
      brandId: formData.brandId,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      discount: parseFloat(formData.discount) || 0,
      status: formData.status,
      material: { vi: formData.material_vi || '', en: formData.material_en || '', ja: formData.material_ja || '' },
      gender: { vi: formData.gender_vi || '', en: formData.gender_en || '', ja: formData.gender_ja || '' },
      weight: { vi: formData.weight_vi || '', en: formData.weight_en || '', ja: formData.weight_ja || '' },
      tags: formData.tags,
      colors: colorsData,   // Array format with image URLs
      sizes: formData.sizes,     // Array format
    };

    const result = isEdit
      ? await updateProduct(id, submitData)
      : await createProduct(submitData);

    if (result.success) {
      const productId = isEdit ? id : (result.data._id || result.data.id);
      
      // Upload general product images if any
      if (images.length > 0) {
        await uploadProductImages(productId, images);
      }

      // Upload color images if any (append to product images)
      if (colorImagesToUpload.length > 0) {
        await uploadProductImages(productId, colorImagesToUpload);
        addToast({
          type: "info",
          message: `Đã upload ${colorImagesToUpload.length} ảnh màu. Cần cập nhật lại link ảnh cho từng màu thủ công.`,
        });
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

  // Handle URL input for product images
  const handleProductImageUrlChange = async (url) => {
    setProductImageUrl(url);
    
    if (!url.trim()) return;
    
    try {
      new URL(url);
    } catch {
      return;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      if (blob.size > 5 * 1024 * 1024) {
        addToast({ type: "error", message: "Ảnh từ URL phải nhỏ hơn 5MB" });
        return;
      }

      const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg';
      const file = new File([blob], filename, { type: blob.type });
      
      if (isEdit) {
        const result = await uploadProductImages(id, [file]);
        if (result.success) {
          const newImages = Array.isArray(result.data?.images) ? result.data.images : [];
          setExistingImages((prev) => {
            const merged = [...prev];
            newImages.forEach((url) => {
              if (!merged.includes(url)) merged.push(url);
            });
            return merged;
          });
          addToast({ type: "success", message: "Đã thêm ảnh từ URL" });
          setProductImageUrl("");
        }
      } else {
        setImages((prev) => [...prev, file]);
        addToast({ type: "success", message: "Đã thêm ảnh từ URL" });
        setProductImageUrl("");
      }
    } catch (error) {
      console.error("Error loading image from URL:", error);
      addToast({ type: "error", message: "Không thể tải ảnh từ URL này" });
    }
  };

  const handleProductImageDrop = async (e) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (url) {
      handleProductImageUrlChange(url);
    }
  };

  const handleProductImageDragOver = (e) => {
    e.preventDefault();
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

  // Color Management
  const [colorInput, setColorInput] = useState({
    color_vi: "",
    color_en: "",
    color_ja: "",
    hex_color: "#000000",
    image: null, // File object
    imagePreview: "", // Preview URL
    imageUrl: "", // URL input
  });

  const handleColorImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        addToast({ type: "error", message: "Ảnh phải nhỏ hơn 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setColorInput({ 
          ...colorInput, 
          image: file,
          imagePreview: reader.result,
          imageUrl: "" // Clear URL when file is selected
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL input for color image
  const handleColorImageUrlChange = async (url) => {
    setColorInput({ ...colorInput, imageUrl: url });
    
    if (!url.trim()) return;
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return; // Invalid URL, wait for user to finish typing
    }

    // Fetch image from URL and convert to blob
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      if (blob.size > 5 * 1024 * 1024) { // 5MB limit for URL
        addToast({ type: "error", message: "Ảnh từ URL phải nhỏ hơn 5MB" });
        return;
      }

      // Create file from blob
      const filename = url.split('/').pop()?.split('?')[0] || 'image.jpg';
      const file = new File([blob], filename, { type: blob.type });
      
      setColorInput({
        ...colorInput,
        image: file,
        imagePreview: url,
        imageUrl: url
      });
      
      addToast({ type: "success", message: "Đã tải ảnh từ URL" });
    } catch (error) {
      console.error("Error loading image from URL:", error);
      addToast({ type: "error", message: "Không thể tải ảnh từ URL này" });
    }
  };

  // Handle drag and drop for URL
  const handleColorImageDrop = async (e) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (url) {
      handleColorImageUrlChange(url);
    }
  };

  const handleColorImageDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddColor = () => {
    if (!colorInput.color_vi && !colorInput.color_en && !colorInput.color_ja) {
      addToast({ type: "error", message: "Vui lòng nhập tên màu (ít nhất 1 ngôn ngữ)" });
      return;
    }
    const newColor = {
      color_name: {
        vi: colorInput.color_vi || '',
        en: colorInput.color_en || '',
        ja: colorInput.color_ja || ''
      },
      hex_color: colorInput.hex_color,
      image: colorInput.imagePreview || "", // Store preview URL or empty
      imageFile: colorInput.image, // Store file for upload
      tags: []
    };
    setFormData({
      ...formData,
      colors: [...formData.colors, newColor]
    });
    setColorInput({ 
      color_vi: "", 
      color_en: "", 
      color_ja: "", 
      hex_color: "#000000",
      image: null,
      imagePreview: "",
      imageUrl: ""
    });
  };

  const handleRemoveColor = (index) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index)
    });
  };

  // Size Management
  const [sizeInput, setSizeInput] = useState({
    size_vi: "",
    size_en: "",
    size_ja: "",
  });

  const handleAddSize = () => {
    if (!sizeInput.size_vi && !sizeInput.size_en && !sizeInput.size_ja) {
      addToast({ type: "error", message: "Vui lòng nhập size (ít nhất 1 ngôn ngữ)" });
      return;
    }
    const newSize = {
      size_name: {
        vi: sizeInput.size_vi || '',
        en: sizeInput.size_en || '',
        ja: sizeInput.size_ja || ''
      },
      tags: []
    };
    setFormData({
      ...formData,
      sizes: [...formData.sizes, newSize]
    });
    setSizeInput({ size_vi: "", size_en: "", size_ja: "" });
  };

  const handleRemoveSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
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
                  onChange={(e) => {
                    const stockValue = parseInt(e.target.value) || 0;
                    let newStatus = formData.status;
                    
                    // Auto update status based on stock
                    if (stockValue === 0) {
                      newStatus = 'out_of_stock';
                    } else if (stockValue < 10) {
                      newStatus = 'low_stock';
                    } else if (formData.status === 'out_of_stock' || formData.status === 'low_stock') {
                      newStatus = 'active';
                    }
                    
                    setFormData({ 
                      ...formData, 
                      stock: e.target.value,
                      status: newStatus
                    });
                  }}
                  placeholder={t('admin.products.form.stockPlaceholder')}
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Trạng thái tự động: 0 = Hết hàng, &lt;10 = Sắp hết, ≥10 = Hoạt động
                </p>
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
                <option value="low_stock">Sắp hết hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Tự động cập nhật theo tồn kho (có thể chỉnh thủ công)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Product Attributes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.products.form.specifications')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Colors - Multiple */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Màu sắc (Colors)
              </label>
              
              {/* Add Color Form */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tên màu (VI)</label>
                    <Input
                      value={colorInput.color_vi}
                      onChange={(e) => setColorInput({ ...colorInput, color_vi: e.target.value })}
                      placeholder="Đen"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Color name (EN)</label>
                    <Input
                      value={colorInput.color_en}
                      onChange={(e) => setColorInput({ ...colorInput, color_en: e.target.value })}
                      placeholder="Black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">色名 (JA)</label>
                    <Input
                      value={colorInput.color_ja}
                      onChange={(e) => setColorInput({ ...colorInput, color_ja: e.target.value })}
                      placeholder="黒"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Mã màu (Hex)</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={colorInput.hex_color}
                        onChange={(e) => setColorInput({ ...colorInput, hex_color: e.target.value })}
                        className="w-12 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={colorInput.hex_color}
                        onChange={(e) => setColorInput({ ...colorInput, hex_color: e.target.value })}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  {/* NEW: Image upload for color variant */}
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600 mb-1">
                      🖼️ Ảnh sản phẩm với màu này (tùy chọn)
                    </label>
                    
                    {/* URL Input */}
                    <div className="mb-2">
                      <Input
                        type="text"
                        value={colorInput.imageUrl}
                        onChange={(e) => handleColorImageUrlChange(e.target.value)}
                        onDrop={handleColorImageDrop}
                        onDragOver={handleColorImageDragOver}
                        placeholder="Paste hoặc kéo thả link ảnh vào đây (https://...)"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        💡 Kéo thả link ảnh từ browser hoặc paste URL vào
                      </p>
                    </div>

                    {/* File Upload */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleColorImageChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Hoặc chọn file từ máy tính
                        </p>
                      </div>
                      
                      {colorInput.imagePreview && (
                        <div className="relative w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                          <img 
                            src={colorInput.imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setColorInput({ ...colorInput, image: null, imagePreview: "", imageUrl: "" })}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button type="button" onClick={handleAddColor} size="sm">
                  + Thêm màu
                </Button>
              </div>

              {/* Colors List */}
              {formData.colors.length > 0 && (
                <div className="space-y-2">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                      {/* Color preview or image */}
                      {color.image ? (
                        <div className="w-12 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0 overflow-hidden">
                          <img 
                            src={color.image} 
                            alt={color.color_name.vi || 'Color'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: color.hex_color }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {color.color_name.vi || color.color_name.en || color.color_name.ja || 'Unnamed'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {color.hex_color}
                          {color.image && <span className="ml-2">📷 Có ảnh</span>}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveColor(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {formData.colors.length === 0 && (
                <p className="text-sm text-gray-500 italic">Chưa có màu nào. Thêm màu bên trên.</p>
              )}
            </div>

            {/* Material - Multilingual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.form.materialMultilingual')}</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.vietnameseLang')}</label>
                  <Input
                    value={formData.material_vi}
                    onChange={(e) => setFormData({ ...formData, material_vi: e.target.value })}
                    placeholder={t('admin.products.form.materialPlaceholderVI')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.englishLang')}</label>
                  <Input
                    value={formData.material_en}
                    onChange={(e) => setFormData({ ...formData, material_en: e.target.value })}
                    placeholder={t('admin.products.form.materialPlaceholderEN')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.japaneseLang')}</label>
                  <Input
                    value={formData.material_ja}
                    onChange={(e) => setFormData({ ...formData, material_ja: e.target.value })}
                    placeholder={t('admin.products.form.materialPlaceholderJA')}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('admin.products.form.materialDescription')}</p>
            </div>

            {/* Gender - Multilingual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.form.genderMultilingual')}</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.vietnameseLang')}</label>
                  <Input
                    value={formData.gender_vi}
                    onChange={(e) => setFormData({ ...formData, gender_vi: e.target.value })}
                    placeholder={t('admin.products.form.genderPlaceholderVI')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.englishLang')}</label>
                  <Input
                    value={formData.gender_en}
                    onChange={(e) => setFormData({ ...formData, gender_en: e.target.value })}
                    placeholder={t('admin.products.form.genderPlaceholderEN')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.japaneseLang')}</label>
                  <Input
                    value={formData.gender_ja}
                    onChange={(e) => setFormData({ ...formData, gender_ja: e.target.value })}
                    placeholder={t('admin.products.form.genderPlaceholderJA')}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('admin.products.form.genderDescription')}</p>
            </div>

            {/* Weight - Multilingual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.products.form.weightMultilingual')}</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.vietnameseLang')}</label>
                  <Input
                    value={formData.weight_vi}
                    onChange={(e) => setFormData({ ...formData, weight_vi: e.target.value })}
                    placeholder={t('admin.products.form.weightPlaceholderVI')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.englishLang')}</label>
                  <Input
                    value={formData.weight_en}
                    onChange={(e) => setFormData({ ...formData, weight_en: e.target.value })}
                    placeholder={t('admin.products.form.weightPlaceholderEN')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('admin.common.japaneseLang')}</label>
                  <Input
                    value={formData.weight_ja}
                    onChange={(e) => setFormData({ ...formData, weight_ja: e.target.value })}
                    placeholder={t('admin.products.form.weightPlaceholderJA')}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('admin.products.form.weightDescription')}</p>
            </div>

            {/* Sizes - Multiple */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kích cỡ (Sizes)
              </label>
              
              {/* Add Size Form */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Size (VI)</label>
                    <Input
                      value={sizeInput.size_vi}
                      onChange={(e) => setSizeInput({ ...sizeInput, size_vi: e.target.value })}
                      placeholder="EU36"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Size (EN)</label>
                    <Input
                      value={sizeInput.size_en}
                      onChange={(e) => setSizeInput({ ...sizeInput, size_en: e.target.value })}
                      placeholder="EU36"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Size (JA)</label>
                    <Input
                      value={sizeInput.size_ja}
                      onChange={(e) => setSizeInput({ ...sizeInput, size_ja: e.target.value })}
                      placeholder="EU36"
                    />
                  </div>
                </div>
                <Button type="button" onClick={handleAddSize} size="sm">
                  + Thêm size
                </Button>
              </div>

              {/* Sizes List */}
              {formData.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg"
                    >
                      <span className="text-sm font-medium">
                        {size.size_name.vi || size.size_name.en || size.size_name.ja || 'Unnamed'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="hover:bg-red-50 rounded-full p-1 text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.sizes.length === 0 && (
                <p className="text-sm text-gray-500 italic">Chưa có size nào. Thêm size bên trên.</p>
              )}
            </div>

            {/* Tags */}
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
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      {t('admin.products.form.images')} ({existingImages.length}/5)
                    </label>
                    {imagesReordered && (
                      <Button type="button" size="sm" onClick={handleSaveImagesOrder}>
                        {t('admin.products.form.saveImageOrder')}
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {existingImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group cursor-move bg-white rounded-lg border-2 border-gray-200 hover:border-color4 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md"
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(idx)}
                        title={t('admin.products.form.dragToSort')}
                      >
                        {/* Image Number Badge */}
                        <div className="absolute top-2 left-2 z-10 bg-color4 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                          {idx + 1}
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExistingImage(url);
                          }}
                          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg"
                          aria-label={t('admin.products.form.deleteImage')}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Drag Indicator */}
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity py-2 text-center">
                          <span className="text-white text-xs font-medium">
                            ⇅ {t('admin.products.form.dragToSort')}
                          </span>
                        </div>

                        {/* Image */}
                        <button 
                          type="button" 
                          onClick={() => { setPreviewImage(url); setIsPreviewOpen(true); }} 
                          className="block w-full h-full"
                        >
                          <div className="relative w-full aspect-square bg-gray-100">
                            <img 
                              src={url} 
                              alt={`Product image ${idx + 1}`} 
                              className="absolute inset-0 w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                    <span>💡</span>
                    <span>{t('admin.products.form.dragToReorder')}</span>
                  </p>
                </div>
              )}
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('admin.products.form.uploadImagesLabel')}
                </label>
                
                {/* URL Input */}
                <div className="mb-4">
                  <Input
                    type="text"
                    value={productImageUrl}
                    onChange={(e) => handleProductImageUrlChange(e.target.value)}
                    onDrop={handleProductImageDrop}
                    onDragOver={handleProductImageDragOver}
                    placeholder="Paste hoặc kéo thả link ảnh vào đây (https://...)"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    💡 Kéo thả link ảnh từ browser hoặc paste URL vào
                  </p>
                </div>

                <div className="relative mb-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-50 px-2 text-gray-500">Hoặc</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center gap-3">
                  <label className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-color4 text-color4 rounded-lg cursor-pointer hover:bg-color4 hover:text-white transition-all shadow-sm hover:shadow-md font-medium">
                    <Upload className="w-5 h-5" />
                    <span>{t('admin.products.form.selectImages')}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  
                  {!isEdit && images.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 rounded-full border border-gray-200">
                      <span className="font-semibold text-color4">{images.length}</span>
                      <span>{t('admin.products.form.imagesSelected')}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center space-y-1">
                  <p className="text-xs text-gray-600">
                    {t('admin.products.form.imageFormats')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('admin.products.form.maxImages')}: 5 {t('admin.products.form.images').toLowerCase()}
                  </p>
                </div>
              </div>
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

