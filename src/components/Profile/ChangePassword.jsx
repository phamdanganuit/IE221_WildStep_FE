import { Input } from "../ui/input";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { changePassword } from "@/service/accountService";
import { useTranslation } from "react-i18next";

function ChangePassword() {
  const { t } = useTranslation();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPass !== confirmPass) {
      error(t('profile.changePasswordPage.passwordMismatch'));
      return;
    }

    setIsLoading(true);
    
    const result = await changePassword(oldPass, newPass);
    
    if (result.success) {
      success(result.message);
      // Reset form
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      error(result.error);
    }
    
    setIsLoading(false);
  };

  if(isLoading){
    return <div className="w-full flex items-center justify-center font-semibold text-2xl gap-2">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-[#50D5C4] rounded-full animate-spin"></div>
    </div>
  }

  return (
    <div className="flex-col space-y-4 sm:space-y-6 w-full">
      <p className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t('profile.changePasswordPage.title')}</p>
      <div className="w-full">
        <form className="w-full max-w-2xl space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <div>
            <p className="font-semibold text-sm sm:text-base mb-2">
              {t('profile.changePasswordPage.currentPassword')} <span className="text-red-500">*</span>
            </p>
            <Input
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              required
              type="password"
              className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base mb-2">
              {t('profile.changePasswordPage.newPassword')} <span className="text-red-500">*</span>
            </p>
            <Input
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              type="password"
              className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base mb-2">
              {t('profile.changePasswordPage.confirmPassword')} <span className="text-red-500">*</span>
            </p>
            <Input
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              type="password"
              className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="font-semibold flex items-center gap-2 mt-5 sm:mt-6 w-full sm:w-auto min-h-[44px] px-6 py-2.5 sm:py-3"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {isLoading ? t('profile.changePasswordPage.processing') : t('profile.changePasswordPage.saveChanges')}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword
