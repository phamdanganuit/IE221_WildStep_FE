import React from "react";
import bg from "@/assets/register_bg.png";
import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  return (
    <div
      className="flex w-full h-full bg-white max-md:flex-col"
      aria-label="Trang đăng ký Wild Step"
    >
      <button
        onClick={() => navigate("/")}
        className="absolute left-[45%] top-[2rem] py-[1.25rem] max-w-full cursor-pointer"
      >
        <img
          src="/Logo.svg"
          alt="Wild Step Logo"
          className="object-contain w-full aspect-[9.52] max-md:w-[15rem]"
        />
      </button>
      <div className="flex w-full h-screen justify-center items-center">
        <RegisterForm />
      </div>
      <div className="hidden md:flex h-screen w-11/20 justify-center items-center">
        <img
          src={bg}
          alt="Register background"
          className="h-full object-cover"
        />
      </div>
    </div>
  );
}

export default RegisterPage;
