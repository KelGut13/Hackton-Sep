// Configuración específica para web
export const webConfig = {
  // Configuración para PWA
  enablePWA: true,
  
  // Configuración de SEO
  defaultMeta: {
    title: 'EduPlay - Aplicación Educativa',
    description: 'Aplicación educativa interactiva desarrollada con Expo y React Native',
    keywords: 'educación, aprendizaje, niños, juegos educativos',
    author: 'KelGut13',
  },
  
  // Configuración de responsive design
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  },
  
  // Configuración de accesibilidad web
  a11y: {
    enableScreenReader: true,
    enableKeyboardNavigation: true,
    contrastMode: 'normal', // 'normal' | 'high'
  }
};

export default webConfig;