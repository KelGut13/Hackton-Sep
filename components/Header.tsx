import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface HeaderProps {
  title: string;
  onSettingsPress?: () => void;
  onProfilePress?: () => void;
  showLanguageToggle?: boolean;
  showProfile?: boolean;
}

export default function Header({ 
  title, 
  onSettingsPress, 
  onProfilePress, 
  showLanguageToggle = true, 
  showProfile = true 
}: HeaderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const { getFontSize, speakText } = useAccessibility();
  const fontSizes = getFontSize();

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    setCurrentLanguage(newLang);
    speakText(`Idioma cambiado a ${newLang === 'es' ? 'español' : 'inglés'}`);
  };

  const handleSettingsPress = () => {
    speakText('Configuraciones');
    onSettingsPress?.();
  };

  const handleProfilePress = () => {
    speakText('Perfil de usuario');
    onProfilePress?.();
  };

  return (
    <View style={styles.header}>
      {/* Settings Button */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleSettingsPress}
        accessibilityLabel="Configuraciones"
        accessibilityRole="button"
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.headerTitle, { fontSize: fontSizes.title }]}>
        {title}
      </Text>

      {/* Right side buttons */}
      <View style={styles.rightButtons}>
        {/* Language Toggle */}
        {showLanguageToggle && (
          <TouchableOpacity
            style={styles.languageButton}
            onPress={toggleLanguage}
            accessibilityLabel={`Cambiar idioma a ${currentLanguage === 'es' ? 'inglés' : 'español'}`}
            accessibilityRole="button"
          >
            <Text style={styles.languageFlag}>
              {currentLanguage === 'es' ? '🇲🇽' : '🇺🇸'}
            </Text>
          </TouchableOpacity>
        )}

        {/* User Profile */}
        {showProfile && (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
            accessibilityLabel="Perfil de usuario"
            accessibilityRole="button"
          >
            <View style={styles.profileImage}>
              <Ionicons name="person" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40, // Aumentado para mover el header más abajo
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  languageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});