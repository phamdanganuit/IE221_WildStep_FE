import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="flex flex-col items-start 
      px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16
      pt-12 sm:pt-16 md:pt-20 
      pb-8 sm:pb-10 md:pb-12 
      mt-12 sm:mt-16 md:mt-20 lg:mt-24 
      w-full bg-slate-900">
      <div className="flex flex-col justify-between w-full max-w-full">
        <div className="w-full h-auto">
          {/* Footer Grid - Responsive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 xl:gap-16 w-full">
            
            {/* Brand Section */}
            <div className="text-white text-center md:text-left lg:col-span-1">
              <img 
                src='/Logo_main.svg' 
                alt='Wild Step Logo' 
                className='w-48 sm:w-56 md:w-64 lg:w-[20rem] mb-4 sm:mb-6 mx-auto md:mx-0'
              />
              <p className="mt-6 sm:mt-8 md:mt-12 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                {t('footer.description')}
              </p>
            </div>
            
            {/* Newsletter Section */}
            <div className="text-center md:text-left lg:col-span-1">
              <h4 className="text-lg sm:text-xl md:text-2xl text-white font-medium mb-3 sm:mb-4">
                {t('footer.newsletter')}
              </h4>
              <div className="flex items-center 
                py-3 sm:py-4 md:py-5 
                pr-2 sm:pr-2.5 
                pl-3 sm:pl-4 md:pl-5 
                w-full font-medium bg-white 
                rounded-lg sm:rounded-xl 
                min-h-[48px] sm:min-h-[54px] md:min-h-[61px]">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 text-sm sm:text-base md:text-[1rem] text-black bg-transparent border-none outline-none"
                  aria-label="Email address"
                />
                <button 
                  className="ml-2 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 flex-shrink-0" 
                  aria-label={t('footer.send')}
                >
                  <FontAwesomeIcon 
                    icon={faPaperPlane} 
                    className="w-4 h-4 sm:w-5 sm:h-5 hover:text-color4 transition-colors duration-200" 
                  />
                </button>
              </div>
            </div>
            
            {/* Quick Links Section */}
            <nav className="text-white text-center md:text-left lg:col-span-1" aria-label="Footer navigation">
              <h4 className="text-lg sm:text-xl font-medium mb-4 sm:mb-5">{t('footer.quickLinks')}</h4>
              <ul className="space-y-3 sm:space-y-4 md:space-y-5">
                <li>
                  <a href="/" className="hover:text-color4 transition text-sm sm:text-base md:text-lg inline-block py-1">
                    {t('footer.home')}
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:text-color4 transition text-sm sm:text-base md:text-lg inline-block py-1">
                    {t('footer.shop')}
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:text-color4 transition text-sm sm:text-base md:text-lg inline-block py-1">
                    {t('footer.category')}
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-color4 transition text-sm sm:text-base md:text-lg inline-block py-1">
                    {t('footer.contact')}
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-color4 transition text-sm sm:text-base md:text-lg inline-block py-1">
                    {t('footer.privacy')}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Divider */}
        <div className="self-center mt-8 sm:mt-9 border border-white/30 border-solid min-h-px w-16 sm:w-20" />
        
        {/* Copyright */}
        <p className="mt-6 sm:mt-8 md:mt-9 text-sm sm:text-base md:text-lg text-center text-white/80">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
