import Header from "@/components/Header";
import AddVoucher from "@/components/Voucher/AddVoucher";
import VoucherList from "@/components/Voucher/VoucherList";
import React from "react";

function Voucher() {
  return (
    <div
      className="flex flex-col min-h-screen overflow-x-hidden"
      style={{
        objectFit: "contain",
        backgroundImage: "url('/profile-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />
      <div
        className="flex-1 w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 
        h-full flex flex-col
        pt-6 sm:pt-8 md:pt-10 
        mx-auto 
        gap-4 sm:gap-6 
        bg-white/95 backdrop-blur-sm
        min-h-[calc(100vh-4rem)] container"
      >
        <div className="flex self-start w-full mx-auto justify-between items-center">
          <h2 className="font-semibold text-2xl text-center">
            Mã giảm giá của bạn
          </h2>
          <AddVoucher />
        </div>
        <VoucherList />
      </div>
    </div>
  );
}

export default Voucher;
