import React, { createContext, useContext, useState } from 'react';

const MobileMenuContext = createContext();

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider');
  }
  return context;
};

export const MobileMenuProvider = ({ children }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <MobileMenuContext.Provider value={{ showMobileMenu, setShowMobileMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
};

