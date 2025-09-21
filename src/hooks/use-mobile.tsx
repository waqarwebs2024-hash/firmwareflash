'use client';

import { useState, useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

/**
 * A hook to determine if the current viewport is on a mobile device.
 * @returns `true` if the viewport width is less than or equal to 768px, `false` otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This code now runs only on the client, after the initial render.
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    
    // Set the initial state based on the media query
    setIsMobile(mediaQuery.matches);

    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return isMobile;
}
