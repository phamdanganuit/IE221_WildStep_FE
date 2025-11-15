import { create } from "zustand";
import { getStoredToken, clearStoredToken, getProfile } from "../service/authService";
import { getFullAvatarUrl } from "../lib/avatarUtils";

// Track if initializeAuth is in progress to prevent duplicate calls in Strict Mode
let isInitializing = false;
let initializationPromise = null;

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Khởi tạo auth state từ localStorage/sessionStorage
  initializeAuth: async () => {
    // If already initializing, return the existing promise
    if (isInitializing && initializationPromise) {
      return initializationPromise;
    }
    
    // Mark as initializing and create promise
    isInitializing = true;
    initializationPromise = (async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        set({ token: storedToken, isAuthenticated: true });
        
        // Lấy thông tin profile để có avatar
        try {
          const profile = await getProfile(storedToken);
          if (profile) {
            // Normalize avatar URL to full URL
            const normalizedProfile = {
              ...profile,
              avatar: profile.avatar ? getFullAvatarUrl(profile.avatar) : null
            };
            set({ user: normalizedProfile });
          }
        } catch (error) {
          console.error("Lỗi lấy profile:", error);
          // Nếu token không hợp lệ, clear auth
          clearStoredToken();
          set({ token: null, user: null, isAuthenticated: false });
        }
      } else {
        // Không có token, set loading false ngay
        set({ isLoading: false });
        isInitializing = false;
        initializationPromise = null;
        return;
      }
      set({ isLoading: false });
      isInitializing = false;
      initializationPromise = null;
    })();
    
    return initializationPromise;
  },

  // Lưu token & user sau khi đăng nhập
  setAuth: async (token, user = null) => {
    set({ token, user, isAuthenticated: true });
    
    // Nếu chưa có user info hoặc không có avatar, lấy từ API profile
    if (!user || !user.avatar) {
      try {
        const profile = await getProfile(token);
        if (profile) {
          // Normalize avatar URL to full URL
          const normalizedProfile = {
            ...profile,
            avatar: profile.avatar ? getFullAvatarUrl(profile.avatar) : null
          };
          set({ user: normalizedProfile });
        }
      } catch (error) {
        console.error("Lỗi lấy profile:", error);
      }
    } else if (user && user.avatar) {
      // Normalize existing avatar URL if it's not already a full URL
      const normalizedAvatar = getFullAvatarUrl(user.avatar);
      if (normalizedAvatar !== user.avatar) {
        set({ user: { ...user, avatar: normalizedAvatar } });
      }
    }
  },

  // Xóa token & user khi đăng xuất
  clearAuth: () => {
    clearStoredToken();
    set({ token: null, user: null, isAuthenticated: false });
  },

  // Cập nhật thông tin user
  updateUser: (updatedUser) => {
    set((state) => ({
      user: { ...state.user, ...updatedUser },
    }));
  },
}));
