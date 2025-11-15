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

export default function ShippingInfo({
  addresses,
  setAddresses,
  selectedAddress,
  setSelectedAddress,
}) {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
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

  const saveAddress = () => {
    if (!form.receiver || !form.phone || !form.detail || !form.province) return;

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) =>
          a._id === editingAddress._id ? { ...form, _id: a._id } : a
        )
      );
    } else {
      setAddresses((prev) => [
        ...prev,
        {
          ...form,
          _id: `addr_${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setOpen(false);
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a._id !== id));
    if (selectedAddress?._id === id) {
      setSelectedAddress(addresses.find((a) => a._id !== id) || null);
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
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedAddress?._id === addr._id
                ? "border-color4 bg-teal-50"
                : "hover:border-gray-400"
            }`}
            onClick={() => setSelectedAddress(addr)}
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
                    deleteAddress(addr.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            {selectedAddress?._id === addr._id && (
              <div className="mt-3 flex items-center text-teal-600">
                <FiCheck className="mr-1" /> Đã chọn
              </div>
            )}
          </div>
        ))}
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
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={saveAddress}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
