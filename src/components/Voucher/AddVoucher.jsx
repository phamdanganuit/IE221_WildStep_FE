import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CircleCheck, TicketPlus } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { useToast } from "@/contexts/ToastContext";
import useVoucherStore from "@/store/voucherStore";
import { addVoucherIntoMyList } from "@/service/voucherService";

function AddVoucher() {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addVoucher } = useVoucherStore();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const res = await addVoucherIntoMyList(code);
    if (res.success) {
      addVoucher(res.data);
      success(res.message);
    } else {
      error(res.error);
    }

    setOpen(false);
    setCode("");
    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={"flex items-center space-x-2 w-[200px]"}>
          <TicketPlus />
          Thêm mã giảm giá
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b pb-4">
            <p className="font-semibold text-[1.2rem]">Thêm mã giảm giá mới</p>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>
            Nhập mã giảm giá mới
            <span className="text-red-500">{t("profile.edit.required")}</span>
          </p>
          <Input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <DialogFooter className="flex-row items-center justify-end border-t pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <CircleCheck />
              )}
              <p>Hoàn tất</p>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddVoucher;
