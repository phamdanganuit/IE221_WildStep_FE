import React from "react";
import bg from "@/assets/login_bg.png";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div
      className="flex w-full h-full bg-white max-md:flex-col"
      aria-label="Trang đăng nhập Wild Step"
    >
      <div className="hidden md:flex aspect-[0.7] h-screen justify-center items-center">
        <img
          src={bg}
          alt="Login background"
          className="h-full object-contain"
        />
      </div>
      <button
        onClick={() => navigate("/")}
        className="absolute right-[2.5rem] top-[2rem] py-[1.25rem] max-w-full cursor-pointer"
      >
        <img
          src="/Logo.svg"
          alt="Wild Step Logo"
          className="object-contain w-full aspect-[9.52] max-md:w-[15rem]"
        />
      </button>
      <div className="flex w-full h-screen justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
