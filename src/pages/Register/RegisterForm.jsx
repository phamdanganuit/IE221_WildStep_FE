import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SocialLoginButtons from "@/components/SocialLoginButton";
import { register, getStoredToken } from "../../service/authService";
import { useAuthStore } from "../../store/authStore";
import { useToast } from "../../contexts/ToastContext";
import { useTranslation } from "react-i18next";

function RegisterForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [check, setCheck] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeShake, setAgreeShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const { success, error } = useToast();
  
  const navigate = useNavigate();
  const MIN_PASSWORD_LENGTH = 8; // minimum length required

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

  const isStrongPassword = (value) => {
    // ít nhất phải có 1 chữ in hoa, 1 chữ số và 1 ký tự đặc biệt
    return /(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(value);
  };

  const isValidEmail = (value) => {
    // Basic email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const nextErrors = {};

    // Validation cho fullName
    if (!fullName || fullName.trim() === "") {
      nextErrors.fullName = t('register.errors.fullNameRequired');
    }

    if (!email || email.trim() === "") {
      nextErrors.email = t('register.errors.emailRequired');
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = t('register.errors.emailInvalid');
    }

    if (!password || password === "") {
      nextErrors.password = t('register.errors.passwordRequired');
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = t('register.errors.passwordMinLength', { length: MIN_PASSWORD_LENGTH });
    } else if (!isStrongPassword(password)) {
      nextErrors.password = t('register.errors.passwordWeak');
    }

    if (!check) {
      nextErrors.agree = true;
    }

    setErrors(nextErrors);

    const hasErrors = Object.keys(nextErrors).length > 0;
    if (hasErrors) {
      // focus first invalid field (optional)
      const firstKey = Object.keys(nextErrors)[0];
      const el = document.getElementById(firstKey);
      if (el) el.focus();
      // if the missing/invalid field is the agreement checkbox, trigger a shake
      if (nextErrors.agree) {
        setAgreeShake(true);
        setTimeout(() => setAgreeShake(false), 700);
      }
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(email, password, fullName, null);
      
      if (result.success) {
        success(result.message)
        navigate("/login");
      } else {
        error(result.error);
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex w-auto h-full relative justify-center items-center p-[1rem] max-md:px-[1.25rem] max-md:py-[2.5rem] max-md:w-full">
      <style>{`
      @keyframes shakeX { 
        0% { transform: translateX(0); } 
        20% { transform: translateX(-0.375rem); } 
        40% { transform: translateX(0.375rem); } 
        60% { transform: translateX(-0.25rem); } 
        80% { transform: translateX(0.25rem); } 
        100% { transform: translateX(0); } 
      }
      .shake { animation: shakeX 0.6s ease-in-out; }
      `}</style>
      <div className="flex flex-col justify-center items-center mt-[2rem] max-md:mt-[2.5rem] max-md:max-w-full">
        <main className="flex flex-col gap-[0.75rem] mt-[0.75rem] w-full max-md:mt-[2.5rem] max-md:max-w-full">
          <header className="flex flex-col justify-start items-start gap-[0.25rem]">
            <h1 className="text-[3rem] font-semibold text-color2 max-md:text-[2.25rem]">
              {t('register.title')}
            </h1>
            <div className="text-[1.25rem] tracking-tight text-black text-normal">
              {t('register.subtitle')}
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="mt-[1rem] w-full max-md:max-w-full"
          >
            <div className="w-full font-medium max-md:max-w-full">
              <label
                htmlFor="fullName"
                className="text-[1rem] text-[#000000]/50"
              >
                {t('register.fullName')}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex flex-col justify-center px-[1.25rem] py-[1rem] mt-[0.375rem] w-full text-[1.25rem] text-[#000000]/50 tracking-tight whitespace-nowrap rounded-[1rem] border-[0.125rem] border-solid bg-opacity-0 border-[#333678]/50 border-opacity-50 min-h-[4rem] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-color2 focus:border-color2"
                placeholder={t('register.fullNamePlaceholder')}
                aria-describedby="fullname-help"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="mt-[0.5rem] text-sm text-red-600" id="fullname-help">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="mt-[1rem] w-full font-medium max-md:max-w-full">
              <label htmlFor="email" className="text-[1rem] text-[#000000]/50">
                {t('register.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex flex-col justify-center px-[1.25rem] py-[1rem] mt-[0.375rem] w-full text-[1.25rem] text-[#000000]/50 tracking-tight whitespace-nowrap rounded-[1rem] border-[0.125rem] border-solid bg-opacity-0 border-[#333678]/50 border-opacity-50 min-h-[4rem] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-color2 focus:border-color2"
                placeholder={t('register.emailPlaceholder')}
                aria-describedby="email-help"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-[0.5rem] text-sm text-red-600" id="email-help">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mt-[1rem] w-full font-medium text-[#000000]/50 max-md:max-w-full">
              <label htmlFor="password" className="text-[1rem] tracking-tight">
                {t('register.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('register.passwordPlaceholder')}
                  className="flex flex-col justify-center px-[1.25rem] py-[1rem] mt-[0.375rem] w-full text-[1.25rem] tracking-tight rounded-[1rem] border-[0.125rem] border-solid border-[#333678]/50 min-h-[4rem] max-md:max-w-full focus:outline-none focus:ring-2 focus:ring-color2 focus:border-color2"
                  aria-describedby="password-help"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[1.25rem] top-1/2 transform -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-color2 rounded cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/93c58a2d6a36e95a20c10d52fdc3abf9c42c8805?placeholderIfAbsent=true&apiKey=7e6ace8706ad423985a91f95c2918220"
                    alt=""
                    className="object-contain shrink-0 aspect-[1.16] w-[1.375rem]"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="mt-[0.5rem] text-sm text-red-600" id="password-help">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-[2.5rem] justify-between items-center mt-[1rem] w-full text-[1.25rem] tracking-tight max-md:max-w-full">
              <div className="flex gap-[0.625rem] items-center self-stretch my-auto text-black ">
                <input
                  id="agree"
                  type="checkbox"
                  checked={check}
                  onChange={(e) => setCheck(e.target.checked)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <div
                  role="checkbox"
                  aria-checked={check}
                  tabIndex={0}
                  onClick={() => setCheck((s) => !s)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setCheck((s) => !s);
                    }
                  }}
                  className={`w-[1.25rem] h-[1.25rem] rounded cursor-pointer flex items-center justify-center border-[0.125rem]
                  ${
                    check
                      ? "bg-color2 border-color2"
                      : agreeShake
                      ? "border-red-500 shake bg-transparent"
                      : "border-color2 bg-transparent"
                  }
                `}
                >
                  {check && (
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
                <span className="self-stretch my-auto text-[1.125rem]">
                  {t('register.agreeWith')}{" "}
                  <Link
                    to="/terms"
                    className="font-semibold text-color2 hover:underline hover:scale-50"
                  >
                    {t('register.termsOfService')}
                  </Link>{" "}
                  {t('register.and')}{" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-color2 hover:underline"
                  >
                    {t('register.privacyPolicy')}
                  </Link>
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex gap-[0.625rem] justify-center items-center px-[0.0625rem] py-[1rem] mt-[1rem] max-w-full text-[1.5rem] font-semibold tracking-tight text-center text-white bg-color2 rounded-[1rem] min-h-[4rem] w-full hover:bg-[#003366] hover:shadow-lg hover:-translate-y-[0.25rem] transition-all duration-200 ease-in-out cursor-pointer ${
                isLoading ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-[1.25rem] w-[1.25rem] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="self-stretch my-auto">{t('register.registering')}</span>
                </>
              ) : (
                <span className="self-stretch my-auto">{t('register.registerButton')}</span>
              )}
            </button>
          </form>

          <div className="flex gap-[0.375rem] items-center self-start text-[1.25rem] tracking-tight">
            <p className="self-stretch my-auto text-black">{t('register.haveAccount')}</p>
            <button
              onClick={() => navigate("/login")}
              className="self-stretch my-auto font-semibold text-color2 hover:underline cursor-pointer"
            >
              {t('register.login')}
            </button>
          </div>

          <div className="flex w-full gap-[1.25rem] items-center justify-between text-[1.25rem] tracking-tight text-black max-md:max-w-full">
            <img
              src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/88e5e0c07683d0c404879328cec4e8151ffff570?placeholderIfAbsent=true"
              alt="Social login divider"
              className="object-contain shrink-0 self-stretch my-auto aspect-[76.92] w-[9.6875rem]"
            />
            <span className="self-stretch my-auto text-center">
              {t('register.orContinueWith')}
            </span>
            <img
              src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/88e5e0c07683d0c404879328cec4e8151ffff570?placeholderIfAbsent=true"
              alt="Social login divider"
              className="object-contain shrink-0 self-stretch my-auto aspect-[76.92] w-[9.6875rem]"
            />
          </div>

          <SocialLoginButtons buttonBg="#1C2541" buttonHoverBg="#003366" />
        </main>
      </div>
    </section>
  );
}

export default RegisterForm;
