import { create } from "zustand";

const useVoucherStore = create((set) => ({
  vouchers: [], // danh sách voucher

  setVouchers: (list) => set({ vouchers: list }),

  addVoucher: (voucher) =>
    set((state) => ({ vouchers: [...state.vouchers, voucher] })),

  removeVoucher: (id) =>
    set((state) => ({ vouchers: state.vouchers.filter((v) => v._id !== id) })),

}));

export default useVoucherStore;
