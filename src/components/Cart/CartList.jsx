import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";
import CartHeader from "./CartHeader";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import QuantitySelector from "./QuantitySelector";
import RemoveDialog from "./RemoveDialog";
import { ScrollArea } from "../ui/scroll-area";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { useToast } from "@/contexts/ToastContext";
import { getMyCard, updateCartItemQuantity } from "@/service/cartService";
import { getProductDetail } from "@/service/contentService";
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN") + "₫";
};

function ProductCardCart({ isSelected, selectProduct, cartItem, index, updateQuantity }) {
  // Structure mới: cartItem có product (populated hoặc chỉ product_id), quantity, size, color
  const product = cartItem.product || {};
  const quantity = cartItem.quantity || 1;
  const size = cartItem.size || "";
  const color = cartItem.color || "";
  const productId = cartItem.product_id || product._id || product.id;
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { success, error } = useToast();
  
  // Kiểm tra xem product có đầy đủ thông tin không
  const hasProductInfo = product && (
    product._id || product.id || 
    product.name || 
    product.originalPrice !== undefined || 
    product.price !== undefined
  );
  
  // Support cả brandId (old) và brand (new)
  const brandName = safeText(
    product?.brand?.name || product?.brandId?.name, 
    i18n.language, 
    ''
  );
  const productName = hasProductInfo 
    ? safeText(product?.name, i18n.language, 'Không tìm thấy thông tin sản phẩm')
    : 'Không tìm thấy thông tin sản phẩm';
  const originalPrice = product?.originalPrice || product?.price || 0;
  const discount = product?.discount || 0;
  const stock = product?.stock || 0;
  const images = product?.images || [];

  const setQuantity = async (newQuantity) => {
    // Validate: không được vượt quá tồn kho
    if (stock > 0 && newQuantity > stock) {
      error(`Số lượng không được vượt quá tồn kho (${stock})`);
      // Giới hạn về tồn kho
      newQuantity = stock;
    }
    
    // Validate: số lượng tối thiểu là 1
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    
    // Update local state immediately (optimistic update)
    updateQuantity(index, newQuantity);
    
    // Call API to update
    const res = await updateCartItemQuantity(index, newQuantity);
    if (!res.success) {
      error(res.error || "Không thể cập nhật số lượng");
      // Rollback: reload cart
      // In a real app, you might want to refetch cart here
    }
  };

  return (
    <Card className={"my-2"}>
      <CardContent className={"flex items-center px-10 py-4"}>
        <div className="flex items-center w-1/2">
          {/*Checkbox*/}
          <div className="flex items-center space-x-4 flex-1">
            <Input
              type="checkbox"
              className="w-5 h-5 accent-teal-600 flex-shrink-0"
              checked={isSelected}
              onChange={(e) => selectProduct(cartItem, index)}
            />
            {/*Image*/}
            <div className="relative flex-shrink-0">
              <img
                src={images[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='Arial' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E"}
                alt={productName}
                className="w-16 lg:w-24 flex-shrink-0 aspect-square rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='Arial' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            {/*Product Info*/}
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p
                className="text-[1rem] lg:text-[1.2rem] font-semibold text-wrap hover:underline cursor-pointer"
                onClick={() => productId && navigate(`/product/${productId}`)}
              >
                {productName}
              </p>
              <p className="text-[0.8rem] lg:text-[0.9rem] text-gray-600">
                {brandName}
              </p>
              <div className="flex flex-col space-y-0.5">
                <p className="text-[0.8rem] font-semibold text-gray-700">Phân loại:</p>
                <p className="text-[0.9rem] text-gray-600">{color}, {size}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center w-1/2">
          <div className="flex flex-col items-center w-1/3 gap-1">
            <div className="flex flex-col items-center gap-1">
              {discount > 0 && (
                <span className="text-xs font-medium line-through text-gray-500">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <div className="flex items-center gap-2">
                {discount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded">
                    -{discount}%
                  </span>
                )}
                <span className="font-bold text-[0.8rem] md:text-[1rem] text-red-500">
                  {discount > 0
                    ? formatPrice(((100 - discount) * originalPrice) / 100)
                    : formatPrice(originalPrice)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/3 gap-1">
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              max={stock > 0 ? stock : undefined}
            />
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-600">Tồn kho:</span>
              <span className={`text-xs font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock > 0 ? `${stock}` : 'Hết'}
              </span>
            </div>
          </div>
          <div className="w-1/3 text-center flex justify-center">
            <RemoveDialog cartItem={cartItem} index={index} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CartList() {
  const [list, setList] = useState([]);
  const { success, error } = useToast();
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const fetchingRef = useRef(false); // Prevent concurrent fetches

  const setAllProducts = () => {
    setSelected(list.map((item, index) => ({ item, index })));
  };

  const clearAll = () => {
    setSelected([]);
  };

  const selectProduct = (cartItem, index) => {
    setSelected((prev) => {
      const isExist = prev.some((s) => s.index === index);
      if (isExist) {
        // Bỏ sản phẩm
        return prev.filter((s) => s.index !== index);
      }
      // Thêm sản phẩm
      return [...prev, { item: cartItem, index }];
    });
  };

  const isAllSelected = () => {
    return (
      selected.length === list.length &&
      list.length > 0 &&
      list.every((_, index) => selected.some((s) => s.index === index))
    );
  };

  const updateQuantity = (index, newQuantity) => {
    setList((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    setSelected((prev) =>
      prev.map((s) =>
        s.index === index
          ? { ...s, item: { ...s.item, quantity: newQuantity } }
          : s
      )
    );
  };

  const handleCheckout = () => {
    // navigate to checkout page
    // TODO: Implement checkout navigation
  };

  useEffect(() => {
    // Prevent concurrent fetches (especially in StrictMode)
    if (fetchingRef.current) {
      return;
    }
    
    const fetchCart = async () => {
      fetchingRef.current = true;
      try {
        const res = await getMyCard();
        if (res.success) {
          // Structure mới: data.products thay vì data.cart_products
          let products = res?.data?.products || [];
          
          // Populate product details nếu chưa có
          const failedItems = [];
          products = await Promise.all(
            products.map(async (item, index) => {
              // Nếu đã có product object đầy đủ (có _id và name hoặc originalPrice), giữ nguyên
              if (item.product && typeof item.product === 'object' && 
                  (item.product._id || item.product.id) && 
                  (item.product.name || item.product.originalPrice !== undefined || item.product.price !== undefined)) {
                return item;
              }
              
              // Nếu chỉ có product_id hoặc product chưa đầy đủ, fetch product details
              let productId = item.product_id || item.product?._id || item.product?.id || item.product;
              
              if (!productId) {
                failedItems.push({ index, reason: 'No product_id' });
                return item;
              }
              
              // Convert to string - handle ObjectId objects
              let productIdStr;
              if (typeof productId === 'object') {
                // Handle MongoDB ObjectId or similar objects
                if (productId._id) {
                  productIdStr = String(productId._id);
                } else if (productId.toString) {
                  productIdStr = productId.toString();
                } else {
                  productIdStr = String(productId);
                }
              } else {
                productIdStr = String(productId);
              }
              
              // Clean up the string (remove any whitespace)
              productIdStr = productIdStr.trim();
              
              try {
                const productRes = await getProductDetail(productIdStr);
                
                if (productRes.success && productRes.data) {
                  return {
                    ...item,
                    product: productRes.data,
                    product_id: productIdStr
                  };
                } else {
                  failedItems.push({ index, productId: productIdStr, reason: productRes.error });
                }
              } catch (err) {
                failedItems.push({ index, productId: productIdStr, reason: err.message });
              }
              
              // Nếu không fetch được, trả về item gốc
              return item;
            })
          );
          
          // Hiển thị error nếu có items không fetch được
          if (failedItems.length > 0) {
            if (failedItems.length === products.length) {
              error("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
            } else {
              error(`Không thể tải thông tin của ${failedItems.length} sản phẩm.`);
            }
          }
          
          setList(products);
        } else {
          error(res?.error || "Đã xảy ra lỗi khi lấy giỏ hàng");
        }
      } finally {
        fetchingRef.current = false;
      }
    };
    fetchCart();
  }, []); // Empty dependency array - only fetch once on mount

  if (list.length < 1) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <p className="text-[1.6rem] my-10">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng.
        </p>
        <Button onClick={() => navigate("/products")}>
          <ShoppingBag />
          <p>Đến trang danh mục sản phẩm</p>
        </Button>
      </div>
    );
  }

  const getTotalPrice = () => {
    return selected.reduce((total, { item }) => {
      const product = item.product || {};
      const originalPrice = product.originalPrice || product.price || 0;
      const discount = product.discount || 0;
      const quantity = item.quantity || 1;
      
      const price = discount > 0
        ? ((100 - discount) * originalPrice) / 100
        : originalPrice;

      return total + price * quantity;
    }, 0);
  };

  return (
    <div className="w-full mx-auto space-y-2">
      <CartHeader
        allProduct={isAllSelected()}
        clearAll={clearAll}
        setAllProducts={setAllProducts}
      />
      <ScrollArea className="overflow-y-auto pb-20 max-h-[600px]">
        {list.map((cartItem, i) => {
          const isSelected = selected.some((s) => s.index === i);
          return (
            <ProductCardCart
              key={i}
              isSelected={isSelected}
              selectProduct={selectProduct}
              cartItem={cartItem}
              index={i}
              updateQuantity={updateQuantity}
            />
          );
        })}
      </ScrollArea>
      <div
        className={`${
          selected.length > 0 ? "" : "hidden"
        } flex items-center justify-between px-4 border-1 border-color4 fixed bottom-1 left-0 w-full bg-white shadow-lg h-20`}
      >
        <p className="text-[0.8rem] md:text-[1rem]">
          Đã chọn {selected.length} sản phẩm
        </p>

        <div className="flex space-x-4 items-center">
          <p className="text-[0.8rem] md:text-[1rem]">
            Thành tiền:{" "}
            <span className="text-red-500 text-[1rem] md:text-[1.2rem] font-semibold">
              {formatPrice(getTotalPrice())}
            </span>
          </p>

          <Button onClick={handleCheckout}>
            <MdOutlineShoppingCartCheckout />
            <p>Thanh toán</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartList;
