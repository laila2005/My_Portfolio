import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      try {
        // Check for touch capability
        const hasTouch = 'ontouchstart' in window || 
                        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
                        (navigator as any).msMaxTouchPoints > 0;
        
        // Check for mobile user agent
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        
        setIsMobile(hasTouch || isMobileUA);
      } catch (error) {
        console.warn('Mobile detection failed:', error);
        // Fallback to screen size
        setIsMobile(window.innerWidth <= 768);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return isMobile;
}
