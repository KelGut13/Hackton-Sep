import { Platform } from 'react-native';
import { useState, useEffect } from 'react';

/**
 * Hook para detectar la plataforma y proporcionar utilidades específicas de web
 */
export const usePlatform = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      const updateDimensions = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  const isWeb = Platform.OS === 'web';
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  const isDesktop = isWeb && windowDimensions.width >= 1024;
  const isTablet = isWeb && windowDimensions.width >= 768 && windowDimensions.width < 1024;
  const isMobileWeb = isWeb && windowDimensions.width < 768;

  return {
    isWeb,
    isMobile,
    isDesktop,
    isTablet,
    isMobileWeb,
    windowDimensions,
    platform: Platform.OS,
  };
};

/**
 * Hook para gestionar estilos responsivos en web
 */
export const useResponsiveStyles = () => {
  const { isDesktop, isTablet, isMobileWeb } = usePlatform();

  const getResponsiveStyle = (styles: {
    mobile?: any;
    tablet?: any;
    desktop?: any;
    default?: any;
  }) => {
    if (isDesktop && styles.desktop) return styles.desktop;
    if (isTablet && styles.tablet) return styles.tablet;
    if (isMobileWeb && styles.mobile) return styles.mobile;
    return styles.default || {};
  };

  return {
    getResponsiveStyle,
    isDesktop,
    isTablet,
    isMobileWeb,
  };
};

export default usePlatform;