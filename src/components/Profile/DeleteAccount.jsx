import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { deleteAccount } from "@/service/profileService";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/contexts/ToastContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function DeleteAccountDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { clearAuth } = useAuthStore();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleDeteleAccount = async () => {
    if (!confirm(t('profile.deleteAccountPage.confirmPrompt'))) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteAccount();

    if (result.success) {
      success(result.message);
      clearAuth();
      setOpen(false);
      navigate("/");
    } else {
      error(result.error);
    }

    setIsDeleting(false);
  };
  return (
    <Dialog open={open}  onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{t('profile.deleteAccountPage.deleteButton')}</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="border-b px-4 py-2">
            {t('profile.deleteAccountPage.dialogTitle')}
          </DialogTitle>
            <p className="p-2">
              {t('profile.deleteAccountPage.dialogDescription')}
            </p>
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-end border-t px-4 py-2">
          <DialogClose asChild>
            <Button variant="outline">
              <ChevronLeftIcon />
              {t('profile.deleteAccountPage.cancel')}
            </Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleDeteleAccount}
            disabled={isDeleting}
          >
            {isDeleting ? t('profile.deleteAccountPage.deleting') : t('profile.deleteAccountPage.confirmDelete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAccount() {
  const { t } = useTranslation();
  
  return (
    <div className="flex-col space-y-[10px] w-full">
      <p className="text-2xl font-semibold mb-4">{t('profile.deleteAccountPage.title')}</p>
      <div className="w-full space-y-4">
        <p className="text-lg">
          {t('profile.deleteAccountPage.description')}
        </p>
        <DeleteAccountDialog />
      </div>
    </div>
  );
}

export default DeleteAccount;
