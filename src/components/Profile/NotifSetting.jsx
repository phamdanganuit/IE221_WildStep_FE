import React, { useEffect, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item";
import { Switch } from "../ui/switch";
import { getNotificationSettings, updateNotificationSettings } from "@/service/accountService";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";

const NotifItem = ({ title, description, value, setValue, disabled }) => {
  return (
    <div>
      <Item>
        <ItemContent>
          <ItemTitle
            className={`font-semibold text-lg ${
              !disabled ? "text-black" : "text-gray-300"
            }`}
          >
            {title}
          </ItemTitle>
          <ItemDescription
            className={`${!disabled ? "text-black" : "text-gray-300"}`}
          >
            {description}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Switch
            disabled={disabled}
            checked={value}
            onCheckedChange={setValue}
            aria-label="Medium switch"
            className="h-6 w-10 [&_span]:size-5 data-[state=checked]:[&_span]:translate-x-4.5 data-[state=checked]:[&_span]:rtl:-translate-x-4.5"
          />
        </ItemActions>
      </Item>
    </div>
  );
};

function NotifSetting() {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [emailUpdate, setEmailUpdate] = useState(true);
  const [emailSale, setEmailSale] = useState(true);
  const [emailSurvey, setEmailSurvey] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [smsSale, setSmsSale] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await getNotificationSettings();
      if (result.success) {
        const data = result.data;
        setEmailNotif(data.emailNotif ?? true);
        setEmailUpdate(data.emailUpdate ?? true);
        setEmailSale(data.emailSale ?? true);
        setEmailSurvey(data.emailSurvey ?? true);
        setSmsNotif(data.smsNotif ?? false);
        setSmsSale(data.smsSale ?? false);
      } else {
        error(result.error || t('profile.notificationPage.loadError'));
      }
      setIsLoaded(true);
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const saveSettings = async () => {
      const settings = {
        emailNotif,
        emailUpdate,
        emailSale,
        emailSurvey,
        smsNotif,
        smsSale,
      };
      
      const result = await updateNotificationSettings(settings);
      if (!result.success) {
        error(result.error || t('profile.notificationPage.saveError'));
      }
    };
    
    saveSettings();
  }, [emailNotif, emailUpdate, emailSale, emailSurvey, smsNotif, smsSale]);

  useEffect(() => {
    if (!isLoaded) return;
    // if emailNotif off, turn off all email settings
    if (!emailNotif) {
      setEmailUpdate(false);
      setEmailSale(false);
      setEmailSurvey(false);
    }
    // if smsNotif off, turn off smsSale
    if (!smsNotif) {
      setSmsSale(false);
    }
  }, [emailNotif, smsNotif]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center font-semibold text-2xl gap-2">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#50D5C4] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-col space-y-[10px] w-full">
      <p className="text-2xl font-semibold mb-4">{t('profile.notificationPage.title')}</p>
      <div className="w-full space-y-2">
        <NotifItem
          title={t('profile.notificationPage.emailNotifications')}
          description={t('profile.notificationPage.emailDesc')}
          value={emailNotif}
          setValue={setEmailNotif}
        />
        <div className={`pl-6 ${emailNotif ? "" : "bg-opacity/70"}`}>
          <NotifItem
            disabled={!emailNotif}
            title={t('profile.notificationPage.orderUpdates')}
            description={t('profile.notificationPage.orderDesc')}
            value={emailUpdate}
            setValue={setEmailUpdate}
          />
          <NotifItem
            disabled={!emailNotif}
            title={t('profile.notificationPage.promotions')}
            description={t('profile.notificationPage.promotionsDesc')}
            value={emailSale}
            setValue={setEmailSale}
          />
          <NotifItem
            disabled={!emailNotif}
            title={t('profile.notificationPage.survey')}
            description={t('profile.notificationPage.surveyDesc')}
            value={emailSurvey}
            setValue={setEmailSurvey}
          />
        </div>
        <NotifItem
          title={t('profile.notificationPage.smsNotifications')}
          description={t('profile.notificationPage.smsDesc')}
          value={smsNotif}
          setValue={setSmsNotif}
        />
        <div className="pl-6">
          <NotifItem
            disabled={!smsNotif}
            title={t('profile.notificationPage.smsPromotions')}
            description={t('profile.notificationPage.smsPromotionsDesc')}
            value={smsSale}
            setValue={setSmsSale}
          />
        </div>
      </div>
    </div>
  );
}

export default NotifSetting;
