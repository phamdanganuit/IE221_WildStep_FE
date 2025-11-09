import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useMobileMenu } from "@/contexts/MobileMenuContext";

function Sidebar({ isActive, setActive }) {
  const { t } = useTranslation();
  const { showMobileMenu, setShowMobileMenu } = useMobileMenu();
  
  const menuItems = [
    { key: 'profile', label: t('profile.title') },
    { key: 'address', label: t('profile.address') },
    { key: 'changePassword', label: t('profile.changePassword') },
    { key: 'linkAccount', label: t('profile.linkAccount') },
    { key: 'notificationSettings', label: t('profile.notificationSettings') },
  ];

  const handleMenuClick = (label) => {
    setActive(label);
    setShowMobileMenu(false);
  };

  const MenuContent = () => (
    <>
      {menuItems.map((item) => (
        <button
          key={item.key}
          className={`${
            isActive === item.label 
              ? "font-bold text-[#0B132B] bg-gray-100" 
              : "font-semibold text-zinc-500"
          } px-4 py-2.5 sm:py-3 text-left hover:bg-gray-200 rounded-lg cursor-pointer transition-colors
          text-sm sm:text-base
          min-h-[44px] flex items-center`}
          onClick={() => handleMenuClick(item.label)}
        >
          {item.label}
        </button>
      ))}
      <div className="border-t border-[#3A506B] my-2" />
      <button
        className={`${
          isActive === t('profile.deleteAccount') 
            ? "font-bold text-rose-600 bg-rose-50" 
            : "font-semibold text-rose-500"
        } px-4 py-2.5 sm:py-3 text-left hover:bg-rose-100 rounded-lg cursor-pointer transition-colors
        text-sm sm:text-base
        min-h-[44px] flex items-center`}
        onClick={() => handleMenuClick(t('profile.deleteAccount'))}
      >
        {t('profile.deleteAccount')}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Menu Overlay - Uses hamburger menu from Header */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-2xl z-40 lg:hidden overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0B132B]">{t('profile.title')}</h2>
              <button onClick={() => setShowMobileMenu(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <MenuContent />
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col 
        w-full lg:w-64 
        space-y-2 sm:space-y-3 md:space-y-4 
        justify-start 
        pr-4 lg:pr-6 
        border-0 lg:border-r border-[#3A506B]
        pb-6">
        <MenuContent />
      </div>

      {/* Mobile: Show selected menu title */}
      <div className="lg:hidden w-full mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B132B] px-2">
          {isActive}
        </h2>
      </div>
    </>
  );
}

export default Sidebar;
