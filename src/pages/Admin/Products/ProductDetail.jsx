import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";
import i18n from "@/i18n/config";

const ProductDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maxImageHeight, setMaxImageHeight] = useState(0);
  const imageRefs = useRef([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const result = await getProduct(id);

    if (result.success) {
      setProduct(result.data);
      setMaxImageHeight(0);
      imageRefs.current = [];
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.products.loadProductError'),
      });
      navigate("/admin/products");
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: t('admin.products.active'), class: "bg-green-100 text-green-800" },
      inactive: { label: t('admin.products.inactive'), class: "bg-gray-100 text-gray-800" },
      out_of_stock: { label: t('admin.products.outOfStock'), class: "bg-red-100 text-red-800" },
      low_stock: { label: t('admin.products.lowStock'), class: "bg-yellow-100 text-yellow-800" },
    };

    const statusInfo = statusMap[status] || { label: status, class: "bg-gray-100 text-gray-800" };

    return (
      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{safeText(product.name, i18n.language, 'N/A')}</h1>
            <p className="text-gray-600 mt-1">{t('admin.products.detail.title')}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/admin/products/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          {t('admin.products.edit')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {product.images && product.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.products.detail.images')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((img, index) => (
                    <div
                      key={index}
                      className="w-full bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100"
                      style={{ height: maxImageHeight ? `${maxImageHeight}px` : undefined }}
                    >
                      <img
                        ref={(el) => (imageRefs.current[index] = el)}
                        src={img}
                        alt={`${safeText(product.name, i18n.language, '')} ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                        onLoad={(e) => {
                          // Measure rendered height after image loads
                          const renderedHeight = e.currentTarget?.naturalHeight && e.currentTarget?.naturalWidth
                            ? (e.currentTarget.naturalHeight / e.currentTarget.naturalWidth) * e.currentTarget.clientWidth
                            : e.currentTarget.clientHeight;
                          setMaxImageHeight((prev) => Math.max(prev, Math.ceil(renderedHeight)));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.products.detail.description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {safeText(product.description, i18n.language, t('admin.products.form.noDescription'))}
              </p>
            </CardContent>
          </Card>

          {/* Specifications */}
          {product.specifications && (
            <Card>
              <CardHeader>
                <CardTitle>Thông số kỹ thuật</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.specifications.size && product.specifications.size.length > 0 && (
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Size:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.specifications.size.map((size, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.specifications.color && product.specifications.color.length > 0 && (
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Màu sắc:</span>
                      <div className="flex flex-wrap gap-2">
                        {product.specifications.color.map((color, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.specifications.material && (
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Chất liệu:</span>
                      <span className="text-sm text-gray-700">{product.specifications.material}</span>
                    </div>
                  )}

                  {product.specifications.weight && (
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-medium text-gray-600 min-w-[100px]">Trọng lượng:</span>
                      <span className="text-sm text-gray-700">{product.specifications.weight}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-color4/10 text-color4 text-sm rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.products.detail.status')}</CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(product.status)}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.products.detail.pricing')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">{t('admin.products.detail.originalPrice')}</span>
                <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(product.price)}</p>
              </div>
              {product.discount > 0 && (
                <>
                  <div>
                    <span className="text-sm text-gray-600">{t('admin.products.detail.discount')}</span>
                    <p className="text-lg font-semibold text-red-600 mt-1">{product.discount}%</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('admin.products.detail.finalPrice')}</span>
                    <p className="text-xl font-bold text-color4 mt-1">
                      {formatCurrency(product.discountPrice)}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Stock */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.products.detail.inventory')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">{t('admin.products.detail.quantity')}</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">{product.stock}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">{t('admin.products.detail.sold')}</span>
                <p className="text-xl font-semibold text-gray-900 mt-1">{product.sold || 0}</p>
              </div>
            </CardContent>
          </Card>

          {/* Category & Brand */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.products.detail.classification')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">{t('admin.products.detail.categoryInfo')}</span>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {safeText(product.category?.name, i18n.language, "N/A")}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">{t('admin.products.detail.brandInfo')}</span>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {safeText(product.brand?.name, i18n.language, "N/A")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.products.detail.otherInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">{t('admin.products.detail.createdAt')}</span>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">{t('admin.products.detail.updatedAt')}</span>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

