import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React, { useEffect, useState } from "react";
import DatePicker from "../DatePicker";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import ChangeAvatar from "./ChangeAvatar";
import { getProfile, updateProfile, uploadAvatar } from "@/service/profileService";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/contexts/ToastContext";
import { getFullAvatarUrl } from "@/lib/avatarUtils";
import { useTranslation } from "react-i18next";

function EditProfile() {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sex, setSex] = useState("male");
  const [birth, setBirth] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth, token } = useAuthStore();
  const { success, error } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getProfile();
      if (result.success) {
        const profile = result.data;
        setDisplayName(profile.displayName || "");
        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        
        // Map giá trị từ API sang giá trị UI
        if (profile.sex === "male") setSex(t('profile.edit.male'));
        else if (profile.sex === "female") setSex(t('profile.edit.female'));
        else setSex(t('profile.edit.other'));
        
        setBirth(profile.birth ? new Date(profile.birth) : null);
        // Convert avatar URL to full URL if it's relative
        const fullAvatarUrl = profile.avatar ? getFullAvatarUrl(profile.avatar) : "";
        setAvatar(fullAvatarUrl);
      } else {
        error(result.error || t('profile.edit.loadError'));
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleAvatarChange = async (file) => {
    if (!file) return;
    
    // Upload avatar ngay khi chọn
    const result = await uploadAvatar(file);
    if (result.success) {
      // Use helper to get full URL
      const fullAvatarUrl = getFullAvatarUrl(result.data.avatarUrl);
      setAvatar(fullAvatarUrl);
      success(result.message);
      
      // Cập nhật auth store
      const profileResult = await getProfile();
      if (profileResult.success) {
        // Normalize avatar URL in profile data before saving to store
        const updatedProfile = {
          ...profileResult.data,
          avatar: fullAvatarUrl
        };
        setAuth(token, updatedProfile);
      }
    } else {
      error(result.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Map giá trị từ UI sang giá trị API
    let sexValue;
    if (sex === t('profile.edit.male')) sexValue = "male";
    else if (sex === t('profile.edit.female')) sexValue = "female";
    else sexValue = "other";

    const data = {
      email,
      displayName,
      phone,
      sex: sexValue,
      birth: birth ? birth.toISOString() : null,
    };

    const result = await updateProfile(data);
    
    if (result.success) {
      success(result.message);
      // Cập nhật auth store với thông tin mới
      setAuth(token, result.data);
    } else {
      error(result.error);
    }
    
    setIsSubmitting(false);
  };

  if(isLoading){
    return <div className="w-full flex items-center justify-center font-semibold text-2xl gap-2">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-[#50D5C4] rounded-full animate-spin"></div>
    </div>
  }

  return (
    <div className="flex-col space-y-4 sm:space-y-6 w-full">
      <p className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t('profile.edit.title')}</p>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 lg:gap-8">
        <form className="flex-1 space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <div>
            <p className="font-semibold text-sm sm:text-base mb-2">
              {t('profile.edit.displayName')} <span className="text-red-500">{t('profile.edit.required')}</span>
            </p>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base mb-2">
              {t('profile.edit.email')} <span className="text-red-500">{t('profile.edit.required')}</span>
            </p>
            <Input
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base mb-2">{t('profile.edit.phone')}</p>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
            />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base mb-3">{t('profile.edit.gender')}</p>
            <div className="flex flex-wrap gap-4 sm:gap-5 items-center">
              <Label className="flex items-center gap-2 cursor-pointer">
                <Input
                  type="radio"
                  checked={sex === t('profile.edit.male')}
                  value={t('profile.edit.male')}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-600"
                />
                <span className="text-sm sm:text-base">{t('profile.edit.male')}</span>
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <Input
                  type="radio"
                  checked={sex === t('profile.edit.female')}
                  value={t('profile.edit.female')}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-600"
                />
                <span className="text-sm sm:text-base">{t('profile.edit.female')}</span>
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <Input
                  type="radio"
                  checked={sex === t('profile.edit.other')}
                  value={t('profile.edit.other')}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-600"
                />
                <span className="text-sm sm:text-base">{t('profile.edit.other')}</span>
              </Label>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base mb-2">{t('profile.edit.birthDate')}</p>
            {!isLoading && (
              <DatePicker
                defaultValue={birth}
                onChange={(date) => setBirth(date)}
              />
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-semibold flex items-center gap-2 mt-5 sm:mt-6 w-full sm:w-auto min-h-[44px] px-6 py-2.5 sm:py-3"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {isSubmitting ? t('profile.edit.saving') : t('profile.edit.saveChanges')}
          </Button>
        </form>
        <div className="flex-shrink-0 lg:ml-6">
          <ChangeAvatar avatar={avatar} setAvatar={handleAvatarChange} />
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
