import React, { createContext, useContext, useState, useCallback } from 'react';

const CartAnimationContext = createContext();

export const useCartAnimation = () => {
  const context = useContext(CartAnimationContext);
  if (!context) {
    throw new Error('useCartAnimation must be used within a CartAnimationProvider');
  }
  return context;
};

export const CartAnimationProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartPos, setAnimationStartPos] = useState(null);
  const [productImage, setProductImage] = useState(null);

  // Trigger animation from a position
  const triggerAnimation = useCallback((startPosition, imageUrl) => {
    setAnimationStartPos(startPosition);
    setProductImage(imageUrl);
    setIsAnimating(true);
    
    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationStartPos(null);
      setProductImage(null);
    }, 800); // Animation duration
  }, []);

  // Update cart count
  const updateCartCount = useCallback((count) => {
    setCartCount(count);
  }, []);

  // Increment cart count (for animation effect)
  const incrementCartCount = useCallback(() => {
    setCartCount(prev => prev + 1);
  }, []);

  const value = {
    cartCount,
    isAnimating,
    animationStartPos,
    productImage,
    triggerAnimation,
    updateCartCount,
    incrementCartCount,
  };

  return (
    <CartAnimationContext.Provider value={value}>
      {children}
    </CartAnimationContext.Provider>
  );
};

