import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="flex flex-col items-start px-12 pt-20 pb-12 mt-24 w-full bg-slate-900  max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col justify-between w-full max-w-full">
        <div className="w-full h-auto max-md:max-w-full">
          <div className="flex flex-wrap gap-10 justify-between items-start w-full max-md:max-w-full">
            <div className="text-white min-w-60 w-[409px]">
              <img src='/Logo_main.svg' alt='Wild Step Logo' className='w-[20rem] mb-6'/>
              <p className="mt-12 text-lg leading-7 max-md:mt-10">
                {t('footer.description')}
              </p>
            </div>
            <div className="min-w-60 w-[497px] max-md:max-w-full">
              <div className="w-full max-w-[506px] max-md:max-w-full">
                <h4 className="text-2xl text-white max-md:max-w-full">
                  {t('footer.newsletter')}
                </h4>
                <div className="flex items-center py-5 pr-2.5 pl-5 mt-3.5 w-full font-medium bg-white rounded-xl min-h-[61px] max-md:max-w-full">
                  <div className="flex justify-between items-center self-stretch my-auto min-w-60 max-md:max-w-full">
                    <input
                      type="email"
                      placeholder={t('footer.emailPlaceholder')}
                      className="self-stretch my-auto text-[1rem] text-black w-[426px] max-md:max-w-full bg-transparent border-none outline-none"
                      aria-label="Email address"
                    />
                    <div className="flex gap-2 items-center self-stretch my-auto text-[1.125rem] text-black whitespace-nowrap w-[50px]">
                      <div className="shrink-0 self-stretch my-auto w-0 border border-black border-solid h-[18px]" />
                      <button className="self-stretch my-auto w-[41px]">
                        {t('footer.send')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <nav className="text-lg text-white w-[129px]" aria-label="Footer navigation">
              <h4 className="text-xl font-medium">{t('footer.quickLinks')}</h4>
              <ul className="space-y-5 mt-5">
                <li><a href="#" className="hover:text-gray-300">{t('footer.home')}</a></li>
                <li><a href="#" className="hover:text-gray-300">{t('footer.shop')}</a></li>
                <li><a href="#" className="hover:text-gray-300">{t('footer.category')}</a></li>
                <li><a href="#" className="hover:text-gray-300">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-gray-300">{t('footer.privacy')}</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="self-center mt-9 border border-white border-solid min-h-px w-[66px]" />
        <p className="mt-9 text-lg text-center text-white max-md:max-w-full">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
