import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronLeftIcon, EllipsisIcon, Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import useVoucherStore from "@/store/voucherStore";
import { useTranslation } from "react-i18next";
import { useToast } from "@/contexts/ToastContext";
import { removeVoucherFromList } from "@/service/voucherService";

function DeleteVoucher({ voucher }) {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { removeVoucher } = useVoucherStore();
  const handleDelete = async () => {
    setLoading(true);

    const res = await removeVoucherFromList(voucher._id);
    if (res.success) {
      removeVoucher(voucher._id);
      success(res.message);
    } else {
      error(res.error);
    }

    setLoading(false);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Toggle menu"
          className={"flex items-center space-x-2 text-red-500"}
        >
          <Trash />
          <p>Xóa khỏi danh sách</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p>Xóa mã giảm giá khỏi danh sách?</p>
          </DialogTitle>
          <DialogDescription>
            Hành động này sẽ không thể hoàn tác!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end">
          <DialogClose asChild>
            <Button variant="outline">
              <ChevronLeftIcon />
              Hủy
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash />
            <p>Xóa khỏi danh sách</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VoucherOption({ voucher }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle menu"
          className={"absolute right-0 top-0"}
        >
          <EllipsisIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"w-full"}>
        <DeleteVoucher voucher={voucher} />
      </PopoverContent>
    </Popover>
  );
}

export default VoucherOption;
