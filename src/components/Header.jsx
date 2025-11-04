import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    clearAuth();
    setShowUserMenu(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setShowUserMenu(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
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

  return (
    <header className="w-full flex items-center justify-between px-10 py-4 bg-color1 text-white">
      <div className="flex items-center gap-2">
        <img
          src="/Logo_main.svg"
          alt="Wild Step Logo"
          className="h-6 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <nav className="hidden md:flex gap-6 text-[1.15rem]">
        <a href="#" className="hover:text-[#50D5C4] transition">
          Sản phẩm mới
        </a>
        <a href="#" className="hover:text-[#50D5C4] transition">
          Nam
        </a>
        <a href="#" className="hover:text-[#50D5C4] transition">
          Nữ
        </a>
        <a href="#" className="hover:text-[#50D5C4] transition">
          Unisex
        </a>
        <a href="#" className="hover:text-[#50D5C4] transition">
          Trẻ em
        </a>
        <a href="#" className="hover:text-[#50D5C4] transition">
          Phụ kiện thể thao
        </a>
        <a href="#" className="text-[#50D5C4] font-semibold">
          Giảm giá
        </a>
      </nav>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          // Giao diện khi đã đăng nhập
          <div className="flex items-center gap-2.5">
            {/* Search Bar */}
            <div className="flex justify-center items-center bg-white rounded-[1.5rem] px-3 py-2 text-[#0A1E33]">
              <img
                src="/icon/material-symbols_search-rounded.svg"
                alt="Search"
                className="w-6 h-6 mr-1"
              />
              <input
                type="text"
                placeholder="Search"
                className="flex justify-center items-center bg-transparent outline-none text-[1.25rem] px-2"
              />
            </div>

            {/* Cart Icon */}
            <div className="w-[3rem] h-[3rem] rounded-[30px] flex items-center justify-center hover:bg-gray-700 transition cursor-pointer">
              <img
                src="/icon/mdi_cart-outline.svg"
                alt="Cart"
                className="w-6 h-6"
              />
            </div>

            {/* Wishlist Icon */}
            <div className="w-[3rem] h-[3rem] rounded-[30px] flex items-center justify-center hover:bg-gray-700 transition cursor-pointer">
              <img
                src="/icon/mdi_heart-outline.svg"
                alt="Wishlist"
                className="w-6 h-6"
              />
            </div>

            {/* User Profile */}
            <div className="relative" ref={userMenuRef}>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-[3rem] h-[3rem] rounded-full overflow-hidden flex items-center justify-center">
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
                    <p className="text-[0.875rem] text-gray-500 w-full">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleProfile}
                    className="cursor-pointer w-full px-4 py-2 text-left text-[1rem] text-gray-900 hover:bg-gray-100 transition"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FontAwesomeIcon icon={faCircleUser} className="w-4 h-4" />
                      Hồ sơ
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full px-4 py-2 text-left text-[1rem] text-red-600 hover:bg-red-50 transition"
                  >
                    <span className="inline-flex items-center gap-2">
                      <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
                      Đăng xuất
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Giao diện khi chưa đăng nhập
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-[1.5rem] px-3 py-2 text-[#0A1E33]">
              <img
                src="/icon/material-symbols_search-rounded.svg"
                alt="Search"
                className="w-6 h-6 mr-1"
              />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[1rem] px-2"
              />
            </div>

            <button
              onClick={() => navigate("/login")}
              className="bg-color4 text-[#0A1E33] font-semibold px-4 py-2 rounded-[0.5rem] hover:bg-hover4 transition cursor-pointer"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
