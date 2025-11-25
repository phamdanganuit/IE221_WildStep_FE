import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiCheckCircle,
  FiMapPin,
} from "react-icons/fi";
import {
  MdOutlineWest,
  MdOutlineEast,
  MdOutlineCreditCard,
} from "react-icons/md";
import { cn } from "@/lib/utils";
import OrderSummary from "../../components/Checkout/OrderInfo";
import ShippingInfo from "../../components/Checkout/ShippingInfo";
import PaymentMethod from "../../components/Checkout/Method";
import OrderComplete from "../../components/Checkout/OrderComplete";
import Stepper from "@/components/Checkout/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { getMyCard } from "@/service/cartService";
import { getAddresses } from "@/service/addressService";
import { validateVoucher, getMyVouchersList } from "@/service/voucherService";
import { createOrder } from "@/service/orderService";
import { getProductDetail } from "@/service/contentService";
import { useToast } from "@/contexts/ToastContext";

// Helper function to get address ID (supports both 'id' and '_id')
const getAddressId = (address) => {
  if (!address) return null;
  return address.id || address._id || null;
};

// Helper function to compare address IDs
const compareAddressIds = (id1, id2) => {
  if (!id1 || !id2) return false;
  return String(id1) === String(id2);
};

// Helper function to transform cart API response to UI format
// Now fetches product details for each product_id
const transformCartItems = async (cartData) => {
  if (!cartData || !cartData.products || cartData.products.length === 0) {
    return [];
  }

  // Fetch product details for all products in parallel
  const productPromises = cartData.products.map(async (item, index) => {
    try {
      const productResult = await getProductDetail(item.product_id);
      const product = productResult.success && productResult.data ? productResult.data : {};
      
      const productName = product.name || {};
      const name = typeof productName === 'string' 
        ? productName 
        : productName.vi || productName.en || 'Sản phẩm';
      
      const images = product.images || [];
      const image = images.length > 0 
        ? (images[0].startsWith('http') ? images[0] : `${import.meta.env.VITE_BACKEND_URL}${images[0]}`)
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
      
      // Calculate price - use discountPrice if available, otherwise originalPrice
      const price = product.discountPrice || product.price || product.originalPrice || 0;
      
      return {
        id: index, // Use index as ID - this is the cartItemId for API
        originalIndex: index, // Store original index from API response
        product_id: item.product_id,
        image,
        name,
        color: item.color || 'Mặc định',
        size: item.size || '',
        price,
        qty: item.quantity || 1,
        category_id: product.category?._id || product.category_id,
      };
    } catch (error) {
      console.error(`Error fetching product ${item.product_id}:`, error);
      // Return item with default values if product fetch fails
      return {
        id: index,
        originalIndex: index,
        product_id: item.product_id,
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=',
        name: 'Sản phẩm',
        color: item.color || 'Mặc định',
        size: item.size || '',
        price: 0,
        qty: item.quantity || 1,
        category_id: null,
      };
    }
  });

  return await Promise.all(productPromises);
};

