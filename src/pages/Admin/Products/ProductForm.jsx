import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  createProduct,
  updateProduct,
  uploadProductImages,
  getCategories,
  getBrands,
} from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    brandId: "",
    price: "",
    description: "",
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
            flattened.push({ id: child.id || child._id, name: `${parent.name} / ${child.name}` });
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
      setFormData({
        name: product.name || "",
        categoryId: product.categoryId || product.category?.id || "",
        brandId: product.brandId || "",
        price: product.price || "",
        description: product.description || "",
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
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể tải thông tin sản phẩm",
      });
      navigate("/admin/products");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.categoryId || !formData.brandId || !formData.price) {
      addToast({
        type: "error",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
      setLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      discount: parseFloat(formData.discount) || 0,
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
        message: isEdit ? "Cập nhật sản phẩm thành công" : "Tạo sản phẩm thành công",
      });
      navigate("/admin/products");
    } else {
      addToast({
        type: "error",
        message: result.error || "Không thể lưu sản phẩm",
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
    setImages(files);
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
            {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? "Cập nhật thông tin sản phẩm" : "Tạo sản phẩm mới trong cửa hàng"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nike Air Max 270"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  required
                >
                  <option value="">Chọn danh mục (chọn danh mục con)</option>
                  {Array.isArray(categoryOptions) && categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                  required
                >
                  <option value="">Chọn thương hiệu</option>
                  {Array.isArray(brands) && brands.map((brand) => (
                    <option key={brand._id || brand.id} value={brand._id || brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết về sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card>
          <CardHeader>
            <CardTitle>Giá & Tồn kho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VND) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="3500000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá (%)</label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="10"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tồn kho</label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="45"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-color4 focus:border-color4"
              >
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Thông số kỹ thuật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (nhập từng giá trị và nhấn Enter)
              </label>
              <Input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={handleAddSize}
                placeholder="Nhập size và nhấn Enter"
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
                Màu sắc (nhập từng giá trị và nhấn Enter)
              </label>
              <Input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={handleAddColor}
                placeholder="Nhập màu sắc và nhấn Enter"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Chất liệu</label>
                <Input
                  value={formData.specifications.material}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, material: e.target.value },
                    })
                  }
                  placeholder="Da tổng hợp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trọng lượng</label>
                <Input
                  value={formData.specifications.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, weight: e.target.value },
                    })
                  }
                  placeholder="300g"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (nhập từng giá trị và nhấn Enter)
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Nhập tag và nhấn Enter"
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
            <CardTitle>Hình ảnh</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload ảnh (tối đa 5 ảnh)
              </label>
              <div className="mt-2 flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Chọn ảnh</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {images.length > 0 && (
                  <span className="text-sm text-gray-600">{images.length} ảnh đã chọn</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Định dạng: Tất cả định dạng ảnh. Kích thước tối đa: 5MB mỗi ảnh.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo sản phẩm"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

