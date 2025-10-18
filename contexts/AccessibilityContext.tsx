import * as Speech from 'expo-speech';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

interface AccessibilityContextType {
  // Estados de accesibilidad
  highContrast: boolean;
  colorBlindMode: boolean;
  fontSize: 'small' | 'normal' | 'large';
  screenReaderEnabled: boolean;
  
  // Funciones para cambiar estados
  setHighContrast: (value: boolean) => void;
  setColorBlindMode: (value: boolean) => void;
  setFontSize: (value: 'small' | 'normal' | 'large') => void;
  setScreenReaderEnabled: (value: boolean) => void;
  
  // Funciones auxiliares
  getAccessibleColors: () => any;
  getFontSize: () => any;
  speakText: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Función para leer texto en voz alta
  const speakText = (text: string) => {
    if (screenReaderEnabled) {
      Speech.speak(text, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  // Función para obtener colores accesibles
  const getAccessibleColors = () => {
    if (highContrast) {
      return {
        background: ['#000000', '#1a1a1a', '#333333'],
        inputBg: '#FFFFFF',
        inputText: '#000000',
        buttonBg: '#FFFFFF',
        buttonText: '#000000',
        labelText: '#FFFFFF'
      };
    }
    if (colorBlindMode) {
      return {
        background: ['#4A90E2', '#7BB3F0', '#A8D5F2'],
        inputBg: '#E8F4FD',
        inputText: '#2C5282',
        buttonBg: '#2C5282',
        buttonText: '#FFFFFF',
        labelText: '#FFFFFF'
      };
    }
    return {
      background: ['#5BA9B8', '#87CEBD', '#B8D896'],
      inputBg: '#6BCDDD',
      inputText: 'white',
      buttonBg: '#5BA9D0',
      buttonText: 'white',
      labelText: 'white'
    };
  };

  // Función para obtener tamaños de fuente
  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return { base: 14, title: 20, button: 16, label: 12 };
      case 'large': return { base: 20, title: 32, button: 24, label: 18 };
      default: return { base: 16, title: 24, button: 20, label: 14 };
    }
  };

  // Detectar si el lector de pantalla del sistema está activo
  useEffect(() => {
    const checkScreenReader = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setScreenReaderEnabled(isEnabled);
      } catch (error) {
        console.log('Error checking screen reader:', error);
      }
    };
    
    checkScreenReader();
    
    // Listener para cambios en el lector de pantalla
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );

    return () => subscription?.remove();
  }, []);

  const value = {
    highContrast,
    colorBlindMode,
    fontSize,
    screenReaderEnabled,
    setHighContrast,
    setColorBlindMode,
    setFontSize,
    setScreenReaderEnabled,
    getAccessibleColors,
    getFontSize,
    speakText,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}