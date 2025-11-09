import React from "react";
import bg from "@/assets/login_bg.png";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col md:flex-row w-full min-h-screen bg-white overflow-x-hidden"
      aria-label="Trang đăng nhập Wild Step"
    >
      {/* Logo - Responsive positioning */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 sm:top-6 md:top-8 
          right-4 sm:right-6 md:right-10 
          z-50 cursor-pointer"
      >
        <img
          src="/Logo.svg"
          alt="Wild Step Logo"
          className="object-contain 
            w-32 sm:w-40 md:w-48 lg:w-56
            h-auto"
        />
      </button>

      {/* Background Image - Hidden on mobile, shown on tablet+ */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 h-screen justify-center items-center bg-gray-50">
        <img
          src={bg}
          alt="Login background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Login Form Container - Responsive */}
      <div className="flex w-full lg:w-3/5 xl:w-1/2 min-h-screen justify-center items-center 
        p-4 sm:p-6 md:p-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
