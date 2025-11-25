import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { loginWithGoogle, loginWithFacebook } from "../service/authService";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../contexts/ToastContext";
import { useTranslation } from "react-i18next";

function SocialLoginButtons({ buttonBg, buttonHoverBg }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState({ google: false, facebook: false });
  const setAuth = useAuthStore((state) => state.setAuth);
  const { error } = useToast();
  const navigate = useNavigate();

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setIsLoading(prev => ({ ...prev, google: true }));
    
    try {
      // Khởi tạo Google OAuth
      if (typeof window.google === 'undefined') {
        // Load Google OAuth script nếu chưa có
        await loadGoogleScript();
      }

      // Sử dụng Google Identity Services
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response) => {
          if (response.error) {
            error(t('socialLogin.googleLoginFailed') + ": " + response.error);
            setIsLoading(prev => ({ ...prev, google: false }));
            return;
          }

          try {
            // Lấy thông tin user từ Google
            const userInfo = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`);
            const userData = await userInfo.json();
            
            // Gửi id_token đến backend
            const result = await loginWithGoogle(response.access_token);
            
            if (result.success) {
              // Tạo user info từ Google
              const userInfo = {
                email: userData.email || 'google@user.com',
                displayName: userData.name || 'Google User',
                avatar: userData.picture || null // Lấy ảnh từ Google
              };
              setAuth(result.data.access_token, userInfo);
              navigate("/"); // Redirect về home
            } else {
              error(result.error);
            }
          } catch (err) {
            error(t('socialLogin.googleLoginError'));
          } finally {
            setIsLoading(prev => ({ ...prev, google: false }));
          }
        }
      });

      client.requestAccessToken();
    } catch (err) {
      error(t('socialLogin.googleOAuthError'));
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  // Facebook OAuth Login
  const handleFacebookLogin = async () => {
    setIsLoading(prev => ({ ...prev, facebook: true }));
    
    try {
      // Khởi tạo Facebook SDK
      await loadFacebookScript();

      // Đợi FB object được tạo và khởi tạo
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      while (!window.FB && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!window.FB) {
        throw new Error('Facebook SDK failed to load');
      }
      
      // Init FB nếu chưa được init
      try {
        // Kiểm tra xem FB có getAppId method không
        if (typeof window.FB.getAppId === 'function') {
          const currentAppId = window.FB.getAppId();
          if (!currentAppId) {
            window.FB.init({
              appId: import.meta.env.VITE_FACEBOOK_APP_ID,
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            });
          }
        } else {
          // Không có getAppId, init luôn
          window.FB.init({
            appId: import.meta.env.VITE_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
        }
      } catch (err) {
        // Silent fail - FB đã init rồi
      }

      window.FB.login((response) => {
        if (response.authResponse) {
          const processLogin = async () => {
            try {
              const result = await loginWithFacebook(response.authResponse.accessToken);
              
              if (result.success) {
                // Lấy thông tin user từ Facebook
                window.FB.api('/me', { fields: 'name,email,picture' }, (userData) => {
                  const userInfo = {
                    email: userData.email || 'facebook@user.com',
                    displayName: userData.name || 'Facebook User',
                    avatar: userData.picture?.data?.url || null // Lấy ảnh từ Facebook
                  };
                  setAuth(result.data.access_token, userInfo);
                  navigate("/"); // Redirect về home
                });
              } else {
                error(result.error);
              }
            } catch (err) {
              error(t('socialLogin.facebookLoginError'));
            } finally {
              setIsLoading(prev => ({ ...prev, facebook: false }));
            }
          };
          
          processLogin();
        } else {
          error(t('socialLogin.facebookCancelled'));
          setIsLoading(prev => ({ ...prev, facebook: false }));
        }
      }, { scope: 'email,public_profile' });
    } catch (err) {
      error(t('socialLogin.facebookOAuthError'));
      setIsLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  // Load Google OAuth script
  const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Load Facebook SDK script
  const loadFacebookScript = () => {
    return new Promise((resolve, reject) => {
      if (window.FB) {
        // Kiểm tra xem đã init chưa
        if (window.FB.getAppId && window.FB.getAppId() === import.meta.env.VITE_FACEBOOK_APP_ID) {
          resolve();
          return;
        }
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://connect.facebook.net/en_US/sdk.js"]');
      if (existingScript) {
        // Script đã tồn tại, đợi FB load xong
        const checkFB = setInterval(() => {
          if (window.FB) {
            window.FB.init({
              appId: import.meta.env.VITE_FACEBOOK_APP_ID,
              cookie: true,
              xfbml: true,
              version: 'v18.0',
              autoLogAppEvents: false  // Tắt auto logging
            });
            clearInterval(checkFB);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkFB);
          reject(new Error('Facebook SDK load timeout'));
        }, 10000);
        return;
      }

      // Load Facebook SDK
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Đợi FB object được tạo
        const initFB = setInterval(() => {
          if (window.FB) {
            window.FB.init({
              appId: import.meta.env.VITE_FACEBOOK_APP_ID,
              cookie: true,
              xfbml: true,
              version: 'v18.0',
              autoLogAppEvents: false  // Tắt auto logging để giảm console errors
            });
            clearInterval(initFB);
            resolve();
          }
        }, 50);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const socialButtons = [
    { 
      icon: <FaGoogle />, 
      label: "Login with Google",
      onClick: handleGoogleLogin,
      loading: isLoading.google,
      disabled: isLoading.google || isLoading.facebook
    },
    { 
      icon: <FaFacebook />, 
      label: "Login with Facebook",
      onClick: handleFacebookLogin,
      loading: isLoading.facebook,
      disabled: isLoading.google || isLoading.facebook
    },
  ];

  return (
    <section
      className="flex relative items-center justify-center gap-4 max-md:gap-4 max-sm:flex-wrap max-sm:gap-5 max-sm:justify-center max-sm:w-full"
      aria-label="Social login options"
    >
      {socialButtons.map((btn, index) => (
        <button
          key={index}
          aria-label={btn.label}
          disabled={btn.disabled}
          onClick={btn.onClick}
          className={`flex relative flex-col gap-2.5 items-center justify-center px-6 py-4 rounded-2xl max-md:px-5 max-md:py-3 max-sm:px-5 max-sm:py-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 
              transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0`}
          style={{
            backgroundColor: buttonBg,
          }}
          onMouseEnter={(e) => {
            if (!btn.disabled) {
              e.currentTarget.style.backgroundColor = buttonHoverBg;
            }
          }}
          onMouseLeave={(e) => {
            if (!btn.disabled) {
              e.currentTarget.style.backgroundColor = buttonBg;
            }
          }}
        >
          {btn.loading ? (
            <svg className="animate-spin h-[2.65rem] w-[2.65rem] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            React.cloneElement(btn.icon, {
              className: "text-[2.65rem] text-white",
            })
          )}
        </button>
      ))}
    </section>
  );
}

export default SocialLoginButtons;
