import CartList from "@/components/Cart/CartList";
import Header from "@/components/Header";
import React from "react";

function Cart() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <div
        className="flex-1 w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 
        h-full flex flex-col
        pt-6 sm:pt-8 md:pt-10 
        mx-auto 
        gap-4 sm:gap-6 
        bg-white/95 backdrop-blur-sm
        container"
      >
        <h2 className="font-semibold text-2xl">Giỏ hàng</h2>
        <CartList />
      </div>
    </div>
  );
}

export default Cart;
