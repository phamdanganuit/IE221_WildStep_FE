import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../ui/dialog";
  import { ScrollArea } from "../ui/scroll-area";
  import { Input } from "../ui/input";
  import { Label } from "../ui/label";
  import { Switch } from "../ui/switch";
  import { Button } from "../ui/button";
  import { ChevronLeftIcon } from "lucide-react";  
  import React, { useState } from "react";
  import { useTranslation } from "react-i18next";

export default function AddressDialog({address , title, submitText, submitIcon, onSubmit}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [receiver, setReceiver] = useState(address ? address.receiver : "");
    const [detail, setDetail] = useState(address ? address.detail : "");
    const [ward, setWard] = useState(address ? address.ward : "");
    const [district, setDistrict] = useState(address ? address.district : "");
    const [province, setProvince] = useState(address ? address.province : "");
    const [phone, setPhone] = useState(address ? address.phone : "");
    const [defaultAddress, setDefaultAddress] = useState(address ? (address.default || address.is_default) : false);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async() => {
      setIsLoading(true);
      const data ={
        receiver,
        detail,
        ward,
        district,
        province,
        phone,
        default: defaultAddress,
      };
      await onSubmit(data);
      setIsLoading(false);
      setOpen(false);
    };
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className={"flex items-center space-x-2 w-[200px]"}>
            {submitIcon}
            {title}
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 min-w-[calc(50vw-2rem)]">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b px-6 py-4">
              {title}
            </DialogTitle>
            <ScrollArea className="flex max-h-full flex-col overflow-hidden">
              <DialogDescription asChild>
                {isLoading ? (
                  <div className="w-full flex items-center justify-center font-semibold text-2xl gap-2">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-[#50D5C4] rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="w-full space-y-[10px]">
                      <div className="flex grid grid-cols-2 gap-2">
                        <div className="col-span-1 flex-col space-y-[10px]">
                          <p className="font-semibold">
                            {t('profile.addressPage.receiver')} <span className="text-red-500">*</span>
                          </p>
                          <Input
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 text-gray-400 px-2"
                          />
                        </div>
                        <div className="col-span-1 flex-col space-y-[10px]">
                          <p className="font-semibold">
                            {t('profile.addressPage.phoneNumber')} <span className="text-red-500">*</span>
                          </p>
                          <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-2"
                          />
                        </div>
                      </div>
  
                      <p className="font-semibold">
                        {t('profile.addressPage.addressDetail')} <span className="text-red-500">*</span>
                      </p>
                      <Input
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-2"
                      />
                      <p className="font-semibold">
                        {t('profile.addressPage.ward')} <span className="text-red-500">*</span>
                      </p>
                      <Input
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-2"
                      />
                      <p className="font-semibold">
                        {t('profile.addressPage.district')} <span className="text-red-500">*</span>
                      </p>
                      <Input
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-2"
                      />
                      <p className="font-semibold">
                        {t('profile.addressPage.province')} <span className="text-red-500">*</span>
                      </p>
                      <Input
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full bg-white rounded-lg outline outline-2 outline-offset-[-2px] outline-gray-200 px-2"
                      />
  
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          id="default-address"
                          checked={defaultAddress}
                          onCheckedChange={(checked) =>
                            setDefaultAddress(checked)
                          }
                          aria-label="Medium switch"
                          className="h-6 w-10 [&_span]:size-5 data-[state=checked]:[&_span]:translate-x-4.5 data-[state=checked]:[&_span]:rtl:-translate-x-4.5"
                        />
                        <Label htmlFor="default-address">{t('profile.addressPage.setDefault')}</Label>
                      </div>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </ScrollArea>
          </DialogHeader>
          <DialogFooter className="flex-row items-center justify-end border-t px-6 py-4">
            <DialogClose asChild>
              <Button variant="outline">
                <ChevronLeftIcon />
                {t('profile.addressPage.cancel')}
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit}>
              {submitIcon}
              {submitText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  