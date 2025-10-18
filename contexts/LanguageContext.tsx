import React, { createContext, ReactNode, useContext, useState } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  texts: {
    es: any;
    en: any;
  };
  currentTexts: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const texts = {
  es: {
    // Header texts
    settings: 'Configuraciones',
    userProfile: 'Perfil de Usuario',
    darkMode: 'Modo Oscuro',
    changePassword: 'Cambiar Contraseña',
    changeName: 'Cambiar Nombre',
    logout: 'Cerrar Sesión',
    close: 'Cerrar',
    // Confirmation texts
    logoutConfirm: '¿Estás seguro que deseas cerrar sesión?',
    cancel: 'Cancelar',
    error: 'Error',
    logoutError: 'No se pudo cerrar sesión. Intenta nuevamente.',
    // Home screen texts
    languages: 'Lenguas',
    scientificThought: 'Saberes y Pensamiento Científico',
    progress: 'Progreso',
    // Activity texts
    geoSopa: 'GeoSopa',
    puntoGo: 'PuntoGo',
    matematico: 'P.Matemático',
    // Game texts
    next: 'Siguiente',
    title: 'GeoSopa',
    instruction: 'Encuentra en la sopa de letras el nombre de las figuras que aparecen, hazlo en el menor tiempo posible.',
    howToPlay: '¿Cómo jugar?',
    playButton: '¡A Jugar!',
    backButton: 'Atrás',
    soundButton: 'Sonido'
  },
  en: {
    // Header texts
    settings: 'Settings',
    userProfile: 'User Profile',
    darkMode: 'Dark Mode',
    changePassword: 'Change Password',
    changeName: 'Change Name',
    logout: 'Logout',
    close: 'Close',
    // Confirmation texts
    logoutConfirm: 'Are you sure you want to logout?',
    cancel: 'Cancel',
    error: 'Error',
    logoutError: 'Could not logout. Please try again.',
    // Home screen texts
    languages: 'Languages',
    scientificThought: 'Knowledge and Scientific Thought',
    progress: 'Progress',
    // Activity texts
    geoSopa: 'GeoSoup',
    puntoGo: 'PuntoGo',
    matematico: 'P.Mathematical',
    // Game texts
    next: 'Next',
    title: 'GeoSoup',
    instruction: 'Find in the word search the name of the figures that appear, do it in the shortest time possible.',
    howToPlay: 'How to play?',
    playButton: 'Let\'s Play!',
    backButton: 'Back',
    soundButton: 'Sound'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    setCurrentLanguage(newLang);
  };

  const currentTexts = texts[currentLanguage];

  const value = {
    currentLanguage,
    setCurrentLanguage,
    toggleLanguage,
    texts,
    currentTexts
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}