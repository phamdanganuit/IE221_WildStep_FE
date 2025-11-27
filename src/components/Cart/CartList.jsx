import React, { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { safeText } from "@/lib/i18nUtils";

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN") + "₫";
};

function ProductCardCart({ isSelected, selectProduct, cp, updateQuantity }) {
  const product = cp.product;
  const option = cp.option;
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isNew = product?.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() <
      10 * 24 * 60 * 60 * 1000
    : false;
  const brandName = safeText(product?.brandId?.name, i18n.language, '');
  const productName = safeText(product?.name, i18n.language, 'N/A');
  const colorName = safeText(option?.color?.colorName, i18n.language, option?.color?.colorName || 'N/A');

  const setQuantity = (quantity) => {
    updateQuantity(cp._id, quantity);
  };
  return (
    <Card className={"my-2"}>
      <CardContent className={"flex items-center"}>
        <div className="flex flex-col md:flex-row justify-start items-center space-x-4 w-1/2">
          {/*Checkbox*/}
          <div className="flex justify-start items-center space-x-4">
            <Input
              type="checkbox"
              className="w-5 h-5 accent-teal-600 flex-shrink-0"
              checked={isSelected}
              onChange={(e) => selectProduct(cp)}
            />
            {/*Image & Badge*/}
            <div className="relative flex-shrink-0">
              {isNew && (
                <div
                  className="absolute top-2 sm:top-3 left-0 
          px-2 py-1 sm:px-3 sm:py-1.5
          bg-green-500 text-white text-xs sm:text-sm font-bold
          rounded-tr-lg rounded-br-lg shadow-md
          z-10"
                >
                  NEW
                </div>
              )}
              {product?.discount > 0 && !isNew && (
                <div
                  className="absolute top-2 sm:top-3 md:top-4 left-0 
          px-2 py-1 sm:px-3 sm:py-1.5
          bg-red-600 text-white text-xs sm:text-sm font-bold
          rounded-tr-lg rounded-br-lg shadow-md
          flex items-center gap-1 z-10"
                >
                  -{product?.discount}%
                </div>
              )}
              <img
                src={product?.images[0]}
                alt={product?.name}
                className="w-16 lg:w-24 flex-shrink-0 aspect-square rounded-lg"
              />
            </div>
            {/*Product Info*/}
            <div className="flex-col space-y-1 max-w-1/2">
              <p
                className="text-[1rem] lg:text-[1.2rem] font-semibold text-wrap hover:underline cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {productName}
              </p>
              <p className="text-[0.8rem] lg:text-[0.9rem] mr-5">
                {brandName}
              </p>
            </div>
          </div>

          {/*User Option*/}
          <div className="flex flex-row md:flex-col space-x-2 md:w-1/3 space-y-1 md:justify-items-center">
            <p className="text-[0.8rem] font-semibold">Phân loại:</p>
            <p className="text-[0.9rem]">{colorName},</p>
            <p className="text-[0.9rem]">{option?.size?.name || 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center w-1/2 justify-end">
          <div className="font-bold text-[0.8rem] md:text-[1rem] text-center text-red-500 w-1/3">
            {product?.discount > 0
              ? formatPrice(
                  ((100 - product?.discount) * product?.originalPrice) / 100
                )
              : formatPrice(product?.originalPrice)}
          </div>
          <div className="w-1/3 text-center">
            <QuantitySelector
              quantity={option?.quantity}
              setQuantity={setQuantity}
            />
          </div>
          <p className="w-1/3 text-center flex justify-center">
            <RemoveDialog cp={cp} onRemoveSuccess={fetchCart} />
          </p>
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

  const setAllProducts = () => {
    setSelected(list);
  };

  const clearAll = () => {
    setSelected([]);
  };

  const selectProduct = (cp) => {
    setSelected((prev) => {
      const isExist = prev.some((p) => p._id === cp._id);
      if (isExist) {
        // Bỏ sản phẩm
        return prev.filter((p) => p._id !== cp._id);
      }
      // Thêm sản phẩm
      return [...prev, cp];
    });
  };

  const isAllSelected = () => {
    return (
      selected.length === list.length &&
      list.every((p) => selected.some((s) => s._id === p._id))
    );
  };

  const updateQuantity = async (id, newQuantity) => {
    // Optimistic update
    setList((prev) =>
      prev.map((cp) =>
        cp._id === id
          ? { ...cp, option: { ...cp.option, quantity: newQuantity } }
          : cp
      )
    );
    setSelected((prev) =>
      prev.map((cp) =>
        cp._id === id
          ? { ...cp, option: { ...cp.option, quantity: newQuantity } }
          : cp
      )
    );

    // Call API
    try {
      const result = await updateCartItemQuantity(id, newQuantity);
      if (!result.success) {
        // Revert on error
        error(result.error || "Không thể cập nhật số lượng");
        // Refresh cart to get correct data
        const res = await getMyCard();
        if (res.success) {
          setList(res?.data?.cart_products || []);
        }
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      error("Đã xảy ra lỗi khi cập nhật số lượng");
      // Refresh cart to get correct data
      const res = await getMyCard();
      if (res.success) {
        setList(res?.data?.cart_products || []);
      }
    }
  };

  const handleCheckout = () => {
    // navigate to checkout page
  };

  const fetchCart = async () => {
    const res = await getMyCard();
    if (res.success) {
      setList(res?.data?.cart_products || []);
    } else {
      error(res?.error || "Đã xảy ra lỗi khi lấy giỏ hàng");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

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
    return selected.reduce((total, item) => {
      const price =
        item.product.discount > 0
          ? ((100 - item.product.discount) * item.product.originalPrice) / 100
          : item.product.originalPrice;

      return total + price * item.option.quantity;
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
        {list.map((cp, i) => {
          return (
            <ProductCardCart
              key={i}
              isSelected={selected.some((s) => s._id === cp._id)}
              selectProduct={selectProduct}
              cp={cp}
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
