import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function CatalogBreadCrumb({ category }) {
  return (
    <Breadcrumb className={"py-4 px-2"}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <p className="font-semibold">Trang chủ</p>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator> | </BreadcrumbSeparator>
        {category === "" ? (
          <BreadcrumbItem>
            <BreadcrumbPage>
              <p className="font-semibold">Tất cả danh mục</p>
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">
                <p className="font-semibold">Tất cả danh mục</p>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator> | </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>
                <p className="font-semibold capitalize">
                  {category.replace(/-/g, " ")}
                </p>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default CatalogBreadCrumb;
