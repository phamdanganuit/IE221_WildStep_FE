import { useEffect, useState } from "react";
import { getCategories, getBrands } from "@/service/adminService";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "@/service/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
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
import i18n from "@/i18n/config";

const ProductList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
    sort: "createdAt",
    order: "desc",
    category: "",
    brand: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    // Load filter options once
    const loadOptions = async () => {
      const [catRes, brandRes] = await Promise.all([getCategories(), getBrands()]);

      if (catRes.success) {
        const payload = catRes.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        const flattened = [];
        list.forEach((parent) => {
          if (Array.isArray(parent.children)) {
            parent.children.forEach((child) => {
              const parentName = safeText(parent.name, i18n.language, 'N/A');
              const childName = safeText(child.name, i18n.language, 'N/A');
              flattened.push({ id: child.id || child._id, name: `${parentName} / ${childName}` });
            });
          }
        });
        setCategoryOptions(flattened);
      }

      if (brandRes.success) {
        const payload = brandRes.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        setBrandOptions(list.map((b) => ({ id: b.id || b._id, name: safeText(b.name, i18n.language, 'N/A') })));
      }
    };
    loadOptions();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getProducts(filters);

    if (result.success) {
      const payload = result.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.products)
            ? payload.products
            : Array.isArray(payload?.items)
              ? payload.items
              : [];
      setProducts(list);
      const pages =
        (payload?.pagination && typeof payload.pagination.totalPages === "number")
          ? payload.pagination.totalPages
          : (typeof payload?.totalPages === "number" ? payload.totalPages : 1);
      setTotalPages(pages > 0 ? pages : 1);
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.products.loadError'),
      });
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleDelete = async () => {
    if (!deleteDialog.product) return;

    const result = await deleteProduct(deleteDialog.product._id || deleteDialog.product.id);

    if (result.success) {
      addToast({
        type: "success",
        message: t('admin.products.deleteSuccess'),
      });
      fetchProducts();
    } else {
      addToast({
        type: "error",
        message: result.error || t('admin.products.deleteError'),
      });
    }

    setDeleteDialog({ open: false, product: null });
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
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.products.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.products.subtitle')}</p>
        </div>
        <Button onClick={() => navigate("/admin/products/create")}>
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.products.addNew')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('admin.products.search')}
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="">{t('admin.products.allCategories')}</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="">{t('admin.products.allBrands')}</option>
              {brandOptions.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="">{t('admin.products.allStatus')}</option>
              <option value="active">{t('admin.products.active')}</option>
              <option value="inactive">{t('admin.products.inactive')}</option>
              <option value="out_of_stock">{t('admin.products.outOfStock')}</option>
              <option value="low_stock">{t('admin.products.lowStock')}</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="createdAt">{t('admin.products.newest')}</option>
              <option value="name">{t('admin.products.name')}</option>
              <option value="price">{t('admin.products.price')}</option>
              <option value="stock">{t('admin.products.stock')}</option>
              <option value="sold">{t('dashboard.orders')}</option>
            </select>
            <select
              value={filters.order}
              onChange={(e) => setFilters({ ...filters, order: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4"
            >
              <option value="desc">{t('admin.products.priceHighLow')}</option>
              <option value="asc">{t('admin.products.priceLowHigh')}</option>
            </select>
            <Button type="submit">{t('header.search')}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.products.title')} ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('admin.products.noProducts')}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.products.name')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.products.price')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.products.stock')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('dashboard.orders')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('admin.products.status')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">{t('admin.products.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id || product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={safeText(product.name, i18n.language, '')}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-400 text-xs">{t('common.noImage')}</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{safeText(product.name, i18n.language, 'N/A')}</p>
                              <p className="text-sm text-gray-500">{safeText(product.brand?.name, i18n.language, '')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{formatCurrency(product.price || 0)}</p>
                            {product.discountPrice != null && (
                              <p className="text-sm text-color4">
                                {formatCurrency(product.discountPrice)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.stock}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.sold || 0}</td>
                        <td className="py-3 px-4">{getStatusBadge(product.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => navigate(`/admin/products/${product._id || product.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => navigate(`/admin/products/${product._id || product.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => setDeleteDialog({ open: true, product })}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    {t('admin.products.list.pagination.page', { current: filters.page, total: totalPages })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={filters.page === 1}
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    >
                      {t('admin.products.list.pagination.prev')}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={filters.page === totalPages}
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    >
                      {t('admin.products.list.pagination.next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, product: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.products.list.deleteConfirm.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.products.list.deleteConfirm.description', { name: safeText(deleteDialog.product?.name, i18n.language, '') })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, product: null })}>{t('common.cancel')}</Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;

