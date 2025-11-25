import React, { useEffect, useRef } from 'react';
import { useCartAnimation } from '@/contexts/CartAnimationContext';

const CartAnimation = ({ cartIconRef }) => {
  const { isAnimating, animationStartPos, productImage } = useCartAnimation();
  const animationElementRef = useRef(null);

  useEffect(() => {
    if (!isAnimating || !animationStartPos || !cartIconRef?.current || !productImage) {
      return;
    }

    const cartIcon = cartIconRef.current;
    const cartIconRect = cartIcon.getBoundingClientRect();
    const cartIconX = cartIconRect.left + cartIconRect.width / 2;
    const cartIconY = cartIconRect.top + cartIconRect.height / 2;

    const animationElement = animationElementRef.current;
    if (!animationElement) return;

    // Set initial position
    animationElement.style.left = `${animationStartPos.x - 30}px`;
    animationElement.style.top = `${animationStartPos.y - 30}px`;
    animationElement.style.display = 'block';
    animationElement.style.opacity = '1';
    animationElement.style.transform = 'scale(1) translate(0, 0)';

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animationElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animationElement.style.left = `${cartIconX - 30}px`;
        animationElement.style.top = `${cartIconY - 30}px`;
        animationElement.style.opacity = '0';
        animationElement.style.transform = 'scale(0.2) translate(0, 0)';
      });
    });
  }, [isAnimating, animationStartPos, cartIconRef, productImage]);

  if (!isAnimating || !productImage) {
    return null;
  }

  return (
    <div
      ref={animationElementRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <img
        src={productImage}
        alt="Product"
        className="w-full h-full object-cover"
        style={{
          display: 'block',
        }}
      />
    </div>
  );
};

export default CartAnimation;

