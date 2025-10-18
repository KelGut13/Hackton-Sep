import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  title: string;
  showLanguageToggle?: boolean;
  showProfile?: boolean;
}

export default function Header({ 
  title, 
  showLanguageToggle = true, 
  showProfile = true 
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const { getFontSize, speakText } = useAccessibility();
  const { currentLanguage, toggleLanguage, currentTexts } = useLanguage();
  const fontSizes = getFontSize();

  const handleSettingsPress = () => {
    setShowSettings(true);
    speakText('Abriendo configuraciones');
  };

  const handleProfilePress = () => {
    setShowUserMenu(true);
    speakText('Abriendo menú de usuario');
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
    speakText(`Idioma cambiado a ${currentLanguage === 'es' ? 'inglés' : 'español'}`);
  };

  const handleLogout = async () => {
    Alert.alert(
      currentTexts.logout,
      currentTexts.logoutConfirm,
      [
        {
          text: currentTexts.cancel,
          style: 'cancel'
        },
        {
          text: currentTexts.logout,
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              setShowUserMenu(false);
              speakText('Sesión cerrada exitosamente');
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert(currentTexts.error, currentTexts.logoutError);
            }
          }
        }
      ]
    );
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
            onPress={handleLanguageToggle}
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

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
              {currentTexts.settings}
            </Text>
            
            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => {
                setDarkMode(!darkMode);
                speakText(`Modo ${darkMode ? 'claro' : 'oscuro'} activado`);
              }}
              accessibilityLabel={`${currentTexts.darkMode}: ${darkMode ? 'Activado' : 'Desactivado'}`}
              accessibilityRole="switch"
              accessibilityState={{ checked: darkMode }}
            >
              <Ionicons name={darkMode ? "moon" : "sunny"} size={24} color="#333" />
              <Text style={styles.settingText}>{currentTexts.darkMode}</Text>
              <Ionicons 
                name={darkMode ? "toggle" : "toggle-outline"} 
                size={24} 
                color={darkMode ? "#4CAF50" : "#ccc"} 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
              accessibilityLabel={currentTexts.close}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>{currentTexts.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* User Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showUserMenu}
        onRequestClose={() => setShowUserMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: fontSizes.title }]}>
              {currentTexts.userProfile}
            </Text>
            
            <TouchableOpacity
              style={styles.userOption}
              accessibilityLabel={currentTexts.changeName}
              accessibilityRole="button"
            >
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.userOptionText}>{currentTexts.changeName}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userOption}
              accessibilityLabel={currentTexts.changePassword}
              accessibilityRole="button"
            >
              <Ionicons name="lock-closed-outline" size={24} color="#333" />
              <Text style={styles.userOptionText}>{currentTexts.changePassword}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userOption}
              onPress={handleLogout}
              accessibilityLabel={currentTexts.logout}
              accessibilityRole="button"
            >
              <Ionicons name="log-out-outline" size={24} color="#f44336" />
              <Text style={[styles.userOptionText, { color: '#f44336' }]}>
                {currentTexts.logout}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUserMenu(false)}
              accessibilityLabel={currentTexts.close}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>{currentTexts.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userOptionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6BCDDD',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});