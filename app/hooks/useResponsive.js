'use client';

import { useState, useEffect, useCallback } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event) => setMatches(event.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

export const useBreakpoint = () => {
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2Xl = useMediaQuery('(min-width: 1536px)');

  const breakpoint = is2Xl 
    ? '2xl' 
    : isXl 
      ? 'xl' 
      : isLg 
        ? 'lg' 
        : isMd 
          ? 'md' 
          : isSm 
            ? 'sm' 
            : 'xs';

  return {
    breakpoint,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg
  };
};

export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
};

export const useDeviceDetection = () => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouchDevice: false,
    userAgent: ''
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = navigator.userAgent;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Detección básica de dispositivo
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*Tablet)|(?=.*\bAndroid\b)(?=.*\bMobile\b)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    setDevice({
      isMobile: isMobile && !isTablet,
      isTablet,
      isDesktop,
      isTouchDevice,
      userAgent
    });
  }, []);

  return device;
};

export const useScrollDirection = (threshold = 10) => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && Math.abs(currentScrollY - lastScrollY) > threshold) {
        setScrollDirection(direction);
      }
      
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, threshold]);

  return { scrollDirection, scrollY };
};

export const useKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const viewport = useViewport();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let initialViewportHeight = window.innerHeight;

    const checkKeyboard = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;
      
      // Si la altura cambió más de 150px, probablemente el teclado está visible
      setIsKeyboardVisible(heightDiff > 150);
    };

    window.addEventListener('resize', checkKeyboard);
    
    // También escuchar eventos de focus en campos de entrada
    const inputs = document.querySelectorAll('input, textarea, select');
    
    const onFocus = () => {
      setTimeout(checkKeyboard, 300); // Delay para que el teclado aparezca
    };
    
    const onBlur = () => {
      setTimeout(checkKeyboard, 300);
    };

    inputs.forEach(input => {
      input.addEventListener('focus', onFocus);
      input.addEventListener('blur', onBlur);
    });

    return () => {
      window.removeEventListener('resize', checkKeyboard);
      inputs.forEach(input => {
        input.removeEventListener('focus', onFocus);
        input.removeEventListener('blur', onBlur);
      });
    };
  }, []);

  return { isKeyboardVisible, viewport };
};

export const useOrientation = () => {
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOrientation = () => {
      if (screen.orientation) {
        setOrientation(screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape');
      } else {
        // Fallback para navegadores que no soportan screen.orientation
        setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
      }
    };

    updateOrientation();

    if (screen.orientation) {
      screen.orientation.addEventListener('change', updateOrientation);
      return () => screen.orientation.removeEventListener('change', updateOrientation);
    } else {
      window.addEventListener('resize', updateOrientation);
      return () => window.removeEventListener('resize', updateOrientation);
    }
  }, []);

  return orientation;
};

export const useAccessibility = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detectar preferencias de accesibilidad
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setPrefersReducedMotion(reducedMotionQuery.matches);
    setPrefersHighContrast(highContrastQuery.matches);
    setPrefersDarkMode(darkModeQuery.matches);

    const updateReducedMotion = (e) => setPrefersReducedMotion(e.matches);
    const updateHighContrast = (e) => setPrefersHighContrast(e.matches);
    const updateDarkMode = (e) => setPrefersDarkMode(e.matches);

    reducedMotionQuery.addListener(updateReducedMotion);
    highContrastQuery.addListener(updateHighContrast);
    darkModeQuery.addListener(updateDarkMode);

    return () => {
      reducedMotionQuery.removeListener(updateReducedMotion);
      highContrastQuery.removeListener(updateHighContrast);
      darkModeQuery.removeListener(updateDarkMode);
    };
  }, []);

  return {
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode
  };
};
