// PaymentMethod.jsx
// Select payment method (COD, Card, Wallet) with card form and validation
import React from 'react';
import { FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi';
import {Input} from '@/components/ui/input';

const validateCard = (number) => {
  const cleaned = number.replace(/\D/g, '');
  if (!/^\d{16}$/.test(cleaned)) return false;
  let sum = 0;
  let alternate = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit = (digit % 10) + 1;
    }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

export default function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
  cardDetails,
  setCardDetails,
}) {
  const [errors, setErrors] = React.useState({});

  const handleCardChange = (field, value) => {
    let formatted = value;
    if (field === 'number') {
      formatted = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (field === 'expiry') {
      formatted = value.replace(/\D/g, '').replace(/(.{2})(.{2})/, '$1/$2');
    }
    setCardDetails(prev => ({ ...prev, [field]: formatted }));
  };

  React.useEffect(() => {
    const newErrors = {};
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !validateCard(cardDetails.number)) newErrors.number = 'Số thẻ không hợp lệ';
      if (!cardDetails.name) newErrors.name = 'Vui lòng nhập tên';
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) newErrors.expiry = 'Định dạng MM/YY';
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) newErrors.cvv = 'CVV không hợp lệ';
    }
    setErrors(newErrors);
  }, [cardDetails, paymentMethod]);

  const methods = [
    { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: FiDollarSign },
    { id: 'card', label: 'Thẻ tín dụng/ghi nợ', icon: FiCreditCard },
    { id: 'wallet', label: 'Ví điện tử', icon: FiSmartphone },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
      <p className="text-sm text-gray-600 mb-6">Lựa chọn phương thức thanh toán bên dưới</p>

      <div className="space-y-3">
        {methods.map(method => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
              paymentMethod === method.id ? 'border-teal-600 bg-teal-50' : 'hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <method.icon className="text-xl mr-3 text-gray-700" />
            <span className="flex-1">{method.label}</span>
            {paymentMethod === method.id && (
              <div className="w-5 h-5 rounded-full border-2 border-teal-600 flex items-center justify-center">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
              </div>
            )}
          </label>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <Input
            label="Số thẻ"
            value={cardDetails.number}
            onChange={(e) => handleCardChange('number', e.target.value)}
            placeholder="1234 5678 9012 3456"
            error={errors.number}
          />
          <Input
            label="Tên trên thẻ"
            value={cardDetails.name}
            onChange={(e) => handleCardChange('name', e.target.value)}
            placeholder="NGUYEN VAN A"
            error={errors.name}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hết hạn (MM/YY)"
              value={cardDetails.expiry}
              onChange={(e) => handleCardChange('expiry', e.target.value)}
              placeholder="MM/YY"
              error={errors.expiry}
            />
            <Input
              label="CVV"
              value={cardDetails.cvv}
              onChange={(e) => handleCardChange('cvv', e.target.value)}
              placeholder="123"
              error={errors.cvv}
            />
          </div>
        </div>
      )}
    </div>
  );
}