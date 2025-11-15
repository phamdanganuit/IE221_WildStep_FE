import React, { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils"
import OrderSummary from "../../components/Checkout/OrderInfo";
import ShippingInfo from "../../components/Checkout/ShippingInfo";
import PaymentMethod from "../../components/Checkout/Method";
import OrderComplete from "../../components/Checkout/OrderComplete";
import Stepper from "@/components/Checkout/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

const mockCartItems = [
  {
    id: 1,
    image:
      "https://shoeshop.blob.core.windows.net/media/products/69110ac083c5c6519af1ec97_37accb34.avif",
    name: "Cloud Shift Lightweight Runner Pro Edition",
    color: "White/Brown",
    size: "EU37",
    price: 120000,
    qty: 1,
  },
  {
    id: 2,
    image:
      "https://shoeshop.blob.core.windows.net/media/products/69110ac083c5c6519af1ec97_37accb34.avif",
    name: "Cloud Shift Lightweight Runner Pro Edition",
    color: "White/Brown",
    size: "EU37",
    price: 120000,
    qty: 1,
  },
  {
    id: 3,
    image:
      "https://shoeshop.blob.core.windows.net/media/products/69110ac083c5c6519af1ec97_37accb34.avif",
    name: "Cloud Shift Lightweight Runner Pro Edition",
    color: "White/Brown",
    size: "EU37",
    price: 120000,
    qty: 1,
  },
];

const mockAddresses = [
  {
    _id: "addr_001",
    receiver: "Hac Thien Cau",
    detail: "Khu phố 34",
    ward: "Phường Linh Xuân",
    district: "Quận Thủ Đức",
    province: "Thành phố Hồ Chí Minh",
    phone: "+84 779765688",
    default: true,
    createdAt: "2025-11-14T00:00:00.000Z",
  },
  {
    _id: "addr_002",
    receiver: "Jeroen",
    detail: "1016 DW Keizersgracht 172",
    ward: "",
    district: "Centrum",
    province: "Amsterdam",
    phone: "+31612345678",
    default: false,
    createdAt: "2025-01-12T00:00:00.000Z",
  },
];

const vouchers = [
  {
    _id: "voucher_001",
    name: "Giảm 29.900đ cho đơn hàng đầu tiên",
    code: "WILDSTEPWELCOME",
    description:
      "Giảm 29.900đ cho đơn hàng đầu tiên. - Áp dụng cho tất cả sản phẩm.",
    discount: 29900,
    minValue: null,
    maxDiscount: 29900,
    start: "2025-01-01T00:00:00.000Z",
    expired: "2025-12-31T23:59:59.000Z",
  },
  {
    _id: "voucher_002",
    name: "Giảm 10% tối đa 50k cho đơn từ 300k",
    code: "SAVE10",
    description:
      "Giảm 10% tối đa 50.000đ. - Áp dụng cho đơn từ 300k. - Áp dụng cho tất cả sản phẩm. - Không áp dụng cùng các chương trình khuyến mãi khác.",
    discount: 0.1,
    minValue: "300000",
    maxDiscount: 50000,
    start: "2025-01-01T00:00:00.000Z",
    expired: "2025-12-31T23:59:59.000Z",
  },
  {
    _id: "voucher_003",
    name: "Giảm 20% tối đa 100k cho đơn từ 800k",
    code: "WILD20",
    description:
      "Giảm 20% cho đơn từ 800k. - Áp dụng cho tất cả sản phẩm. - Không áp dụng cùng các chương trình khuyến mãi khác.",
    discount: 0.2,
    minValue: "800000",
    start: "2024-01-01T00:00:00.000Z",
    expired: "2024-12-31T23:59:59.000Z",
  },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(mockCartItems);
  const [addresses, setAddresses] = useState(mockAddresses);
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
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("checkoutState");
    if (saved) {
      const data = JSON.parse(saved);
      setStep(data.step ?? 1);
      setCart(data.cart ?? mockCartItems);
      setAddresses(data.addresses ?? mockAddresses);
      setSelectedAddress(data.selectedAddress ?? null);
      setPaymentMethod(data.paymentMethod ?? null);
      setCardDetails(
        data.cardDetails ?? { number: "", name: "", expiry: "", cvv: "" }
      );
      setVoucherCode(data.voucherCode ?? "");
      setAppliedVoucher(data.appliedVoucher ?? null);
    }
  }, []);

  useEffect(() => {
    const state = {
      step,
      cart,
      addresses,
      selectedAddress,
      paymentMethod,
      cardDetails,
      voucherCode,
      appliedVoucher,
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
    appliedVoucher,
  ]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 32000;

  const applyVoucher = () => {
    setVoucherError("");
    setAppliedVoucher(null);

    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    const voucher = vouchers.find((v) => v.code === code);
    if (!voucher) {
      setVoucherError("Voucher không khả dụng");
      return;
    }

    const now = new Date();
    const start = new Date(voucher.start);
    const expired = new Date(voucher.expired);

    if (now < start) {
      setVoucherError("Voucher chưa có hiệu lực");
      return;
    }
    if (now > expired) {
      setVoucherError("Voucher đã hết hạn");
      return;
    }

    // Kiểm tra minValue (nếu có)
    if (voucher.minValue !== null) {
      const min = Number(voucher.minValue);
      if (subtotal < min) {
        setVoucherError(`Cần mua từ ${min.toLocaleString()}đ để dùng mã`);
        return;
      }
    }

    setAppliedVoucher(voucher);
  };

  // TÍNH GIẢM GIÁ
  const discount = React.useMemo(() => {
    if (!appliedVoucher) return 0;

    let rawDiscount = 0;

    if (typeof appliedVoucher.discount === "number") {
      if (appliedVoucher.discount < 1) {
        // % discount
        rawDiscount = subtotal * appliedVoucher.discount;
      } else {
        // fixed amount
        rawDiscount = appliedVoucher.discount;
      }
    }

    // Áp dụng maxDiscount nếu có
    if (
      appliedVoucher.maxDiscount !== undefined &&
      appliedVoucher.maxDiscount !== null
    ) {
      rawDiscount = Math.min(rawDiscount, appliedVoucher.maxDiscount);
    }

    return rawDiscount;
  }, [appliedVoucher, subtotal]);

  const total = subtotal - discount + shipping;

  const validateStep = () => {
    if (step === 1) return cart.length > 0;
    if (step === 2) return !!selectedAddress;
    if (step === 3) return !!paymentMethod;
    return true;
  };

  const goToStep = (newStep) => {
    if (newStep < step || (newStep > step && validateStep())) {
      setError("");
      setStep(newStep);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsLoading(false);
    setOrderId(`ORDER-${Date.now()}`);
    goToStep(4);
  };

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
        <div className="mb-4">
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
            <Button onClick={applyVoucher} className="h-10 flex flex-1">
              Sử dụng
            </Button>
          </div>
          {voucherError && (
            <p className="text-xs text-red-600 mt-1">{voucherError}</p>
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

        {appliedVoucher && (
          <div className="flex justify-between text-red-600">
            <span>Voucher từ WildStep</span>
            <span className="text-red-600">
              -{discount.toLocaleString()} VND
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
      {step === 4 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm border border-green-200">
          <p className="font-medium text-green-700">Đơn hàng đã được đặt!</p>
          <p className="text-green-600">
            Mã: <span className="font-mono">{orderId}</span>
          </p>
        </div>
      )}
    </div>
  );

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
                  subtotal={subtotal}
                  discount={discount}
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
              {step === 4 && (
                <OrderComplete
                  orderId={orderId}
                  cart={cart}
                  selectedAddress={selectedAddress}
                  paymentMethod={paymentMethod}
                  total={total}
                  subtotal={subtotal}
                  shipping={shipping}
                  discount={discount}
                  appliedVoucher={appliedVoucher}
                />
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
                  // Bước 1 & 2 → luôn là "Tiếp theo"
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
                      // COD → "Tiếp theo"
                      <Button
                        onClick={() => goToStep(step + 1)}
                        disabled={!validateStep()}
                        className="flex items-center gap-1"
                      >
                        Tiếp theo
                        <MdOutlineEast className="w-4 h-4" />
                      </Button>
                    ) : (
                      // Ví điện tử / Thẻ → "Thanh toán"
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={!validateStep() || isLoading}
                        loading={isLoading}
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
