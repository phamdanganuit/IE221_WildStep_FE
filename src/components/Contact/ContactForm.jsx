"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

// SEND CONTACT MESSAGE - ko biết nên để ở file nào trong service nên để tạm ở đây :)
const base_url = import.meta.env.VITE_BACKEND_URL;
export const contactMessage = async ({
  name,
  email,
  phone,
  issue,
  message,
}) => {
  try {
    const res = await fetch(`${base_url}/contact`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        phone,
        issue,
        message,
      }),
    });
    // OK -> 201 Created
    if (!res.ok) {
      if (res.status === 400) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.detail || "Dữ liệu không hợp lệ",
        };
      }
      throw new Error("Không thể gửi tin nhắn liên hệ");
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || "Gửi tin nhắn thành công!",
    };
  } catch (error) {
    return {
      success: false,
      error: err.message || "Có lỗi xảy ra khi gửi tin nhắn liên hệ",
    };
  }
};

export function ContactForm({ className }) {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [issue, setIssue] = useState("Hỗ trợ đơn hàng");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await contactMessage({
        name,
        email,
        phone,
        issue,
        message,
      });
      if (result.success) {
        success(result.message);
      } else {
        error(result.error);
      }
    } catch (err) {
      error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={`${className} px-10 py-4 space-y-3`}>
      <div>
        <p className="font-semibold text-sm sm:text-base mb-2">
          Họ và tên{" "}
          <span className="text-red-500">{t("profile.edit.required")}</span>
        </p>
        <Input
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
        />
      </div>
      <div className="flex w-full justify-between space-x-4">
        <div className="w-1/2">
          <p className="font-semibold text-sm sm:text-base mb-2">
            Email{" "}
            <span className="text-red-500">{t("profile.edit.required")}</span>
          </p>
          <Input
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
          />
        </div>
        <div className="w-1/2">
          <p className="font-semibold text-sm sm:text-base mb-2">
            Số điện thoại
          </p>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]"
          />
        </div>
      </div>
      <div>
        <p className="font-semibold text-sm sm:text-base mb-2">
          Chọn đề tài{" "}
          <span className="text-red-500">{t("profile.edit.required")}</span>
        </p>
        <div className="flex flex-wrap gap-4 sm:gap-5 items-center">
          <Label className="flex items-center gap-2 cursor-pointer">
            <Input
              type="radio"
              checked={issue === "Hỗ trợ đơn hàng"}
              value={"Hỗ trợ đơn hàng"}
              onChange={(e) => setIssue(e.target.value)}
              className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-600"
            />
            <span className="text-sm sm:text-base">Hỗ trợ đơn hàng</span>
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer">
            <Input
              type="radio"
              checked={issue === "Tư vấn sản phẩm"}
              value={"Tư vấn sản phẩm"}
              onChange={(e) => setIssue(e.target.value)}
              className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-600"
            />
            <span className="text-sm sm:text-base">Tư vấn sản phẩm</span>
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer">
            <Input
              type="radio"
              checked={issue === "Phản hồi & Góp ý"}
              value={"Phản hồi & Góp ý"}
              onChange={(e) => setIssue(e.target.value)}
              className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-600"
            />
            <span className="text-sm sm:text-base">Phản hồi & Góp ý</span>
          </Label>
          <Label className="flex items-center gap-2 cursor-pointer">
            <Input
              type="radio"
              checked={issue === "Khác"}
              value={"Khác"}
              onChange={(e) => setIssue(e.target.value)}
              className="w-5 h-5 sm:w-6 sm:h-6 accent-teal-600"
            />
            <span className="text-sm sm:text-base">Khác</span>
          </Label>
        </div>
      </div>
      <div>
        <p className="font-semibold text-sm sm:text-base mb-2">
          Tin nhắn{" "}
          <span className="text-red-500">{t("profile.edit.required")}</span>
        </p>
        <Textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-describedby
          className="resize-none scroll max-h-[100px] w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-3 py-2.5 sm:py-3 text-sm sm:text-base"
        />
      </div>
      <Button type="submit" disabled={loading} className={`px-4 py-2`}>
        {loading ? (
          <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Send />
        )}
        <p>Gửi tin nhắn</p>
      </Button>
    </form>
  );
}
