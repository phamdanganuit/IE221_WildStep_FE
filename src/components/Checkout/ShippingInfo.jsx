import React, { useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiCheck } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createAddress, updateAddress, deleteAddress as deleteAddressAPI } from "@/service/addressService";
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

export default function ShippingInfo({
  addresses,
  setAddresses,
  selectedAddress,
  setSelectedAddress,
}) {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { success: showSuccess, error: showError } = useToast();
  const [form, setForm] = useState({
    receiver: "",
    detail: "",
    ward: "",
    district: "",
    province: "",
    phone: "",
    default: false,
  });

  const openDialog = (addr = null) => {
    setEditingAddress(addr);
    if (addr) {
      setForm({ ...addr });
    } else {
      setForm({
        receiver: "",
        detail: "",
        ward: "",
        district: "",
        province: "",
        phone: "",
        default: false,
      });
    }
    setOpen(true);
  };

  const saveAddress = async () => {
    if (!form.receiver || !form.phone || !form.detail || !form.province) {
      showError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSaving(true);
    try {
      const addressData = {
        receiver: form.receiver,
        detail: form.detail,
        ward: form.ward,
        district: form.district,
        province: form.province,
        phone: form.phone,
        is_default: form.default,
      };

      if (editingAddress) {
        // Update existing address
        const editingId = getAddressId(editingAddress);
        if (!editingId) {
          showError("Không tìm thấy ID địa chỉ");
          setIsSaving(false);
          return;
        }
        const result = await updateAddress(editingId, addressData);
        if (result.success) {
          setAddresses((prev) =>
            prev.map((a) =>
              compareAddressIds(getAddressId(a), editingId) ? result.data : a
            )
          );
          if (compareAddressIds(getAddressId(selectedAddress), editingId)) {
            setSelectedAddress(result.data);
          }
          showSuccess(result.message || "Cập nhật địa chỉ thành công!");
          setOpen(false);
        } else {
          showError(result.error || "Không thể cập nhật địa chỉ");
        }
      } else {
        // Create new address
        const result = await createAddress(addressData);
        if (result.success) {
          setAddresses((prev) => [...prev, result.data]);
          showSuccess(result.message || "Thêm địa chỉ thành công!");
          setOpen(false);
        } else {
          showError(result.error || "Không thể thêm địa chỉ");
        }
      }
    } catch (err) {
      showError(err.message || "Đã xảy ra lỗi");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAddress = async (addr) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      return;
    }

    try {
      const addrId = getAddressId(addr);
      if (!addrId) {
        showError("Không tìm thấy ID địa chỉ");
        return;
      }
      const result = await deleteAddressAPI(addrId);
      if (result.success) {
        setAddresses((prev) => prev.filter((a) => !compareAddressIds(getAddressId(a), addrId)));
        if (compareAddressIds(getAddressId(selectedAddress), addrId)) {
          const remaining = addresses.filter((a) => !compareAddressIds(getAddressId(a), addrId));
          setSelectedAddress(remaining.length > 0 ? remaining[0] : null);
        }
        showSuccess(result.message || "Xóa địa chỉ thành công!");
      } else {
        showError(result.error || "Không thể xóa địa chỉ");
      }
    } catch (err) {
      showError(err.message || "Đã xảy ra lỗi khi xóa địa chỉ");
    }
  };

  // Format full address for display
  const formatAddress = (addr) => {
    const parts = [addr.detail, addr.ward, addr.district, addr.province]
      .filter(Boolean)
      .join(", ");
    return parts;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
      <p className="text-sm text-gray-600 mb-6">
        Xem lại thông tin giao hàng của bạn trước khi thanh toán
      </p>

      <div className="space-y-4">
        {addresses.map((addr) => {
          // Use helper function to compare IDs (supports both 'id' and '_id')
          const addrId = getAddressId(addr);
          const selectedId = getAddressId(selectedAddress);
          const isSelected = compareAddressIds(addrId, selectedId);
          
          return (
            <div
              key={addrId || Math.random()}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "border-color4 bg-teal-50"
                  : "hover:border-gray-400"
              }`}
              onClick={() => {
                // Ensure we're setting a complete address object
                if (addr && addrId) {
                  setSelectedAddress(addr);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{addr.receiver}</h4>
                    {addr.isDefault && (
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{addr.phone}</p>
                  <p className="text-sm mt-1">{formatAddress(addr)}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDialog(addr);
                    }}
                    className="text-gray-600 hover:text-color4"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(addr);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              {isSelected && (
                <div className="mt-3 flex items-center text-teal-600">
                  <FiCheck className="mr-1" /> Đã chọn
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="mt-6 w-full"
            variant="outline"
            onClick={() => openDialog()}
          >
            <FiPlus className="mr-2" /> Thêm địa chỉ mới
          </Button>
        </DialogTrigger>

        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label>Họ tên người nhận</Label>
              <Input
                value={form.receiver}
                onChange={(e) => setForm({ ...form, receiver: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Số điện thoại</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Địa chỉ chi tiết (số nhà, đường...)</Label>
              <Input
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Phường/Xã</Label>
                <Input
                  value={form.ward}
                  onChange={(e) => setForm({ ...form, ward: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Quận/Huyện</Label>
                <Input
                  value={form.district}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Tỉnh/Thành phố</Label>
              <Input
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="default"
                checked={form.default}
                onChange={(e) =>
                  setForm({ ...form, default: e.target.checked })
                }
                className="rounded"
              />
              <label htmlFor="default" className="text-sm">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
              Hủy
            </Button>
            <Button onClick={saveAddress} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
