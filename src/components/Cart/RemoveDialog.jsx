import React, { useState } from "react";
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
import { Button } from "../ui/button";
import { ChevronLeftIcon, Trash } from "lucide-react";
import { removeFromCart } from "@/service/cartService";
import { useToast } from "@/contexts/ToastContext";

function RemoveDialog({ cp, onRemoveSuccess }) {
  const { success, error } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const res = await removeFromCart(cp._id);
    if (res.success) {
      success(res.message);
      // Refresh cart after successful removal
      if (onRemoveSuccess) {
        onRemoveSuccess();
      }
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
          className="text-red-500"
          variant="ghost"
          title="Xóa khỏi giỏ hàng"
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa khỏi giỏ hàng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng? Hành động này
            sẽ không thể hoàn tác!
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

export default RemoveDialog;
