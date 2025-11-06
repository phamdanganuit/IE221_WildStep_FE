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
    <div className="flex flex-col min-h-screen" style={{
      objectFit: "contain",
      backgroundImage: "url('/profile-bg.png')",
    }}>
      {/*Header*/}
    <Header/>
      {/*Main*/}
      <div className="flex-1 jusifty-center w-[1100px] px-6 h-full flex pt-10 mx-auto space-x-2 bg-white">
        <Sidebar isActive={isActive} setActive={setActive} />
        <div className="w-full pl-2 max-h-screen">
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
