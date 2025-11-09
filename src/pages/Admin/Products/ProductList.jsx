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
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{t('admin.products.title')}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">{t('admin.products.subtitle')}</p>
        </div>
        <Button 
          onClick={() => navigate("/admin/products/create")}
          className="w-full sm:w-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.products.addNew')}
        </Button>
      </div>

      {/* Filters - Responsive */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('admin.products.search')}
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 min-h-[44px] text-sm sm:text-base"
                />
              </div>
            </div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4 min-h-[44px] w-full sm:w-auto"
            >
              <option value="">{t('admin.products.allCategories')}</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value, page: 1 })}
              className="px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4 min-h-[44px] w-full sm:w-auto"
            >
              <option value="">{t('admin.products.allBrands')}</option>
              {brandOptions.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4 min-h-[44px] w-full sm:w-auto"
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
              className="px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4 min-h-[44px] w-full sm:w-auto"
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
              className="px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-color4 focus:border-color4 min-h-[44px] w-full sm:w-auto"
            >
              <option value="desc">{t('admin.products.priceHighLow')}</option>
              <option value="asc">{t('admin.products.priceLowHigh')}</option>
            </select>
            <Button type="submit" className="min-h-[44px] w-full sm:w-auto">{t('header.search')}</Button>
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
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                          {t('admin.products.name')}
                        </th>
                        <th className="px-3 py-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                          {t('admin.products.price')}
                        </th>
                        <th className="px-3 py-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                          {t('admin.products.stock')}
                        </th>
                        <th className="px-3 py-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                          {t('dashboard.orders')}
                        </th>
                        <th className="px-3 py-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                          {t('admin.products.status')}
                        </th>
                        <th className="px-3 py-3 sm:px-4 text-right text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                          {t('admin.products.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id || product.id} className="hover:bg-gray-50">
                          <td className="px-3 py-3 sm:px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {product.images && product.images[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={safeText(product.name, i18n.language, '')}
                                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                  <span className="text-gray-400 text-xs">{t('common.noImage')}</span>
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                                  {safeText(product.name, i18n.language, 'N/A')}
                                </p>
                                <p className="text-xs text-gray-500 truncate hidden sm:block">
                                  {safeText(product.brand?.name, i18n.language, '')}
                                </p>
                                {/* Mobile: Show price and stock */}
                                <div className="sm:hidden mt-1 space-y-1">
                                  <p className="text-xs font-medium text-gray-900">
                                    {formatCurrency(product.price || 0)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {t('admin.products.stock')}: {product.stock}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-4 whitespace-nowrap hidden md:table-cell">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-900">{formatCurrency(product.price || 0)}</p>
                              {product.discountPrice != null && (
                                <p className="text-xs text-color4">
                                  {formatCurrency(product.discountPrice)}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                            {product.stock}
                          </td>
                          <td className="px-3 py-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                            {product.sold || 0}
                          </td>
                          <td className="px-3 py-3 sm:px-4 whitespace-nowrap">
                            {getStatusBadge(product.status)}
                          </td>
                          <td className="px-3 py-3 sm:px-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => navigate(`/admin/products/${product._id || product.id}`)}
                                className="min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => navigate(`/admin/products/${product._id || product.id}/edit`)}
                                className="min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => setDeleteDialog({ open: true, product })}
                                className="min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto"
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

