"use client";
import { ContactForm } from "@/components/Contact/ContactForm";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";

import { FaDiscord, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


function Contact() {
  const [isLoaded, setIsLoaded] = useState(false);

  // delay 0.5s tạo hiệu ứng
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Header />
      <div
        className={`${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } transition-all duration-500`}
      >
        <div className="container mx-auto mt-10 space-y-2">
          <h2 className="font-semibold text-2xl text-center">Liên hệ</h2>
          <p className="text-gray-500 font-semibold text-base text-center">
            Có thắc mắc hoặc góp ý? Hãy gửi tin nhắn cho chúng tôi!
          </p>
          <div className="flex bg-card p-2 mt-5 text-card-foreground rounded-xl border shadow-sm">
            <Card className={"bg-color1 w-1/3 text-white"}>
              <CardHeader>
                <CardTitle>
                  <p className="font-semibold text-xl">Thông tin liên hệ</p>
                </CardTitle>
                <CardDescription>
                  Bắt đầu cuộc trò chuyện với chúng tôi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-10 my-10 w-full">
                  <div className="space-x-4 flex items-center">
                    <Phone className="h-6 w-6"/>
                    <a className="max-w-4/5 text-sm lg:text-base" target="_blank" href="tel:+84123456789">
                      +84 123 456 789
                    </a>
                  </div>
                  <div className="space-x-4 flex items-center">
                    <Mail className="h-6 w-6" />
                    <a className="max-w-4/5 break-all text-sm lg:text-base" target="_blank" href="mailto:contact@wildstep.com">
                      contact@wildstep.com
                    </a>
                  </div>
                  <div className="space-x-4 flex items-center">
                    <MapPin className="h-6 w-6"/>
                    <a className="max-w-4/5 break-normal text-sm lg:text-base"
                      target="_blank"
                      href="https://maps.app.goo.gl/NhmstJE5pSmF7Nqe8"
                    >
                      KP34, Đường Hàn Thuyên, Phường Linh Xuân, Thành phố Hồ Chí
                      Minh
                    </a>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  <Button className={"rounded-full w-10 h-10"}>
                    <a target="_blank" href="https://x.com">
                      <FaTwitter className="w-8 h-8" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className={"rounded-full w-10 h-10"}
                  >
                    <a target="_blank" href="https://facebook.com">
                      <FaFacebook className="w-8 h-8" />
                    </a>
                  </Button>
                  <Button className={"rounded-full w-10 h-10"}>
                    <a target="_blank" href="https://instagram.com">
                      <FaInstagram className="w-8 h-8" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className={"rounded-full w-10 h-10"}
                  >
                    <a target="_blank" href="https://discord.com">
                      <FaDiscord className="w-8 h-8" />
                    </a>
                  </Button>
                </div>
              </CardFooter>
            </Card>
            <ContactForm className={"w-2/3"}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
