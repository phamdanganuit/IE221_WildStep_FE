import React, { useEffect, useState, useRef } from "react";
import AddressCard from "./AddressCard";
import AddressDialog from "./AddressDialog";
import { Plus } from "lucide-react";
import { getAddresses, createAddress } from "@/service/addressService";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";

function Address() {
  const { t } = useTranslation();
  const [addressList, setAddressList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();
  const hasLoadedRef = useRef(false);

  const fetchAddresses = async () => {
    setIsLoading(true);
    const result = await getAddresses();
    if (result.success) {
      setAddressList(result.data);
    } else {
      error(result.error || t('profile.addressPage.loadError'));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Prevent double calls in React StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    fetchAddresses();
    
    return () => {
      hasLoadedRef.current = false;
    };
  }, []);

  const handleAdd = async (newAddress) => {
    const result = await createAddress({
      receiver: newAddress.receiver,
      detail: newAddress.detail,
      ward: newAddress.ward,
      district: newAddress.district,
      province: newAddress.province,
      phone: newAddress.phone,
      is_default: newAddress.default,
    });

    if (result.success) {
      success(result.message);
      // Refresh danh sách địa chỉ
      await fetchAddresses();
    } else {
      error(result.error);
    }
  };
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center font-semibold text-2xl gap-2">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#50D5C4] rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="flex-col space-y-4 sm:space-y-6 w-full">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-xl sm:text-2xl font-semibold">{t('profile.addressPage.title')}</p>
        <AddressDialog 
          title={t('profile.addressPage.addNew')} 
          submitIcon={<Plus/>} 
          submitText={t('profile.addressPage.add')} 
          onSubmit={handleAdd}
        />
      </div>
      <div className="w-full flex-col space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] sm:max-h-[34.5rem] scrollbar-hide pr-2">
        {addressList.length === 0 ? (
          <div className="p-4 sm:p-6 bg-gray-50 rounded-lg">
            <p className="text-sm sm:text-base text-gray-600">{t('profile.addressPage.noAddress')}</p>
          </div>
        ) : (
          <>
            {addressList?.map((a) => {
              return <AddressCard key={a.id || a._id} address={a} onUpdate={fetchAddresses} />;
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Address;
