import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SocialLoginButtons from "@/components/SocialLoginButton";
import { login, getStoredToken } from "../../service/authService";
import { useAuthStore } from "../../store/authStore";
import { useToast } from "../../contexts/ToastContext";
import { useTranslation } from "react-i18next";

function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const { success, error } = useToast();

  const navigate = useNavigate();

  // Khởi tạo auth state nếu có token
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        await initializeAuth();
      }
    };
    checkAuth();
  }, [initializeAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(email, password, rememberMe);
      
      if (result.success) {
        // Tạo user info đơn giản từ email
        const userInfo = {
          email: email,
          displayName: email.split('@')[0], // Lấy phần trước @ làm displayName
          avatar: null // Sẽ được cập nhật từ API profile sau
        };
        setAuth(result.data.access_token, userInfo);
        success(result.message)
        navigate("/");
      } else {
        error(result.error);
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex w-full max-w-md lg:max-w-lg xl:max-w-xl 
      justify-center items-center 
      px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col justify-center items-center w-full">
        <main className="flex flex-col gap-3 sm:gap-4 w-full">
          <header className="flex flex-col justify-start items-start gap-1 sm:gap-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-color4">
              {t('login.title')}
            </h1>
            <div className="text-base sm:text-lg md:text-xl tracking-tight text-black">
              {t('login.subtitle')}
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="mt-4 sm:mt-6 w-full"
          >
            {/* Email Field - Responsive */}
            <div className="w-full font-medium">
              <label htmlFor="email" className="text-sm sm:text-base text-[#000000]/50 block mb-2">
                {t('login.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 
                  text-base sm:text-lg 
                  text-[#000000]/50 tracking-tight 
                  rounded-xl sm:rounded-2xl 
                  border-2 border-solid border-[#333678]/50 
                  min-h-[48px] sm:min-h-[56px] md:min-h-[64px]
                  focus:outline-none focus:ring-2 focus:ring-color4 focus:border-color4
                  transition-all"
                placeholder={t('login.emailPlaceholder')}
                required
                aria-describedby="email-help"
              />
            </div>

            {/* Password Field - Responsive */}
            <div className="mt-4 sm:mt-5 w-full font-medium text-[#000000]/50">
              <label htmlFor="password" className="text-sm sm:text-base tracking-tight block mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 
                    text-base sm:text-lg 
                    tracking-tight 
                    rounded-xl sm:rounded-2xl 
                    border-2 border-solid border-[#333678]/50 
                    min-h-[48px] sm:min-h-[56px] md:min-h-[64px]
                    focus:outline-none focus:ring-2 focus:ring-color4 focus:border-color4
                    transition-all
                    pr-12"
                  required
                  aria-describedby="password-help"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 
                    w-10 h-10 flex items-center justify-center
                    focus:outline-none focus:ring-2 focus:ring-color4 rounded cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/93c58a2d6a36e95a20c10d52fdc3abf9c42c8805?placeholderIfAbsent=true&apiKey=7e6ace8706ad423985a91f95c2918220"
                    alt=""
                    className="object-contain w-5 h-5 sm:w-6 sm:h-6"
                  />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password - Responsive */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 md:gap-6 
              justify-between items-start sm:items-center 
              mt-4 sm:mt-5 w-full">
              <label className="flex gap-2.5 items-center text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 
                    border-2 border-color4 rounded 
                    ${rememberMe ? "bg-color4" : "bg-transparent"} 
                    flex items-center justify-center
                    flex-shrink-0`}
                >
                  {rememberMe && (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm sm:text-base">
                  {t('login.rememberMe')}
                </span>
              </label>
              <button
                type="button"
                className="text-sm sm:text-base font-medium 
                  text-color4 hover:text-hover4 hover:underline 
                  cursor-pointer 
                  focus:outline-none focus:ring-2 focus:ring-color4 rounded
                  transition-colors"
              >
                {t('login.forgotPassword')}
              </button>
            </div>

            {/* Submit Button - Responsive */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                flex gap-2.5 justify-center items-center 
                px-4 py-3 sm:py-4 
                mt-5 sm:mt-6 
                w-full 
                text-base sm:text-lg md:text-xl 
                font-semibold tracking-tight text-center text-white 
                rounded-xl sm:rounded-2xl 
                min-h-[48px] sm:min-h-[56px]
                transition-all duration-200 ease-in-out 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-color4 hover:bg-hover4 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                }
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('login.loggingIn')}</span>
                </>
              ) : (
                <span>{t('login.loginButton')}</span>
              )}
            </button>
          </form>

          {/* Register Link - Responsive */}
          <div className="flex gap-1.5 items-center justify-center sm:justify-start 
            text-sm sm:text-base md:text-lg tracking-tight
            mt-4">
            <p className="text-black">
              {t('login.noAccount')}
            </p>
            <button
              onClick={() => navigate("/register")}
              className="font-semibold text-color4 hover:underline cursor-pointer transition-colors"
            >
              {t('login.register')}
            </button>
          </div>

          {/* Social Login Divider - Responsive */}
          <div className="flex w-full gap-3 sm:gap-4 md:gap-5 
            items-center justify-center 
            text-xs sm:text-sm md:text-base 
            tracking-tight text-black
            mt-4 sm:mt-5">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="whitespace-nowrap px-2">
              {t('login.orContinueWith')}
            </span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login Buttons - Responsive */}
          <div className="mt-4 sm:mt-5">
            <SocialLoginButtons buttonBg="#5BC0BE" buttonHoverBg="#248F8D" />
          </div>
        </main>
      </div>
    </section>
  );
}

export default LoginForm;
