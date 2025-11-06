import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Image } from "lucide-react";
import { getFullAvatarUrl } from "@/lib/avatarUtils";
import { useTranslation } from "react-i18next";

function ChangeAvatar({ avatar, setAvatar }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Sync preview with avatar prop when it changes (e.g., after reload)
  useEffect(() => {
    let objectUrl = null;
    
    if (avatar) {
      // If avatar is a File object, create object URL
      if (avatar instanceof File) {
        objectUrl = URL.createObjectURL(avatar);
        setPreview(objectUrl);
      } else {
        // If avatar is a URL string, use it directly (will be normalized by getFullAvatarUrl)
        const fullUrl = getFullAvatarUrl(avatar);
        setPreview(fullUrl);
      }
    } else {
      setPreview(null);
    }
    
    // Cleanup: revoke object URL when component unmounts or avatar changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [avatar]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cleanup previous object URL if exists
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      setAvatar && setAvatar(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col space-y-5 items-center justify-center">
      <img
        src={
          preview || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
        }
        alt="avatar"
        className="w-[150px] h-[150px] rounded-full outline-1 outline-[#50D5C4] object-cover"
        onError={(e) => {
          // Fallback to default avatar if image fails to load
          e.target.src = "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg";
        }}
      />
      <Button variant={"outline"} onClick={handleClick}>
        <Image />
        {t('avatar.selectImage')}
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="max-w-[200px] text-center">
        {t('avatar.maxFileSize')}
        <br />
        {t('avatar.formats')}
      </p>
    </div>
  );
}

export default ChangeAvatar;
