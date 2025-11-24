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
    <section className="flex w-auto h-full relative justify-center items-center p-[1rem] max-md:px-[1.25rem] max-md:py-[2.5rem] max-md:w-full">
      <div className="flex flex-col justify-center items-center mt-[0.75rem] max-md:mt-[2.5rem] max-md:max-w-full">
        <main className="flex flex-col gap-[0.75rem] mt-[2.5rem] w-full max-md:mt-[2.5rem] max-md:max-w-full">
          <header className="flex flex-col justify-start items-start gap-[0.25rem]">
            <h1 className="text-[3rem] font-semibold text-color4 max-md:text-[2.25rem]">
            {t('login.title')}
            </h1>
            <div className="text-[1.25rem] tracking-tight text-black text-normal">
            {t('login.subtitle')}
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="mt-4 w-full max-md:max-w-full"
          >
            <div className="w-full font-medium max-md:max-w-full">
              <label htmlFor="email" className="text-[1rem] text-[#000000]/50">
              {t('login.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex flex-col justify-center px-[1.25rem] py-[1.5rem] mt-[0.375rem] w-full text-[1.25rem] text-[#000000]/50 tracking-tight whitespace-nowrap rounded-[1rem] border-[0.125rem] border-solid bg-opacity-0 border-[#333678]/50 border-opacity-50 min-h-[4rem] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-color4 focus:border-color4"
                placeholder={t('login.emailPlaceholder')}
                required
                aria-describedby="email-help"
                disabled={isLoading}
              />
            </div>

            <div className="mt-[1rem] w-full font-medium text-[#000000]/50 max-md:max-w-full">
              <label htmlFor="password" className="text-[1rem] tracking-tight">
              {t('login.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  className="flex flex-col justify-center px-[1.25rem] py-[1.5rem] mt-[0.375rem] w-full text-[1.25rem] tracking-tight rounded-[1rem] border-[0.125rem] border-solid border-[#333678]/50 min-h-[4rem] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-color4 focus:border-color4"
                  required
                  aria-describedby="password-help"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[1.25rem] top-1/2 transform -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-color4 rounded cursor-pointer"
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  disabled={isLoading}
                >
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/93c58a2d6a36e95a20c10d52fdc3abf9c42c8805?placeholderIfAbsent=true&apiKey=7e6ace8706ad423985a91f95c2918220"
                    alt=""
                    className="object-contain shrink-0 aspect-[1.16] w-[1.375rem]"
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-[2.5rem] justify-between items-center mt-[1rem] w-full text-[1.25rem] tracking-tight max-md:max-w-full">
              <div className="flex gap-[0.625rem]">
                <label className="flex gap-[0.625rem] items-center self-stretch my-auto text-black">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div
                    className={`w-[1.25rem] h-[1.25rem] border-[0.125rem] border-color4 rounded cursor-pointer ${
                      rememberMe ? "bg-color4" : "bg-transparent"
                    } flex items-center justify-center`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-[1.25rem] h-[1.25rem] text-white"
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
                </label>
                <span className="self-stretch my-auto text-[1.125rem]">
                  {t('login.rememberMe')}
                </span>
              </div>
              <button
                type="button"
                className="self-stretch my-auto text-[1.125rem] font-medium text-color4 hover:text-hover4 hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-color4 rounded"
                disabled={isLoading}
              >
                {t('login.forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex gap-[0.625rem] justify-center items-center px-[0.0625rem] py-[1.25rem] mt-[1rem] max-w-full text-[1.5rem] font-semibold tracking-tight text-center text-white bg-color4 rounded-[1rem] min-h-[4rem] w-full hover:bg-hover4 hover:shadow-lg hover:-translate-y-[0.25rem] transition-all duration-200 ease-in-out cursor-pointer ${
                isLoading ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-[1.25rem] w-[1.25rem] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="self-stretch my-auto">{t('login.loggingIn')}</span>
                </>
              ) : (
                <span className="self-stretch my-auto">{t('login.loginButton')}</span>
              )}
            </button>
          </form>

          <div className="flex gap-[0.375rem] items-center self-start text-[1.25rem] tracking-tight">
            <p className="self-stretch my-auto text-black">
              {t('login.noAccount')}
            </p>
            <button
              onClick={() => navigate("/register")}
              className="self-stretch my-auto font-semibold text-color4 hover:underline cursor-pointer"
            >
              {t('login.register')}
            </button>
          </div>

          <div className="flex w-full gap-[1.25rem] items-center justify-between text-[1.25rem] tracking-tight text-black max-md:max-w-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/88e5e0c07683d0c404879328cec4e8151ffff570?placeholderIfAbsent=true"
              alt="Social login divider"
              className="object-contain shrink-0 self-stretch my-auto aspect-[76.92] w-[9.6875rem]"
            />
            <span className="self-stretch my-auto text-center">
              {t('login.orContinueWith')}
            </span>
            <img
              src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/88e5e0c07683d0c404879328cec4e8151ffff570?placeholderIfAbsent=true"
              alt="Social login divider"
              className="object-contain shrink-0 self-stretch my-auto aspect-[76.92] w-[9.6875rem]"
            />
          </div>

          <SocialLoginButtons buttonBg="#5BC0BE" buttonHoverBg="#248F8D" />
        </main>
      </div>
    </section>
  );
}

export default LoginForm;
