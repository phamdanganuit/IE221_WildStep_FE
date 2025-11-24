import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { safeText, parseMultiLanguageSlug } from "@/lib/i18nUtils";

function CatalogBreadCrumb({ category, brandName, categoryName }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const brandFromUrl = searchParams.get("brand") || "";
  const categorySlug = searchParams.get("category_slug") || "";
  
  // Use provided names or fallback to URL params, and extract localized text
  const rawBrand = brandName || brandFromUrl;
  const displayBrand = typeof rawBrand === 'object' ? safeText(rawBrand, i18n.language, '') : rawBrand;
  
  // Parse category slug - if it's multi-language format, extract the part for current language
  let displayCategory = categoryName;
  if (!displayCategory && categorySlug) {
    const parsedSlug = parseMultiLanguageSlug(categorySlug, i18n.language);
    // Convert slug back to readable text (replace hyphens with spaces and capitalize)
    displayCategory = parsedSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Handle click on "Tất cả sản phẩm" to clear all filters
  const handleAllProductsClick = (e) => {
    e.preventDefault();
    // Clear all query params
    setSearchParams({}, { replace: true });
  };
  
  return (
    <Breadcrumb className={"py-4 px-2"}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <p className="font-semibold">Trang chủ</p>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator> | </BreadcrumbSeparator>
        {displayBrand ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products" onClick={handleAllProductsClick}>
                  <p className="font-semibold">Tất cả sản phẩm</p>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator> | </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/products?brand=${encodeURIComponent(displayBrand)}`}>
                  <p className="font-semibold">{displayBrand}</p>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {displayCategory ? (
              <>
                <BreadcrumbSeparator> | </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <p className="font-semibold capitalize">{displayCategory}</p>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </>
        ) : displayCategory ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products" onClick={handleAllProductsClick}>
                  <p className="font-semibold">Tất cả sản phẩm</p>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator> | </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>
                <p className="font-semibold capitalize">{displayCategory}</p>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>
              <p className="font-semibold">Tất cả sản phẩm</p>
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default CatalogBreadCrumb;
