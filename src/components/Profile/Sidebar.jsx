import React from "react";
import { useTranslation } from "react-i18next";

function Sidebar({ isActive, setActive }) {
  const { t } = useTranslation();
  
  const menuItems = [
    { key: 'profile', label: t('profile.title') },
    { key: 'address', label: t('profile.address') },
    { key: 'changePassword', label: t('profile.changePassword') },
    { key: 'linkAccount', label: t('profile.linkAccount') },
    { key: 'notificationSettings', label: t('profile.notificationSettings') },
  ];

  return (
    <div className="mt-10 flex flex-col space-y-4 w-[250px] h-[400px] justify-start pr-6 border-r border-[#3A506B] ">
      {menuItems.map((item) => (
        <button
          key={item.key}
          className={`${
            isActive === item.label ? "font-bold text-[#0B132B]" : "font-semibold text-zinc-500"
          } px-4 py-2 text-left hover:bg-gray-200 rounded-lg cursor-pointer`}
          onClick={() => setActive(item.label)}
        >
          {item.label}
        </button>
      ))}
      <div className="border-t border-[#3A506B]" />
      <button
        className={`${
          isActive === t('profile.deleteAccount') ? "font-bold text-rose-600" : "font-semibold text-rose-500"
        } px-4 py-2 text-left hover:bg-gray-200 rounded-lg cursor-pointer`}
        onClick={() => setActive(t('profile.deleteAccount'))}
      >
        {t('profile.deleteAccount')}
      </button>
    </div>
  );
}

export default Sidebar;