export default function CheckoutPage() {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [fullCart, setFullCart] = useState([]); // Store full cart from API
  const [selectedCartItems, setSelectedCartItems] = useState(null); // Selected items from cart page
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState([]); // Changed to array for multi-select
  const [availableVouchers, setAvailableVouchers] = useState([]); // Vouchers from wallet
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState("");
  const { success: showSuccess, error: showError } = useToast();
  const hasLoadedRef = React.useRef(false); // Prevent double API calls

  // Function to filter cart by selected items
  const filterCartBySelected = (transformedCart, selectedItems) => {
    if (!selectedItems || selectedItems.length === 0) {
      return transformedCart;
    }

    // Filter cart to only include selected items
    // Match by product_id + size + color (unique combination)
    return transformedCart.filter((item) => {
      return selectedItems.some((selected) => {
        const productIdMatch = String(selected.productId) === String(item.product_id);
        const sizeMatch = String(selected.size || "") === String(item.size || "");
        const colorMatch = String(selected.color || "") === String(item.color || "");
        
        // Match by product_id + size + color
        return productIdMatch && sizeMatch && colorMatch;
      });
    });
  };

  // Refs to avoid dependency issues
  const selectedCartItemsRef = React.useRef(null);
  const showErrorRef = React.useRef(showError);
  
  // Update ref when showError changes
  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  // Function to reload cart - exported for manual refresh if needed
  const reloadCart = useCallback(async (selectedItems = null) => {
    const itemsToUse = selectedItems !== null ? selectedItems : selectedCartItemsRef.current;
    const cartResult = await getMyCard();
    if (cartResult.success && cartResult.data) {
      const transformedCart = await transformCartItems(cartResult.data);
      setFullCart(transformedCart);
      
      // Filter cart based on selected items if coming from cart page
      if (itemsToUse && itemsToUse.length > 0) {
        const filteredCart = filterCartBySelected(transformedCart, itemsToUse);
        setCart(filteredCart);
      } else {
        // If no selected items, show full cart
        setCart(transformedCart);
      }
    } else {
      showErrorRef.current(cartResult.error || "Không thể tải giỏ hàng");
    }
  }, []); // No dependencies - use refs instead

  // Load cart and addresses on mount - only when location.state changes
  useEffect(() => {
    // Prevent double calls in React StrictMode
    if (hasLoadedRef.current) return;
    
    // Get selected items from navigation state
    const stateSelectedItems = location.state?.selectedCartItems;
    if (stateSelectedItems) {
      selectedCartItemsRef.current = stateSelectedItems;
      setSelectedCartItems(stateSelectedItems);
    } else {
      selectedCartItemsRef.current = null;
    }

    const loadData = async () => {
      hasLoadedRef.current = true;
      setIsLoadingData(true);
      
      // Load cart inline to avoid dependency issues
      const itemsToUse = selectedCartItemsRef.current;
      const cartResult = await getMyCard();
      if (cartResult.success && cartResult.data) {
        const transformedCart = await transformCartItems(cartResult.data);
        setFullCart(transformedCart);
        
        // Filter cart based on selected items if coming from cart page
        if (itemsToUse && itemsToUse.length > 0) {
          const filteredCart = filterCartBySelected(transformedCart, itemsToUse);
          setCart(filteredCart);
        } else {
          setCart(transformedCart);
        }
      } else {
        showErrorRef.current(cartResult.error || "Không thể tải giỏ hàng");
      }

      // Load addresses
      const addressResult = await getAddresses();
      if (addressResult.success && addressResult.data) {
        const addressList = Array.isArray(addressResult.data) 
          ? addressResult.data 
          : addressResult.data.data || [];
        setAddresses(addressList);
        
        // Set default address if available
        const defaultAddr = addressList.find(addr => addr.is_default || addr.default);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      } else {
        showErrorRef.current(addressResult.error || "Không thể tải danh sách địa chỉ");
      }

      // Load available vouchers from wallet
      const vouchersResult = await getMyVouchersList();
      if (vouchersResult.success && vouchersResult.data) {
        setAvailableVouchers(vouchersResult.data);
      }

      setIsLoadingData(false);
    };

    loadData();
    
    // Reset ref when component unmounts or location.state changes
    return () => {
      hasLoadedRef.current = false;
    };
  }, [location.state?.selectedCartItems]); // Only depend on location.state

  // Update cart when selectedCartItems or fullCart changes
  useEffect(() => {
    if (fullCart.length > 0) {
      if (selectedCartItems && selectedCartItems.length > 0) {
        const filteredCart = filterCartBySelected(fullCart, selectedCartItems);
        setCart(filteredCart);
      } else {
        setCart(fullCart);
      }
    }
  }, [selectedCartItems, fullCart]);

  // Ensure selectedAddress is still valid when addresses change
  useEffect(() => {
    if (addresses.length === 0) {
      // If no addresses, clear selected address
      if (selectedAddress) {
        setSelectedAddress(null);
      }
      return;
    }
    
    // Use helper to get current selectedAddress ID (supports both 'id' and '_id')
    const currentSelectedId = getAddressId(selectedAddress);
    
    if (currentSelectedId) {
      // Check if selectedAddress still exists in addresses list by ID
      const addressExists = addresses.some(addr => 
        compareAddressIds(getAddressId(addr), currentSelectedId)
      );
      
      if (!addressExists) {
        // Selected address no longer exists, find default or first address
        const defaultAddr = addresses.find(addr => addr.is_default || addr.default || addr.isDefault);
        const newAddress = defaultAddr || addresses[0];
        if (newAddress && getAddressId(newAddress)) {
          setSelectedAddress(newAddress);
        }
      } else {
        // Selected address exists - verify it's the same object or update if needed
        // Only update if the address was edited (same ID but different data)
        // Don't update if it's the same object to avoid unnecessary re-renders
        const updatedAddress = addresses.find(addr => 
          compareAddressIds(getAddressId(addr), currentSelectedId)
        );
        
        if (updatedAddress && selectedAddress) {
          // Only update if critical fields changed (receiver, phone, detail, province)
          const criticalFields = ['receiver', 'phone', 'detail', 'province', 'district', 'ward'];
          const hasChanged = criticalFields.some(field => 
            selectedAddress[field] !== updatedAddress[field]
          );
          
          if (hasChanged) {
            // Update with latest data
            setSelectedAddress(updatedAddress);
          }
          // Otherwise, keep the current selectedAddress to maintain user selection
        }
      }
    } else if (addresses.length > 0 && !selectedAddress) {
      // No address selected, set default or first address (only if not already selected)
      const defaultAddr = addresses.find(addr => addr.is_default || addr.default || addr.isDefault);
      const newAddress = defaultAddr || addresses[0];
      if (newAddress && getAddressId(newAddress)) {
        setSelectedAddress(newAddress);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]); // Only depend on addresses to avoid loops

  useEffect(() => {
    const state = {
      step,
      cart,
      addresses,
      selectedAddress,
      paymentMethod,
      cardDetails,
      voucherCode,
      appliedVouchers,
    };
    localStorage.setItem("checkoutState", JSON.stringify(state));
  }, [
    step,
    cart,
    addresses,
    selectedAddress,
    paymentMethod,
    cardDetails,
    voucherCode,
    appliedVouchers,
  ]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 30000; // Default shipping fee from API

  // Apply voucher by code (manual input)
  const applyVoucher = async () => {
    setVoucherError("");

    const code = voucherCode.trim().toUpperCase();
    if (!code) {
      setVoucherError("Vui lòng nhập mã voucher");
      return;
    }

    // Check if voucher already applied
    if (appliedVouchers.some(v => v.code === code)) {
      setVoucherError("Voucher này đã được áp dụng");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare cart items for validation
      const cartItems = cart.map(item => ({
        category_id: item.category_id,
      }));

      const result = await validateVoucher(code, subtotal, cartItems);
      
      if (result.success && result.valid) {
        // Determine discount_type: if discount is between 0 and 1, it's percentage
        const discount = result.voucher.discount;
        let discountType = result.voucher.discount_type;
        if (!discountType && typeof discount === "number") {
          if (discount > 0 && discount < 1) {
            discountType = 'percentage';
          } else {
            discountType = 'fixed';
          }
        }
        
        const newVoucher = {
          _id: result.voucher._id,
          code: result.voucher.code,
          name: result.voucher.name,
          discount: discount,
          discount_type: discountType,
          discount_amount: result.discount_amount,
          min_value: result.voucher.min_value || result.voucher.minValue,
          max_discount: result.voucher.max_discount || result.voucher.maxDiscount,
          categories: result.voucher.categories || [],
        };
        
        setAppliedVouchers(prev => [...prev, newVoucher]);
        setVoucherCode("");
        setVoucherError("");
        showSuccess(result.message || "Áp dụng voucher thành công!");
      } else {
        setVoucherError(result.message || result.error || "Voucher không hợp lệ");
      }
    } catch (err) {
      setVoucherError(err.message || "Đã xảy ra lỗi khi validate voucher");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle voucher selection from wallet
  const toggleVoucher = async (voucher) => {
    // Check if already applied
    const isApplied = appliedVouchers.some(v => v._id === voucher._id || v.code === voucher.code);
    
    if (isApplied) {
      // Remove voucher
      setAppliedVouchers(prev => prev.filter(v => v._id !== voucher._id && v.code !== voucher.code));
      showSuccess("Đã bỏ chọn voucher");
      return;
    }

    // Validate and add voucher
    setIsLoading(true);
    try {
      const cartItems = cart.map(item => ({
        category_id: item.category_id,
      }));

      const result = await validateVoucher(voucher.code, subtotal, cartItems);
      
      if (result.success && result.valid) {
        // Determine discount_type: if discount is between 0 and 1, it's percentage
        const discount = result.voucher.discount;
        let discountType = result.voucher.discount_type;
        if (!discountType && typeof discount === "number") {
          if (discount > 0 && discount < 1) {
            discountType = 'percentage';
          } else {
            discountType = 'fixed';
          }
        }
        
        const newVoucher = {
          _id: result.voucher._id,
          code: result.voucher.code,
          name: result.voucher.name,
          discount: discount,
          discount_type: discountType,
          discount_amount: result.discount_amount,
          min_value: result.voucher.min_value || result.voucher.minValue,
          max_discount: result.voucher.max_discount || result.voucher.maxDiscount,
          categories: result.voucher.categories || [],
        };
        
        setAppliedVouchers(prev => [...prev, newVoucher]);
        showSuccess("Áp dụng voucher thành công!");
      } else {
        showError(result.message || result.error || "Voucher không hợp lệ");
      }
    } catch (err) {
      showError(err.message || "Đã xảy ra lỗi khi validate voucher");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove voucher
  const removeVoucher = (voucherId) => {
    setAppliedVouchers(prev => prev.filter(v => v._id !== voucherId));
    showSuccess("Đã bỏ chọn voucher");
  };

  // TÍNH GIẢM GIÁ - Hỗ trợ multi voucher và phân biệt shipping vs subtotal
  // Note: Frontend calculates discount for all vouchers for display
  // But backend only applies the first voucher when creating order
  const { discount: subtotalDiscount, shippingDiscount } = React.useMemo(() => {
    if (!appliedVouchers || appliedVouchers.length === 0) {
      return { discount: 0, shippingDiscount: 0 };
    }

    let subtotalDiscountTotal = 0;
    let shippingDiscountTotal = 0;

    appliedVouchers.forEach(voucher => {
      // Check if voucher is for shipping (categories = []) or subtotal (categories has values)
      const isShippingVoucher = !voucher.categories || voucher.categories.length === 0;
      
      // Always calculate discount based on discount and discount_type
      // Don't rely on discount_amount from API as it may be outdated or incorrect
      let voucherDiscount = 0;
      
      if (typeof voucher.discount === "number") {
        // Determine discount type
        // If discount is between 0 and 1 (exclusive), it's ALWAYS percentage (0.5 = 50%)
        // This overrides discount_type from API to prevent errors
        // Otherwise, use discount_type from API or default to 'fixed'
        let discountType;
        
        if (voucher.discount > 0 && voucher.discount < 1) {
          // Always treat values between 0 and 1 as percentage
          discountType = 'percentage';
        } else {
          // Use discount_type from API, or default to 'fixed' for values >= 1
          discountType = voucher.discount_type || 'fixed';
        }
        
        if (discountType === 'percentage') {
          // Percentage discount: 0.5 = 50%, 0.1 = 10%
          if (isShippingVoucher) {
            voucherDiscount = shipping * voucher.discount;
          } else {
            voucherDiscount = subtotal * voucher.discount;
          }
        } else {
          // Fixed amount discount
          voucherDiscount = voucher.discount;
        }

        // Apply maxDiscount if available
        const maxDiscount = voucher.max_discount || voucher.maxDiscount;
        if (maxDiscount !== undefined && maxDiscount !== null && maxDiscount > 0) {
          voucherDiscount = Math.min(voucherDiscount, maxDiscount);
        }
      }

      // Apply discount to appropriate category
      if (isShippingVoucher) {
        shippingDiscountTotal += voucherDiscount;
      } else {
        subtotalDiscountTotal += voucherDiscount;
      }
    });

    return {
      discount: subtotalDiscountTotal,
      shippingDiscount: shippingDiscountTotal,
    };
  }, [appliedVouchers, subtotal, shipping]);

  const total = subtotal - subtotalDiscount + shipping - shippingDiscount;

  const validateStep = () => {
    if (step === 1) return cart.length > 0;
    if (step === 2) {
      // More thorough validation: check if selectedAddress exists and has id
      // Also verify it exists in addresses list
      const selectedId = getAddressId(selectedAddress);
      if (!selectedAddress || !selectedId) {
        return false;
      }
      // Double check: verify the selected address still exists in addresses list
      const addressExists = addresses.some(addr => 
        compareAddressIds(getAddressId(addr), selectedId)
      );
      return addressExists;
    }
    if (step === 3) return !!paymentMethod;
    return true;
  };

  const goToStep = (newStep) => {
    if (newStep < step) {
      // Going back - always allow
      setError("");
      setStep(newStep);
    } else if (newStep > step) {
      // Going forward - validate first
      if (validateStep()) {
        setError("");
        setStep(newStep);
      } else {
        // Set appropriate error message based on current step
        if (step === 1) {
          setError("Giỏ hàng trống");
        } else if (step === 2) {
          setError("Vui lòng chọn địa chỉ giao hàng");
        } else if (step === 3) {
          setError("Vui lòng chọn phương thức thanh toán");
        }
      }
    }
  };

  const handlePlaceOrder = async () => {
    // Validate and find selected address - with fallback
    let addressToUse = selectedAddress;
    
    // If selectedAddress is null but addresses exist, try to find default or first address
    if (!addressToUse && addresses.length > 0) {
      const defaultAddr = addresses.find(addr => addr.is_default || addr.default || addr.isDefault);
      addressToUse = defaultAddr || addresses[0];
      // Update state to reflect the address being used
      if (addressToUse) {
        setSelectedAddress(addressToUse);
      }
    }
    
    const addressId = getAddressId(addressToUse);
    if (!addressToUse || !addressId) {
      setError("Vui lòng chọn địa chỉ giao hàng");
      // Force user back to step 2 to select address
      setStep(2);
      return;
    }

    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán");
      setStep(3);
      return;
    }

    if (cart.length === 0) {
      setError("Giỏ hàng trống");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Map payment method to API format
      const paymentMethodMap = {
        'COD': 'cod',
        'card': 'credit_card',
        'wallet': 'e_wallet',
      };
      const apiPaymentMethod = paymentMethodMap[paymentMethod] || paymentMethod.toLowerCase();

      // Get voucher IDs
      // Note: Backend API currently supports single voucher_id
      // If multiple vouchers are selected, only the first one will be sent
      // Frontend calculates discount for all vouchers for display, but backend applies only one
      const voucherIds = appliedVouchers.length > 0 
        ? appliedVouchers.map(v => v._id).filter(Boolean)
        : null;

      // Warn user if multiple vouchers selected (backend only supports one)
      if (appliedVouchers.length > 1) {
        const confirmMessage = `Bạn đã chọn ${appliedVouchers.length} vouchers. Hệ thống chỉ có thể áp dụng 1 voucher cho đơn hàng. Bạn có muốn tiếp tục với voucher đầu tiên?`;
        if (!window.confirm(confirmMessage)) {
          setIsLoading(false);
          return;
        }
      }

      const result = await createOrder(
        addressId, // Use addressId from helper function
        voucherIds, // Array will be handled by service (sends first voucher)
        apiPaymentMethod,
        null // notes - can be added later if needed
      );

      if (result.success) {
        const orderData = result.data;
        setOrderId(orderData._id || orderData.order_number || `ORDER-${Date.now()}`);
        showSuccess(result.message || "Đặt hàng thành công!");
        setIsOrderPlaced(true);
        
        // Clear cart from localStorage state
        localStorage.removeItem("checkoutState");
      } else {
        setError(result.error || "Đặt hàng thất bại");
        showError(result.error || "Đặt hàng thất bại");
      }
    } catch (err) {
      const errorMsg = err.message || "Đặt hàng thất bại";
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOrderPlaced && orderId) {
      goToStep(4);
      setIsOrderPlaced(false);
    }
  }, [isOrderPlaced, orderId]);

  const steps = [
    { number: 1, label: "Tổng quan đơn hàng", icon: FiShoppingBag },
    { number: 2, label: "Thông tin giao hàng", icon: FiTruck },
    { number: 3, label: "Phương thức thanh toán", icon: FiCreditCard },
    { number: 4, label: "Hoàn tất đơn hàng", icon: FiCheckCircle },
  ];

  // SIDEBAR
  const renderSidebar = () => (
    <div className="bg-white rounded-xl shadow-sm p-5 sticky top-6">
      <h3 className="font-semibold text-lg mb-4">Đơn hàng của bạn</h3>

      {step === 1 && (
        <div className="mb-4 space-y-3">
          {/* Manual voucher input */}
          <div className="flex gap-2">
            <Input
              value={voucherCode}
              onChange={(e) => {
                setVoucherCode(e.target.value);
                setVoucherError("");
              }}
              placeholder="Nhập mã giảm giá"
              className="flex h-10 text-[1rem]"
              onKeyDown={(e) => e.key === "Enter" && applyVoucher()}
            />
            <Button 
              onClick={applyVoucher} 
              className="h-10 flex flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Đang kiểm tra..." : "Sử dụng"}
            </Button>
          </div>
          {voucherError && (
            <p className="text-xs text-red-600 mt-1">{voucherError}</p>
          )}

          {/* Voucher from wallet */}
          {availableVouchers.length > 0 && (
            <div>
              <Button
                variant="outline"
                onClick={() => setShowVoucherList(!showVoucherList)}
                className="w-full text-sm"
              >
                {showVoucherList ? "Ẩn" : "Chọn từ ví voucher"} ({availableVouchers.length})
              </Button>
              
              {showVoucherList && (
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {availableVouchers.map((voucher) => {
                    const isApplied = appliedVouchers.some(v => v._id === voucher._id || v.code === voucher.code);
                    const isShippingVoucher = !voucher.categories || voucher.categories.length === 0;
                    const discountType = voucher.discount_type || (voucher.discount < 1 && voucher.discount > 0 ? 'percentage' : 'fixed');
                    const discountText = discountType === 'percentage' 
                      ? `${(voucher.discount * 100).toFixed(0)}%` 
                      : `${voucher.discount.toLocaleString()}đ`;
                    
                    return (
                      <div
                        key={voucher._id || voucher.code}
                        className={cn(
                          "p-2 border rounded-lg cursor-pointer transition-colors",
                          isApplied 
                            ? "bg-teal-50 border-teal-300" 
                            : "bg-white border-gray-200 hover:border-teal-300"
                        )}
                        onClick={() => toggleVoucher(voucher)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isApplied}
                                onChange={() => toggleVoucher(voucher)}
                                className="mt-1"
                              />
                              <div>
                                <p className="font-medium text-sm">{voucher.name || voucher.code}</p>
                                <p className="text-xs text-gray-600">
                                  {isShippingVoucher ? "Giảm phí ship" : "Giảm giá sản phẩm"} - {discountText}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Applied vouchers list */}
          {appliedVouchers.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Voucher đã áp dụng:</p>
              {appliedVouchers.map((voucher, index) => {
                const isShippingVoucher = !voucher.categories || voucher.categories.length === 0;
                const isFirstVoucher = index === 0;
                return (
                  <div
                    key={voucher._id || voucher.code}
                    className={cn(
                      "flex items-center justify-between p-2 rounded text-xs",
                      isFirstVoucher 
                        ? "bg-teal-50 border border-teal-200" 
                        : "bg-yellow-50 border border-yellow-200"
                    )}
                  >
                    <div className="flex-1">
                      <span className={isFirstVoucher ? "text-teal-700" : "text-yellow-700"}>
                        {voucher.name || voucher.code}
                      </span>
                      {!isFirstVoucher && (
                        <span className="ml-1 text-yellow-600 text-[10px]">(Chỉ hiển thị, không áp dụng)</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeVoucher(voucher._id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              {appliedVouchers.length > 1 && (
                <p className="text-xs text-yellow-600 mt-1 px-2">
                  ⚠️ Chỉ voucher đầu tiên sẽ được áp dụng khi đặt hàng
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 2+ */}
      {step >= 2 && selectedAddress && (
        <div className="mb-4 p-3 bg-teal-50 rounded-lg text-sm border border-teal-200">
          <div className="flex items-center gap-1 text-teal-700 font-medium mb-1">
            <FiMapPin className="text-xs" />
            <span>Giao đến</span>
          </div>
          <p className="font-medium">{selectedAddress.receiver}</p>
          <p className="text-gray-600">{selectedAddress.phone}</p>
          <p className="text-gray-600 mt-1">
            {[
              selectedAddress.detail,
              selectedAddress.ward,
              selectedAddress.district,
              selectedAddress.province,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString()} VND</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span>{shipping.toLocaleString()} VND</span>
        </div>

        {subtotalDiscount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Giảm giá sản phẩm</span>
            <span className="text-red-600">
              -{subtotalDiscount.toLocaleString()} VND
            </span>
          </div>
        )}

        {shippingDiscount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Giảm phí vận chuyển</span>
            <span className="text-red-600">
              -{shippingDiscount.toLocaleString()} VND
            </span>
          </div>
        )}

        {/* STEP 3+ */}
        {step >= 3 && paymentMethod && (
          <div className="mb-4 text-sm flex justify-between gap-1">
            <div className="flex items-center font-medium">
              <span>Phương thức thanh toán</span>
            </div>
            <p className="font-medium ">
              {paymentMethod === "COD" && "Thanh toán COD"}
              {paymentMethod === "card" && "Thẻ tín dụng/ghi nợ"}
              {paymentMethod === "wallet" && "Ví điện tử"}
            </p>
          </div>
        )}

        <div className="border-t pt-2 font-semibold text-lg flex justify-between">
          <span>Thành tiền</span>
          <span className="text-color4">{total.toLocaleString()} VND</span>
        </div>
      </div>

      {/* STEP 4 */}
      {step === 4 && orderId && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm border border-green-200">
          <p className="font-medium text-green-700">Đơn hàng đã được đặt!</p>
          <p className="text-green-600">
            Mã: <span className="font-mono">{orderId}</span>
          </p>
        </div>
      )}
    </div>
  );

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        <div className="max-w-[95%] mx-auto p-4 md:p-5">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color4 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !isOrderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <Header />
        <div className="max-w-[95%] mx-auto p-4 md:p-5">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-4">Giỏ hàng trống</p>
              <Button onClick={() => window.location.href = '/'}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <div className="max-w-[95%] mx-auto p-4 md:p-5">
        <Stepper steps={steps} currentStep={step} onStepClick={goToStep} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`lg:col-span-2 transition-all duration-300 ${
              step === 4 ? "lg:col-span-3" : ""
            }`}
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              {step === 1 && (
                <OrderSummary
                  cart={cart}
                  setCart={setCart}
                  reloadCart={reloadCart}
                  fullCart={fullCart}
                  subtotal={subtotal}
                  discount={subtotalDiscount + shippingDiscount}
                  shipping={shipping}
                  total={total}
                />
              )}
              {step === 2 && (
                <ShippingInfo
                  addresses={addresses}
                  setAddresses={setAddresses}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                />
              )}
              {step === 3 && (
                <PaymentMethod
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  cardDetails={cardDetails}
                  setCardDetails={setCardDetails}
                />
              )}
              {step === 4 && orderId && (
                <OrderComplete
                  orderId={orderId}
                  cart={cart}
                  selectedAddress={selectedAddress}
                  paymentMethod={paymentMethod}
                  total={total}
                  subtotal={subtotal}
                  shipping={shipping}
                  discount={subtotalDiscount + shippingDiscount}
                  appliedVouchers={appliedVouchers}
                />
              )}
              {step === 4 && !orderId && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <h2 className="text-xl font-semibold mb-4">Xác nhận đơn hàng</h2>
                    <p className="text-gray-600 mb-6">
                      Vui lòng xác nhận để hoàn tất đơn hàng
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => goToStep(3)}
                        className="flex items-center gap-1"
                      >
                        <MdOutlineWest className="w-4 h-4" />
                        Quay lại
                      </Button>
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                        className="flex items-center gap-1"
                      >
                        {isLoading ? (
                          <>Đang xử lý...</>
                        ) : (
                          <>
                            Xác nhận đặt hàng
                            <FiCheckCircle className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                    {error && <p className="mt-4 text-red-600">{error}</p>}
                  </div>
                </div>
              )}
            </div>

            {step < 4 && (
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => goToStep(step - 1)}
                  disabled={step === 1}
                  className="flex items-center gap-1"
                >
                  <MdOutlineWest className="w-4 h-4" />
                  Quay lại
                </Button>

                {step < 3 ? (
                  <Button
                    onClick={() => goToStep(step + 1)}
                    disabled={!validateStep()}
                    className="flex items-center gap-1"
                  >
                    Tiếp theo
                    <MdOutlineEast className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    {paymentMethod === "COD" ? (
                      <Button
                        onClick={() => goToStep(step + 1)}
                        disabled={!validateStep()}
                        className="flex items-center gap-1"
                      >
                        Tiếp theo
                        <MdOutlineEast className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={!validateStep() || isLoading}
                        {...(isLoading && { loading: true })}
                        className={cn(
                          "flex items-center gap-1",
                          isLoading && "cursor-not-allowed"
                        )}
                      >
                        {isLoading ? (
                          <>Đang xử lý...</>
                        ) : (
                          <>
                            Thanh toán
                            <MdOutlineCreditCard className="w-4 h-4 ml-1" />
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
            {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
          </div>

          {/* RIGHT – Dynamic sidebar */}
          {step < 4 && <div className="lg:col-span-1">{renderSidebar()}</div>}
        </div>
      </div>
    </div>
  );
}
