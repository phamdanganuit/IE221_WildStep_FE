import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import AddressDialog from "./AddressDialog";
import { Pencil, Trash2 } from "lucide-react";
import { setDefaultAddress, updateAddress, deleteAddress } from "@/service/addressService";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";

function AddressCard({ address, onUpdate }) {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDefault = async () => {
    if (address?.is_default || address?.default) return;
    setIsProcessing(true);
    
    const result = await setDefaultAddress(address.id || address._id);
    if (result.success) {
      success(result.message);
      onUpdate && onUpdate(); // Refresh danh sách
    } else {
      error(result.error);
    }
    setIsProcessing(false);
  };

  const handleEdit = async (updatedAddress) => {
    const result = await updateAddress(address.id || address._id, {
      receiver: updatedAddress.receiver,
      detail: updatedAddress.detail,
      ward: updatedAddress.ward,
      district: updatedAddress.district,
      province: updatedAddress.province,
      phone: updatedAddress.phone,
      is_default: updatedAddress.default,
    });

    if (result.success) {
      success(result.message);
      onUpdate && onUpdate(); // Refresh danh sách
    } else {
      error(result.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('profile.addressPage.deleteConfirm'))) return;
    
    const result = await deleteAddress(address.id || address._id);
    if (result.success) {
      success(result.message);
      onUpdate && onUpdate(); // Refresh danh sách
    } else {
      error(result.error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p>
            {address?.receiver} |{" "}
            <span className="font-normal">({address?.phone})</span>
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-between">
          <div className="h-full flex-col space-y-4">
            <p>{address?.detail}, {address?.ward}, {address?.district}, {address?.province}</p>
            {(address?.default || address?.is_default) && <div className="px-2 py-1 rounded-xl text-center text-slate-800 border border-slate-800 w-[100px]">{t('profile.addressPage.default')}</div>}
          </div>
          <div className="flex-col space-y-2">
            <AddressDialog address={address} title={t('profile.addressPage.edit')} submitIcon={<Pencil/>} submitText={t('common.save')} onSubmit={handleEdit}/>
            <Button
              variant="outline"
              disabled={address?.default || address?.is_default || isProcessing}
              className="w-[200px]"
              onClick={handleDefault}
            >
              {isProcessing ? t('profile.changePasswordPage.processing') : t('profile.addressPage.setDefault')}
            </Button>
            <Button
              variant="destructive"
              className="w-[200px] flex items-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              {t('profile.addressPage.delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AddressCard;
