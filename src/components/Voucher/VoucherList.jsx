import useVoucherStore from "@/store/voucherStore";
import React, { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { ShoppingBag, Truck } from "lucide-react";
import VoucherOption from "./VoucherOption";
import { getMyVouchersList } from "@/service/voucherService";
import { useTranslation } from "react-i18next";
import { useToast } from "@/contexts/ToastContext";

const VoucherCard = ({ voucher }) => {
  // có category tức là voucher mua sắm
  const formattedDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className={"col-span-1 w-full"}>
      <CardContent className={"flex items-center space-x-4 relative"}>
        <VoucherOption voucher={voucher} />
        {voucher?.category?.length <= 0 ? (
          <div className="flex flex-col w-24 flex-shrink-0 aspect-square justify-center items-center bg-color3 text-white p-2 rounded-lg">
            <Truck className="w-12 h-12" />
            <p className="text-xs text-nowrap">Vận chuyển</p>
          </div>
        ) : (
          <div className="flex flex-col w-24 flex-shrink-0 aspect-square justify-center items-center bg-color4 text-white p-2 rounded-lg">
            <ShoppingBag className="w-12 h-12" />
            <p className="text-xs text-nowrap">Mua sắm</p>
          </div>
        )}
        <div className="flex-col space-y-1">
          <p className="text-[1.2rem] font-semibold">{voucher?.name}</p>
          <p className="text-[0.9rem] mr-5">{voucher?.description}</p>
          <p className="text-gray-500 text-[0.9rem]">
            HSD: {formattedDate(voucher?.start)} -{" "}
            {formattedDate(voucher?.expired)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

function VoucherList() {
  const { vouchers, setVouchers } = useVoucherStore();
  const { t } = useTranslation();
  const { error } = useToast();
  useEffect(() => {
    const fetchVouchers = async () => {
      const res = await getMyVouchersList();
      if (res.success) {
        setVouchers(res.data);
      } else {
        error(res.error);
      }
    };
    fetchVouchers();
  }, []);

  if (vouchers?.length <= 0) {
    return (
      <p className="text-center text-[1.6rem] my-10">
        Bạn chưa lưu mã giảm giá nào.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {vouchers?.map((v) => {
        return <VoucherCard key={v._id} voucher={v} />;
      })}
    </div>
  );
}

export default VoucherList;
