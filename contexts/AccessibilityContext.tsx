import * as Speech from 'expo-speech';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AccessibilityInfo, Dimensions } from 'react-native';

interface ButtonPosition {
  x: number;
  y: number;
}

interface AccessibilityContextType {
  // Estados de accesibilidad
  highContrast: boolean;
  colorBlindMode: boolean;
  fontSize: 'small' | 'normal' | 'large';
  screenReaderEnabled: boolean;
  
  // Posición del botón de accesibilidad
  buttonPosition: ButtonPosition;
  setButtonPosition: (position: ButtonPosition) => void;
  
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
  
  // Estado para la posición del botón de accesibilidad
  const screenWidth = Dimensions.get('window').width;
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition>({
    x: screenWidth - 70, // 50 (buttonSize) + 20 (margin)
    y: 50
  });

  // Función para leer texto en voz alta
  const speakText = (text: string) => {
    try {
      if (screenReaderEnabled && text && text.trim()) {
        Speech.speak(text, {
          language: 'es-ES',
          pitch: 1.0,
          rate: 0.8,
        });
      }
    } catch (error) {
      console.warn('Error en speakText:', error);
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

    // Detectar si el screen reader está habilitado
  useEffect(() => {
    let subscription: any;
    
    const checkScreenReader = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setScreenReaderEnabled(isEnabled);
      } catch (error) {
        console.warn('Error checking screen reader:', error);
        setScreenReaderEnabled(false);
      }
    };

    // Verificar estado inicial
    checkScreenReader();

    // Suscribirse a cambios
    try {
      subscription = AccessibilityInfo.addEventListener(
        'screenReaderChanged',
        setScreenReaderEnabled
      );
    } catch (error) {
      console.warn('Error setting up screen reader listener:', error);
    }

    return () => {
      try {
        subscription?.remove();
      } catch (error) {
        console.warn('Error removing screen reader listener:', error);
      }
    };
  }, []);

  const value = {
    highContrast,
    colorBlindMode,
    fontSize,
    screenReaderEnabled,
    buttonPosition,
    setButtonPosition,
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