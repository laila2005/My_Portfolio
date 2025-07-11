import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      try {
        // Simple and safe mobile detection
        const isTouchDevice = 'ontouchstart' in window;
        setIsMobile(isTouchDevice);
      } catch (error) {
        console.warn('Mobile detection failed:', error);
        // Safe fallback
        setIsMobile(false);
      }
    };

    // Delay the check to ensure window is fully loaded
    const timer = setTimeout(checkMobile, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return isMobile;
}
