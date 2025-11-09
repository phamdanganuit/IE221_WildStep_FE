import React, { useState } from "react";
import Sidebar from "../../components/Profile/Sidebar";
import EditProfile from "../../components/Profile/EditProfile";
import Address from "../../components/Profile/Address";
import ChangePassword from "../../components/Profile/ChangePassword";
import LinkAccount from "../../components/Profile/LinkAccount";
import NotifSetting from "../../components/Profile/NotifSetting";
import DeleteAccount from "../../components/Profile/DeleteAccount";
import Header from "@/components/Header";
import { useTranslation } from "react-i18next";

function Profile() {
  const { t } = useTranslation();
  const [isActive, setActive] = useState(t('profile.title'));
  
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden" style={{
      objectFit: "contain",
      backgroundImage: "url('/profile-bg.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      {/*Header*/}
      <Header/>
      {/*Main - Responsive Layout */}
      <div className="flex-1 w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 
        h-full flex flex-col lg:flex-row 
        pt-6 sm:pt-8 md:pt-10 
        mx-auto 
        gap-4 sm:gap-6 
        bg-white/95 backdrop-blur-sm
        min-h-[calc(100vh-4rem)]">
        <Sidebar isActive={isActive} setActive={setActive} />
        <div className="w-full lg:pl-4 max-h-screen overflow-y-auto">
          {isActive === t('profile.title') ? (
            <EditProfile />
          ) : isActive === t('profile.address') ? (
            <Address />
          ) : isActive === t('profile.changePassword') ? (
            <ChangePassword />
          ) : isActive === t('profile.linkAccount') ? (
            <LinkAccount />
          ) : isActive === t('profile.notificationSettings') ? (
            <NotifSetting />
          ) : (
            <DeleteAccount />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
