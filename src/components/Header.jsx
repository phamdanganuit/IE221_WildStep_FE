import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser} from "@fortawesome/free-regular-svg-icons";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { LuTicketPercent } from "react-icons/lu";
import {
  faRightFromBracket,
  faGauge,
  faGlobe,
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMobileMenu } from "@/contexts/MobileMenuContext";
import { useCartAnimation } from "@/contexts/CartAnimationContext";
import SearchBox from "@/components/SearchBox";
import { getCartCount } from "@/service/cartService";
import CartAnimation from "@/components/Cart/CartAnimation";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { showMobileMenu, setShowMobileMenu } = useMobileMenu();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { cartCount, updateCartCount } = useCartAnimation();
  const userMenuRef = useRef(null);
  const languageMenuRef = useRef(null);
  const cartIconRef = useRef(null);
  const { t, i18n } = useTranslation();

  // Check if we're on Profile page
  const isProfilePage = location.pathname === "/profile";
  // Check if we're on Cart page (to avoid unnecessary API calls)
  const isCartPage = location.pathname === "/cart";

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  const handleLogout = () => {
    clearAuth();
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const handleMyOrders = () => {
    navigate("/orders");
    setShowUserMenu(false);
    setShowMobileMenu(false);
  }

  const handleVoucher = () => {
    navigate("/vouchers");
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setShowLanguageMenu(false);
  };

  const handleNavClick = () => {
    setShowMobileMenu(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target)
      ) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set loading state when avatar changes
  const prevAvatarRef = useRef(user?.avatar);

  useEffect(() => {
    if (user?.avatar && user?.avatar !== prevAvatarRef.current) {
      setAvatarLoading(true);
      prevAvatarRef.current = user.avatar;
    } else if (!user?.avatar) {
      setAvatarLoading(false);
    }
  }, [user?.avatar]);

  // Ref to prevent duplicate API calls
  const fetchingCartCountRef = useRef(false);
  const lastFetchKeyRef = useRef('');
  
  // Fetch cart count when authenticated or location changes
  useEffect(() => {
    // Skip if already fetching
    if (fetchingCartCountRef.current) return;
    
    // Create a unique key for this fetch condition
    const fetchKey = `${isAuthenticated}-${location.pathname}`;
    
    // Skip if we already fetched for this exact condition
    if (lastFetchKeyRef.current === fetchKey) return;
    
    const fetchCartCount = async () => {
      // Skip fetching count when on cart page (CartList already has cart data)
      if (isCartPage) {
        lastFetchKeyRef.current = fetchKey;
        return;
      }
      
      fetchingCartCountRef.current = true;
      
      try {
        if (isAuthenticated) {
          const result = await getCartCount();
          if (result.success) {
            updateCartCount(result.count || 0);
          }
        } else {
          updateCartCount(0);
        }
        lastFetchKeyRef.current = fetchKey;
      } finally {
        fetchingCartCountRef.current = false;
      }
    };
    
    fetchCartCount();
  }, [isAuthenticated, location.pathname, isCartPage, updateCartCount]);

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-2 md:py-4 bg-color1 text-white sticky top-0 z-50">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-white z-50"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} size="lg" />
        </button>
        {/* Logo */}
        <div className="flex items-center gap-2 z-50">
          <img
            src="/Logo_main.svg"
            alt="Wild Step Logo"
            className="h-5 sm:h-6 md:h-7 cursor-pointer"
            onClick={() => {
              navigate("/");
              setShowMobileMenu(false);
            }}
          />
        </div>

        {/* Desktop Navigation - Hidden on mobile/tablet */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-6 xl:gap-10 text-base xl:text-[1.25rem]">
            <a
              href="/products?filter=Sản-phẩm-mới"
              className={`${decodeURIComponent(location.search).includes("Sản-phẩm-mới") &&"font-semibold text-color4"} hover:text-color4 transition whitespace-nowrap`}
            >
              {t("header.nav.newProducts")}
            </a>
            <a
              href="/products?filter=Giảm-giá"
              className={`${decodeURIComponent(location.search).includes("Giảm-giá") &&"font-semibold text-color4"} hover:text-color4 transition whitespace-nowrap`}
            >
              {t("header.nav.sale")}
            </a>
            <a
              href="/contact"
              className={`${location.pathname === "/contact" &&"font-semibold text-color4"} hover:text-color4 transition whitespace-nowrap`}
            >
              {t("header.nav.contact")}
            </a>
            <a
              href="/support"
              className={`${location.pathname === "/support" &&"font-semibold text-color4"} hover:text-color4 transition whitespace-nowrap`}
            >
              {t("header.nav.support")}
            </a>
          </div>
        </nav>

        {/* Mobile/Tablet Hamburger Menu Button */}

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            // Giao diện khi đã đăng nhập
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <SearchBox className="hidden lg:flex" />
              {/* Cart Icon */}
              <div 
                ref={cartIconRef}
                onClick={()=>navigate("/cart")} 
                className="hidden md:inline-flex relative w-[3rem] h-[3rem] rounded-[30px] items-center justify-center hover:bg-gray-700 transition cursor-pointer"
              >
                <img
                  src="/icon/mdi_cart-outline.svg"
                  alt="Cart"
                  className="w-6 h-6"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <CartAnimation cartIconRef={cartIconRef} />

              {/* Wishlist Icon */}
              <div className="hidden md:inline-flex w-[3rem] h-[3rem] rounded-[30px] items-center justify-center hover:bg-gray-700 transition cursor-pointer">
                <img
                  src="/icon/mdi_heart-outline.svg"
                  alt="Wishlist"
                  className="w-6 h-6"
                />
              </div>

              {/* Language Switcher */}
              <div className="relative" ref={languageMenuRef}>
                <div
                  className="hidden md:inline-flex w-[3rem] h-[3rem] rounded-[30px] items-center justify-center hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                >
                  <FontAwesomeIcon icon={faGlobe} size="lg" />
                </div>

                {/* Language Dropdown */}
                {showLanguageMenu && (
                  <div className="absolute right-0 top-full mt-2 min-w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-3 text-left text-[1rem] flex items-center gap-3 transition ${
                          i18n.language === lang.code
                            ? "bg-color1 text-white"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative" ref={userMenuRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-10 h-10 xl:w-[3rem] xl:h-[3rem] rounded-full overflow-hidden flex items-center justify-center">
                    {user?.avatar ? (
                      <>
                        {avatarLoading && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full"></div>
                        )}
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onLoad={() => setAvatarLoading(false)}
                          onError={(e) => {
                            setAvatarLoading(false);
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      </>
                    ) : null}
                    <div
                      className={`w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${
                        user?.avatar ? "hidden" : "flex"
                      }`}
                    >
                      <span className="text-white font-semibold text-[1rem]">
                        {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div className="w-[1rem] h-[1rem] flex items-center justify-center">
                    <img
                      src="/icon/bxs_down-arrow.svg"
                      alt="Dropdown"
                      className="w-4 h-4"
                    />
                  </div>
                </div>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute p-0 right-0 top-full mt-2 min-w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 w-full">
                      <p className="text-[1rem] font-medium text-gray-900">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-[0.875rem] text-gray-500 w-full">
                        {user?.email}
                      </p>
                    </div>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin/dashboard");
                          setShowUserMenu(false);
                        }}
                        className="cursor-pointer w-full px-4 py-2 text-left text-[1rem] text-gray-900 hover:bg-gray-100 transition"
                      >
                        <span className="inline-flex items-center gap-2">
                          <FontAwesomeIcon icon={faGauge} className="w-4 h-4" />
                          {t("header.admin")}
                        </span>
                      </button>
                    )}
                    <button
                      onClick={handleProfile}
                      className="cursor-pointer w-full px-4 py-2 text-left text-[1rem] text-gray-900 hover:bg-gray-100 transition"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          className="w-4 h-4"
                        />
                        {t("header.profile")}
                      </span>
                    </button>

                    <button
                      onClick={handleMyOrders}
                      className="cursor-pointer w-full px-4 py-2 text-left text-[1rem] text-gray-900 hover:bg-gray-100 transition"
                    >
                      <span className="inline-flex items-center gap-2">
                        <HiOutlineArchiveBox className="w-4 h-4 stroke-2"/>
                        {t("header.myOrders")}
                      </span>
                    </button>

                    <button
                      onClick={handleVoucher}
                      className="cursor-pointer w-full px-4 py-2 text-left text-[1rem] text-gray-900 hover:bg-gray-100 transition"
                    >
                      <span className="inline-flex items-center gap-2">
                        <LuTicketPercent className="w-4 h-4 stroke-2"/>
                        {t("header.voucher")}
                      </span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="cursor-pointer w-full px-4 py-2 text-left text-[1rem] text-red-600 hover:bg-red-50 transition"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faRightFromBracket}
                          className="w-4 h-4"
                        />
                        {t("header.logout")}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Giao diện khi chưa đăng nhập
            <div className="flex items-center gap-2 xl:gap-4">
              <SearchBox className="hidden xl:flex" />

              {/* Language Switcher for non-authenticated users - Hidden on mobile */}
              <div className="hidden lg:block relative" ref={languageMenuRef}>
                <div
                  className="w-10 h-10 xl:w-[3rem] xl:h-[3rem] rounded-[30px] flex items-center justify-center hover:bg-gray-700 transition cursor-pointer"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                >
                  <FontAwesomeIcon icon={faGlobe} size="lg" />
                </div>

                {/* Language Dropdown */}
                {showLanguageMenu && (
                  <div className="absolute right-0 top-full mt-2 min-w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-3 text-left text-[1rem] flex items-center gap-3 transition ${
                          i18n.language === lang.code
                            ? "bg-color1 text-white"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/login")}
                className="bg-color4 text-[#0A1E33] font-semibold px-3 py-1.5 xl:px-4 xl:py-2 text-sm xl:text-base rounded-[0.5rem] hover:bg-hover4 transition cursor-pointer"
              >
                {t("header.login")}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile/Tablet Menu Overlay - Only show if NOT on Profile page */}
      {showMobileMenu && !isProfilePage && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full sm:w-80 bg-color1 text-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Content */}
            <div className="flex flex-col p-6 gap-6 mt-16">
              {/* Search Bar Mobile */}
              <SearchBox
                isMobile={true}
                onClose={() => setShowMobileMenu(false)}
              />

              {/* Navigation Links */}
              <nav className="flex flex-col gap-4 border-t border-white/20 pt-6">
                <a
                  href="/products?filter=Sản-phẩm-mới"
                  className="text-lg py-2 hover:text-[#50D5C4] transition"
                  onClick={handleNavClick}
                >
                  {t("header.nav.newProducts")}
                </a>
                <a
                  href="/products?filter=Giảm-giá"
                  className="text-lg py-2 text-[#50D5C4] font-semibold"
                  onClick={handleNavClick}
                >
                  {t("header.nav.sale")}
                </a>
                <a
                  href="/contact"
                  className="text-lg py-2 hover:text-[#50D5C4] transition"
                  onClick={handleNavClick}
                >
                  {t("header.nav.contact")}
                </a>
                <a
                  href="/support"
                  className="text-lg py-2 hover:text-[#50D5C4] transition"
                  onClick={handleNavClick}
                >
                  {t("header.nav.support")}
                </a>
              </nav>

              {/* Mobile Actions */}
              {isAuthenticated ? (
                <div className="flex flex-col gap-4 border-t border-white/20 pt-6">
                  {/* User Info */}
                  <div className="flex items-center gap-3 pb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-sm text-white/70">{user?.email}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        navigate("/cart");
                        setShowMobileMenu(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-lg transition relative"
                    >
                      <img
                        src="/icon/mdi_cart-outline.svg"
                        alt="Cart"
                        className="w-5 h-5"
                      />
                      <span className="text-sm">Cart</span>
                      {cartCount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-lg transition">
                      <img
                        src="/icon/mdi_heart-outline.svg"
                        alt="Wishlist"
                        className="w-5 h-5"
                      />
                      <span className="text-sm">Wishlist</span>
                    </button>
                  </div>

                  {/* User Menu Items */}
                  {user?.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center gap-3 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition"
                    >
                      <FontAwesomeIcon icon={faGauge} className="w-5 h-5" />
                      <span>{t("header.admin")}</span>
                    </button>
                  )}

                  <button
                    onClick={handleProfile}
                    className="flex items-center gap-3 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition"
                  >
                    <FontAwesomeIcon icon={faCircleUser} className="w-5 h-5" />
                    <span>{t("header.profile")}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-3 px-4 bg-red-600/80 hover:bg-red-600 rounded-lg transition"
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="w-5 h-5"
                    />
                    <span>{t("header.logout")}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 border-t border-white/20 pt-6">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setShowMobileMenu(false);
                    }}
                    className="w-full bg-color4 text-[#0A1E33] font-semibold py-3 rounded-lg hover:bg-hover4 transition"
                  >
                    {t("header.login")}
                  </button>
                </div>
              )}

              {/* Language Selector Mobile */}
              <div className="border-t border-white/20 pt-6">
                <p className="text-sm text-white/70 mb-3">
                  {t("header.language") || "Language"}
                </p>
                <div className="flex flex-col gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setShowMobileMenu(false);
                      }}
                      className={`flex items-center gap-3 py-2 px-4 rounded-lg transition ${
                        i18n.language === lang.code
                          ? "bg-color4 text-[#0A1E33]"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
